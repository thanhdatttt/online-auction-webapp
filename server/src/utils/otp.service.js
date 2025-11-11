// random otp
import crypto from "crypto";
// for sending email
import nodemailer from "nodemailer";
import OTP from "../models/OTP.js";
import { config } from "../configs/config.js";

// reuse for forgot password
export const generateOTP = async (email) => {
  try {
    const existsOTP = await OTP.findOne({ email });

    if (existsOTP) {
      const timeDiff = (Date.now() - existsOTP.createdAt.getTime()) / 1000; // for avoiding spamming

      if (timeDiff < 60)
        throw new Error(
          `Please wait for ${Math.ceil(
            60 - timeDiff
          )} second(s) before sending a new OTP request.`
        );

      await OTP.deleteOne({ email });
    }

    const randomCode = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

    const newOTP = await OTP.create({ email, otp: randomCode });

    return newOTP;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// reuse for forgot password
// custom subject and contentHTML
export const sendOTP = async (newOTP, subject, contentHTML) => {
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
  } catch (err) {
    console.error(err);
    throw err;
  }
};
