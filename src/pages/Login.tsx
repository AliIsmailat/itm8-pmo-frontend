import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

const Login: React.FC = () => (
  <AuthLayout>
    <LoginForm />
  </AuthLayout>
);

export default Login;
