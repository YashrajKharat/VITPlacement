"use client";

import { useState, useEffect } from "react";
import { getAdminDashboardAction } from "@/actions/dashboard";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    students: 0,
    recruiters: 0,
    companies: 0,
    jobs: 0
  });

  useEffect(() => {
    const loadAdminStats = async () => {
      try {
        const res = await getAdminDashboardAction();
        if (res?.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAdminStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading admin control panel...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Header welcome banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
            Super Admin Control Panel
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Global configuration, database table schema checks, API tokens, and audit trails.
          </p>
        </div>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Credentials</p>
          <p className="text-3xl font-bold font-display text-slate-800 dark:text-slate-200 mt-1">{stats.users}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students Registered</p>
          <p className="text-3xl font-bold font-display text-slate-800 dark:text-slate-200 mt-1">{stats.students}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recruiter Accounts</p>
          <p className="text-3xl font-bold font-display text-slate-800 dark:text-slate-200 mt-1">{stats.recruiters}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Corporate Brands</p>
          <p className="text-3xl font-bold font-display text-slate-800 dark:text-slate-200 mt-1">{stats.companies}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Postings Published</p>
          <p className="text-3xl font-bold font-display text-slate-800 dark:text-slate-200 mt-1">{stats.jobs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: System status indicators (Span 2) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">Database & System Health</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl border border-slate-200/50 dark:border-zinc-800/30 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Prisma Schema Connection</p>
                <p className="text-slate-400">PostgreSQL adapter sync status.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold uppercase text-[9px]">
                Operational
              </span>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl border border-slate-200/50 dark:border-zinc-800/30 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">AI Core Processing</p>
                <p className="text-slate-400">OpenAI token endpoint validation.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold uppercase text-[9px]">
                Active (Local Mock Fallback)
              </span>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl border border-slate-200/50 dark:border-zinc-800/30 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Mail Dispatch Engine</p>
                <p className="text-slate-400">Resend email dispatch status.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 font-bold uppercase text-[9px]">
                Staged
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Global system configurations */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 space-y-6">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">System Tokens</h3>
          
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">OpenAI Api Token</label>
              <input
                type="password"
                disabled
                value="••••••••••••••••••••••••••••"
                className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent rounded-lg focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Cloudinary Upload Key</label>
              <input
                type="password"
                disabled
                value="••••••••••••••••••••••••••••"
                className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
