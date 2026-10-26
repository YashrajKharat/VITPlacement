"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { Bell, Menu, Check } from "lucide-react";
import { 
  getUserNotificationsAction, 
  markNotificationReadAction, 
  markAllNotificationsReadAction 
} from "@/actions/dashboard";

export default function DashboardNavbar({ user }) {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const setTheme = useAppStore((state) => state.setTheme);

  const [notifs, setNotifs] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Force Light mode programmatically on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, [setTheme]);

  // Load user notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await getUserNotificationsAction();
        if (res?.success) {
          setNotifs(res.notifications || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const res = await markAllNotificationsReadAction();
      if (res?.success) {
        const listRes = await getUserNotificationsAction();
        if (listRes?.success) {
          setNotifs(listRes.notifications || []);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkOne = async (id) => {
    try {
      const res = await markNotificationReadAction(id);
      if (res?.success) {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-black/5 bg-white/60 backdrop-blur-xl flex items-center justify-between px-6 print:hidden">
      {/* Toggle button */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-display font-semibold text-[#1C4980] hidden md:inline-block">
          Vidyalankar Institute of Technology • Placement & Training Network
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-black/5 bg-white shadow-xl p-4 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-2">
                <span className="font-semibold text-sm text-slate-800">Notifications ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#DD3333] font-semibold hover:underline"
                  >
                     Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {notifs.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No new notifications</p>
                ) : (
                  notifs.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkOne(n.id)}
                      className={`p-2.5 rounded-xl text-xs cursor-pointer border transition-colors flex items-start justify-between gap-2
                        ${n.read 
                          ? "bg-slate-50/50 border-transparent text-slate-500" 
                          : "bg-blue-50/40 border-blue-100 text-slate-800"
                        }
                      `}
                    >
                       <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#DD3333]">{n.title}</p>
                        <p className="mt-0.5 text-slate-500 leading-relaxed truncate">{n.message}</p>
                      </div>
                      {!n.read && (
                        <div className="h-4 w-4 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Check className="h-2.5 w-2.5 text-[#DD3333]" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
