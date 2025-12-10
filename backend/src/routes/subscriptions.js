import express from "express";
import { body, validationResult } from "express-validator";
import Subscription from "../models/Subscription.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", body("email").isEmail(), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const existing = await Subscription.findOne({ email: req.body.email });
    if (existing) return res.json(existing);
    const subscription = await Subscription.create({ email: req.body.email });
    res.status(201).json(subscription);
  } catch (err) {
    next(err);
  }
});

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const subs = await Subscription.find().sort("-createdAt");
    res.json(subs);
  } catch (err) {
    next(err);
  }
});

export default router;


