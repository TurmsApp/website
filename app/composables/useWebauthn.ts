import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type {
  VerifiedAuthenticationResponse,
  WebAuthnCredential,
  VerifyAuthenticationResponseOpts,
  AuthenticationResponseJSON,
  AuthenticatorAssertionResponseJSON,
} from "@simplewebauthn/server";

const EXPECTED_RPID = "account.gravitalia.com";
const EXPECTED_ORIGIN = [`https://${EXPECTED_RPID}`];

export const useWebautn = async (
  userId: string,
  publicKey: Uint8Array<ArrayBuffer>,
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
      id: userId,
      rawId: userId,
      response: res,
      type: "public-key",
      clientExtensionResults: {},
    };

    const credential: WebAuthnCredential = {
      id: "",
      publicKey,
      counter: 0,
      transports: [],
    };

    const opts: VerifyAuthenticationResponseOpts = {
      response,
      expectedChallenge,
      expectedOrigin: EXPECTED_ORIGIN,
      expectedRPID: EXPECTED_RPID,
      credential: credential,
    };
    verification = await verifyAuthenticationResponse(opts);
  } catch (error) {
    return false;
  }

  const { verified } = verification;
  return verified;
};
