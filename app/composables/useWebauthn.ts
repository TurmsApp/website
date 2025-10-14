import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type {
  VerifiedAuthenticationResponse,
  WebAuthnCredential,
  VerifyAuthenticationResponseOpts,
  AuthenticationResponseJSON,
  AuthenticatorAssertionResponseJSON,
} from "@simplewebauthn/server";

/**
 * Converts a PEM string (like a certificate or key) to a Uint8Array.
 * @param {string} pem The PEM-encoded string.
 * @returns {Uint8Array} The corresponding data as a Uint8Array.
 */
const pemToUint8Array = (pem: string) => {
  const base64 = pem
    .replace(/-----BEGIN [^-]+-----/, "")
    .replace(/-----END [^-]+-----/, "")
    .replace(/\s/g, "");

  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

export const useWebautn = async (
  publicKey: string,
  expectedChallenge: string,
  signature?: string,
  authenticatorData?: string,
  clientDataJSON?: string,
): Promise<boolean> => {
  if (!signature || !authenticatorData || !clientDataJSON) return false;

  let verification: VerifiedAuthenticationResponse;
  try {
    let res: AuthenticatorAssertionResponseJSON = {
      signature,
      authenticatorData,
      clientDataJSON,
    };
    const response: AuthenticationResponseJSON = {
      id: "MA==",
      rawId: "MA==",
      response: res,
      type: "public-key",
      clientExtensionResults: {},
    };

    const credential: WebAuthnCredential = {
      id: "",
      publicKey: pemToUint8Array(publicKey),
      counter: 0,
      transports: [],
    };

    const opts: VerifyAuthenticationResponseOpts = {
      response,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin: "https://account.gravitalia.com",
      expectedRPID: "Gravitalia",
      credential: credential,
      requireUserVerification: false,
    };
    verification = await verifyAuthenticationResponse(opts);
  } catch (error) {
    const _error = error as Error;
    console.error(_error);
    return false;
  }

  const { verified, authenticationInfo } = verification;
  return verified;
};
