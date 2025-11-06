import dotenv from 'dotenv';
// load config from env
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/auctiondb",
    JWT_SECRET: process.env.JWT_SECRET || "QDXZLwjpOYSplfPlOi13VjV6XBeexxdzb8Jbhz/tWGoY73Ky//Wtodvf0SKlv5EUqF9mZ7YoGOaz2aszN3uXxw==",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "0cgufdf0GGeXuj8G5M85hGB9+tvbq/4RnKb5RhpOdBhQoOA3PX50SXS357rJ6/X3kknK4KbwBTPEaxtRaSozdQ==",

    EMAIL_APP: process.env.EMAIL_APP,
    PASSWORD_EMAIL_APP: process.env.PASSWORD_EMAIL_APP
};
