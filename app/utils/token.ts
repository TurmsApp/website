import * as jose from "jose";

const EXPIRATION_TIME = "6h";
const alg = "ES256";

export const generateToken = async (sub: string): Promise<string> => {
  const privateKeyPem = useRuntimeConfig().private.TURMS_JWT_PRIVATE_KEY;
  const privateKey = await jose.importPKCS8(privateKeyPem, alg);

  const token = await new jose.SignJWT({})
    .setProtectedHeader({
      alg,
    })
    .setIssuedAt()
    .setIssuer("https://turms.gravitalia.com")
    .setAudience("discovery")
    .setSubject(sub)
    .setExpirationTime(EXPIRATION_TIME)
    .sign(privateKey);

  return token;
};
