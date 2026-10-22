"use client";

import { useState, useEffect } from "react";
import { getTpoRecruitersAction, verifyRecruiterAction } from "@/actions/dashboard";
import { Building, ShieldCheck, Check } from "lucide-react";

export default function TpoRecruitersPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");

  const loadRecruiters = async () => {
    try {
      const res = await getTpoRecruitersAction();
      if (res?.success) {
        setRecruiters(res.recruiters || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiters();
  }, []);

  const handleVerify = async (recId, status) => {
    setActionId(recId);
    try {
      await verifyRecruiterAction(recId, status);
      await loadRecruiters();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId("");
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold">Loading recruiter directory...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
          Manage Verified Employers
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Review recruiter designations, company names, and verify login access permissions.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Recruiter Name</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Employer Brand</th>
                <th className="py-3 px-4">Verification status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/50">
              {recruiters.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    <div>
                      <p>{rec.name}</p>
                      {rec.email && <p className="text-[10px] text-slate-400 font-normal">{rec.email}</p>}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-zinc-400">{rec.designation || "Recruiting Coordinator"}</td>
                  <td className="py-4 px-4 font-semibold text-indigo-500">{rec.company?.name || "Corporate Partner"}</td>
                  <td className="py-4 px-4">
                    <span 
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                        ${rec.isVerified ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}
                      `}
                    >
                      {rec.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {!rec.isVerified && (
                      <button
                        onClick={() => handleVerify(rec.id, true)}
                        disabled={actionId === rec.id}
                        className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-[10px] font-bold rounded-lg cursor-pointer disabled:opacity-50"
                      >
                        Approve Access
                      </button>
                    )}
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
