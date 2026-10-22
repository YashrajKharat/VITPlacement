import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import DashboardNavbar from "@/components/shared/DashboardNavbar";

export const metadata = {
  title: "VIT Placements - Mission Control Dashboard",
  description: "Manage applications, schedule interviews, and audit career readiness scores.",
};

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <DashboardSidebar user={session.user} />
      
      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ml-20 md:ml-64">
        {/* Navbar */}
        <DashboardNavbar user={session.user} />
        
        {/* Page Content View */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto relative">
          <div className="glow-mesh" />
          {children}
        </main>
      </div>
    </div>
  );
}
