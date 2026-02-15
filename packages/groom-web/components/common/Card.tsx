import type React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  const baseClasses = "bg-white rounded-xl shadow-lg";
  return <div className={`${baseClasses} ${className}`}>{children}</div>;
};

export default Card;
