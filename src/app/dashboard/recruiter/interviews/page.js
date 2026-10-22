"use client";

import { useState, useEffect } from "react";
import { getRecruiterInterviewsAction } from "@/actions/dashboard";
import { Calendar, Video, Clock, User } from "lucide-react";

export default function RecruiterInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const res = await getRecruiterInterviewsAction();
        if (res?.success) {
          setInterviews(res.interviews || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInterviews();
  }, []);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading scheduler calendar...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
          Interview Panels Scheduled
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Review details, format types, and coordinates of student rounds you have scheduled.
        </p>
      </div>

      <div className="space-y-4">
        {interviews.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80">
            <Calendar className="h-12 w-12 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="font-semibold text-slate-500 dark:text-zinc-400">No scheduled panels</p>
            <p className="text-xs text-slate-400 mt-1">Setup mock rounds from the Recruiter Overview board.</p>
          </div>
        ) : (
          interviews.map((int) => (
            <div 
              key={int.id}
              className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 grid md:grid-cols-4 gap-6 items-center"
            >
              <div className="md:col-span-2 space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                  {int.format} Interview Loop
                </span>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  Candidate: {int.student?.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {int.student?.department} • CGPA: {int.student?.cgpa || "N/A"}
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 font-semibold">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  {new Date(int.dateTime).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 mt-1">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  {new Date(int.dateTime).toLocaleTimeString()} ({int.duration} mins)
                </span>
              </div>

              <div className="flex flex-col gap-2 justify-end">
                {int.link && (
                  <a 
                    href={int.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-200 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Open Room Link</span>
                  </a>
                )}
                
                <span className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-wider text-center w-full block">
                  {int.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
