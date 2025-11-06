import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from "cookie-parser";
import { config } from './configs/config.js';
import { connectDB } from './libs/db.js';
import { auth } from './middlewares/auth.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);

app.use(auth);
app.use("/api/users", userRoute);

// run server
connectDB()
    .then(() => {
        server.listen(config.PORT, () =>
            console.log(`Server running on port ${config.PORT} ...`)
        );
    });