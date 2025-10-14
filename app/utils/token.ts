import jwt from "jsonwebtoken";

export const generateToken = (sub: string) => {
  return jwt.sign(
    {
      sub,
      iss: "Turms",
    },
    useRuntimeConfig().private.ecdsaPrivateKey,
    { algorithm: "RS256", expiresIn: "1h" },
  );
};
