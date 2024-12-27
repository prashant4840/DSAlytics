import { Request, Response } from "express";
import User from "../models/userModel";
import {
  codeforcesData,
  gfgData,
  interviewbitData,
  LeetcodeData,
} from "../utils/platformData";

const platformData = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { usernames } = user;
    if (!usernames) {
      return res.status(403).json({ error: "Usernames not found" });
    }

    const results: Record<string, any> = {};

    if (usernames.gfg) {
      const gfgRes = await gfgData(usernames.gfg);
      if (gfgRes) {
        results.gfg = gfgRes;
      } else {
        return res.status(404).json({ error: "GFG data not found" });
      }
    }

    if (usernames.leetcode) {
      const leetcodeRes = (await LeetcodeData(usernames.leetcode)) as any;
      if (leetcodeRes) {
        results.leetcode = leetcodeRes;
      } else {
        return res.status(404).json({ error: "Leetcode data not found" });
      }
    }

    if (usernames.codeforces) {
      const codeforcesRes = await codeforcesData(usernames.codeforces);
      if (codeforcesRes) {
        results.codeforces = codeforcesRes;
      } else {
        return res.status(404).json({ error: "Codeforces data not found" });
      }
    }

    if (usernames.interviewbit) {
      const interviewbitRes = await interviewbitData(usernames.interviewbit);
      if (interviewbitRes) {
        results.interviewbit = interviewbitRes;
      } else {
        return res.status(404).json({ error: "InterviewBit data not found" });
      }
    }

    // console.dir(results, { depth: null });
    return res.json(results);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to fetch data: ${error.message}`,
    });
  }
};

export default platformData;
