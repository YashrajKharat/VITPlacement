"use client";

import { useState, useEffect } from "react";
import { getTpoStudentsAction } from "@/actions/dashboard";
import { User, ShieldCheck } from "lucide-react";

export default function TpoStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await getTpoStudentsAction();
        if (res?.success) {
          setStudents(res.students || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  if (loading) {
    return <div className="text-center py-20 font-semibold">Loading student roster...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
          Manage Enrolled Students
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Review academic details, CGPA standings, and calculated placement readiness scores.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Department & Batch</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Readiness Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/50">
              {students.map((stud) => (
                <tr key={stud.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    <div>
                      <p>{stud.name}</p>
                      {stud.skills && Array.isArray(stud.skills) && stud.skills.length > 0 && (
                        <p className="text-[10px] text-indigo-500 truncate max-w-xs">{stud.skills.slice(0, 3).join(", ")}{stud.skills.length > 3 ? "..." : ""}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-zinc-400">{stud.email || "—"}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-zinc-400">
                    <span className="font-medium">{stud.department || "CMPN"}</span>
                    {stud.batch && <span className="text-slate-400 text-[10px] ml-1">({stud.batch})</span>}
                  </td>
                  <td className="py-4 px-4 font-semibold">{stud.cgpa ? `${stud.cgpa} CGPA` : "N/A"}</td>
                  <td className="py-4 px-4 font-semibold text-indigo-500">{stud.placementReadinessScore || 0}% Ready</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-wider">
                      Active
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
