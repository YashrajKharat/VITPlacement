"use client";

import { useState } from "react";
import { Brain, Sparkles, BarChart2, ShieldAlert } from "lucide-react";

export default function AdminAiLogsPage() {
  const [logs] = useState([
    { id: 1, user: "Alex Mercer", tool: "ATS Resume Analyzer", tokens: 1240, status: "SUCCESS", timestamp: new Date().toLocaleString() },
    { id: 2, user: "Alex Mercer", tool: "Skill Gap Analyzer", tokens: 2150, status: "SUCCESS", timestamp: new Date().toLocaleString() },
    { id: 3, user: "Alex Mercer", tool: "AI Mock Interview Setup", tokens: 850, status: "SUCCESS", timestamp: new Date().toLocaleString() },
    { id: 4, user: "Alex Mercer", tool: "AI HR screening simulation", tokens: 420, status: "SUCCESS", timestamp: new Date().toLocaleString() }
  ]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
          AI Token & Usage Logs
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Monitor active OpenAI API requests, processed tokens, and query responses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total AI Requests</p>
          <p className="text-3xl font-bold font-display text-indigo-500 mt-1">482 Queries</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tokens Consumed</p>
          <p className="text-3xl font-bold font-display text-emerald-500 mt-1">682,450</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Latency</p>
          <p className="text-3xl font-bold font-display text-purple-500 mt-1">824 ms</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">AI Tool Module</th>
                <th className="py-3 px-4">Tokens Used</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{log.user}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-zinc-400">{log.tool}</td>
                  <td className="py-4 px-4 font-mono">{log.tokens}</td>
                  <td className="py-4 px-4 text-slate-500">{log.timestamp}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-wider">
                      {log.status}
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
