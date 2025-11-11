import crypto from "node:crypto";

export const generateChallenge = (length = 32) => {
  return crypto.randomBytes(length);
};
