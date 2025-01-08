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

// Reusable helper for platform data fetching
const fetchPlatformData = async (
  usernames: Record<string, string | undefined>
) => {
  const platforms = {
    gfg: gfgData,
    leetcode: LeetcodeData,
    codeforces: codeforcesData,
    interviewbit: interviewbitData,
  };

  const results: Record<string, any> = {};

  for (const [platform, fetchFunction] of Object.entries(platforms)) {
    const username = usernames[platform];
    if (username) {
      const data = await getCachedData(`${platform}:${username}`, () =>
        fetchFunction(username)
      );
      if (data) {
        results[platform] = data;
      }
    }
  }

  return results;
};

export const previewPlatformData = async (req: Request, res: Response) => {
  try {
    const { userid } = req.params;

    const user = await User.findById(userid).select("name email usernames pfp");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const { usernames } = user;
    if (!usernames) {
      return res.status(403).json({
        success: false,
        user,
        error: "Usernames not found",
      });
    }

    const filteredUsernames: Record<string, string | undefined> =
      Object.fromEntries(
        Object.entries(usernames).filter(([_, v]) => v !== null)
      ) as Record<string, string | undefined>;

    const results = await fetchPlatformData(filteredUsernames);

    return res.json({
      success: true,
      user,
      userStats: results,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: `Failed to fetch data: ${error.message}`,
    });
  }
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

    const filteredUsernames: Record<string, string | undefined> =
      Object.fromEntries(
        Object.entries(usernames).filter(([_, v]) => v !== null)
      ) as Record<string, string | undefined>;

    const results = await fetchPlatformData(filteredUsernames);

    return res.json(results);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to fetch data: ${error.message}`,
    });
  }
};

export const fetchImages = async (req: Request, res: Response) => {
  const { urls } = req.body;

  try {
    const fetchImage = async (url: string) => {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      const mimeType = response.headers["content-type"];
      return `data:${mimeType};base64,${base64}`;
    };

    const results = await Promise.all(
      Object.entries(urls).map(async ([key, url]) => {
        if (typeof url === "string") {
          const data = await fetchImage(url);
          return [key, data];
        }
        return [key, null];
      })
    );

    const responseData = Object.fromEntries(results);

    res.json({
      success: true,
      imgs: responseData,
    });
  } catch (error) {
    console.error("Error fetching images", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
