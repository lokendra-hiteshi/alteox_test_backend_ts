import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import "dotenv/config";

const SECRET_KEY: string = process.env.JWT_SECRET_KEY || "your-secret-key";
const TOKEN_EXPIRATION = 7 * 24 * 60 * 60;

export const generateToken = (email: string): string => {
  if (!SECRET_KEY) {
    throw new Error("Missing SECRET_KEY environment variable");
  }

  const options: SignOptions = {
    expiresIn: TOKEN_EXPIRATION,
  };

  return jwt.sign({ email }, SECRET_KEY, options);
};

export const verifyToken = (token: string): string | JwtPayload => {
  if (!SECRET_KEY) {
    throw new Error("Missing SECRET_KEY environment variable");
  }

  return jwt.verify(token, SECRET_KEY);
};
