import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type {
  VerifiedAuthenticationResponse,
  WebAuthnCredential,
  VerifyAuthenticationResponseOpts,
  AuthenticationResponseJSON,
  AuthenticatorAssertionResponseJSON,
} from "@simplewebauthn/server";
import { importSPKI } from "jose";
import { cborEncodeMap } from "~/utils/cbor";
import { Buffer } from "buffer";

const EXPECTED_RPID = "account.gravitalia.com";
const EXPECTED_ORIGIN = [`https://${EXPECTED_RPID}`];

/**
 * Converts a PEM public key (EC P-256) to a COSE Key (CBOR-encoded Uint8Array)
 * @param {string} pemContent Contents of the public key in PEM format
 * @returns {Uint8Array}
 */
export const pemToCose = async (pem: string) => {
  const cryptoKey = await importSPKI(pem, "ES256");

  const jwk = await crypto.subtle.exportKey("jwk", cryptoKey);

  if (jwk.kty !== "EC" || jwk.crv !== "P-256" || !jwk.x || !jwk.y) {
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

  const cborKey = cborEncodeMap(COSE_KEY);

  return new Uint8Array(cborKey);
};

export const useWebautn = async (
  userId: string,
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
      id: userId,
      rawId: userId,
      response: res,
      type: "public-key",
      clientExtensionResults: {},
    };

    const credential: WebAuthnCredential = {
      id: "",
      publicKey: await pemToCose(publicKey),
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
    console.error(error);
    return false;
  }

  const { verified } = verification;
  return verified;
};
