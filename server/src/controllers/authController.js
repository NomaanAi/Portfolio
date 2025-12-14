import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
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

    // Generate token
    const token = generateToken(user._id, user.role);

    // Remove password from output
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user: userResponse,
    });
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

    const token = generateToken(user._id, user.role);

    // Remove password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      status: "success",
      token,
      user: userResponse
    });
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

    const token = generateToken(user._id, user.role);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      status: "success",
      token,
      user: userResponse
    });
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
