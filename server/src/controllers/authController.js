import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // Enable in production with HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Needed for cross-site if separate domains
  };

  // For development on localhost/HTTP, secure must be false.
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: "fail", message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: "fail", message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token and send response
    createSendToken(user, 201, res);
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password" });
    }

    // specific selection to include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ status: "fail", message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "fail", message: "Invalid credentials" });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ status: "fail", message: "Invalid credentials" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ status: "fail", message: "Access denied: Admins only" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "fail", message: "Invalid credentials" });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const getMe = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: "fail", message: "Not authenticated" });
    }

    res.status(200).json({
      status: "success",
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
