import { Request, Response } from "express";
import User from "../models/userModel";
import { fetchPlatformData } from "./platformController";
import jwt from "jsonwebtoken";

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

export const leaderboardController = async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    const { sortBy, college, platform } = req.body;
    const pageNumber = parseInt(page, 10) || 1;
    const itemsPerPage = 10;
    const token = req.headers.authorization?.split(" ")[1];

    let currentUser: {
      userId: string;
      name: string;
      pfp: string;
      totalSolved: number;
      overallScore: number;
      college: string;
      rank: number;
    } | null = null;

    if (token) {
      try {
        // @ts-ignore
        const { id } = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findById(id).select("_id name pfp totalSolved skillScores college");
        if (user) {
          currentUser = {
            userId: user._id.toString(),
            name: user.name,
            pfp: user.pfp || "",
            totalSolved: user.totalSolved || 0,
            overallScore: user.skillScores?.overall || 0,
            college: user.college || "",
            rank: 0,
          };
        }
      } catch (err) {
        console.error("User not found");
      }
    }

    const query: any = {};
    query.totalSolved = { $exists: true };

    if (college) {
      query.college = { $regex: college, $options: "i" };
    }

    if (platform) {
      query[`usernames.${platform}`] = { $ne: "", $exists: true };
    }

    const sortField = sortBy === "overall" ? "skillScores.overall" : "totalSolved";
    const sortQuery: any = {};
    sortQuery[sortField] = -1;
    sortQuery._id = 1;

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    const users = await User.find(query)
      .sort(sortQuery)
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const leaderboardUsers = users.map((user, index) => ({
      userId: user._id,
      name: user.name,
      pfp: user.pfp || "",
      totalSolved: user.totalSolved || 0,
      overallScore: user.skillScores?.overall || 0,
      college: user.college || "",
      rank: (pageNumber - 1) * itemsPerPage + index + 1,
    }));

    if (currentUser) {
      const targetUserId = currentUser.userId;
      const allUsers = await User.find(query).sort(sortQuery);
      const currentUserRank =
        allUsers.findIndex(
          (u) => u._id.toString() === targetUserId
        ) + 1;
      
      const loggedInUser = allUsers.find(
        (u) => u._id.toString() === targetUserId
      );

      if (loggedInUser && currentUserRank > 0) {
        currentUser = {
          userId: loggedInUser._id.toString(),
          name: loggedInUser.name,
          pfp: loggedInUser.pfp || "",
          totalSolved: loggedInUser.totalSolved || 0,
          overallScore: loggedInUser.skillScores?.overall || 0,
          college: loggedInUser.college || "",
          rank: currentUserRank,
        };
      } else {
        currentUser = null;
      }
    }

    res.json({
      users: leaderboardUsers,
      currentUser: currentUser || null,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching leaderboard", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
