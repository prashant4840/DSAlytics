import { Request, Response, RequestHandler } from "express";
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
const MAX_CACHE_SIZE = 1000;

const getCachedData = async (
  key: string,
  fetchFunction: () => Promise<PlatformData | null>,
): Promise<PlatformData | null> => {
  const currentTime = Date.now();

  // Lazy eviction and size constraint to prevent unbounded memory growth (W-B3)
  if (Object.keys(cache).length >= MAX_CACHE_SIZE) {
    for (const cacheKey in cache) {
      if (cache[cacheKey].expiry <= currentTime) {
        delete cache[cacheKey];
      }
    }
    // If still exceeding the size limit, clear the entire cache
    if (Object.keys(cache).length >= MAX_CACHE_SIZE) {
      for (const cacheKey in cache) {
        delete cache[cacheKey];
      }
    }
  }

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
export const fetchPlatformData = async (
  usernames: Record<string, string | undefined>,
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
        fetchFunction(username),
      );
      if (data) {
        results[platform] = data;
      }
    }
  }

  return results;
};

export const platformData: RequestHandler = async (req, res): Promise<void> => {
  try {
    const id = req.user?.id;
    if (!id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { usernames } = user;
    if (!usernames) {
      res.status(403).json({ error: "Usernames not found" });
      return;
    }

    const filteredUsernames: Record<string, string | undefined> =
      Object.fromEntries(
        Object.entries(usernames).filter(([_, v]) => v !== null),
      ) as Record<string, string | undefined>;

    const results = await fetchPlatformData(filteredUsernames);

    res.json(results);
  } catch (error: any) {
    res.status(500).json({
      error: `Failed to fetch data: ${error.message}`,
    });
  }
};

// Allowlisted domains for image proxy to prevent SSRF attacks
const ALLOWED_IMAGE_DOMAINS = [
  "avatars.githubusercontent.com",
  "github.githubassets.com",
  "assets.leetcode.com",
  "leetcode.com",
  "media.geeksforgeeks.org",
  "cdn.codechef.com",
  "userpic.codeforces.org",
  "userpic.codeforces.com",
  "lh3.googleusercontent.com",
  "gravatar.com",
  "www.gravatar.com",
  "i.imgur.com",
];

const isAllowedUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    return ALLOWED_IMAGE_DOMAINS.some(
      (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

export const fetchImages: RequestHandler = async (req, res): Promise<void> => {
  const { urls } = req.body;

  try {
    const fetchImage = async (url: string) => {
      if (!isAllowedUrl(url)) {
        throw new Error(`Blocked: ${url} is not an allowed image domain`);
      }
      const response = await axios.get(url, { responseType: "arraybuffer", timeout: 5000 });
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      const mimeType = response.headers["content-type"];
      return `data:${mimeType};base64,${base64}`;
    };

    const results = await Promise.all(
      Object.entries(urls).map(async ([key, url]) => {
        if (typeof url === "string") {
          try {
            const data = await fetchImage(url);
            return [key, data];
          } catch (err) {
            console.warn(`Skipping blocked/failed URL for ${key}:`, (err as Error).message);
            return [key, null];
          }
        }
        return [key, null];
      }),
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
