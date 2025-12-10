import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AdminUser from "../models/AdminUser.js";

const router = express.Router();

router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const user = await AdminUser.findOne({ email: req.body.email });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      const ok = await user.comparePassword(req.body.password);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "devsecret",
        { expiresIn: "2d" }
      );
      res.json({ token, email: user.email });
    } catch (err) {
      next(err);
    }
  }
);

export default router;


