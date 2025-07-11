import { Outlet } from "react-router-dom";
import UserCard from "./UserCard";
import { UserSideNav } from "./UserSideNav";
import { Topbar } from "./DashboardTopbar";
import { Footer } from "./Footer";

export const UserLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F9F8FF]">
      {/* Sidebar */}
      <div className="hidden lg:block w-[260px] bg-white border-r border-gray-200 shadow-sm">
        <UserSideNav />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Topbar />
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
