import jwt from "jsonwebtoken";

export const generateToken = (sub: string): string => {
  return jwt.sign(
    {
      sub,
      iss: "https://turms.gravitalia.com",
      aud: "discovery"
    },
    useRuntimeConfig().private.ecdsaPrivateKey,
    { algorithm: "ES256", header: { kid: "3+uMdwtBCG5frztDFOxV97fvcmNyX/WZIQSX1SnDoto=" }, expiresIn: "5m" },
  )
};
