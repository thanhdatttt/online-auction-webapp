import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";
import User from "../models/User.js";
import OTP from "../models/OTP.js";

import bcrypt from "bcryptjs";
// for sending email
import nodemailer from 'nodemailer';

// generates access and refresh token
const genAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        config.JWT_SECRET,
        { expiresIn: "1h" },
    );
}

const genRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        config.JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
    );
}
// reuse for forgot password
const generateOTP = async (email, username = "", hashPassword = "") => {
    try {
        const existsOTP = await OTP.findOne({ email });

        if (existsOTP) {

            const timeDiff = (Date.now() - existsOTP.createdAt.getTime()) / 1000 // for avoiding spamming

            if (timeDiff < 60)
                throw new Error(`Please wait for ${Math.ceil(60 - timeDiff)} second(s) before sending a new OTP request.`);

            await OTP.deleteOne({ email });
        }

        const randomCode = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");

        const newOTP = await OTP.create({ email, username, hashPassword, otp: randomCode})

        return newOTP;
    } catch(err) {
        res.status(400).json({message: err.message});
    }

}

// reuse for forgot password
const sendOTP = async (newOTP, subject, contentHTML) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.EMAIL_APP,
                pass: config.PASSWORD_EMAIL_APP,
            },
        });

        const mailOptions = {
            from: `"Your Auctiz" <${config.EMAIL_APP}>`,
            to: newOTP.email,
            subject: subject,
            html: contentHTML,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Error occured when trying to send an OTP to email.");
    }
}


// encap the whole process of generate OTP and send OTP
// cuz sometime users want to re-send......
const emailverificationOTP = async (email, username="", hashPassword="") => {
    // generate a new OTP and we also want to store draft username and password for propagation... 
    const newOTP = await generateOTP(email, username, hashPassword);

    // set up mail for sending OTP
    const subject = "[Auctiz] Verify your email address";

    const contentHTML = `
            <p>Hello,</p>

            <p>Thank you for registering on <strong>Auctiz</strong>!</p>
            <p>To complete your registration, please verify your email address by entering the OTP code below in the Auctiz verification page:</p>

            <h2 style="text-align:center; color:#2F4F4F;">${newOTP.otp}</h2>

            <p>If you did not request this, please ignore this email.</p>

            <p>Best regards,<br>The Auctiz Team.</p>`;

    await sendOTP(newOTP, subject, contentHTML);
}


// register
export const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        // check if user exists
        const existUser = await User.findOne({ username });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // checking if email exists before sending OTP....
        const existEmail = await User.findOne({ email });

        if (existEmail)
            return res.status(400).json({ message: "Email is already in use." });

        // for securing password in OTP table 
        const hashPassword = await bcrypt.hash(password, 10);

        emailverificationOTP(email, username, hashPassword);

        res.status(200).json({ message: "Send an OTP successfully. Please check your email." });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// verify successfully then save user account
export const verifyAndSave = async (req, res) => {
    try {

        const { email, otp } = req.body;

        const existsOTP = await OTP.findOne({ email });

        if (!existsOTP || otp !== existsOTP.otp)
            return res.status(400).json({ message: "Invalid OTP." });

        const isExpired = ((Date.now() - existsOTP.createdAt) / 1000) > 300;

        if (isExpired)
            return res.status(400).json({ message: "Your OTP is already expired." });

        const user = await User.create(
            {
                username: existsOTP.username,
                passwordHash: existsOTP.hashPassword,
                email: existsOTP.email
            }
        );

        console

        // delete record if verifying successfully.
        await OTP.deleteOne({ email: existsOTP.email });

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
            message: "Register and verify successfully",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is not matched" });
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
        res.status(400).json({ message: err.message });
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
        const { refreshToken } = req.cookies.refreshToken;
        // check if there is token
        if (!refreshToken) {
            return res.status(400).json({ message: "Missing refresh token" });
        }

        // check if token is correct
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(400).json({ message: "Invalid refresh token" });
        }

        jwt.verify(refreshToken, config.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: "Expired or invalid refresh token" });
            }

            const newAccessToken = genAccessToken(user);
            return res.status(200).json({
                accessToken: newAccessToken,
            });
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}