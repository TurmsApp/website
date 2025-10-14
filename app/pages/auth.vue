<script setup lang="ts">
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

if (process.server) {
  const query: AuthQuery = useRoute().query;
  const { signature, id, key, authenticatorData, clientDataJSON } = query;

  // Configuration for the challenge cookie.
  const COOKIE_MAX_AGE = 60 * 5; // 5 minutes in seconds.
  const COOKIE_OPTIONS = {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    secure: true, // Should always be true in production.
    sameSite: "strict" as const,
  };

  if (!id || !key) {
    try {
      // 32 bytes (256 bits) is a standard secure length for a challenge.
      const challengeBytes = generateChallenge(32);
      const challenge = challengeBytes.toString("base64url");
      useCookie("challenge", COOKIE_OPTIONS).value = challenge;

      // Redirect the user to the external authorization service.
      await navigateTo(
        `https://account.gravitalia.com/authorize?redirect=https://turms.gravitalia.com/auth&challenge=${challenge}`,
        { external: true, redirectCode: 307 },
      );
    } catch (error) {
      console.error("Error during initial authorization redirect:", error);
      await navigateTo("/");
    }
  } else {
    const challenge = useCookie("challenge").value;
    // Clear the cookie immediately after reading it, regardless of the outcome.
    useCookie("challenge", COOKIE_OPTIONS).value = null;

    if (!challenge) {
      console.warn("Missing or expired challenge cookie. Restarting flow.");
      const localePath = useLocalePath();
      // Redirect to the beginning of the auth flow.
      await navigateTo(localePath("/auth"));
    }

    // Ensure all required parameters are present for verification.
    if (!signature || !authenticatorData || !clientDataJSON) {
      console.error("Missing required query parameters for verification.");
      const localePath = useLocalePath();
      await navigateTo(localePath("/auth"));
    }

    try {
      const { username, server } = useUserId(id);
      const config = await useServerConfiguration(server);

      const user: User = await $fetch(
        `https://${normalizeUrl(config.url).host}/users/${username}`,
      );

      const publicKey = user.public_keys.find((k) => k.id === key);

      if (!publicKey) {
        console.error(
          `Public key with ID "${key}" not found for user "${username}@${server}".`,
        );
        throw new Error("public key not found");
      }

      // 2. Perform WebAuthn Verification
      const isVerified = await useWebautn(
        publicKey.public_key_pem,
        challenge as string,
        signature,
        authenticatorData,
        clientDataJSON,
      );

      if (isVerified) {
        const token = generateToken(`${username}@${server}`);
        await navigateTo(`turms:${token}`, { external: true });
      } else {
        console.error(
          `WebAuthn verification failed for ${username}@${server}.`,
        );
      }
    } catch (error) {
      console.error("Authentication process failed:", error);
    }
  }
}
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <p>You don't suppose to see this. Please contact support.</p>
  </div>
</template>
