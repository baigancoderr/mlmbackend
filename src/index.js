import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import createBot from "./bot/bot.js";

const app = express();

// ✅ middleware
app.use(cors());
app.use(express.json());

// ✅ test route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ API route (check kar ki ye hai)
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const bot = createBot();
  bot.launch();
  console.log("🤖 Bot Started");

  // 🚨 IMPORTANT: SERVER START KAR
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};

start();