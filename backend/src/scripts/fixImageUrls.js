import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/Project.js";
import Client from "../models/Client.js";

dotenv.config();

async function run() {
  const base = process.env.FILE_BASE_URL || "";
  if (!base) {
    console.error("FILE_BASE_URL is required to fix image URLs");
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI missing");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Fixing image URLs with base:", base);

  const fix = async (Model, field) => {
    const docs = await Model.find();
    for (const doc of docs) {
      const current = doc[field];
      if (!current) continue;
      const isAbsolute = current.startsWith("http://") || current.startsWith("https://");
      if (isAbsolute) continue;
      const newUrl = `${base.replace(/\/+$/, "")}${current.startsWith("/") ? "" : "/"}${current}`;
      doc[field] = newUrl;
      await doc.save();
      console.log(`Updated ${Model.modelName} ${doc._id} -> ${newUrl}`);
    }
  };

  await fix(Project, "imageUrl");
  await fix(Client, "imageUrl");
  console.log("Done.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


