import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";
import User from "../models/User.js";

export const auth = (req, res, next) => {
  try {
    // get header
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    // get token
    const token = header.split(" ")[1];

    // verify token
    jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Expired or invalid token" });
      }

      const user = await User.findById(decoded.id).select(
        "-passwordHash -refreshToken"
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "System error when JWT authenticating" });
  }
};

export const authOTP = (req, res, next) => {
  try {
    // get header
    const header = req.headers.authorization;
    if (!header) {
      return res.status(400).json({ message: "No token provided" });
    }

    // get token
    const token = header.split(" ")[1];

    // verify token
    jwt.verify(token, config.JWT_REGISTER, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Expired or invalid token" });
      }

      req.email = decoded.email;
      next();
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "System error when JWT authenticating" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only." });
  }
  next();
};

export const authorize = (...validRoles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(403).json({ message: "You are not authenticated." });
    if (!validRoles.includes(req.user.role))
      return res
        .status(403)
        .json({ message: "You are not allowed to perform this action." });
    next();
  };
};
