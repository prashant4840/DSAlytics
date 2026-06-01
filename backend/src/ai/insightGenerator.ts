import axios from "axios";
import { SkillScores } from "../analytics/scoringEngine";

export interface Weakness {
  title: string;
  category: string;
  level: "High" | "Medium" | "Low";
  description: string;
}

export interface Recommendation {
  title: string;
  category: string;
  description: string;
  actionUrl: string;
}

export const generateInsights = async (
  scores: SkillScores,
  githubStats: { repos: number; commits: number; stars: number },
  leetcodeStats: { solved: number; rating?: number },
  codeforcesStats: { rating?: number }
): Promise<{ weaknesses: Weakness[]; recommendations: Recommendation[] }> => {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const prompt = `Analyze this developer profile and return a JSON object with:
  1. An array "weaknesses" where each item has: "title", "category", "level" ("High" | "Medium" | "Low"), and "description".
  2. An array "recommendations" where each item has: "title", "category", "description", and "actionUrl".

  Developer Stats:
  - Overall Score: ${scores.overall}/1000
  - DSA Score: ${scores.dsa}/100
  - Development Score: ${scores.development}/100
  - Consistency Score: ${scores.consistency}/100
  - Problem Solving Score: ${scores.problemSolving}/100
  - Project Quality Score: ${scores.projectQuality}/100
  - Contest Rating Score: ${scores.contestPerformance}/100
  - Open Source Score: ${scores.openSource}/100
  - GitHub Repositories: ${githubStats.repos}, Commits: ${githubStats.commits}, Stars: ${githubStats.stars}
  - LeetCode Solved: ${leetcodeStats.solved}, Rating: ${leetcodeStats.rating || 'N/A'}
  - Codeforces Rating: ${codeforcesStats.rating || 'N/A'}`;

  // 1. Try OpenAI if key is present
  if (openaiApiKey) {
    try {
      const aiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You are a senior technical interviewer and career mentor. Output valid JSON matching the requested structure.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      const result = JSON.parse(aiResponse.data.choices[0].message.content);
      if (result.weaknesses && result.recommendations) {
        return result;
      }
    } catch (e: any) {
      console.warn("Failed to generate insights using OpenAI, trying other options:", e.message);
    }
  }

  // 2. Try Gemini if key is present
  if (geminiApiKey) {
    try {
      const aiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt + "\n\nOutput only valid JSON conforming to the structural spec."
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );

      const responseText = aiResponse.data.candidates[0].content.parts[0].text;
      const result = JSON.parse(responseText);
      if (result.weaknesses && result.recommendations) {
        return result;
      }
    } catch (e: any) {
      console.warn("Failed to generate insights using Gemini, falling back to rule engine:", e.message);
    }
  }

  // Graceful rule-based fallback expert engine
  const weaknesses: Weakness[] = [];
  const recommendations: Recommendation[] = [];

  // Weakness Checks
  if (scores.dsa >= 60 && scores.development < 45) {
    weaknesses.push({
      title: "Strong DSA but Weak Development",
      category: "Development",
      level: "High",
      description: "You have excellent problem-solving ability but lack practical development exposure. Recruiters look for developers who can build real products.",
    });
    recommendations.push({
      title: "Build a Full-Stack Project",
      category: "Development",
      description: "Design and build a complete MERN stack application, focus on REST APIs and state management, and deploy it to Vercel/Render.",
      actionUrl: "https://roadmap.sh/full-stack",
    });
  }

  if (scores.development >= 60 && scores.dsa < 45) {
    weaknesses.push({
      title: "Active Developer but Weak DSA",
      category: "DSA",
      level: "High",
      description: "Your development skills are solid, but you might fail automated online coding assessments (OA) which are typical in recruitment rounds.",
    });
    recommendations.push({
      title: "LeetCode 75 Study Plan",
      category: "DSA",
      description: "Start solving the LeetCode 75 curated list to cover key data structures (trees, graphs, DP) and core algorithms.",
      actionUrl: "https://leetcode.com/studyplan/leetcode-75/",
    });
  }

  if (scores.consistency < 50) {
    weaknesses.push({
      title: "Low Coding Consistency",
      category: "Consistency",
      level: "Medium",
      description: "Your coding activities are sparse. Top platforms reward daily streaks and persistent progress which builds muscle memory.",
    });
    recommendations.push({
      title: "GitHub Green Commits Challenge",
      category: "Consistency",
      description: "Commit daily to local repositories—even small docstrings, bug fixes, or README updates—to show recruiters an active commit log.",
      actionUrl: "https://github.com/",
    });
  }

  if (githubStats.repos > 0 && githubStats.stars === 0) {
    weaknesses.push({
      title: "Low Repository Depth & Quality",
      category: "Project Quality",
      level: "Medium",
      description: "You have multiple repositories on GitHub, but they lack stars, detailed README files, or active usage indicators.",
    });
    recommendations.push({
      title: "Document and Refactor Projects",
      category: "Project Quality",
      description: "Create premium README documentations for your top 2 repositories, add screenshots/Gifs, clear installation guides, and ask peers for reviews.",
      actionUrl: "https://github.com/matiassingers/awesome-readme",
    });
  }

  if (scores.contestPerformance < 40) {
    weaknesses.push({
      title: "Weak Contest Exposure",
      category: "Contest",
      level: "Low",
      description: "You avoid timed coding contests. Virtual or live contests build pressure-handling skills required during interview live coding.",
    });
    recommendations.push({
      title: "Participate in Weekly Contests",
      category: "Contest",
      description: "Register for LeetCode Weekly Contests or Codeforces Div. 3 rounds, even if you only solve one problem initially.",
      actionUrl: "https://leetcode.com/contest/",
    });
  }

  // Ensure we have at least some basic weaknesses/recommendations if none matched
  if (weaknesses.length === 0) {
    weaknesses.push({
      title: "Limited Open Source exposure",
      category: "Open Source",
      level: "Low",
      description: "You haven't contributed to any external repositories or open-source libraries. Open source contributions showcase teamwork skills.",
    });
    recommendations.push({
      title: "Contribute to First PR",
      category: "Open Source",
      description: "Search for repositories with 'good first issue' labels and submit simple fixes or documentation updates to learn pull-request workflows.",
      actionUrl: "https://goodfirstissue.dev/",
    });
  }

  return { weaknesses, recommendations };
};
