import { SignJWT } from "jose";

const EXPIRATION_TIME = "5m";

export const generateToken = async (sub: string): Promise<string> => {
  const privateKeyPem = useRuntimeConfig().private.ecdsaPrivateKey;

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    new TextEncoder().encode(privateKeyPem),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );

  const token = await new SignJWT()
    .setProtectedHeader({
      alg: "ES256",
      kid: "3+uMdwtBCG5frztDFOxV97fvcmNyX/WZIQSX1SnDoto=",
    })
    .setAudience("discovery")
    .setIssuer("https://turms.gravitalia.com")
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(EXPIRATION_TIME)
    .sign(privateKey);

  return token;
};
