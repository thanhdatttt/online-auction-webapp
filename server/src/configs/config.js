import dotenv from "dotenv";
// load config from env
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/auctiondb",
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "QDXZLwjpOYSplfPlOi13VjV6XBeexxdzb8Jbhz/tWGoY73Ky//Wtodvf0SKlv5EUqF9mZ7YoGOaz2aszN3uXxw==",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET ||
    "0cgufdf0GGeXuj8G5M85hGB9+tvbq/4RnKb5RhpOdBhQoOA3PX50SXS357rJ6/X3kknK4KbwBTPEaxtRaSozdQ==",
  JWT_REGISTER:
    process.env.JWT_REGISTER ||
    "QQ7iqwWFFmY05VFyBv1ko7Q/uxDOcTNa12c3hcqlemfU0SY9eTFL6WNqfxv4TRrGO087nADUCJCrilk+4xkPgQ==",
  EMAIL_APP: process.env.EMAIL_APP || "nvminh231@clc.fitus.edu.vn",
  PASSWORD_EMAIL_APP: process.env.PASSWORD_EMAIL_APP || "dkoe azvk lsow yumz",

  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID ||
    "647765963057-3egmukrpv2kv4smt2gqe9epoq0eektgl.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET:
    process.env.GOOGLE_CLIENT_SECRET || "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",
  GOOGLE_REDIRECT_URI:
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:5000/api/auth/google/callback",

  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI,
};
