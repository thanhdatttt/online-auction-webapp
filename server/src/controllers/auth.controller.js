import jwt from "jsonwebtoken";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { config } from "../configs/config.js";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { generateOTP, sendOTP } from "../utils/otp.utils.js";
import { verify_captcha } from "../utils/captcha.utils.js";
const ACCESS_TOKEN_TTL = "1d";
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

// generates access and refresh token
const genAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
};

const genRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// only used for register verification
export const register = async (req, res) => {
  try {
    const { email, captcha } = req.body;

    if (!captcha)
      return res
        .status(400)
        .json({ field: "captcha", error: "Please verify the Captcha" });

    const success = verify_captcha(captcha);

    if (!success)
      return res
        .status(400)
        .json({ field: "captcha", error: "OTP verification failed" });

    // checking if email exists before sending OTP....
    const existEmail = await User.findOne({ email });

    if (existEmail)
      return res
        .status(400)
        .json({ field: "email", error: "Email is already in use." });

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

    sendOTP(generatedOTP, subject, contentHTML);
    res.status(200).json({ message: "Proceed to the verification process" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// can be used for verifying OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ field: "otp", error: "OTP is empty" });
    }

    const existsOTP = await OTP.findOne({ email });

    if (!existsOTP || otp !== existsOTP.otp)
      return res
        .status(400)
        .json({ field: "otp", error: "Your OTP is invalid." });

    const isExpired = (Date.now() - existsOTP.createdAt) / 1000 > 300;

    if (isExpired)
      return res.status(400).json({
        field: "otp",
        error: "Your OTP is already expired.",
        status: 402,
      });

    // delete record if verifying successfully.
    await OTP.deleteOne({ email: existsOTP.email });

    const token = jwt.sign({ email }, config.JWT_REGISTER, {
      expiresIn: "5m",
    });

    res
      .status(200)
      .json({ message: "Verify OTP successfully.", token, status: 200 });

    // propagation for creating user
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// bypass login for register.....
export const createUser = async (req, res) => {
  try {
    const { username, password, firstName, lastName, address } = req.body;
    const email = req.email;

    // check if user exists
    const existUser = await User.findOne({ username });
    if (existUser) {
      return res
        .status(400)
        .json({ field: "username", error: "Username is already in use." });
    }
    const user = await User.create({
      username: username,
      passwordHash: password,
      firstName: firstName,
      lastName: lastName,
      address: address,
      email: email,
    });

    // create tokens
    const accessToken = genAccessToken(user);
    const refreshToken = genRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    // save refresh token to cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_TTL,
    });
    res.status(201).json({
      message: "Register and verify successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ error: "Your register session is already out of date." });
    }

    if (err.name === "JsonWebTokenError") {
      return res
        .status(400)
        .json({ error: "Your register session is invalid." });
    }
    res.status(400).json({ error: err.message });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { username, password, captcha } = req.body;

    // if (!captcha)
    //   return res
    //     .status(400)
    //     .json({ field: "captcha", error: "Please verify the Captcha" });

    // const success = verify_captcha(captcha);

    // if (!success)
    //   return res
    //     .status(400)
    //     .json({ field: "captcha", error: "OTP verification failed" });

    // check if user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password." });
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
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_TTL,
    });
    res.status(201).json({
      message: "Login successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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
    res.status(400).json({ message: error.message });
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
        return res
          .status(400)
          .json({ message: "Expired or invalid refresh token" });
      }

      const newAccessToken = genAccessToken(user);
      return res.status(200).json({
        accessToken: newAccessToken,
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

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
  res.json({ url });
};

// get the google callback
export const googleCallback = async (req, res) => {
  // get the code
  const code = req.query.code;

  try {
    // get tokens and verify from code
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.GOOGLE_CLIENT_ID,
    });

    // authen from payload
    const payload = ticket.getPayload();
    // check if user already exists
    let user = await User.findOne({ "providers.google.id": payload.sub });
    if (!user) {
      // check if email already used
      user = await User.findOne({ email: payload.email });
      if (user) {
        user.providers.google = { id: payload.sub };
        await user.save();
      } else {
        // gen username from email
        let baseUserName = payload.email.split("@")[0];
        let count = 1;
        while (await User.findOne({ username: baseUserName })) {
          baseUserName = `${baseUserName}${Math.floor(Math.random() * 1000)}`;
          count++;
          if (count > 100) break;
        }

        // create new user
        user = await User.create({
          username: baseUserName,
          email: payload.email,
          providers: { google: { id: payload.sub } },
          firstName: payload.given_name,
          lastName: payload.family_name,
          avatar_url: payload.picture,
        });
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

    // redirect back with token
    const redirectUrl = `${config.CLIENT_URL}/auth/success?accessToken=${accessToken}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// facebook authentication
export const getFacebookUrl = (req, res) => {
  const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${
    config.FACEBOOK_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    config.FACEBOOK_REDIRECT_URI
  )}&scope=email,public_profile`;
  res.json({ url });
};

// get the fb callback
export const facebookCallback = async (req, res) => {
  const code = req.query.code;

  try {
    // get callback info
    const tokenRes = await axios.get(
      `https://graph.facebook.com/v12.0/oauth/access_token`,
      {
        params: {
          client_id: config.FACEBOOK_CLIENT_ID,
          client_secret: config.FACEBOOK_CLIENT_SECRET,
          redirect_uri: config.FACEBOOK_REDIRECT_URI,
          code,
        },
      }
    );

    // use fb access token to get info
    const fbAccesstoken = tokenRes.data.access_token;
    const profileRes = await axios.get(`https://graph.facebook.com/me`, {
      params: {
        fields: "id,name,email,picture",
        access_token: fbAccesstoken,
      },
    });

    const profile = profileRes.data;
    let user = await User.findOne({ "providers.facebook.id": profile.id });
    if (!user) {
      // check if email already used
      user = await User.findOne({ email: profile.email });
      if (user) {
        user.providers.facebook = { id: profile.id };
        await user.save();
      } else {
        // create new user
        user = await User.create({
          username: profile.name,
          email: profile.email,
          providers: { facebook: { id: profile.id } },
          firstName: profile.name?.split(" ")[0] || "",
          lastName: profile.name?.split(" ").slice(1).join(" ") || "",
          avatar_url: profile.picture?.data?.url || null,
        });
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
    res.status(400).json({ message: error.message });
  }
};

// manage password
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    // Fake sent OTP even if email doesn't exist
    if (!user) {
      return res.status(200).json({
        message: "An OTP has been sent.",
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
    const { newPassword } = req.body;

    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.passwordHash = newPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
