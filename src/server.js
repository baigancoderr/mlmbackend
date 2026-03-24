import dotenv from "dotenv";
import mongoose from "mongoose";
import bot from "./bot/bot.js";

dotenv.config();

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ DB Connected");

  // 🤖 Bot Start
  bot.launch();
  console.log("🤖 Bot Started");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};

start();