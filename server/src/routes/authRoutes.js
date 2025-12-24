import express from "express";
import { signup, login, adminLogin, getMe, logout } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/register", signup);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
