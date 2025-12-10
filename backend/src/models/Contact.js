import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", ContactSchema);


