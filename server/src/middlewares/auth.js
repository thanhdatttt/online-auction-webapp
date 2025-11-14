import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";
import User from "../models/User.js";

export const auth = (req, res, next) => {
    try {
        // get header
        const header = req.headers.authorization;
        if (!header) {
            return res.status(400).json({message: "No token provided"});
        }
    
        // get token
        const token = header.split(" ")[1];
    
        // verify token
        jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).json({message: "Expired or invalid token"});
            }
            
            const user =  await User.findById(decoded.id).select("-hashedPassword");
            if (!user) {
                return res.status(400).json({message: "User not found"});
            }
    
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'System error when JWT authenticating'});
    }
}

export const authOTP = (req, res, next) => {
    try {
        // get header
        const header = req.headers.authorization;
        if (!header) {
            return res.status(400).json({message: "No token provided"});
        }
    
        // get token
        const token = header.split(" ")[1];
    
        // verify token
        jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).json({message: "Expired or invalid token"});
            }
            
            const email = decoded.email;
    
            req.email= email;
            next();
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'System error when JWT authenticating'});
    }
}
