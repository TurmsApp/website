interface Key {
  id: string;
  public_key_pem: string;
}

interface User {
  id: string;
  public_keys: Key[];
}

interface AuthQuery {
  signature?: string;
  id?: string;
  key?: string;
  authenticatorData?: string;
  clientDataJSON?: string;
}

// Configuration for the challenge cookie.
const COOKIE_MAX_AGE = 60 * 5; // 5 minutes in seconds.
const COOKIE_OPTIONS = {
  maxAge: COOKIE_MAX_AGE,
  httpOnly: true,
  secure: true, // Should always be true in production.
  sameSite: "strict" as const,
};

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    return;
  }

  const query: AuthQuery = useRoute().query;
  const { signature, id, key, authenticatorData, clientDataJSON } = query;
  const localePath = useLocalePath();

  if (!id || !key) {
    try {
      // 32 bytes (256 bits) is a standard secure length for a challenge.
      const challengeBytes = generateChallenge(32);
      const challenge = challengeBytes.toString("base64");
      useCookie("challenge", COOKIE_OPTIONS).value = challenge;

      // Redirect the user to the external authorization service.
      navigateTo(
        `https://account.gravitalia.com/authorize?redirect=https://turms.gravitalia.com/auth&challenge=${challenge}`,
        { external: true, redirectCode: 307 },
      );
    } catch (error) {
      console.error("Error during initial authorization redirect:", error);
      navigateTo("/");
    }
  } else {
    const challenge = useCookie("challenge").value;
    // Clear the cookie immediately after reading it, regardless of the outcome.
    useCookie("challenge", COOKIE_OPTIONS).value = undefined;

    if (!challenge || !signature || !authenticatorData || !clientDataJSON) {
      // Redirect to the beginning of the auth flow.
      navigateTo(localePath("/auth"));
    }

    try {
      const { username, server } = useUserId(id);
      const config = await useServerConfiguration(server);

      const user = (await useFetch(
        `https://${normalizeUrl(config.url).host}/users/${username}`,
      ).data.value) as User;

      const publicKey = user.public_keys.find((k) => k.id === key);

      if (!publicKey) {
        console.error(
          `Public key with ID "${key}" not found for user "${username}@${server}".`,
        );
        navigateTo(localePath("/auth"));
      }

      // Perform WebAuthn verification.
      const isVerified = await useWebautn(
        publicKey.public_key_pem,
        challenge as string,
        signature,
        authenticatorData,
        clientDataJSON,
      );

      if (isVerified) {
        const token = generateToken(`${username}@${server}`);
        navigateTo(`turms:${token}`, { external: true });
      } else {
        navigateTo(localePath("/auth"));
      }
    } catch (error) {
      navigateTo(localePath("/"));
    }
  }
});
