import axios from "axios";

type TVerificationRequest = {
  [platform: string]: string;
};

export const verifyPlatformData = async (updates: TVerificationRequest) => {
  if (!updates || Object.keys(updates).length === 0) {
    return { success: false, error: "No updates provided" };
  }

  const platform = Object.keys(updates)[0].toLowerCase();
  const username = updates[platform];
  let data: PlatformData | null = null;

  switch (platform) {
    case "gfg":
      data = await gfgData(username);
      break;
    case "leetcode":
      data = await LeetcodeData(username);
      break;
    case "codeforces":
      data = await codeforcesData(username);
      break;
    case "interviewbit":
      data = await interviewbitData(username);
      break;
    default:
      return { success: false, error: "Invalid platform" };
  }

  if (data) {
    return { success: true, data };
  } else {
    return { success: false, error: `${platform} data not found` };
  }
};

export const LeetcodeData = async (username: string) => {
  try {
    // First API call: Fetch user public profile and submit stats
    const userProfileQuery = JSON.stringify({
      query: `
        query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            profile {
              ranking
              userAvatar
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                count
              }
            }
          }
        }
      `,
      variables: { username },
    });

    const userProfileConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.VITE_LEETCODE,
      headers: {
        "Content-Type": "application/json",
      },
      data: userProfileQuery,
    };

    const userProfileResponse = await axios.request(userProfileConfig);
    if (userProfileResponse.data.errors) {
      throw new Error("User not found");
    }

    const userProfileData = userProfileResponse.data.data.matchedUser;

    // Second API call: Fetch user contest ranking
    const userContestQuery = JSON.stringify({
      query: `
        query userContestRanking($username: String!) {
          userContestRanking(username: $username) {
            rating
            globalRanking
          }
        }
      `,
      variables: { username },
    });

    const userContestConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.VITE_LEETCODE,
      headers: {
        "Content-Type": "application/json",
      },
      data: userContestQuery,
    };

    let userContestData = null;
    try {
      const userContestResponse = await axios.request(userContestConfig);
      userContestData = userContestResponse.data.data.userContestRanking;
    } catch (contestError) {
      console.warn("Contest data not found or failed to fetch:", contestError);
    }

    // Combine responses
    const combinedResponse = {
      avatar: userProfileData.profile.userAvatar,
      totalProblemsSolved: userProfileData.submitStats.acSubmissionNum[0].count,
      rating: userContestData?.rating || null,
      contestGlobalRank: userContestData?.globalRanking || null,
      rank: userProfileData.profile.ranking,
    };

    return combinedResponse;
  } catch (error) {
    console.error("Error in fetching Leetcode data:", error);
    return null;
  }
};

export const gfgData = async (username: string) => {
  try {
    const response = await axios.get(`${process.env.VITE_GFG}${username}`);
    const combinedResponse: PlatformData = {
      avatar: response.data.data.profile_image_url,
      totalProblemsSolved: response.data.data.total_problems_solved,
      universityRank: response.data.data.institute_rank,
    };

    return combinedResponse;
  } catch (error) {
    console.error("Error in fetching gfg data");
    return null;
  }
};

export const codeforcesData = async (username: string) => {
  try {
    const [response, response2] = await Promise.all([
      axios.get(`${process.env.VITE_CODEFORCES}${username}`),
      axios.get(
        `${process.env.VITE_CODEFORCES_SUBMISSIONS}${username}&from=1&count=10000`
      ),
    ]);

    if (response.data.status !== "OK") {
      throw new Error("User not found");
    }

    const submissions = response2.data.result;
    const solvedProblems = new Set();

    submissions.forEach((submission: any) => {
      if (submission.verdict === "OK") {
        const problemKey = `${submission.problem.contestId}-${submission.problem.index}`;
        solvedProblems.add(problemKey);
      }
    });

    const combinedResponse: PlatformData = {
      avatar: response.data.result[0].avatar,
      totalProblemsSolved: solvedProblems.size,
    };

    const userInfo = response.data.result[0];
    if (userInfo.rating && userInfo.rank && userInfo.maxRating) {
      combinedResponse.rating = userInfo.rating;
      combinedResponse.rank = userInfo.rank;
      combinedResponse.maxRating = userInfo.maxRating;
    }

    return combinedResponse;
  } catch (error) {
    console.error("Error in fetching Codeforces data:", error);
    return null;
  }
};

export const interviewbitData = async (username: string) => {
  try {
    const [response, response2] = await Promise.all([
      axios.get(`${process.env.VITE_INTERVIEWBIT}${username}`),
      axios.get(`${process.env.VITE_INTERVIEWBIT_SUBMISSIONS}${username}`),
    ]);

    const rank = response.data.global_rank;
    const avatar = response.data.image;
    const universityRank = response.data.university_rank;

    const totalProblemsSolved = response2.data.total_problems_solved;

    const combinedResponse: PlatformData = {
      avatar,
      rank,
      totalProblemsSolved,
    };

    if (universityRank) {
      combinedResponse.universityRank = universityRank;
    }

    return combinedResponse;
  } catch (error) {
    console.error("Error in fetching interviewbit data");
    return null;
  }
};

export interface PlatformData {
  avatar: string;
  totalProblemsSolved: number;
  rating?: number;
  rank?: string;
  maxRating?: number;
  universityRank?: number;
  contestGlobalRank?: number;
}
