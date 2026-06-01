import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import generateToken from "../utils/generateTokens";
import { verifyPlatformData, LeetcodeData, codeforcesData, gfgData, interviewbitData } from "../utils/platformData";
import { fetchGithubStats } from "../integrations/github";
import { fetchCodechefStats } from "../integrations/codechef";
import { calculateSkillScores } from "../analytics/scoringEngine";
import { generateInsights } from "../ai/insightGenerator";
import { AxiosError } from "axios";

export const registerUser: RequestHandler = async (req, res): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    res.status(400).json({ message: "Name must be at least 2 characters long" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ message: "Please provide a valid email address" });
    return;
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters long" });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const loginUser: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({ token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
};

export const updateUsernames: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const id = req.user?.id;
  if (!id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const updates = req.body; // Contains only provided usernames

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const verification = await verifyPlatformData(updates);

    if (!verification.success) {
      res.status(400).json({ message: verification.error });
      return;
    }

    const updatedUsernames = { ...user.usernames, ...updates };

    // Update the user in the database
    user.usernames = updatedUsernames;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating usernames" });
  }
};

export const setTotalSolved: RequestHandler = async (
  req,
  res
): Promise<void> => {
  res.status(403).json({
    message: "totalSolved is computed automatically on sync and cannot be set directly",
  });
};

export const verify: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const id = req.user?.id;
  if (!id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await User.findById(id).select("name email usernames pfp");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Error verifying user" });
  }
};

export const userId: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const id = req.user?.id;
  if (!id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ message: "Error verifying user" });
  }
};

export const setUserAvatar: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const id = req.user?.id;
  if (!id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { avatarUrl } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.pfp = avatarUrl;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error setting user avatar" });
  }
};

export const updateUserDetails: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const id = req.user?.id;
  if (!id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { name, email, college } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400).json({ message: "Email is already in use" });
        return;
      }
      user.email = email;
    }
    if (college !== undefined) user.college = college;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user details" });
  }
};

export const deleteUser: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const id = req.user?.id;
    if (!id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { platformId } = req.body;

    if (!platformId) {
      res.status(400).json({ message: "Platform ID is required" });
      return;
    }

    // Find the user and update the specific platform's username to null
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $unset: { [`usernames.${platformId}`]: "" } },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error("Error deleting username:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const syncAllStats: RequestHandler = async (req, res): Promise<void> => {
  const id = req.user?.id;
  if (!id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Smart Caching Check (15 minutes threshold unless forced)
    const force = req.query.force === "true" || req.body.force === true;
    const cooldownPeriod = 15 * 60 * 1000; // 15 minutes in milliseconds
    const lastSyncedTime = user.lastSyncedAt ? new Date(user.lastSyncedAt).getTime() : 0;
    const hasSyncedRecently = lastSyncedTime && (Date.now() - lastSyncedTime < cooldownPeriod);

    if (hasSyncedRecently && !force) {
      res.json({
        success: true,
        isCached: true,
        message: "Data loaded from cache. You can sync again in 15 minutes.",
        user,
      });
      return;
    }

    const { usernames } = user;
    const githubUsername = usernames?.github || "";
    const codechefUsername = usernames?.codechef || "";
    const leetcodeUsername = usernames?.leetcode || "";
    const codeforcesUsername = usernames?.codeforces || "";
    const gfgUsername = usernames?.gfg || "";
    const ibUsername = usernames?.interviewbit || "";

    // 1. Fetch GitHub and CodeChef stats asynchronously
    const [ghStats, ccStats] = await Promise.all([
      fetchGithubStats(githubUsername),
      fetchCodechefStats(codechefUsername),
    ]);

    // 2. Fetch other platforms using existing utilities
    const [lcStats, cfStats, gfgStats, ibStats] = await Promise.all([
      leetcodeUsername ? LeetcodeData(leetcodeUsername) : Promise.resolve(null),
      codeforcesUsername ? codeforcesData(codeforcesUsername) : Promise.resolve(null),
      gfgUsername ? gfgData(gfgUsername) : Promise.resolve(null),
      ibUsername ? interviewbitData(ibUsername) : Promise.resolve(null),
    ]);

    // Format stats for scoring engine
    const formattedLC = { solved: lcStats?.totalProblemsSolved || 0, rating: lcStats?.rating || undefined };
    const formattedCF = { rating: cfStats?.rating || undefined, solved: cfStats?.totalProblemsSolved || 0 };
    const formattedCC = { rating: ccStats.rating || undefined, solved: ccStats.solved || 0 };
    const formattedGFG = { solved: gfgStats?.totalProblemsSolved || 0 };
    const formattedIB = { solved: ibStats?.totalProblemsSolved || 0 };

    // 3. Run scoring engine
    const skillScores = calculateSkillScores(
      ghStats,
      formattedLC,
      formattedCF,
      formattedCC,
      formattedGFG,
      formattedIB
    );

    // 4. Generate weaknesses and recommendations
    const { weaknesses, recommendations } = await generateInsights(
      skillScores,
      ghStats,
      formattedLC,
      formattedCF
    );

    // 5. Update user model
    user.githubStats = ghStats;
    user.skillScores = skillScores;
    user.weaknesses = weaknesses as any;
    user.recommendations = recommendations as any;
    user.totalSolved = 
      (lcStats?.totalProblemsSolved || 0) + 
      (gfgStats?.totalProblemsSolved || 0) + 
      (ibStats?.totalProblemsSolved || 0) + 
      (cfStats?.totalProblemsSolved || 0) + 
      (ccStats.solved || 0);

    user.lastSyncedAt = new Date();
    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("Error syncing platform stats:", error);
    res.status(500).json({ message: "Error syncing stats: " + error.message });
  }
};

export const getAnalytics: RequestHandler = async (req, res): Promise<void> => {
  const id = req.user?.id;
  if (!id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await User.findById(id).select("skillScores weaknesses recommendations githubStats totalSolved");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      success: true,
      analytics: {
        skillScores: user.skillScores,
        weaknesses: user.weaknesses,
        recommendations: user.recommendations,
        githubStats: user.githubStats,
        totalSolved: user.totalSolved,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
