import { Telegraf } from "telegraf";
import User from "../models/User.js";
import { generateRefId } from "../utils/generateRefId.js";

const createBot = () => {
  // 🔐 Safety check
  if (!process.env.BOT_TOKEN) {
    throw new Error("❌ BOT_TOKEN missing in .env");
  }

  console.log("✅ BOT TOKEN LOADED:", process.env.BOT_TOKEN);

  const bot = new Telegraf(process.env.BOT_TOKEN);

  // 🚀 START COMMAND (Referral Handle)
  bot.start(async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      const username = ctx.from.username || "no_username";

      // 👇 referral param
      const ref = ctx.startPayload || process.env.DEFAULT_REF;

      let user = await User.findOne({ telegramId });

      if (!user) {
        const newRefId = generateRefId();

        user = new User({
          telegramId,
          username,
          referralId: newRefId,
          referredBy: ref
        });

        await user.save();

        // 👇 Parent update
        const parent = await User.findOne({ referralId: ref });
        if (parent) {
          parent.referrals.push(user._id);
          await parent.save();
        }
      }

      const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralId}`;

      // 🎯 Reply with button
      await ctx.reply(
        `🔥 Welcome ${username}\n\nYour Referral Link:\n${referralLink}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Open App",
                  web_app: { url: process.env.WEB_APP_URL }
                }
              ]
            ]
          }
        }
      );

    } catch (err) {
      console.log("❌ BOT ERROR:", err);
    }
  });

  return bot;
};

export default createBot;