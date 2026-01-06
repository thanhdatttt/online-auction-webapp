import dotenv from "dotenv";
// load config from env
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_URL: process.env.CLIENT_URL,
  JWT_SECRET:
    process.env.JWT_SECRET,
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET,
  JWT_REGISTER:
    process.env.JWT_REGISTER,
  EMAIL_APP: process.env.EMAIL_APP,
  PASSWORD_EMAIL_APP: process.env.PASSWORD_EMAIL_APP,

  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI:
    process.env.GOOGLE_REDIRECT_URI,

  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI,

  SITE_KEY: process.env.SITE_KEY,
  SECRET_KEY: process.env.SECRET_KEY,

  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
};
