import React from "react";

export const Card = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export default Card;
