import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";
import User from "../models/User.js";
import OTP from "../models/OTP.js";

import crypto from 'crypto';
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

const genOTPToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        config.JWT_SECRET,
        { expiresIn: "5m" },
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

        const user = await User.findOne({ email });

        const OTPToken = genOTPToken(user);
        // delete record if verifying successfully.
        await OTP.deleteOne({ email: existsOTP.email });

        res.status(200).json({ message: "Verify OTP successfully.", OTPToken: OTPToken });

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

export const changePassword = async (req, res) => {
    try{
        const { oldPassword, newPassword } = req.body;
    
        const user = await User.findById(req.user.id).select('+passwordHash');
    
        if (!(await user.comparePassword(oldPassword))) {
            return res.status(401).json({ message: 'Your old password is not matched.' });
        }
    
        // const accessToken = genAccessToken(user);
        // const refreshToken = genRefreshToken(user);
        // user.refreshToken = refreshToken;

        // Save new password
        user.passwordHash = newPassword;
        await user.save();
    
        res.status(200).json({ message: 'Password changed successfully.' });
    } catch(e) {
        res.status(500).json({ message: e.message });
    }
};

export const forgotPassword = async (req, res) => {
  try {

    const email = req.body.email;
    const user = await User.findOne({ email });
    
    // Fake sent OTP even if email doesn't exist
    if (!user) {
      return res.status(200).json({
        message: 'An OTP has been sent.',
      });
    }

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

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    user.passwordHash = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};