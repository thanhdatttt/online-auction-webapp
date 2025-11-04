import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { config } from './config.js';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "✅ Server is running and reachable!" });
});

mongoose.connect(config.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        server.listen(config.PORT, () =>
            console.log(`Server running on port ${config.PORT} ...`)
        );
    })
    .catch(err => {
        console.error("MongoDB error:", err);
        console.log("MONGO_URI loaded:", config.MONGO_URI);
    });