import crypto from "crypto";

export const generateChallenge = (length = 32) => {
  return crypto.randomBytes(length);
};
