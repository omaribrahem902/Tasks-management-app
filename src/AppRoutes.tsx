import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./auth/signup/SignUp";
import Login from "./auth/login/Login";
import ForgotPassword from "./auth/forgot-password/ForgotPassword";
import CreateNewPassword from "./auth/create new password/CreateNewPassword";
import Projects from "./pages/projectsPages/Projects";
import PrivateRoutes from "./utils/PrivateRoutes";
import AuthLayout from "./auth/AuthLayout";
import AddProject from "./pages/addNewProjectpage/AddProject";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Navigate to="/project" />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/project/add" element={<AddProject />} />
      </Route>
    
      <Route path="/login" element={<AuthLayout children={<Login />} />} />
      <Route path="/signup" element={<AuthLayout children={<SignUp />} />} />
      <Route path="/forgot-password" element={<AuthLayout children={<ForgotPassword />} />} />
      <Route path="/create-new-password" element={<AuthLayout children={<CreateNewPassword />} />} />
      {/* <Route path="/projects" element={<Projects />} /> */}
    </Routes>
  );
}