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
  let data = null;

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
    const data = JSON.stringify({
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
        userContestRanking(username: $username) {
          rating
          globalRanking
        }
      }
      `,
      variables: {
        username: username,
      },
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.VITE_LEETCODE,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
    if (response.data.errors) {
      throw new Error("User not found");
    }
    const combinedResponse: {
      avatar: string;
      totalProblemsSolved: number;
      rating: number;
      contestGlobalRank: number;
      ranking: number;
    } = {
      avatar: response.data.data.matchedUser.profile.userAvatar,
      totalProblemsSolved:
        response.data.data.matchedUser.submitStats.acSubmissionNum[0].count,
      rating: response.data.data.userContestRanking.rating,
      contestGlobalRank: response.data.data.userContestRanking.globalRanking,
      ranking: response.data.data.matchedUser.profile.ranking,
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
    const combinedResponse: {
      avatar: string;
      totalProblemsSolved: number;
      universityRank?: number;
    } = {
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
        `${process.env.VITE_CODEFORCES_SUBMISSIONS}${username}&from=1&count=1000`
      ),
    ]);

    if (response.data.status !== "OK") {
      throw new Error("User not found");
    }

    // Filter results with verdict 'OK' and count unique contestId
    const solvedProblemsCount = [
      ...new Set(
        response2.data.result
          .filter((submission: any) => submission.verdict === "OK")
          .map((submission: any) => submission.contestId)
      ),
    ].length;

    const combinedResponse: {
      avatar: string;
      totalProblemsSolved: number;
      rating?: number;
      rank?: string;
      maxRating?: number;
    } = {
      avatar: response.data.result[0].avatar,
      totalProblemsSolved: solvedProblemsCount,
    };

    const res = response.data.result;

    if (res.rating && res.rank && res.maxRating) {
      combinedResponse.rating = res.rating;
      combinedResponse.rank = res.rank;
      combinedResponse.maxRating = res.maxRating;
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

    const combinedResponse: {
      avatar: string;
      rank: number;
      totalProblemsSolved: number;
      universityRank?: number;
    } = {
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
