"use client";

import { useState, useEffect } from "react";
import { getAdminUsersAction } from "@/actions/dashboard";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getAdminUsersAction();
        if (res?.success) {
          setUsers(res.users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading user access table...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
          User Access List
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Review accounts, designations, roles, and credential configurations.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Account status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{u.name}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-zinc-400">{u.email}</td>
                  <td className="py-4 px-4 font-semibold text-indigo-500">{u.role}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-wider">
                      Active Access
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
