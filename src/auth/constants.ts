export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const fbConfig = {
  client_id: process.env.FB_CLIENT_ID,
  client_secret: process.env.FB_CLIENT_SECRET,
};

export const appleConfig = {
  privateKey: process.env.APPLE_PRIVATE_KEY,
  keyId: process.env.APPLE_KEY_ID,
  bundleId: process.env.APPLE_BUNDLE_ID,
  teamId: process.env.APPLE_TEAM_ID,
  client_id: process.env.APPLE_CLIENT_ID,
  android: process.env.APPLE_ANDROID,
  redirect_uri: process.env.APPLE_REDIRECT_URI,
};
