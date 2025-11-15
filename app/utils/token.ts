import { SignJWT, importPKCS8 } from "jose";

const EXPIRATION_TIME = "6h";

export const generateToken = async (sub: string): Promise<string> => {
  const privateKeyPem = useRuntimeConfig().private.TURMS_JWT_PRIVATE_KEY;

  const privateKey = await importPKCS8(privateKeyPem, "ES256");

  const token = await new SignJWT()
    .setProtectedHeader({
      alg: "ES256",
    })
    .setAudience("discovery")
    .setIssuer("https://turms.gravitalia.com")
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(EXPIRATION_TIME)
    .sign(privateKey);

  return token;
};
