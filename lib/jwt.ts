import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as Secret;

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "1d" });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, accessTokenSecret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, refreshTokenSecret) as JwtPayload;
  } catch (error) {
    return null;
  }
};
