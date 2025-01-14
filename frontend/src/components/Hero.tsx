import { FilledButton, HollowButton } from "./ui/Button";
import { AnimatedHighlight } from "./ui/hero-highlight";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Hero = () => {
  const [hasAccount, setHasAccount] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasAccount(!!token);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 1.5,
            ease: [0.4, 0.0, 0.5, 1],
          }}
          className="text-5xl pb-5 px-4 md:text-4xl lg:text-6xl font-bold text-black  max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto ">
          Share all your DSA stats in{" "}
          <AnimatedHighlight>one place</AnimatedHighlight>
        </motion.h1>

        <div className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-down">
          Share and track your progress across LeetCode, GFG, Codeforces and
          interviewBit. showcase your coding journey in one place.{" "}
          <span className="bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent">
            Get started now!
          </span>
        </div>
        <div className="flex justify-center space-x-4 animate-slide-down-slow">
          <FilledButton to={!hasAccount ? "/signup" : "/profile"}>
            {!hasAccount ? "Create your profile" : "View your profile"}
          </FilledButton>
          <HollowButton to="/leaderboard">Leaderboard</HollowButton>
        </div>
      </div>
    </div>
  );
};
