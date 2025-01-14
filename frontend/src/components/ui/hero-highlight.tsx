import { motion } from "framer-motion";

export const AnimatedHighlight = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <motion.span
        className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-gradient-to-r  from-indigo-800 to-indigo-300"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      />
    </span>
  );
};
