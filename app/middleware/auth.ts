import { isProduction } from "std-env";

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
  httpOnly: false,
  secure: false, // Should always be true in production.
  sameSite: "lax",
};

/**
 * Converts a standard Base64 string to Base64URL.
 * @param base64 Encoded string in standard Base64.
 * @returns
 */
const toBase64url = (base64: string): string => {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

const redirectToAccount = () => {
  const localePath = useLocalePath();

  // 32 bytes (256 bits) is a standard secure length for a challenge.
  const challengeBytes = generateChallenge(32);
  const challenge = toBase64url(challengeBytes.toString("base64"));
  useCookie("challenge", COOKIE_OPTIONS).value = challenge;

  // Redirect the user to the external authorization service.
  const path = localePath("/auth");
  const redirect = isProduction
    ? "https://turms.gravitalia.com"
    : "http://localhost:3000";
  navigateTo(
    `https://account.gravitalia.com/authorize?redirect=${redirect}${path}&challenge=${challenge}`,
    { external: true, redirectCode: 307 },
  );
};

export default defineNuxtRouteMiddleware(async (to) => {
  const event = useRequestEvent();
  if (event) {
    event.node.res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    event.node.res.setHeader("Pragma", "no-cache");
    event.node.res.setHeader("Expires", "0");
  }

  if (import.meta.client) {
    return;
  }

  const query: AuthQuery = to.query;
  const { signature, id, key, authenticatorData, clientDataJson } = query;

  if (!id || !key) {
    return redirectToAccount();
  } else {
    const challenge = useCookie("challenge").value;

    if (!challenge || !signature || !authenticatorData || !clientDataJson) {
      // Redirect to the beginning of the auth flow.
      return redirectToAccount();
    }

    try {
      const { username, server } = useUserId(id);
      const config = await useServerConfiguration(server);

      const { data } = await useFetch(
        `https://${normalizeUrl(config.url).host}/users/${username}`,
      );
      const user = data.value as User;

      if (!user) return redirectToAccount();

      const publicKey = user.publicKeys.find((k) => k.id === key);

      if (!publicKey) {
        console.error(
          `Public key with ID "${key}" not found for user "${username}@${server}".`,
        );
        return redirectToAccount();
      }

      // Perform WebAuthn verification.
      const isVerified = await useWebautn(
        user.id,
        publicKey.publicKeyPem,
        challenge as string,
        signature,
        authenticatorData,
        clientDataJson,
      );

      if (isVerified) {
        useCookie("challenge", { ...COOKIE_OPTIONS, maxAge: 0 }).value =
          undefined;

        const token = await generateToken(`${username}@${server}`);
        useState("token", () => token);
        navigateTo(`turms://${token}`, { external: true });
      } else {
        return redirectToAccount();
      }
    } catch (err) {
      console.error(err);
      return redirectToAccount();
    }
  }
});
