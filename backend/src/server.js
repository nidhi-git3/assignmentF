import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

import projectsRouter from "./routes/projects.js";
import clientsRouter from "./routes/clients.js";
import contactsRouter from "./routes/contacts.js";
import subscriptionsRouter from "./routes/subscriptions.js";
import authRouter from "./routes/auth.js";
import AdminUser from "./models/AdminUser.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flipr";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

app.use(limiter);
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/projects", projectsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/auth", authRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongo connected");
    await ensureAdminUser();
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const existing = await AdminUser.findOne({ email });
  if (existing) return;
  const passwordHash = await bcrypt.hash(password, 10);
  await AdminUser.create({ email, passwordHash });
  console.log(`Seeded admin user ${email}`);
}

start();

