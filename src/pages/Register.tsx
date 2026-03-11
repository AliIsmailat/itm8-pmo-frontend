import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

const Register: React.FC = () => (
  <AuthLayout>
    <RegisterForm />
  </AuthLayout>
);

export default Register;
