import React from "react";
import AuthBrandingPanel from "./AuthBrandingPanel";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => (
  <div className="min-h-screen flex">
    <AuthBrandingPanel />
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f7f5fb] px-8 py-16">
      {children}
    </div>
  </div>
);

export default AuthLayout;
