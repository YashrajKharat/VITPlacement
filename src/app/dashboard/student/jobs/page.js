"use client";

import { useState, useEffect } from "react";
import { getStudentJobsAction } from "@/actions/dashboard";
import { applyToJobAction, bookmarkJobAction } from "@/actions/jobs";
import { predictPlacementProbabilityAction } from "@/actions/ai";
import { 
  Search, Briefcase, MapPin, DollarSign, Bookmark, 
  Sparkles, CheckCircle2, AlertCircle, Eye
} from "lucide-react";

export default function StudentJobsPage() {
  const [session, setSession] = useState(null);
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [selectedJob, setSelectedJob] = useState(null);

  // AI Shortlist Prediction States
  const [prediction, setPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (selectedJob && student) {
        setLoadingPrediction(true);
        setPrediction(null);
        try {
          const res = await predictPlacementProbabilityAction(student.id, selectedJob.id);
          if (res?.success) {
            setPrediction(res);
          }
        } catch (err) {
          console.error("Shortlist prediction error:", err);
        } finally {
          setLoadingPrediction(false);
        }
      } else {
        setPrediction(null);
      }
    };
    fetchPrediction();
  }, [selectedJob, student]);

  const loadJobsData = async () => {
    try {
      const res = await getStudentJobsAction();
      if (res?.success) {
        setSession(res.session);
        setStudent(res.student);
        setJobs(res.jobs || []);
        setBookmarks(res.bookmarks || []);
        setApplications(res.applications || []);
        setRecommendations(res.recommendations || []);
      }
    } catch (err) {
      console.error("Error loading jobs data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobsData();
  }, []);

  const handleApply = async (jobId) => {
    if (!student) return;
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("resumeUrl", student.resumeUrl || "https://res.cloudinary.com/demo/image/upload/sample_resume.pdf");

    const res = await applyToJobAction(formData);
    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.success) {
      setSuccessMsg("Application successfully submitted! Recruiter notified.");
      await loadJobsData();
      setSelectedJob(null);
    }
    setActionLoading(false);
  };

  const handleBookmark = async (jobId) => {
    if (!student) return;
    const isBookmarked = bookmarks.some(b => b.jobId === jobId);
    
    // Toggle locally for instant UI responsiveness
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(b => b.jobId !== jobId));
    } else {
      setBookmarks(prev => [...prev, { jobId }]);
    }

    const res = await bookmarkJobAction(jobId, !isBookmarked);
    if (res?.success) {
      await loadJobsData();
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading placement jobs board...</div>;
  }

  // Filter logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "ALL" || job.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      <div className="space-y-3">
        <div className="inline-block px-3 py-1 rounded-full border border-[#DD3333]/15 bg-[#DD3333]/5 text-[#DD3333] text-[9px] uppercase font-bold tracking-widest">
          [ ! ] Vidyalankar Institute of Technology • Active Drives
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-slate-800 uppercase tracking-tighter leading-none">
          Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DD3333] via-red-500 to-rose-600">Board.</span>
        </h1>
        <p className="text-xs text-slate-500">
          Apply to active software engineering and design openings verified by the Placement Officer.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-650 p-4 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="h-4.5 w-4.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-xs font-semibold">
          <AlertCircle className="h-4.5 w-4.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search & Filter header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search role, company or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40 focus:border-[#DD3333] text-slate-800 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {["ALL", "FULL_TIME", "INTERNSHIP"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer
                ${filterType === t 
                  ? "bg-[#DD3333] text-white border-transparent shadow-sm" 
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              {t === "ALL" && "All Jobs"}
              {t === "FULL_TIME" && "Full Time"}
              {t === "INTERNSHIP" && "Internships"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Job Cards list */}
        <div className="lg:col-span-2 space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80">
              <Briefcase className="h-12 w-12 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
              <p className="font-semibold text-slate-500 dark:text-zinc-400">No job drives found</p>
              <p className="text-xs text-slate-400 mt-1">Adjust search parameters or filters.</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isApplied = applications.some(a => a.jobId === job.id);
              const isBooked = bookmarks.some(b => b.jobId === job.id);
              const recomm = recommendations.find(r => r.jobId === job.id);

              return (
                <div 
                  key={job.id} 
                  className={`p-6 rounded-3xl border transition-all hover:shadow-md cursor-pointer text-left flex flex-col justify-between h-48
                    ${selectedJob?.id === job.id 
                      ? "bg-slate-50 border-purple-500 dark:bg-zinc-900/60" 
                      : "bg-white dark:bg-zinc-950 border-slate-200/80 dark:border-zinc-800/80"
                    }
                  `}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {job.company.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={job.company.logo} 
                          alt={job.company.name} 
                          className="h-12 w-12 rounded-xl object-cover bg-slate-100 dark:bg-zinc-900"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center font-bold text-indigo-500">
                          {job.company.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{job.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{job.company.name}</p>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(job.id);
                        }}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer
                          ${isBooked 
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20" 
                            : "border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                          }
                        `}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      {job.salaryRange || "Competitive"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[10px] font-semibold text-slate-600 dark:text-zinc-300">
                      {job.type}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-zinc-900 pt-3">
                    {recomm && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        <span>AI Match {recomm.matchScore}%</span>
                      </div>
                    )}
                    
                    <span 
                      className={`text-xs font-semibold
                        ${isApplied ? "text-emerald-500" : "text-slate-400"}
                      `}
                    >
                      {isApplied ? "✓ Applied" : "Click to view details"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Selected Job detail card */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 text-left space-y-6">
          {selectedJob ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">{selectedJob.title}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[9px] uppercase font-bold tracking-wider">
                    {selectedJob.type}
                  </span>
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{selectedJob.company.name}</p>
                <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-zinc-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {selectedJob.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" /> {selectedJob.salaryRange || "Competitive"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 dark:border-zinc-900 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About the Role</h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-h-40 overflow-y-auto">
                  {selectedJob.description}
                </p>
              </div>

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Requirements</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* AI Shortlist Predictor Card */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-zinc-900/30 rounded-2xl border border-black/5 text-xs text-left">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                  <Sparkles className="h-3.5 w-3.5 text-[#DD3333] animate-pulse" />
                  <span>AI Shortlist Probability</span>
                </h4>
                {loadingPrediction ? (
                  <div className="py-4 text-center space-y-2">
                    <div className="h-4 w-4 border-2 border-[#DD3333] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] text-slate-400">Evaluating compatibility score...</p>
                  </div>
                ) : prediction ? (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Match Probability</span>
                      <span className={`font-bold font-display text-sm
                        ${prediction.tier === "HIGH" ? "text-emerald-600" : prediction.tier === "MEDIUM" ? "text-amber-500" : "text-rose-500"}
                      `}>
                        {prediction.probability}% ({prediction.tier} FIT)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all
                          ${prediction.tier === "HIGH" ? "bg-emerald-500" : prediction.tier === "MEDIUM" ? "bg-amber-400" : "bg-rose-500"}
                        `} 
                        style={{ width: `${prediction.probability}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-550 dark:text-zinc-400 leading-relaxed font-sans pt-1">
                      {prediction.reason}
                    </p>
                    {prediction.tips?.length > 0 && (
                      <div className="pt-1.5 space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recommended Profile Optimization:</p>
                        <ul className="space-y-0.5 pl-3 list-disc text-[9px] text-slate-500 dark:text-zinc-400 leading-tight">
                          {prediction.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 py-1">Select a candidate profile and drive to calculate match.</p>
                )}
              </div>

              <div className="border-t border-slate-100 dark:border-zinc-900 pt-4">
                {applications.some(a => a.jobId === selectedJob.id) ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Applied Successfully</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(selectedJob.id)}
                    disabled={actionLoading}
                    className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-semibold text-xs shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <div className="h-3.5 w-3.5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Briefcase className="h-3.5 w-3.5" />
                    )}
                    <span>Apply to Drive</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <Briefcase className="h-10 w-10 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
              <p className="text-xs font-semibold">Select a job post from the list to view full description and apply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
