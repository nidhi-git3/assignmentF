import express from "express";
import { body, validationResult } from "express-validator";
import Contact from "../models/Contact.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  body("fullName").notEmpty(),
  body("email").isEmail(),
  body("mobile").notEmpty(),
  body("city").notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const contact = await Contact.create(req.body);
      res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const contacts = await Contact.find().sort("-createdAt");
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

export default router;


