import { Outlet } from "react-router-dom";
import UserCard from "./UserCard";
import { AdminSideNav } from "./AdminSideNav";
import { Topbar } from "./DashboardTopbar";
import { Footer } from "./Footer";
import { useState } from "react";

export const AdminLayout = () => {
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
        } bg-[#093FB4] transition-all duration-300 ease-in-out z-30`}
      >
        <AdminSideNav collapsed={collapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-sm bg-opacity-40 z-40"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-screen w-[260px] bg-[#093FB4] transform transition-transform duration-300 ease-in-out z-50 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSideNav collapsed={false} onNavClick={handleMobileNavClick} />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? "lg:ml-[80px]" : "lg:ml-[260px]"
        }`}
      >
        {/* Top Navigation */}
        <div className="sticky top-0 z-20 bg-white shadow-sm">
          <Topbar
            toggleSidebar={toggleSidebar}
            toggleMobileSidebar={toggleMobileSidebar}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <UserCard>
            <Outlet />
          </UserCard>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
