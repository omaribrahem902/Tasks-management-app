import { Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const PrivateRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    const fullPath = location.pathname + location.search;
    const redirectUrl =
      fullPath && fullPath !== "/"
        ? `?redirect=${encodeURIComponent(fullPath)}`
        : "";
    return <Navigate to={`/login${redirectUrl}`} replace />;
  }

  return (
    <div className="flex ">
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col">
        <Navbar openSidebar={() => setIsSidebarOpen(true)} />
        <hr />
        <main className="flex-1 relative">
          {/* Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <section className="flex flex-col justify-start h-full p-6 md:p-8 background ">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
};

export default PrivateRoutes;
