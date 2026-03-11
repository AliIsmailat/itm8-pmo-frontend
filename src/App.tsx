import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Resources from "./pages/Resources";
import Customers from "./pages/Customers";
import Archive from "./pages/Archive";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App: React.FC = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
