export interface User {
  name: string;
  email: string;
  password: string;
  usernames: {
    leetcode?: string;
    gfg?: string;
    interviewbit?: string;
    codeforces?: string;
  };
  pfp?: string;
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
