import jwt from "jsonwebtoken";
import axios from "axios";
import {OAuth2Client} from "google-auth-library";
import { config } from "../configs/config.js";
import User from "../models/User.js";
import OTP from "../models/OTP.js";

import crypto from 'crypto';
// for sending email
import nodemailer from 'nodemailer';

const ACCESS_TOKEN_TTL = "1h";
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

// generates access and refresh token
const genAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        config.JWT_SECRET,
        {expiresIn: ACCESS_TOKEN_TTL},
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
const generateOTP = async (email) => {
    try {
        const existsOTP = await OTP.findOne({ email });

        if (existsOTP) {

            const timeDiff = (Date.now() - existsOTP.createdAt.getTime()) / 1000 // for avoiding spamming

            if (timeDiff < 60)
                throw new Error(`Please wait for ${Math.ceil(60 - timeDiff)} second(s) before sending a new OTP request.`);

            await OTP.deleteOne({ email });
        }

        const randomCode = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

        const newOTP = await OTP.create({ email, otp: randomCode })

        return newOTP;

    } catch (err) {
        throw new Error("Error occured when trying to generate an OTP");
    }

    
}

// reuse for forgot password
// custom subject and contentHTML
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
        console.error(error);
        throw new Error(error.message);
    }
}

// only used for register verification 
export const register = async (req, res) => {

    try {
        const { email } = req.body;

        // checking if email exists before sending OTP....
        const existEmail = await User.findOne({ email });

        if (existEmail)
            return res.status(400).json({ message: "Email is already in use." });

        // set up subject and content for sending OTP

        const generatedOTP = await generateOTP(email);

        const subject = "[Auctiz] Verify your email address";

        const contentHTML = `
            <p>Hello,</p>

            <p>Thank you for registering on <strong>Auctiz</strong>!</p>
            <p>To complete your registration, please verify your email address by entering the OTP code below in the Auctiz verification page:</p>

            <h2 style="text-align:center; color:#2F4F4F;">${generatedOTP.otp}</h2>

            <p>If you did not request this, please ignore this email.</p>

            <p>Best regards,<br>The Auctiz Team.</p>`;

        await sendOTP(generatedOTP, subject, contentHTML);

        res.status(200).json({ message: "Proceed to the verification process" });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }

}


// can be used for verifying OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const existsOTP = await OTP.findOne({ email });

        if (!existsOTP || otp !== existsOTP.otp)
            return res.status(400).json({ message: "Invalid OTP." });

        const isExpired = ((Date.now() - existsOTP.createdAt) / 1000) > 300;

        if (isExpired)
            return res.status(400).json({ message: "Your OTP is already expired." });


        // delete record if verifying successfully.
        await OTP.deleteOne({ email: existsOTP.email });


        res.status(200).json({ message: "Verify OTP successfully." });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// bypass login for register.....
export const createUser = async (req, res) => {

    try {
        const { email, username, password } = req.body;

        // check if user exists
        const existUser = await User.findOne({ username });
        if (existUser) {
            return res.status(400).json({ message: "Username is already in use." });
        }

        const user = await User.create(
            {
                username: username,
                passwordHash: password,
                email: email
            }
        );

        // create tokens
        const accessToken = genAccessToken(user);
        const refreshToken = genRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        // save refresh token to cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: REFRESH_TOKEN_TTL,
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
            secure: true,
            sameSite: "strict",
            maxAge: REFRESH_TOKEN_TTL,
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
    try {
        // clear cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
    
        // clear refresh token
        const user = await User.findOne({ refreshToken: req.cookies.refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
    
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

// refresh token
export const refreshToken = async (req, res) => {
    try {
        // get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;
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

// google authentication
const client = new OAuth2Client({
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    redirectUri: config.GOOGLE_REDIRECT_URI,
});

export const getGoogleUrl = (req, res) => {
    const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["email", "profile"],
    });
    res.json({url});
}

// get the google callback
export const googleCallback = async (req, res) => {
    // get the code
    const code = req.query.code;

    try {
        // get tokens and verify from code
        const {tokens} = await client.getToken(code);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: config.GOOGLE_CLIENT_ID,
        });
    
        // authen from payload
        const payload = ticket.getPayload();
        // check if user already exists
        let user = await User.findOne({"providers.google.id": payload.sub});
        if (!user) {
            // check if email already used
            user = await User.findOne({email: payload.email});
            if (user) {
                user.providers.google = {id: payload.sub};
                await user.save();
            } else {
                // gen username from email
                let baseUserName = payload.email.split("@")[0];
                let count = 1;
                while (await User.findOne({username: baseUserName})) {
                    baseUserName = `${baseUserName}${Math.floor(Math.random() * 1000)}`;
                    count++;
                    if (count > 10)
                        break;
                }
    
                // create new user
                user = await User.create({
                    username: baseUserName,
                    email: payload.email,
                    providers: { google: { id: payload.sub } },
                    firstName: payload.given_name,
                    lastName: payload.family_name,
                    avatar_url: payload.picture
                })
            }
        }
    
        // create tokens
        const accessToken = genAccessToken(user);
        const refreshToken = genRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();
    
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: REFRESH_TOKEN_TTL,
        });
        res.status(201).json({
            message: "Login with Google successfully",
            accessToken,
            refreshToken,
            user,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// facebook authentication
export const getFacebookUrl = (req, res) => {
    const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${config.FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(config.FACEBOOK_REDIRECT_URI)}&scope=email,public_profile`;
    res.json({url});
}

// get the fb callback
export const facebookCallback = async (req, res) => {
    const code = req.query.code;

    try {
        // get callback info
        const tokenRes = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
            params: {
                client_id: config.FACEBOOK_CLIENT_ID,
                client_secret: config.FACEBOOK_CLIENT_SECRET,
                redirect_uri: config.FACEBOOK_REDIRECT_URI,
                code,
            }
        });
    
        // use fb access token to get info
        const fbAccesstoken = tokenRes.data.access_token;
        const profileRes = await axios.get(`https://graph.facebook.com/me`, {
            params: {
                fields: "id,name,email,picture",
                access_token: fbAccesstoken,
            },
        });
    
        
        const profile = profileRes.data;
        let user = await User.findOne({"providers.facebook.id": profile.id});
        if (!user) {
            // check if email already used
            user = await User.findOne({email: profile.email});
            if (user) {
                user.providers.facebook = {id: profile.id};
                await user.save();
            } else {
                // create new user
                user = await User.create({
                    username: profile.name,
                    email: profile.email,
                    providers: { facebook: { id: profile.id } },
                    firstName: profile.name?.split(" ")[0] || "",
                    lastName: profile.name?.split(" ").slice(1).join(" ") || "",
                    avatar_url: profile.picture?.data?.url || null
                })
            }  
        }
    
        // create tokens
        const accessToken = genAccessToken(user);
        const refreshToken = genRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();
    
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: REFRESH_TOKEN_TTL,
        });
        res.status(201).json({
            message: "Login with Facebook successfully",
            accessToken,
            refreshToken,
            user,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
} 