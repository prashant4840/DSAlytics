export interface User {
  name: string;
  email: string;
  password: string;
  college?: string;
  lastSyncedAt?: string;
  usernames: {
    leetcode?: string;
    gfg?: string;
    interviewbit?: string;
    codeforces?: string;
    github?: string;
    codechef?: string;
  };
  pfp?: string;
  totalSolved?: number;
  githubStats?: {
    repos: number;
    commits: number;
    stars: number;
    openSource: number;
  };
  skillScores?: {
    overall: number;
    dsa: number;
    development: number;
    consistency: number;
    problemSolving: number;
    projectQuality: number;
    contestPerformance: number;
    openSource: number;
  };
  weaknesses?: Array<{
    title: string;
    category: string;
    level: "High" | "Medium" | "Low";
    description: string;
  }>;
  recommendations?: Array<{
    title: string;
    category: string;
    description: string;
    actionUrl: string;
  }>;
}

export interface Platform {
  id: keyof User["usernames"];
  name: string;
  logo: string;
}

export const PLATFORMS: Platform[] = [
  {
    id: "leetcode",
    name: "LeetCode",
    logo: "/leetcode.webp",
  },
  {
    id: "gfg",
    name: "GeeksForGeeks",
    logo: "/gfg.png",
  },
  {
    id: "interviewbit",
    name: "InterviewBit",
    logo: "/interviewbit.png",
  },
  {
    id: "codeforces",
    name: "CodeForces",
    logo: "/codeforces.webp",
  },
  {
    id: "github",
    name: "GitHub",
    logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  },
  {
    id: "codechef",
    name: "CodeChef",
    logo: "/logos/codechef.png",
  },
];

export interface PlatformData {
  avatar: string;
  totalProblemsSolved: number;
  rating?: number;
  rank?: string;
  maxRating?: number;
  universityRank?: number;
  contestGlobalRank?: number;
}

export interface UserStats {
  gfg?: PlatformData;
  leetcode?: PlatformData;
  codeforces?: PlatformData;
  interviewbit?: PlatformData;
}

export interface LeaderboardUser {
  userId: string;
  name: string;
  pfp: string;
  totalSolved: number;
  overallScore?: number;
  college?: string;
  rank: number;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  currentUser?: LeaderboardUser;
  totalPages: number;
}
