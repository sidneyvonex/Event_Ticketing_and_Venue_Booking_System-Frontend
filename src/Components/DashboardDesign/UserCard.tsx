import React, { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

const UserCard: React.FC<CardProps> = ({ children }) => {
  return <div className="p-3 ">{children}</div>;
};

export default UserCard;
