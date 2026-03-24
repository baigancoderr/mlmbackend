import User from "../models/User.js";
import { generateRefId } from "../utils/generateRefId.js";

export const loginUser = async (req, res) => {
  try {
    const { telegramId, username, ref } = req.body;

    if (!telegramId) {
      return res.status(400).json({ error: "telegramId required" });
    }

    let user = await User.findOne({ telegramId });

    // 🆕 New User
    if (!user) {
      let refId = generateRefId();

      user = new User({
        telegramId,
        username,
        referralId: refId,
        referredBy: ref || process.env.DEFAULT_REF
      });

      await user.save();

      // 👇 Parent add (downline)
      const parent = await User.findOne({
        referralId: ref
      });

      if (parent) {
        parent.referrals.push(user._id);
        await parent.save();
      }
    }

    // 🔗 Referral Link
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