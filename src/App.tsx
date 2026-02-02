import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";

const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
