import express from 'express';
import cors from 'cors';
import http from "http";
import cookieParser from "cookie-parser";
import { config } from './configs/config.js';
import { connectDB } from './libs/db.js';
import { auth } from './middlewares/auth.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import adminRoute from "./routes/admin.route.js";
import bidderRoute from "./routes/bidder.route.js";

// create server
const app = express();
const server = http.createServer(app);

// set up server
app.use(cors({origin: config.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);

app.use(auth);
app.use("/api/users", userRoute);
app.use("/api/bidder", bidderRoute);

app.use("/api/admin", adminRoute);

// run server
connectDB()
    .then(() => {
        server.listen(config.PORT, () =>
            console.log(`Server running on port ${config.PORT} ...`)
        );
    });