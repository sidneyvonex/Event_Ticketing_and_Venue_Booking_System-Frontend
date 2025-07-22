import React, { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

const UserCard: React.FC<CardProps> = ({ children }) => {
  return <div className="bg-gray-50 min-h-full">{children}</div>;
};

export default UserCard;
