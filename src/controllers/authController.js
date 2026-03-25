import User from "../models/User.js";
import { generateRefId } from "../utils/generateRefId.js";

export const loginUser = async (req, res) => {
  try {
    const { telegramId, username, ref } = req.body;

    if (!telegramId) {
      return res.status(400).json({ error: "telegramId required" });
    }

    let user = await User.findOne({ telegramId });

    // 🆕 NEW USER
    if (!user) {
      const userCount = await User.countDocuments();

      // 🟢 FIRST USER (no referral required)
      if (userCount === 0) {
        const refId = generateRefId();

        user = new User({
          telegramId,
          username,
          referralId: refId
        });

        await user.save();
      } else {
        // 🔴 REFERRAL REQUIRED
        if (!ref) {
          return res.status(400).json({ error: "Referral required" });
        }

        const parent = await User.findOne({ referralId: ref });

        if (!parent) {
          return res.status(400).json({ error: "Invalid referral" });
        }

        const refId = generateRefId();

        user = new User({
          telegramId,
          username,
          referralId: refId,
          referredBy: ref
        });

        await user.save();

        // ➕ add to parent
        parent.referrals.push(user._id);
        await parent.save();
      }
    }

    const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralId}`;

    res.json({
      success: true,
      user,
      referralLink
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};