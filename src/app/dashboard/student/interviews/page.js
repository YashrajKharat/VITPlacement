"use client";

import { useState, useEffect } from "react";
import { getStudentInterviewsAction } from "@/actions/dashboard";
import { Calendar, Video, Clock, Building } from "lucide-react";

export default function StudentInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const res = await getStudentInterviewsAction();
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
    return <div className="text-center py-20 font-semibold text-slate-400">Loading student interview schedules...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
            My Scheduled Interviews
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Review upcoming technical assessments, coding review sessions, and HR screening rounds.
          </p>
        </div>

        <a
          href="/dashboard/student/interviews/simulator"
          className="px-4 py-2.5 rounded-2xl bg-[#DD3333] hover:bg-[#c52b2b] text-white text-xs font-bold shadow-md shadow-[#DD3333]/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <span>🎙️ Practice Live AI Simulator</span>
        </a>
      </div>

      {/* AI Practice Prompt Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-extrabold uppercase bg-red-500 text-white px-2 py-0.5 rounded-full">
            AI Voice 2.0
          </span>
          <h3 className="font-bold text-sm text-white">
            Simulate a Live Technical & Behavioral Interview with Speech AI
          </h3>
          <p className="text-xs text-slate-300">
            Practice real questions spoken aloud, test your camera posture, and get instant filler-word and STAR scorecards.
          </p>
        </div>
        <a
          href="/dashboard/student/interviews/simulator"
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold whitespace-nowrap"
        >
          Enter Simulator Studio
        </a>
      </div>

      <div className="space-y-4">
        {interviews.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80">
            <Calendar className="h-12 w-12 text-slate-300 dark:text-zinc-755 mx-auto mb-2" />
            <p className="font-semibold text-slate-500 dark:text-zinc-400">No interviews scheduled</p>
            <p className="text-xs text-slate-400 mt-1">You will receive an alert once a recruiter schedules a panel loop.</p>
          </div>
        ) : (
          interviews.map((int) => (
            <div 
              key={int.id}
              className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 grid md:grid-cols-4 gap-6 items-center"
            >
              <div className="md:col-span-2 space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                  {int.format} Interview Round
                </span>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {int.application?.job?.title || "Technical Engineer Interview"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                  <Building className="h-3.5 w-3.5" />
                  {int.recruiter?.company?.name || "Corporate Partner"}
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  {new Date(int.dateTime).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 mt-1">
                  <Clock className="h-4 w-4" />
                  {new Date(int.dateTime).toLocaleTimeString()} ({int.duration} mins)
                </span>
              </div>

              <div className="flex flex-col gap-2 justify-end">
                {int.status === "SCHEDULED" ? (
                  int.link ? (
                    <a 
                      href={int.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-xs font-semibold shadow text-center flex items-center justify-center gap-1.5 font-display"
                    >
                      <Video className="h-4 w-4" />
                      <span>Start Video Loop</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic text-center">Awaiting meeting coordinates</span>
                  )
                ) : (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider text-center w-fit self-end">
                    {int.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
