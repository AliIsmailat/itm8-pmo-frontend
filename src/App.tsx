import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import MsalAuthGuard from "./components/auth/MsalAuthGuard";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Resources from "./pages/Resources";
import Customers from "./pages/Customers";
import Archive from "./pages/Archive";
import Login from "./pages/Login";
import { isAuthenticated } from "./utils/auth";

/** Guards routes that require app-level login (JWT from /api/Auth/login). */
const AppProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // CODE REVIEW: Det känns lite överflödigt att ha både MsalAuthGuard och AppProtectedRoute per route. 
  // MsalAuthGuard borde i princip kunna hantera både inloggning via MSAL och att visa login-sidan om användaren inte är inloggad, utan att vi behöver en separat AppProtectedRoute. 
  // Det skulle förenkla både komponentstrukturen och routing-logiken. 

    return (
    <MsalAuthGuard>
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <MainLayout>
          <Routes>
            <Route
              path="/"
              element={
                <AppProtectedRoute>
                  <Dashboard />
                </AppProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <AppProtectedRoute>
                  <Projects />
                </AppProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <AppProtectedRoute>
                  <ProjectDetails />
                </AppProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <AppProtectedRoute>
                  <Resources />
                </AppProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <AppProtectedRoute>
                  <Customers />
                </AppProtectedRoute>
              }
            />
            <Route
              path="/archive"
              element={
                <AppProtectedRoute>
                  <Archive />
                </AppProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      )}
    </MsalAuthGuard>
  );
};

export default App;
