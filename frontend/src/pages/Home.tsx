import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";
import { Hero } from "../components/Hero";
import { GiProgression } from "react-icons/gi";
import { MdLeaderboard } from "react-icons/md";

interface FeatureCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="w-full max-w-[422px] [background:linear-gradient(0deg,#ffff,theme(colors.slate.50)_50%,#f8f8f8)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.slate.200/.48))_border-box] rounded-2xl border border-transparent animate-border">
    <div className="p-5">
      <div className="flex items-center border justify-center w-12 h-12 bg-white rounded-lg">
        <Icon className="w-6 h-6 text-indigo-500" />
      </div>
      <h3 className="text-xl font-bold mt-4 text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  </div>
);

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen ">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center  bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_2%,black)]"></div>
      </div>
      <div className="pt-24 pb-16 sm:pt-40 sm:pb-24 ">
        <div className="relative w-full max-w-4xl mx-auto">
          {/* LeetCode Logo */}
          <motion.img
            src="/logos/leetcode.webp"
            alt="LeetCode"
            className="hidden blur-[1.5px] lg:block w-16 h-16 absolute top-5 -left-24 drop-shadow-[0_16px_24px_rgba(255,113,0,0.35)]"
            style={{
              x: mousePosition.x * 0.04,
              y: mousePosition.y * 0.04,
            }}
            initial="initial"
            animate="animate"
          />
          <motion.img
            src="/logos/leetcode.webp"
            alt="leetcode"
            className="hidden blur-[2.2px] lg:block w-7 h-7 absolute top-32 right-2 drop-shadow-[0_16px_24px_rgba(139,87,42,0.35)]"
            style={{
              x: mousePosition.x * 0.02,
              y: mousePosition.y * 0.02,
            }}
            initial="initial"
            animate="animate"
          />

          {/* GeeksForGeeks Logo */}
          <motion.img
            src="/logos/gfg.png"
            alt="GeeksForGeeks"
            className="hidden blur-[2.2px] lg:block w-10 h-5 absolute top-40 -left-32 drop-shadow-[0_16px_24px_rgba(47,184,92,0.35)]"
            style={{
              x: mousePosition.x * 0.02,
              y: mousePosition.y * 0.02,
            }}
            initial="initial"
            animate="animate"
          />

          <motion.img
            src="/logos/gfg.png"
            alt="GeeksForGeeks"
            className="hidden blur-[1.5px] lg:block w-20 h-10 absolute top-0 -right-10 drop-shadow-[0_16px_24px_rgba(47,184,92,0.35)]"
            style={{
              x: mousePosition.x * 0.02,
              y: mousePosition.y * 0.02,
            }}
            initial="initial"
            animate="animate"
          />

          {/* CodeChef Logo */}
          <motion.img
            src="/logos/codeforces.webp"
            alt="CodeChef"
            className="hidden blur-[1.5px] lg:block w-10 h-10 absolute bottom-10 -left-10 drop-shadow-[0_16px_24px_rgba(139,87,42,0.35)]"
            style={{
              x: mousePosition.x * 0.03,
              y: mousePosition.y * 0.03,
            }}
            initial="initial"
            animate="animate"
          />

          {/* InterviewBit Logo */}
          <motion.img
            src="/logos/interviewbit.png"
            alt="InterviewBit"
            className="hidden blur-[1.5px] lg:block w-24 h-24 absolute top-60 right-0 drop-shadow-[0_16px_24px_rgba(67,56,202,0.35)]"
            style={{
              x: mousePosition.x * 0.05,
              y: mousePosition.y * 0.05,
            }}
            initial="initial"
            animate="animate"
          />

          <motion.img
            src="/logos/interviewbit.png"
            alt="InterviewBit"
            className="hidden blur-[2.2px] lg:block w-14 h-14 absolute top-36 right-100 drop-shadow-[0_16px_24px_rgba(67,56,202,0.35)]"
            style={{
              x: mousePosition.x * 0.05,
              y: mousePosition.y * 0.05,
            }}
            initial="initial"
            animate="animate"
          />

          {/* Codeforces Logo */}
          <motion.img
            src="/logos/codeforces.webp"
            alt="Codeforces"
            className="hidden blur-[1.5px] lg:block w-14 h-14 absolute top-40 -right-40 drop-shadow-[0_16px_24px_rgba(255,141,0,0.35)]"
            style={{
              x: mousePosition.x * 0.04,
              y: mousePosition.y * 0.03,
            }}
            initial="initial"
            animate="animate"
          />
          <Hero />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to track your DSA progress
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MdLeaderboard}
              title="Beautiful shareable cards"
              description="Create beautiful cards to showcase your progress. Share them on social media or with potential employers."
            />
            <FeatureCard
              icon={BarChart2}
              title="Leaderboards"
              description="Compete with friends and other users on the platform. See where you stand and get motivated to improve."
            />
            <FeatureCard
              icon={GiProgression}
              title="all your progress in one place"
              description="Track your progress on multiple platforms in one place. No need to switch between multiple tabs. or share multiple links of different platforms."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
