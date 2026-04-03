import React from "react";
import type { ReactNode } from "react";
import Navbar from "../components/ui/Navbar";
import FeedbackButton from "../components/ui/FeedbackButton";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f7f5fb] overflow-x-hidden">{children}</main>
      <FeedbackButton />
    </div>
  );
};

export default MainLayout;
