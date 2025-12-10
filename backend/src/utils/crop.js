import sharp from "sharp";
import path from "path";
import fs from "fs";

export async function cropAndSave(file, { width, height }) {
  if (!file) throw new Error("No file provided");
  const inputPath = file.path;
  const ext = path.extname(file.originalname || ".jpg");
  const outputName = `${path.basename(file.filename, ext)}-cropped${ext}`;
  const outputPath = path.join(path.dirname(inputPath), outputName);

  await sharp(inputPath).resize(width, height).toFile(outputPath);

  // cleanup original
  fs.unlink(inputPath, () => {});

  const publicPath = `/uploads/${outputName}`;
  return publicPath;
}


