import { Outlet } from "react-router-dom";
import UserCard from "./UserCard";
import { UserSideNav } from "./UserSideNav";
import { Topbar } from "./DashboardTopbar";
import { Footer } from "./Footer";
import { useState } from "react";

export const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  // Handler to close mobile sidebar from child
  const handleMobileNavClick = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen bg-[#F9F8FF]">
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block fixed top-0 left-0 h-screen ${
          collapsed ? "w-[80px]" : "w-[260px]"
        } bg-[#090040] text-white shadow-md transition-all duration-300 z-30`}
      >
        <UserSideNav collapsed={collapsed} />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 backdrop-blur-sm bg-opacity-40 transition-all duration-300"
          onClick={toggleMobileSidebar}
        >
          <div
            className="bg-[#090040] w-[260px] h-full shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside the sidebar
          >
            <UserSideNav collapsed={false} onNavClick={handleMobileNavClick} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "lg:ml-[80px]" : "lg:ml-[260px]"
        }`}
      >
        {/* ✅ Topbar gets the toggles as props */}
        <Topbar
          toggleSidebar={toggleSidebar}
          toggleMobileSidebar={toggleMobileSidebar}
        />

        <main className="flex-grow p-4 overflow-y-auto">
          <UserCard>
            <Outlet />
          </UserCard>
        </main>

        <Footer />
      </div>
    </div>
  );
};
