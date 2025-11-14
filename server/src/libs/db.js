import mongoose from "mongoose";
import { config } from "../configs/config.js";

// connect database
export const connectDB = async () => {
    mongoose.connect(config.MONGO_URI)
        .then(() => {
            console.log("MongoDB connected");
            
        })
        .catch(err => {
            console.error("MongoDB error:", err);
            console.log("MONGO_URI loaded:", config.MONGO_URI);
            process.exit(1);
        });
}