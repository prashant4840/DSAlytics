import { useEffect, useState } from "react";
import { motion } from "framer-motion";
const HoverLogo = () => {
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
    <div>
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
        className="hidden blur-[1.5px] lg:block w-10 h-10 absolute bottom-40 -left-10 drop-shadow-[0_16px_24px_rgba(139,87,42,0.35)]"
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
        className="hidden blur-[1.5px] lg:block w-12 h-14 absolute top-40 -right-40 drop-shadow-[0_16px_24px_rgba(255,141,0,0.35)]"
        style={{
          x: mousePosition.x * 0.04,
          y: mousePosition.y * 0.03,
        }}
        initial="initial"
        animate="animate"
      />
    </div>
  );
};

export default HoverLogo;
