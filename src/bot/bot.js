import { Telegraf } from "telegraf";
import User from "../models/User.js";
import { generateRefId } from "../utils/generateRefId.js";

const createBot = () => {
  if (!process.env.BOT_TOKEN) {
    throw new Error("❌ BOT_TOKEN missing in .env");
  }

  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.start(async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      const username = ctx.from.username || "no_username";

      const ref = ctx.startPayload;

      let user = await User.findOne({ telegramId });

      if (!user) {
        const userCount = await User.countDocuments();

        // 🟢 FIRST USER
        if (userCount === 0) {
          const newRefId = generateRefId();

          user = new User({
            telegramId,
            username,
            referralId: newRefId
          });

          await user.save();
        } else {
          // 🔴 REFERRAL REQUIRED
          if (!ref) {
            return ctx.reply("❌ Referral required to join");
          }

          const parent = await User.findOne({ referralId: ref });

          if (!parent) {
            return ctx.reply("❌ Invalid referral link");
          }

          const newRefId = generateRefId();

          user = new User({
            telegramId,
            username,
            referralId: newRefId,
            referredBy: ref
          });

          await user.save();

          parent.referrals.push(user._id);
          await parent.save();
        }
      }

      const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralId}`;

      await ctx.reply(
        `🔥 Welcome ${username}

Your Referral Link:
${referralLink}`,
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