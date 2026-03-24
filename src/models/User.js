import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: String,
  username: String,
  referralId: String,
  referredBy: String,
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("User", userSchema);