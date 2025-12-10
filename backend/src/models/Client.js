import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Client", ClientSchema);


