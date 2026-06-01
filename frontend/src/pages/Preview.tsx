import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Link, Share2Icon } from "lucide-react";
import { motion } from "framer-motion";
import { ShareCard } from "../components/ShareCard";
import { User, UserStats } from "../lib/types";
import { useParams, useNavigate } from "react-router-dom";
import axiosFetch from "../lib/axiosFetch";
import LoadingPage from "./Loading";
import Toast from "../components/ui/Toast";

const PreviewPage = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBackground, setSelectedBackground] =
    useState<keyof typeof backgrounds>("default");
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  const id = useParams().userid;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsError(null);
      setIsLoading(true);
      if (id === "null") {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await axiosFetch.get<{
          success: boolean;
          user?: User;
          userStats?: UserStats;
        }>(`/preview/${id}`);

        if (data.success) {
          if (data.user) setUser(data.user);
          if (data.userStats) setUserStats(data.userStats);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        const err = error as { response?: { status: number; data?: { message?: string } } };
        if (err.response?.status === 429) {
          console.error("Rate limit exceeded:", err.response.data?.message);
          navigate("/");
        } else {
          console.error("Authentication or data fetching error:", error);
          setIsError("Authentication Error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, setUser, setUserStats]);

  const canCustomize = localStorage.getItem("token") !== null;

  const handleDownload = async () => {
    setIsError(null);
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
      link.download = `${user?.name}-devlytics.png`;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      setIsError("Error Generating image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    setIsError(null);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user?.name}'s DEVlytics Profile`,
          text: "Check out my DEVlytics profile!",
          url: window.location.href,
        });
      } else {
        // Fallback for browsers without Web Share API
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      setIsError("Error sharing");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
    } catch {
      setIsError("Failed to copy link");
    }
  };

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => {
      setIsCopied(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const numUsernames = Object.values(user?.usernames || {}).filter(
    (username) => username
  ).length;

  if (isLoading) {
    return (
      <div>
        {isError && <Toast message={isError} variant="error" />}
        <LoadingPage />
      </div>
    );
  }

  if (numUsernames === 0)
    return (
      <>
        {isError && <Toast message={isError} variant="error" />}
        <div className="mx-auto dark:bg-zinc-950 py-64 bg-white dark:text-white text-black sm:text-6xl text-lg text-center space-y-6 px-20 items-center">
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
      </>
    );

  return (
    <div className="mx-auto dark:bg-zinc-950 bg-white space-y-6 py-20 px-4 md:px-20 items-center">
      {isError && <Toast message={isError} variant="error" />}
      <div className="max-w-xl mx-auto">
        <ShareCard
          cardRef={cardRef}
          numUsernames={numUsernames}
          selectedBackground={selectedBackground}
          user={user}
          userStats={userStats}
        />

        {/* Actions Bar */}
        <motion.div
          className="flex justify-center sm:space-x-4 space-x-2 mt-4 gap-y-2 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}>
          <button
            onClick={handleShare}
            className="flex items-center border space-x-2 sm:px-4 px-2 py-1 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <Share2Icon className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center border space-x-2 px-4 py-1 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <Download className="w-4 h-4" />
            <span>{isGenerating ? "Generating" : "Download"}</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center border space-x-2 sm:px-4 px-2 py-1 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <Link className="w-4 h-4" />
            <span>{isCopied ? "Copied!" : "Copy Link"}</span>
          </button>
        </motion.div>

        {canCustomize && (
          <motion.div
            className="mt-6 p-6 bg-white rounded-xl shadow-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-semibold mb-4">Customize Your Card</h2>
            <div className="flex gap-4 flex-wrap justify-center">
              {Object.keys(backgrounds).map((bg) => (
                <div key={bg} className="flex flex-col items-center gap-2">
                  <BackgroundPreview
                    bg={bg as keyof typeof backgrounds}
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

export default PreviewPage;

export const backgrounds = {
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
  sleekMidnight: {
    component: () => (
      <div className="h-full absolute w-full rounded-xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-zinc-800" />
    ),
    preview: "Sleek Midnight",
  },
  neonCyberpunk: {
    component: () => (
      <div className="h-full absolute w-full rounded-xl bg-black overflow-hidden border border-fuchsia-800/40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1a3a_1px,transparent_1px),linear-gradient(to_bottom,#1f1a3a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-35" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-fuchsia-600 rounded-full filter blur-[120px] opacity-30" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600 rounded-full filter blur-[120px] opacity-30" />
      </div>
    ),
    preview: "Neon Cyberpunk",
  },
  minimalistSnow: {
    component: () => (
      <div className="h-full absolute w-full rounded-xl bg-[#fafafa] bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:16px_16px] border border-zinc-200" />
    ),
    preview: "Minimalist Snow",
  },
  purpleHaze: {
    component: () => (
      <div className="h-full absolute w-full rounded-xl bg-gradient-to-tr from-violet-950 via-indigo-950 to-zinc-950 overflow-hidden border border-purple-800/30">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-500 rounded-full filter blur-[100px] opacity-25" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full filter blur-[100px] opacity-25" />
      </div>
    ),
    preview: "Purple Haze",
  },
};

const BackgroundPreview = ({
  bg,
  isSelected,
  onClick,
}: {
  bg: keyof typeof backgrounds;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
      isSelected
        ? "border-blue-500 scale-110"
        : "border-gray-200 hover:border-gray-300"
    }`}>
    <div className=" pb-28">
      {React.createElement(
        backgrounds[bg as keyof typeof backgrounds].component
      )}
    </div>
  </button>
);
