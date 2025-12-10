import express from "express";
import { body, validationResult } from "express-validator";
import Client from "../models/Client.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import { cropAndSave } from "../utils/crop.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const clients = await Client.find().sort("-createdAt");
    res.json(clients);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  body("name").notEmpty(),
  body("designation").notEmpty(),
  body("description").notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const publicPath = await cropAndSave(req.file, { width: 300, height: 300 });
      const base =
        (process.env.FILE_BASE_URL || `${req.protocol}://${req.get("host") || ""}`).replace(/\/+$/, "");
      const imageUrl = `${base}${publicPath}`;
      const client = await Client.create({
        name: req.body.name,
        designation: req.body.designation,
        description: req.body.description,
        imageUrl,
      });
      res.status(201).json(client);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;

