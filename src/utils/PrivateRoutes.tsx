import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const PrivateRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  return token ? (
    <div className="flex ">
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col">
        <Navbar
          openSidebar={() => setIsSidebarOpen(true)}
        />
        <hr />
        <main className="flex-1 relative">
          {/* Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <section className= "flex flex-col justify-center  h-full p-6 md:p-8 background">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
