"use client";

import { useState, useEffect } from "react";
import { getRecruiterDashboardAction } from "@/actions/dashboard";
import { 
  updateApplicationStatusAction, 
  scheduleInterviewAction, 
  uploadOfferLetterAction,
  updateJobAction,
  deleteJobAction
} from "@/actions/jobs";
import { 
  Users, Calendar, Check, X, Video, Send, 
  Plus, RefreshCw, Edit2, Trash2, FileText, ExternalLink
} from "lucide-react";

export default function RecruiterDashboard() {
  const [session, setSession] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  // Interview Modals
  const [showIntModal, setShowIntModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [intDateTime, setIntDateTime] = useState("");
  const [intFormat, setIntFormat] = useState("ONLINE");
  const [intLink, setIntLink] = useState("https://zoom.us/j/999999");
  
  // Offer Modals
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPackage, setOfferPackage] = useState("15 LPA");

  // Edit Job Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSalaryRange, setEditSalaryRange] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editType, setEditType] = useState("FULL_TIME");
  const [editRequirements, setEditRequirements] = useState([]);
  const [editReqInput, setEditReqInput] = useState("");

  const loadRecruiterData = async () => {
    try {
      const res = await getRecruiterDashboardAction();
      if (res?.success) {
        setSession(res.session);
        setRecruiter(res.recruiter);
        setApplications(res.applications || []);
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiterData();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    setActionLoading(appId);
    const res = await updateApplicationStatusAction(appId, newStatus);
    if (res?.success) {
      await loadRecruiterData();
    }
    setActionLoading("");
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    
    setActionLoading(selectedApp.id);
    const res = await scheduleInterviewAction({
      applicationId: selectedApp.id,
      studentId: selectedApp.studentId,
      dateTime: intDateTime,
      duration: 45,
      format: intFormat,
      link: intLink
    });

    if (res?.success) {
      await updateApplicationStatusAction(selectedApp.id, "SHORTLISTED");
      await loadRecruiterData();
      setShowIntModal(false);
    }
    setActionLoading("");
  };

  const handleUploadOffer = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setActionLoading(selectedApp.id);
    const res = await uploadOfferLetterAction({
      applicationId: selectedApp.id,
      studentId: selectedApp.studentId,
      offerLetterUrl: "https://cloudinary.com/dummy/offer_letter.pdf",
      packageVal: offerPackage
    });

    if (res?.success) {
      await loadRecruiterData();
      setShowOfferModal(false);
    }
    setActionLoading("");
  };

  const handleEditJobSubmit = async (e) => {
    e.preventDefault();
    if (!editingJob) return;

    setActionLoading(editingJob.id);
    const res = await updateJobAction(editingJob.id, {
      title: editTitle,
      description: editDescription,
      salaryRange: editSalaryRange,
      location: editLocation,
      type: editType,
      requirements: editRequirements
    });

    if (res?.success) {
      await loadRecruiterData();
      setShowEditModal(false);
    }
    setActionLoading("");
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) return;
    setActionLoading(jobId);
    const res = await deleteJobAction(jobId);
    if (res?.success) {
      await loadRecruiterData();
    }
    setActionLoading("");
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading recruiter workspace...</div>;
  }

  if (!recruiter) {
    return <div className="text-center py-20">Recruiter profile not found. Verify company registration.</div>;
  }

  const activeApps = applications.filter(a => a.status === "APPLIED").length;
  const shortApps = applications.filter(a => a.status === "SHORTLISTED").length;
  const offerApps = applications.filter(a => a.status === "OFFERED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Header welcome banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
            Recruiting Dashboard, {recruiter.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Designation: <span className="font-semibold text-slate-700 dark:text-slate-300">{recruiter.designation}</span> • Company: <span className="font-semibold text-slate-700 dark:text-slate-300">{recruiter.company?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span 
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border
              ${(recruiter.isVerified || recruiter.company?.isVerified) 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              }
            `}
          >
            {(recruiter.isVerified || recruiter.company?.isVerified) ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Verified Employer</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Pending TPO Approval</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Recruitment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Positions Open</p>
          <p className="text-3xl font-bold font-display text-slate-800 dark:text-slate-200 mt-1">{jobs.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Applicants</p>
          <p className="text-3xl font-bold font-display text-indigo-500 mt-1">{activeApps}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shortlisted Candidates</p>
          <p className="text-3xl font-bold font-display text-amber-500 mt-1">{shortApps}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offers Rolled Out</p>
          <p className="text-3xl font-bold font-display text-emerald-500 mt-1">{offerApps}</p>
        </div>
      </div>

      {/* Applications lists */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80">
        <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100 mb-4">Job Applicants Review</h2>

        {applications.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Users className="h-10 w-10 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="text-xs font-semibold">No candidates have applied to your active drives yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Role Applied</th>
                  <th className="py-3 px-4">Academic Rating</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/50">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {app.student?.name}
                      <p className="text-[10px] font-normal text-slate-400">{app.student?.department} ({app.student?.batch})</p>
                      {(app.resumeUrl || app.student?.resumeUrl) && (
                        <a
                          href={app.resumeUrl || app.student?.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <FileText className="h-3 w-3" />
                          <span>View Resume</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-zinc-400">{app.job?.title}</td>
                    <td className="py-4 px-4 font-semibold">{app.student?.cgpa || "N/A"} CGPA</td>
                    <td className="py-4 px-4">
                      <span 
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                          ${app.status === "APPLIED" && "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"}
                          ${app.status === "SHORTLISTED" && "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400"}
                          ${app.status === "REJECTED" && "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"}
                          ${app.status === "OFFERED" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"}
                        `}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-1">
                      {app.status === "APPLIED" && (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setIntDateTime(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
                              setShowIntModal(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-750 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer font-display"
                          >
                            <Calendar className="h-3 w-3" /> Schedule Interview
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, "REJECTED")}
                            className="p-1.5 rounded-lg bg-rose-50/20 border border-rose-100 dark:border-rose-950/30 text-rose-500 hover:bg-rose-50/40 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      
                      {app.status === "SHORTLISTED" && (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setShowOfferModal(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer font-display"
                          >
                            <Send className="h-3 w-3" /> Roll Offer
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, "REJECTED")}
                            className="p-1.5 rounded-lg bg-rose-50/20 border border-rose-100 dark:border-rose-950/30 text-rose-500 hover:bg-rose-50/40 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      {app.status === "OFFERED" && (
                        <span className="text-[10px] text-slate-400 italic font-semibold pr-2">Offer Released</span>
                      )}

                      {app.status === "REJECTED" && (
                        <span className="text-[10px] text-rose-500 font-semibold pr-2">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Posted Job Drives */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">Your Active Job Drives</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-650 rounded-full font-mono">
            {jobs.length} Positions
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <RefreshCw className="h-10 w-10 text-slate-350 mx-auto mb-2" />
            <p className="text-xs font-semibold">No active job drives posted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => {
              const jobApps = applications.filter(a => a.jobId === job.id);
              return (
                <div key={job.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-250/60 dark:border-zinc-800/80 flex flex-col justify-between gap-3 text-left">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{job.title}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingJob(job);
                            setEditTitle(job.title);
                            setEditDescription(job.description);
                            setEditSalaryRange(job.salaryRange || job.salary || "");
                            setEditLocation(job.location);
                            setEditType(job.type || "FULL_TIME");
                            setEditRequirements(job.requirements || []);
                            setEditReqInput("");
                            setShowEditModal(true);
                          }}
                          className="p-1 rounded-lg bg-slate-200/50 hover:bg-slate-200 text-slate-600 cursor-pointer"
                          title="Edit Job"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-1 rounded-lg bg-rose-50/50 hover:bg-rose-100 text-rose-500 border border-rose-105 cursor-pointer"
                          title="Delete Job"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">{job.location} • {job.salaryRange || job.salary} LPA</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-zinc-800 text-[10px] text-slate-550">
                    <span>Applicants: <strong className="text-[#DD3333]">{jobApps.length}</strong></span>
                    <span className="text-slate-400">Posted on: {new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SCHEDULE INTERVIEW MODAL */}
      {showIntModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full text-left space-y-4 animate-in zoom-in duration-200">
            <h3 className="font-bold font-display text-slate-800 dark:text-slate-200 text-base">Schedule Interview Round</h3>
            <p className="text-xs text-slate-400">Setup coding assessment or design screening panel coordinates.</p>
            
            <form onSubmit={handleScheduleInterview} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={intDateTime}
                  onChange={(e) => setIntDateTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs rounded-xl focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Format</label>
                <select
                  value={intFormat}
                  onChange={(e) => setIntFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs rounded-xl focus:outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="ONLINE">Online Video Round</option>
                  <option value="IN_PERSON">In Person Campus Drive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Meeting Link / Room</label>
                <input
                  type="text"
                  required
                  value={intLink}
                  onChange={(e) => setIntLink(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs rounded-xl focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowIntModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-zinc-800 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl font-display"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROLL OFFER MODAL */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full text-left space-y-4 animate-in zoom-in duration-200">
            <h3 className="font-bold font-display text-slate-800 dark:text-slate-200 text-base">Roll Out Job Offer</h3>
            <p className="text-xs text-slate-400">Upload official contract detail details.</p>
            
            <form onSubmit={handleUploadOffer} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Package Value (CTC)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18 LPA"
                  value={offerPackage}
                  onChange={(e) => setOfferPackage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs rounded-xl focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-zinc-800 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl font-display"
                >
                  Upload & Roll Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT JOB MODAL */}
      {showEditModal && editingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full text-left space-y-4 animate-in zoom-in duration-200">
            <h3 className="font-bold font-display text-slate-800 dark:text-slate-200 text-base">Edit Job Posting</h3>
            <p className="text-xs text-slate-400">Modify requirements, locations, or package parameters for this drive.</p>
            
            <form onSubmit={handleEditJobSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Job Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs rounded-xl focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Location</label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs rounded-xl focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Salary Range (CTC in LPA)</label>
                  <input
                    type="text"
                    required
                    value={editSalaryRange}
                    onChange={(e) => setEditSalaryRange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs rounded-xl focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Job Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs rounded-xl focus:outline-none text-slate-800 dark:text-slate-200"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>
              </div>

              {/* Skills / Requirements */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400">Required Skills & Keywords</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editReqInput}
                    onChange={(e) => setEditReqInput(e.target.value)}
                    placeholder="e.g. Next.js, Python, AWS"
                    className="flex-1 px-3 py-1.5 border border-slate-250 dark:border-zinc-800 bg-transparent text-xs rounded-xl focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!editReqInput.trim()) return;
                      setEditRequirements([...editRequirements, editReqInput.trim()]);
                      setEditReqInput("");
                    }}
                    className="px-3 py-1.5 bg-[#DD3333] hover:bg-[#DD3333]/90 text-white rounded-xl text-xs font-bold font-display cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {editRequirements.map((req, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-350 text-[10px] rounded-lg flex items-center gap-1.5 border border-slate-200/50"
                    >
                      <span>{req}</span>
                      <button
                        type="button"
                        onClick={() => setEditRequirements(editRequirements.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-750 font-bold text-[9px] cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Job Description</label>
                <textarea
                  required
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs rounded-xl focus:outline-none text-slate-850 dark:text-slate-200 leading-relaxed"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-zinc-800 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === editingJob.id}
                  className="px-4 py-2 bg-[#DD3333] hover:bg-[#DD3333]/90 text-white font-semibold text-xs rounded-xl font-display flex items-center gap-1 cursor-pointer"
                >
                  {actionLoading === editingJob.id && <RefreshCw className="h-3 w-3 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
