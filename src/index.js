import dotenv from "dotenv";
dotenv.config(); // 👈 sabse pehle

import connectDB from "./config/db.js";
import createBot from "./bot/bot.js";

console.log("BOT TOKEN:", process.env.BOT_TOKEN);

const start = async () => {
  await connectDB();

  const bot = createBot(); // 👈 ab safe init

  bot.launch();
  console.log("🤖 Bot Started");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};

start();