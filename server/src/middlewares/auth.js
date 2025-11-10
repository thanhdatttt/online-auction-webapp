import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";

export const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(400).json({message: "No token provided"});
    }

    // get token
    const token = header.split(" ")[1];

    // verify token
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({message: "Invalid token"});
        }
        req.user = decoded;
        next();
    });
}