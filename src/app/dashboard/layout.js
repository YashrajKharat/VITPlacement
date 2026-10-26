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
    <div className="dashboard-root min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex font-sans antialiased print:bg-white print:block print:min-h-0 print:m-0 print:p-0">
      {/* Sidebar Navigation */}
      <DashboardSidebar user={session.user} />
      
      {/* Main Layout Area */}
      <div className="dashboard-content-area flex-1 flex flex-col transition-all duration-300 ml-20 md:ml-64 print:ml-0 print:m-0 print:p-0 print:block print:w-full">
        {/* Navbar */}
        <DashboardNavbar user={session.user} />
        
        {/* Page Content View */}
        <main className="dashboard-main flex-1 p-6 md:p-8 overflow-y-auto relative print:p-0 print:m-0 print:overflow-visible print:block print:w-full">
          <div className="glow-mesh print:hidden" />
          {children}
        </main>
      </div>
    </div>
  );
}
