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
    const pageNumber = parseInt(page, 10) || 1;
    const itemsPerPage = 10;
    const token = req.headers.authorization?.split(" ")[1];

    let currentUser = null;

    if (token) {
      try {
        // @ts-ignore
        const { id } = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findById(id).select("_id name pfp totalSolved");
        if (user) {
          currentUser = {
            userId: user._id,
            name: user.name,
            pfp: user.pfp || "",
            totalSolved: user.totalSolved || 0,
            rank: 0, // This will be calculated later
          };
        }
      } catch (err) {
        console.error("User not found");
      }
    }

    const totalUsers = await User.countDocuments({
      totalSolved: { $exists: true },
    });

    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    const users = await User.find({ totalSolved: { $exists: true } })
      .sort({ totalSolved: -1, _id: 1 })
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const leaderboardUsers = users.map((user, index) => ({
      userId: user._id,
      name: user.name,
      pfp: user.pfp || "",
      totalSolved: user.totalSolved || 0,
      rank: (pageNumber - 1) * itemsPerPage + index + 1,
    }));

    if (currentUser) {
      // Calculate the rank of the current user
      const allUsers = await User.find({ totalSolved: { $exists: true } }).sort(
        { totalSolved: -1 }
      );
      const currentUserRank =
        allUsers.findIndex(
          (u) => u._id.toString() === currentUser.userId.toString()
        ) + 1;
      currentUser.rank = currentUserRank;
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
