import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { User, UserStats } from "../lib/types";
import Card from "../components/ui/Card";
import axiosFetch from "../lib/axiosFetch";
import { backgrounds } from "../pages/Preview";

export const ShareCard = ({
  cardRef,
  numUsernames,
  selectedBackground,
  user,
  userStats,
}: {
  cardRef: any;
  numUsernames: number;
  selectedBackground: keyof typeof backgrounds;
  user: User | null;
  userStats: UserStats | null;
}) => {
  const [processedStats, setProcessedStats] = useState<UserStats | null>(null);
  const [processedUserPfp, setProcessedUserPfp] =
    useState<string>("/defaultpfp.png");
  const [totalProblemsSolved, setTotalProblemsSolved] = useState<number>(0);

  useEffect(() => {
    const processImages = async () => {
      const updatedStats: { [key: string]: UserStats[keyof UserStats] } = {};

      // Collect all avatar URLs
      const avatarUrls: { [key: string]: string } = {};
      if (user?.pfp) {
        avatarUrls["userPfp"] = user.pfp;
      }

      for (const [platform, stats] of Object.entries(userStats || {})) {
        if (stats?.avatar) {
          avatarUrls[platform] = stats.avatar;
        }
      }

      try {
        // Send all avatar URLs to the backend
        const { data } = await axiosFetch.post("/api/platform/img", {
          urls: avatarUrls,
        });

        if (data.success) {
          setProcessedUserPfp(data.imgs.userPfp || "/defaultpfp.png");

          const { imgs } = data;

          // Process platform avatars
          for (const [platform, stats] of Object.entries(userStats || {})) {
            if (stats?.avatar && imgs[platform]) {
              updatedStats[platform] = { ...stats, avatar: imgs[platform] };
            } else {
              updatedStats[platform] = stats;
            }
          }
          setProcessedStats(updatedStats);
        } else {
          throw new Error("Could not find image data");
        }
      } catch (error) {
        console.error("Error processing images : ", error);
      }
    };

    processImages();
  }, [userStats, user?.pfp]);

  useEffect(() => {
    const total = Object.values(userStats || {}).reduce((total, platform) => {
      return total + (platform?.totalProblemsSolved || 0);
    }, 0);
    setTotalProblemsSolved(total);
  }, [userStats]);

  const platformEnv = {
    codeforces: import.meta.env.VITE_CODEFORCES + user?.usernames?.codeforces,
    leetcode: import.meta.env.VITE_LEETCODE + user?.usernames?.leetcode,
    gfg: import.meta.env.VITE_GFG + user?.usernames?.gfg,
    interviewbit:
      import.meta.env.VITE_INTERVIEWBIT + user?.usernames?.interviewbit,
  };

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.div
        className="overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerAnimation}>
        <Card className="bg-white shadow-xl rounded-xl mx-2 sm:mx-10 md:mx-20">
          <div
            id="capture_div"
            ref={cardRef}
            className="md:h-[40rem] sm:h-[43rem] h-[38rem] rounded-xl relative flex items-center justify-center">
            {React.createElement(backgrounds[selectedBackground]?.component)}
            {React.createElement(backgrounds[selectedBackground].component)}

            <motion.div
              className="p-3 space-y-4 relative z-10"
              variants={itemAnimation}>
              {/* Header Section */}
              <div className="flex flex-col md:flex-row items-center md:space-x-6 md:p-4 p-1 border bg-white rounded-lg shadow-lg">
                <motion.img
                  src={processedUserPfp}
                  alt={user?.name}
                  className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-gray-200 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="flex-1 md:text-left">
                  <h1
                    className={`text-2xl md:text-3xl text-center font-bold text-gray-900 ${
                      user!.name.length! > 10 ? "text-sm md:text-lg" : ""
                    }`}>
                    {user?.name}
                  </h1>
                  <div className=" text-center ">
                    <div className="text-4xl md:text-5xl font-extrabold text-blue-600">
                      {totalProblemsSolved.toLocaleString()}
                    </div>
                    <div className="text-base md:text-lg text-gray-700 font-medium sm:mt-1">
                      Total Problems Solved
                    </div>
                  </div>
                </div>
              </div>

              {/* Platforms Grid */}
              <motion.div
                className={`grid ${
                  numUsernames < 3 ? "grid-cols-1" : "grid-cols-2 text-right"
                } sm:gap-4 gap-1`}
                variants={containerAnimation}>
                {processedStats &&
                  Object.entries(processedStats).map(
                    ([platform, stats]) =>
                      stats && (
                        <a
                          target="_blank"
                          key={platform}
                          className="bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-[102%]"
                          href={
                            platformEnv[platform as keyof typeof platformEnv]
                          }>
                          <motion.div key={platform} variants={itemAnimation}>
                            <div className="flex items-center justify-between sm:mb-3 pb-2 border-b border-gray-200">
                              <div className="flex items-center sm:space-x-3 space-x-1">
                                <img
                                  src={stats.avatar}
                                  alt={platform}
                                  className="w-6 h-6 rounded-full"
                                />
                                <h3 className="font-medium text-sm sm:text-lg text-gray-900 capitalize">
                                  {platform}
                                </h3>
                              </div>
                            </div>
                            <div className="space-y-2 sm:text-sm  text-xs hover:scale-105 transition duration-300">
                              <span className="font-bold text-blue-600 flex justify-center">
                                {stats.totalProblemsSolved} solved
                              </span>
                              {stats.rating != null && "rating" in stats && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Rating </span>
                                  <span className="font-semibold">
                                    {stats.rating.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {stats.rank != null && "rank" in stats && (
                                <div className="flex justify-between ">
                                  <span className="text-gray-600">Rank </span>
                                  <span className="font-semibold ">
                                    {typeof stats.rank === "number"
                                      ? stats.rank.toLocaleString()
                                      : stats.rank.split(" ")[0]}
                                  </span>
                                </div>
                              )}
                              {"universityRank" in stats &&
                                stats.universityRank !== "" && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      University Rank :{" "}
                                    </span>
                                    <span className="font-semibold">
                                      {stats.universityRank.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              {stats.maxRating != null &&
                                "maxRating" in stats && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      Max rating{" "}
                                    </span>
                                    <span className="font-semibold">
                                      {stats.maxRating.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              {stats.contestGlobalRank != null &&
                                "contestGlobalRank" in stats && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      Contest{" "}
                                    </span>
                                    <span className="font-semibold">
                                      {stats.contestGlobalRank.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </motion.div>
                        </a>
                      )
                  )}
              </motion.div>
              <div>
                <a
                  href="https://dsastats.fun"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 font-semibold sm:text-md text-sm">
                  DSAStats.fun
                </a>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </>
  );
};
