import { isProduction } from "std-env";
import { importSPKI } from "jose";
import { encode } from "cbor-x";

interface Key {
  id: string;
  publicKeyPem: string;
}

interface User {
  id: string;
  publicKeys: Key[];
}

interface AuthQuery {
  signature?: string;
  id?: string;
  key?: string;
  authenticatorData?: string;
  clientDataJson?: string;
}

// Configuration for the challenge cookie.
const COOKIE_MAX_AGE = 60 * 5; // 5 minutes in seconds.
const COOKIE_OPTIONS = {
  maxAge: COOKIE_MAX_AGE,
  httpOnly: true,
  secure: isProduction, // Should always be true in production.
  sameSite: "strict" as const,
};

/**
 * Converts a standard Base64 string to Base64URL.
 * @param base64 Encoded string in standard Base64.
 * @returns
 */
const toBase64url = (base64: string): string => {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

/**
 * Converts a PEM public key (EC P-256) to a COSE Key (CBOR-encoded Uint8Array)
 * @param {string} pemContent Contents of the public key in PEM format
 * @returns {Uint8Array<ArrayBuffer>}
 */
const pemToCose = async (pem: string) => {
  const cryptoKey = await importSPKI(pem, "ES256");

  const jwk = await crypto.subtle.exportKey("jwk", cryptoKey);

  if (jwk.kty !== "EC" || jwk.crv !== "P-256") {
    throw new Error("Key not supported");
  }

  const x = Buffer.from(jwk.x, "base64url");
  const y = Buffer.from(jwk.y, "base64url");

  const COSE_KEY = new Map();
  COSE_KEY.set(1, 2);
  COSE_KEY.set(3, -7);
  COSE_KEY.set(-1, 1);
  COSE_KEY.set(-2, x);
  COSE_KEY.set(-3, y);

  const coseBuffer = encode(COSE_KEY);

  return new Uint8Array(coseBuffer);
};

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) {
    return;
  }

  const query: AuthQuery = useRoute().query;
  const { signature, id, key, authenticatorData, clientDataJson } = query;
  const localePath = useLocalePath();

  if (!id || !key) {
    try {
      // 32 bytes (256 bits) is a standard secure length for a challenge.
      const challengeBytes = generateChallenge(32);
      const challenge = toBase64url(challengeBytes.toString("base64"));
      useCookie("challenge", COOKIE_OPTIONS).value = challenge;

      // Redirect the user to the external authorization service.
      const path = localePath("/auth");
      navigateTo(
        `https://account.gravitalia.com/authorize?redirect=https://turms.gravitalia.com${path}&challenge=${challenge}`,
        { external: true, redirectCode: 307 },
      );
    } catch (error) {
      console.error("Error during initial authorization redirect:", error);
      navigateTo("/");
    }
  } else {
    const challenge = useCookie("challenge").value;
    // Clear the cookie immediately after reading it, regardless of the outcome.
    useCookie("challenge", {...COOKIE_OPTIONS, maxAge: 0}).value = null;

    if (!challenge || !signature || !authenticatorData || !clientDataJson) {
      // Redirect to the beginning of the auth flow.
      navigateTo(localePath("/auth"));
      return;
    }

    try {
      const { username, server } = useUserId(id);
      const config = await useServerConfiguration(server);

      const { data } = await useFetch(
        `https://${normalizeUrl(config.url).host}/users/${username}`,
      );
      const user = data.value as User;

      const publicKey = user.publicKeys.find((k) => k.id === key);

      if (!publicKey) {
        console.error(
          `Public key with ID "${key}" not found for user "${username}@${server}".`,
        );
        navigateTo(localePath("/auth"));
      }

      const pkey = await pemToCose(publicKey?.publicKeyPem as string);
      // Perform WebAuthn verification.
      const isVerified = await useWebautn(
        user.id,
        pkey,
        challenge as string,
        signature,
        authenticatorData,
        clientDataJson,
      );

      if (isVerified) {
        const token = await generateToken(`${username}@${server}`);
        navigateTo(`turms:${token}`, { external: true });
      } else {
        navigateTo(localePath("/auth"));
      }
    } catch (error) {
      navigateTo(localePath("/"));
    }
  }
});
