"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/hooks/useAppStore";
import { 
  LayoutDashboard, User, Briefcase, Sparkles, Calendar, 
  LogOut, Shield, Users, BarChart3, Building, Database, Send, CheckSquare, Brain,
  Award, FileCheck, ClipboardCheck, GraduationCap, Trophy, HelpCircle, Flame, PlusCircle, Bot
} from "lucide-react";
import { logoutAction } from "@/actions/auth";

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);

  if (!user) return null;
  const role = user.role;

  // Define navigation items based on user roles
  const getNavItems = () => {
    switch (role) {
      case "STUDENT":
        return [
          { label: "Overview", icon: LayoutDashboard, href: "/dashboard/student" },
          { label: "Practice Quizzes", icon: HelpCircle, href: "/dashboard/student/quizzes", badge: "MCQ" },
          { label: "Code Arena (DSA)", icon: Brain, href: "/dashboard/student/code-arena", badge: "OA" },
          { label: "1:1 Mentorship", icon: GraduationCap, href: "/dashboard/student/mentorship", badge: "FAANG" },
          { label: "Jobs & Internships", icon: Briefcase, href: "/dashboard/student/jobs" },
          { label: "AI Placement Coach", icon: Bot, href: "/dashboard/student/ai-coach", badge: "ADVISOR" },
          { label: "AI Voice Simulator", icon: Sparkles, href: "/dashboard/student/interviews/simulator", badge: "AI 2.0" },
          { label: "AI Resume Optimizer", icon: Sparkles, href: "/dashboard/student/resume-optimizer", badge: "ATS 95%" },
          { label: "AI GD Simulator", icon: Users, href: "/dashboard/student/gd-simulator", badge: "VOICE GD" },
          { label: "Resume Builder", icon: User, href: "/dashboard/student/profile/resume-builder", badge: "ATS" },
          { label: "Alumni Archive", icon: GraduationCap, href: "/dashboard/student/experiences", badge: "HOT" },
          { label: "Offer Comparator", icon: CheckSquare, href: "/dashboard/student/offers/compare" },
          { label: "My Profile", icon: User, href: "/dashboard/student/profile" },
          { label: "My Internships", icon: Award, href: "/dashboard/student/internships" }
        ];
      case "FACULTY_MENTOR":
        return [
          { label: "Internship Reviews", icon: ClipboardCheck, href: "/dashboard/faculty/internships" },
          { label: "Student List", icon: Users, href: "/dashboard/tpo/students" },
          { label: "Placement Archive", icon: GraduationCap, href: "/dashboard/student/experiences" }
        ];
      case "INTERNSHIP_COORDINATOR":
        return [
          { label: "Internship Requirements", icon: FileCheck, href: "/dashboard/coordinator/internships" },
          { label: "Submissions & Reviews", icon: ClipboardCheck, href: "/dashboard/faculty/internships" },
          { label: "Department Analytics", icon: BarChart3, href: "/dashboard/tpo/internships" },
          { label: "Alumni Knowledge", icon: GraduationCap, href: "/dashboard/student/experiences" }
        ];
      case "RECRUITER":
        return [
          { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/recruiter" },
          { label: "Company Profile", icon: Building, href: "/dashboard/recruiter/company" },
          { label: "Post a Job", icon: Send, href: "/dashboard/recruiter/post-job" },
          { label: "Candidate Search", icon: Users, href: "/dashboard/recruiter/candidates" },
          { label: "AI Matchmaker", icon: Brain, href: "/dashboard/recruiter/matchmaker" },
          { label: "Interviews", icon: Calendar, href: "/dashboard/recruiter/interviews" },
          { label: "Placement Archive", icon: GraduationCap, href: "/dashboard/student/experiences" }
        ];
      case "TPO":
        return [
          { label: "Analytics Overview", icon: BarChart3, href: "/dashboard/tpo" },
          { label: "Placement Drives & CSV", icon: Briefcase, href: "/dashboard/tpo/drives", badge: "EXCEL" },
          { label: "Alumni Archive", icon: GraduationCap, href: "/dashboard/student/experiences" },
          { label: "Internship Analytics", icon: Award, href: "/dashboard/tpo/internships" },
          { label: "Manage Students", icon: Users, href: "/dashboard/tpo/students" },
          { label: "Manage Recruiters", icon: Building, href: "/dashboard/tpo/recruiters" }
        ];
      case "ADMIN":
        return [
          { label: "Control Panel", icon: Shield, href: "/dashboard/admin" },
          { label: "Internship Config", icon: FileCheck, href: "/dashboard/coordinator/internships" },
          { label: "User Access", icon: Users, href: "/dashboard/admin/users" },
          { label: "AI Resource Logs", icon: Brain, href: "/dashboard/admin/ai-logs" },
          { label: "Audit Logs", icon: Database, href: "/dashboard/admin/audit" }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen max-h-screen transition-all duration-300 ease-in-out border-r border-black/5 bg-white/95 backdrop-blur-xl flex flex-col overflow-hidden
        ${sidebarOpen ? "w-64" : "w-20"}
      `}
    >
      {/* 1. Fixed Header (Logo) */}
      <div className="h-16 flex-shrink-0 flex items-center px-5 border-b border-black/5 justify-between bg-white/50">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-[#1C4980] flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-[#1C4980]/20">
            V
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold tracking-tight text-[#1C4980] text-lg truncate">
              VIT Placements<span className="text-[#DD3333] font-black">.</span>
            </span>
          )}
        </Link>
      </div>

      {/* 2. Scrollable Middle Area (User Card + Navigation list) */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden sidebar-scrollbar flex flex-col">
        {/* User Card inside Sidebar */}
        <div className="p-3 border-b border-black/5 flex-shrink-0">
          <div className="flex items-center gap-3 bg-slate-50/80 p-2.5 rounded-xl border border-black/5">
            <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-slate-600">
              {user.name?.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden min-w-0">
                <p className="font-semibold text-xs text-slate-800 truncate">{user.name}</p>
                <span className="inline-block text-[9px] uppercase font-bold tracking-widest text-[#DD3333]">
                  {role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1 pb-6">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 group text-xs font-semibold
                  ${isActive 
                    ? "bg-[#1C4980] text-white shadow-sm shadow-[#1C4980]/20" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#1C4980]"
                  }
                `}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-105
                  ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#1C4980]"}
                `} />
                {sidebarOpen && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ml-1 flex-shrink-0 ${
                        isActive ? "bg-white/20 text-white" : "bg-blue-50 text-[#1C4980]"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Fixed Footer (Sign Out) */}
      <div className="p-3 border-t border-black/5 flex-shrink-0 bg-white/95 backdrop-blur-md">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all duration-200 group cursor-pointer"
        >
          <LogOut className="h-4 w-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
