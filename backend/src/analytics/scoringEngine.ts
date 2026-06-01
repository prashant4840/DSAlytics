export interface SkillScores {
  overall: number;
  dsa: number;
  development: number;
  consistency: number;
  problemSolving: number;
  projectQuality: number;
  contestPerformance: number;
  openSource: number;
}

export const calculateSkillScores = (
  githubStats: { repos: number; commits: number; stars: number; openSource: number },
  leetcodeStats: { solved: number; rating?: number },
  codeforcesStats: { rating?: number; solved?: number },
  codechefStats: { rating?: number; solved?: number },
  gfgStats: { solved?: number },
  interviewbitStats: { solved?: number }
): SkillScores => {
  // 1. DSA Score (0-100)
  const leetcodeSolved = leetcodeStats.solved || 0;
  const gfgSolved = gfgStats.solved || 0;
  const ibSolved = interviewbitStats.solved || 0;
  const totalDsaProblems = leetcodeSolved + gfgSolved + ibSolved;
  const dsa = Math.min(100, Math.round((totalDsaProblems / 350) * 100));

  // 2. Development Score (0-100)
  const repos = githubStats.repos || 0;
  const commits = githubStats.commits || 0;
  const development = Math.min(100, Math.round((repos * 4) + (commits / 10)));

  // 3. Consistency Score (0-100)
  const commitsFactor = Math.min(40, (commits / 6));
  const activePlatforms = [
    githubStats.repos > 0,
    leetcodeSolved > 0,
    gfgSolved > 0,
    (codeforcesStats.rating || 0) > 0,
  ].filter(Boolean).length;
  const consistency = Math.min(100, Math.round(commitsFactor + (activePlatforms * 15)));

  // 4. Problem Solving Score (0-100)
  const cfSolved = codeforcesStats.solved || 0;
  const ccSolved = codechefStats.solved || 0;
  const totalSolved = totalDsaProblems + cfSolved + ccSolved;
  const problemSolving = Math.min(100, Math.round((totalSolved / 500) * 100));

  // 5. Project Quality Score (0-100)
  const stars = githubStats.stars || 0;
  const reposCount = githubStats.repos || 0;
  const baseProjectScore = reposCount > 0 ? 30 : 0;
  const starsScore = Math.min(70, stars * 10);
  const projectQuality = Math.min(100, Math.round(baseProjectScore + starsScore));

  // 6. Contest Rating Score (0-100)
  const lcRating = leetcodeStats.rating || 1200;
  const cfRating = codeforcesStats.rating || 800;
  const ccRating = codechefStats.rating || 1200;
  const maxRating = Math.max(lcRating, cfRating, ccRating);
  const contestPerformance = Math.min(100, Math.round((maxRating / 2200) * 100));

  // 7. Open Source Contribution Score (0-100)
  const osContribs = githubStats.openSource || 0;
  const openSource = Math.min(100, Math.round(osContribs * 25));

  // 8. Overall Developer Score (0-1000)
  // Weights: DSA (20%), Dev (20%), Consistency (15%), Problem Solving (15%), Project Quality (15%), Contest (10%), Open Source (5%)
  const weightedAverage = 
    (dsa * 0.20) + 
    (development * 0.20) + 
    (consistency * 0.15) + 
    (problemSolving * 0.15) + 
    (projectQuality * 0.15) + 
    (contestPerformance * 0.10) + 
    (openSource * 0.05);

  const overall = Math.min(1000, Math.round(weightedAverage * 10));

  return {
    overall,
    dsa,
    development,
    consistency,
    problemSolving,
    projectQuality,
    contestPerformance,
    openSource,
  };
};
