import { Request, Response } from "express";
import User from "../models/userModel";
import {
  codeforcesData,
  gfgData,
  interviewbitData,
  LeetcodeData,
  PlatformData,
} from "../utils/platformData";
import axios from "axios";

interface CachedData {
  data: PlatformData | null;
  expiry: number;
}

const cache: Record<string, CachedData> = {};
const CACHE_TTL = 5 * 60 * 1000; // Cache time-to-live in milliseconds

const getCachedData = async (
  key: string,
  fetchFunction: () => Promise<PlatformData | null>
): Promise<PlatformData | null> => {
  const currentTime = Date.now();

  if (cache[key] && cache[key].expiry > currentTime) {
    return cache[key].data;
  }

  const data = await fetchFunction();
  cache[key] = {
    data,
    expiry: currentTime + CACHE_TTL,
  };

  return data;
};

export const platformData = async (req: Request, res: Response) => {
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
      const gfgRes = await getCachedData(`gfg:${usernames.gfg}`, () =>
        gfgData(usernames.gfg!)
      );
      if (gfgRes) {
        results.gfg = gfgRes;
      } else {
        return res.status(404).json({ error: "GFG data not found" });
      }
    }

    if (usernames.leetcode) {
      const leetcodeRes = await getCachedData(
        `leetcode:${usernames.leetcode}`,
        () => LeetcodeData(usernames.leetcode!)
      );
      if (leetcodeRes) {
        results.leetcode = leetcodeRes;
      } else {
        return res.status(404).json({ error: "Leetcode data not found" });
      }
    }

    if (usernames.codeforces) {
      const codeforcesRes = await getCachedData(
        `codeforces:${usernames.codeforces}`,
        () => codeforcesData(usernames.codeforces!)
      );
      if (codeforcesRes) {
        results.codeforces = codeforcesRes;
      } else {
        return res.status(404).json({ error: "Codeforces data not found" });
      }
    }

    if (usernames.interviewbit) {
      const interviewbitRes = await getCachedData(
        `interviewbit:${usernames.interviewbit}`,
        () => interviewbitData(usernames.interviewbit!)
      );
      if (interviewbitRes) {
        results.interviewbit = interviewbitRes;
      } else {
        return res.status(404).json({ error: "InterviewBit data not found" });
      }
    }

    return res.json(results);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to fetch data: ${error.message}`,
    });
  }
};

export const fetchImage = async (req: Request, res: Response) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    // Fetch the image from the URL
    const response = await axios.get(url as string, {
      responseType: "arraybuffer",
    });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    const mimeType = response.headers["content-type"];

    // Send the base64 encoded image with its MIME type
    res.json({
      data: `data:${mimeType};base64,${base64}`,
    });
  } catch (error) {
    console.error("Error fetching image");
    res.status(500).json({ error: "Failed to fetch image" });
  }
};
