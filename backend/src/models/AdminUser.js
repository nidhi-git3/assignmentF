import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

AdminUserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export default mongoose.model("AdminUser", AdminUserSchema);


