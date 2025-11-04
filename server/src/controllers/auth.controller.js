import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const {username, password, email} = req.body;
        // check if user exists
        const user = await User.findOne({username});
        if (user) {
            return res.status(400).json({message: "User already exists"});
        }

        // register
        await User.create({username, passwordHash: password, email});
        res.status(201).json({message: "User registered successfully"});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        // check if user exists
        const user = await User.findOne({username});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        // check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({message: "Password is not matched"});
        }

        // create token
        const token = jwt.sign(
            {id: user._id, role: user.role},
            config.JWT_SECRET,
            {expiresIn: "1h"},
        );

        res.status(201).json({
            message: "Login successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        })

    } catch (err) {
        res.status(400).json({message: err.message});
    }
}