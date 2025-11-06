import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";
import User from "../models/User.js";

// generates access and refresh token
const genAccessToken = (user) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        config.JWT_SECRET,
        {expiresIn: "1h"},
    );
}

const genRefreshToken = (user) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        config.JWT_REFRESH_SECRET,
        {expiresIn: "7d"},
    );
}

// register
export const register = async (req, res) => {
    try {
        const {username, password, email} = req.body;
        // check if user exists
        const existUser = await User.findOne({username});
        if (existUser) {
            return res.status(400).json({message: "User already exists"});
        }

        // register and login
        const user = await User.create({username, passwordHash: password, email});

        // create tokens
        const accessToken = genAccessToken(user);
        const refreshToken = genRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        // save refresh token to cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            message: "Register and login successfully",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

// login
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

        // create tokens
        const accessToken = genAccessToken(user);
        const refreshToken = genRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        // save refresh token to cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            message: "Login successfully",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

// logout
export const logout = async (req, res) => {
    // clear cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    });

    // clear refresh token
    const user = await User.findOne({ refreshToken: req.cookies.refreshToken });
    if (user) {
        user.refreshToken = null;
        await user.save();
    }

    res.status(200).json({ message: "Logged out successfully" });
};

// refresh token
export const refreshToken = async (req, res) => {
    try {
        // get token from cookie
        const {refreshToken} = req.cookies.refreshToken;
        // check if there is token
        if (!refreshToken) {
            return res.status(400).json({message: "Missing refresh token"});
        }

        // check if token is correct
        const user = await User.findOne({refreshToken});
        if (!user) {
            return res.status(400).json({message: "Invalid refresh token"});
        }

        jwt.verify(refreshToken, config.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(400).json({message: "Expired or invalid refresh token"});
            }

            const newAccessToken = genAccessToken(user);
            return res.status(200).json({
                accessToken: newAccessToken,
            });
        });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}