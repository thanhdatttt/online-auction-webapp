import dotenv from 'dotenv';
// load config from env
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/auctiondb",
    JWT_SECRET: process.env.JWT_SECRET || "my_super_secret_key",
};
