import { generateToken, generateRefreshToken } from "../utils/generateToken.js";

// Create access & refresh tokens, manages refresh token storage

export const createAuthSession = async ({ user, rememberMe }) => {
  // decide expiry durations

  const accessTokenExpiry = "15m";
  const refreshTokenExpiry = rememberMe ? "30d" : "7d";

  // generate tokens

  const accessToken = generateToken(user._id, accessTokenExpiry);
  const refreshToken = generateRefreshToken(user._id, refreshTokenExpiry);

  // Remove expired refresh tokens

  user.refreshTokens = user.refreshTokens.filter(
    (rt) => rt.expiresAt > new Date(),
  );

  // Store new refresh token

  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(
      Date.now() +
        (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000),
    ),
  });

  await user.save();

  return {
    accessToken,
    refreshToken,
    refreshTokenMaxAge: rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000,
  };
};
