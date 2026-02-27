import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Folder, Users, Handshake } from "lucide-react";

const Navbar: React.FC = () => {
  const username = "User";
  const role = "Admin";
  const initial = username.charAt(0).toUpperCase();

  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Start", icon: Home },
    { to: "/projects", label: "Projekt", icon: Folder },
    { to: "/resources", label: "Resurser", icon: Users },
    { to: "/customers", label: "Kunder", icon: Handshake },
  ];

  return (
    <nav className="bg-purple-800 text-white p-6 flex items-center justify-between px-12">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-4xl font-bold hover:text-purple-300 transition-colors"
        >
          itm8
        </Link>
        <span className="text-xl font-semibold">PMO System</span>
      </div>

      <div className="flex gap-9 items-center justify-center">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`
                flex items-center gap-2 text-lg px-2 py-1 rounded transition-colors
                ${isActive ? "bg-purple-700" : ""}
                hover:bg-purple-700 hover:text-purple-200
              `}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-white" : "text-white"} transition-colors`}
              />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end leading-tight">
          <span className="font-semibold">{username}</span>
          <span className="text-sm text-gray-300">{role}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-gray-500 text-lg">
          {initial}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
