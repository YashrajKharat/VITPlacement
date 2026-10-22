import { create } from "zustand";

export const useAppStore = create((set) => ({
  // Theme state
  theme: "dark",
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(nextTheme);
    }
    return { theme: nextTheme };
  }),
  setTheme: (theme) => set(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
    return { theme };
  }),

  // Application Sidebar Toggle
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Active student tab
  activeStudentTab: "dashboard",
  setActiveStudentTab: (tab) => set({ activeStudentTab: tab }),

  // Notification list
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
  })),

  // Selected AI mock interview questions
  mockInterviewRole: "Frontend Engineer",
  mockInterviewCompany: "Stripe",
  setMockInterviewConfig: (role, company) =>
    set({ mockInterviewRole: role, mockInterviewCompany: company }),
}));
