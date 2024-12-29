import React from "react";

const variants = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-blue-100 text-blue-800",
  secondary: "bg-gray-100 text-gray-800",
  destructive: "bg-red-100 text-red-800",
  outline: "border border-gray-200 text-gray-800",
};

export const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) => {
  return (
    <>
      <span
        className={`
        inline-flex items-center rounded-full px-3 py-1  
        ${variants[variant]}
        ${className}
        `}>
        <p className="font-semibold text-sm">Global Rank : </p>
        <p className=" text-sm">{children}</p>
      </span>
    </>
  );
};

export default Badge;
