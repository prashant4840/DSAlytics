import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pfp: { type: String },
  college: { type: String, default: "" },
  lastSyncedAt: { type: Date },
  usernames: {
    leetcode: { type: String, default: "" },
    gfg: { type: String, default: "" },
    interviewbit: { type: String, default: "" },
    codeforces: { type: String, default: "" },
    github: { type: String, default: "" },
    codechef: { type: String, default: "" },
  },
  totalSolved: { type: Number, default: 0 },
  githubStats: {
    repos: { type: Number, default: 0 },
    commits: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    openSource: { type: Number, default: 0 },
  },
  skillScores: {
    overall: { type: Number, default: 0 },
    dsa: { type: Number, default: 0 },
    development: { type: Number, default: 0 },
    consistency: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    projectQuality: { type: Number, default: 0 },
    contestPerformance: { type: Number, default: 0 },
    openSource: { type: Number, default: 0 },
  },
  weaknesses: [
    {
      title: String,
      category: String,
      level: { type: String, enum: ["High", "Medium", "Low"] },
      description: String,
    }
  ],
  recommendations: [
    {
      title: String,
      category: String,
      description: String,
      actionUrl: String,
    }
  ],
});

const User = mongoose.model("User", userSchema);

// Performance indexes for leaderboard sorting and filtering
userSchema.index({ totalSolved: -1 });
userSchema.index({ "skillScores.overall": -1 });
userSchema.index({ college: 1 });

export default User;

