import React from "react";

import { BarChart2 } from "lucide-react";
import { Hero } from "../components/Hero";
import { GiProgression } from "react-icons/gi";
import { MdLeaderboard } from "react-icons/md";
import HoverLogo from "../components/HoverLogo";

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
  return (
    <div className="min-h-screen ">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center  bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_2%,black)]"></div>
      </div>
      <div className="pt-24 sm:pt-40 pb-12 ">
        <div className="relative w-full max-w-4xl mx-auto">
          <HoverLogo />
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
