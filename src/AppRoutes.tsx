import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./auth/signup/SignUp";
import Login from "./auth/login/Login";
import ForgotPassword from "./auth/forgot-password/ForgotPassword";
import CreateNewPassword from "./auth/create new password/CreateNewPassword";
import Projects from "./pages/projectsPages/Projects";
import PrivateRoutes from "./utils/PrivateRoutes";
import AuthLayout from "./auth/AuthLayout";
import AddProject from "./pages/addNewProjectpage/AddProject";
import MembersPage from "./pages/members/MembersPage";
import DetailsPage from "./pages/DetailsPage";
import EditProjectPage from "./pages/editProject/EditProject";
import CreateNewEpic from "./pages/createNewEpic/CreateNewEpic";
import ProjectEpics from "./pages/projectEpics/projectEpicsPage/ProjectEpics";
import AddNewTask from "./pages/addNewTaskPage/AddNewTask";
import ProjectTasks from "./pages/projectTasksPage/ProjectTasksPage";

export default function AppRoutes() {

  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Navigate to="/project" />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/project/add" element={<AddProject />} />
        <Route path="/project/:projectId/members" element={<MembersPage />} />
        <Route path="/project/:projectId/tasks" element={<ProjectTasks />} />
        <Route path="/project/:projectId/details" element={<DetailsPage />} />
        <Route path="/project/:projectId/edit" element={<EditProjectPage />} />
        <Route path="/project/:projectId/epics/new" element={<CreateNewEpic />}/>
        <Route path="/project/:projectId/epics" element={<ProjectEpics />} />
        <Route path="/project/:projectId/tasks/new" element={<AddNewTask />} />
      </Route>

      <Route path="/login" element={<AuthLayout children={<Login />} />} />
      <Route path="/signup" element={<AuthLayout children={<SignUp />} />} />
      <Route path="/forgot-password" element={<AuthLayout children={<ForgotPassword />} />} />
      <Route path="/create-new-password" element={<AuthLayout children={<CreateNewPassword />} />}/>
    </Routes>
  );
}