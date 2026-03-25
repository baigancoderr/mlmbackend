import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: String,
  username: String,
  referralId: { type: String, unique: true }, // ✅ important
  referredBy: String,
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true }); // ✅ optional but good

export default mongoose.model("User", userSchema);