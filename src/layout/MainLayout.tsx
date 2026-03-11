import React from "react";
import type { ReactNode } from "react";
import Navbar from "../components/ui/Navbar";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 bg-[#f7f5fb]">{children}</main>
    </div>
  );
};

export default MainLayout;
