"use client";

import { useState, useEffect } from "react";
import { getAdminAuditLogsAction } from "@/actions/dashboard";
import { Database, ShieldAlert, Check } from "lucide-react";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuditLogs = async () => {
      try {
        const res = await getAdminAuditLogsAction();
        if (res?.success) {
          setLogs(res.logs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAuditLogs();
  }, []);

  if (loading) {
    return <div className="text-center py-20 font-semibold">Loading system audit trails...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
          System Audit Trails
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Review critical system actions, user registrations, logins, status overrides, and configurations.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Event Origin</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {log.user?.email || "System"}
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">{log.user?.role}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-indigo-500">{log.action}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-zinc-400">{log.details}</td>
                  <td className="py-4 px-4 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
