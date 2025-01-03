import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, Link } from "lucide-react";
import { UserStats } from "../lib/types";
import Card from "../components/ui/Card";
import { useUserContext } from "../contexts/Context";
import { motion } from "framer-motion";
import axiosFetch from "../lib/axiosFetch";

const convertImageToDataURI = async (url: string): Promise<string> => {
  if (url === "./defaultpfp.png") return url;
  try {
    const { data } = await axiosFetch.get(
      `/api/fetchimg?url=${encodeURIComponent(url)}`
    );
    return data.data;
  } catch (error) {
    console.error("Error converting image to data URI:", error);
    return "";
  }
};

const getTotalProblemsSolved = (stats: UserStats) => {
  return Object.values(stats).reduce((total, platform) => {
    return total + (platform?.totalProblemsSolved || 0);
  }, 0);
};

const backgrounds = {
  default: {
    component: () => (
      <div className="h-full absolute w-full rounded-xl dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2]" />
    ),
    preview: "Dark/Light Grid",
  },
  dots: {
    component: () => (
      <div className="h-full absolute w-full rounded-xl bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" />
    ),
    preview: "Dot Grid",
  },
  gradient: {
    component: () => (
      <div className="h-full absolute w-full rounded-xl [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
    ),
    preview: "Purple Gradient",
  },
  dotMask: {
    component: () => (
      <div className="h-full absolute w-full rounded-xl bg-white">
        <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>
    ),
    preview: "Masked Dots",
  },
  grid: {
    component: () => (
      <div className="h-full w-full rounded-xl absolute bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]" />
      </div>
    ),
    preview: "Grid with Glow",
  },
};

const BackgroundPreview = ({ bg, isSelected, onClick }: any) => (
  <button
    onClick={onClick}
    className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
      isSelected
        ? "border-blue-500 scale-110"
        : "border-gray-200 hover:border-gray-300"
    }`}>
    <div className=" pb-28">
      {React.createElement(
        // @ts-ignore
        backgrounds[bg].component
      )}
    </div>
  </button>
);

const SharePage = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBackground, setSelectedBackground] =
    useState<keyof typeof backgrounds>("default");
  const canCustomize = localStorage.getItem("token") !== null;
  const { user, userStats } = useUserContext();
  const [processedStats, setProcessedStats] = useState<UserStats | null>(null);
  const [processedUserPfp, setProcessedUserPfp] = useState<string | null>(null);

  useEffect(() => {
    const processImages = async () => {
      const updatedStats: { [key: string]: UserStats[keyof UserStats] } = {};

      // Process user profile picture
      if (user?.pfp) {
        const pfpDataURI = await convertImageToDataURI(user.pfp);
        setProcessedUserPfp(pfpDataURI);
      }

      // Process platform avatars
      for (const [platform, stats] of Object.entries(userStats || {})) {
        if (stats?.avatar) {
          const avatarDataURI = await convertImageToDataURI(stats.avatar);
          updatedStats[platform] = { ...stats, avatar: avatarDataURI };
        } else {
          updatedStats[platform] = stats;
        }
      }

      setProcessedStats(updatedStats);
    };

    processImages();
  }, [userStats, user?.pfp]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${user?.name}-coding-profile.png`;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${user?.name}'s Coding Profile`,
        text: "Check out my coding profile!",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
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

  const numUsernames = Object.values(user?.usernames || {}).filter(
    (username) => username
  ).length;

  if (numUsernames === 0)
    return (
      <div className="mx-auto dark:bg-zinc-950 py-60 bg-white dark:text-white text-black text-7xl text-center space-y-6 px-20 items-center">
        Please add your Codeforces | LeetCode | GeeksforGeeks | InterviewBit
        usernames to generate your profile card.
        <div className="flex justify-center mt-10">
          <a
            href="/profile"
            className="px-4 py-2 cursor-pointer rounded-md border text-lg  dark:border-black border-white bg-black dark:bg-white text-white dark:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255)] transition duration-200">
            Add usernames
          </a>
        </div>
      </div>
    );

  return (
    <div className="mx-auto dark:bg-zinc-950 bg-white space-y-6 py-10 md:py-20 px-4 md:px-20 items-center">
      <div className="max-w-xl mx-auto">
        <motion.div
          id="capture_div"
          ref={cardRef}
          className="overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={containerAnimation}>
          <Card className="bg-white shadow-xl rounded-xl mx-2 md:mx-10">
            <div className="h-[40rem] w-full rounded-xl relative flex items-center justify-center">
              {/* Dynamic Background */}
              {React.createElement(backgrounds[selectedBackground].component)}

              <motion.div
                className="p-4 md:p-8 space-y-6 md:space-y-8 relative z-10"
                variants={itemAnimation}>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:space-x-6 p-4 border bg-white rounded-lg shadow-lg">
                  <motion.img
                    src={processedUserPfp || user?.pfp}
                    alt={user?.name}
                    className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-gray-200 shadow-md mb-4 md:mb-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {user?.name}
                    </h1>
                    <div className="mt-4">
                      <div className="text-4xl md:text-5xl font-extrabold text-blue-600">
                        {getTotalProblemsSolved(userStats!).toLocaleString()}
                      </div>
                      <div className="text-base md:text-lg text-gray-700 font-medium mt-1">
                        Total Problems Solved
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platforms Grid */}
                <motion.div
                  className={`grid ${
                    numUsernames < 3 ? "grid-cols-1" : "grid-cols-2 text-right"
                  } gap-4`}
                  variants={containerAnimation}>
                  {processedStats &&
                    Object.entries(processedStats).map(
                      ([platform, stats]) =>
                        stats && (
                          <motion.div
                            key={platform}
                            className="bg-gray-50 border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                            variants={itemAnimation}>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={stats.avatar}
                                  alt={platform}
                                  className="w-6 h-6 rounded-full"
                                />
                                <h3 className="font-medium text-gray-900 capitalize">
                                  {platform}
                                </h3>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <span className="text-sm font-medium flex justify-center text-zinc-950">
                                {stats.totalProblemsSolved} solved
                              </span>
                              {"rating" in stats && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Rating</span>
                                  <span className="font-semibold">
                                    {stats.rating?.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {"rank" in stats && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Rank</span>
                                  <span className="font-semibold">
                                    {stats.rank?.toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                    )}
                </motion.div>
                <div>
                  <a
                    href="https://dsastats.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 font-semibold">
                    DSAStats.com
                  </a>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          className="flex justify-center space-x-4 mt-4 flex-wrap gap-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}>
          <button
            onClick={handleShare}
            className="flex items-center border space-x-2 px-4 py-1 bg-zinc-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center border space-x-2 px-4 py-1 bg-zinc-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4" />
            <span>{isGenerating ? "Generating..." : "Download"}</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center border space-x-2 px-4 py-1 bg-zinc-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Link className="w-4 h-4" />
            <span>Copy Link</span>
          </button>
        </motion.div>

        {canCustomize && (
          <motion.div
            className="mt-6 p-6 bg-white rounded-xl shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-semibold mb-4">Customize Your Card</h2>
            <div className="flex gap-4 flex-wrap">
              {Object.keys(backgrounds).map((bg) => (
                <div key={bg} className="flex flex-col items-center gap-2">
                  <BackgroundPreview
                    bg={bg}
                    isSelected={selectedBackground === bg}
                    onClick={() =>
                      setSelectedBackground(bg as keyof typeof backgrounds)
                    }
                  />
                  <span className="text-xs text-gray-600">
                    {backgrounds[bg as keyof typeof backgrounds].preview}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SharePage;
