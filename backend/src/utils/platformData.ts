import axios from "axios";

export const LeetcodeData = async (username: string) => {
  try {
    const data = JSON.stringify({
      query: `
        query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              userAvatar
              realName
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
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

    // Await the response
    const response = await axios.request(config);
    return response.data; // Ensure the response data is returned
  } catch (error) {
    console.error("Error in fetching Leetcode data", error);
    return null;
  }
};

export const gfgData = async (username: string) => {
  try {
    const response = await axios.get(`${process.env.VITE_GFG}${username}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching gfg data");
    return null;
  }
};

export const codeforcesData = async (username: string) => {
  try {
    const response = await axios.get(
      `${process.env.VITE_CODEFORCES}${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching codeforces data");
    return null;
  }
};

export const interviewbitData = async (username: string) => {
  try {
    const response = await axios.get(
      `${process.env.VITE_INTERVIEWBIT}${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching interviewbit data");
    return null;
  }
};
