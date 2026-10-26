"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getSampleJobDescriptionsAction, 
  optimizeResumeAgainstJobAction,
  applyOptimizedResumeToProfileAction
} from "@/actions/aiResumeOptimizer";
import { getStudentProfileAction } from "@/actions/dashboard";
import { 
  Sparkles, CheckCircle2, ArrowLeft, Copy, Check, 
  Zap, ArrowRight, TrendingUp, AlertTriangle, FileText, 
  RefreshCw, Briefcase, ChevronRight, Layers, Sliders,
  Terminal, ExternalLink, Award, BadgeCheck, Bot, MapPin, DollarSign, Building2, Tag, ChevronDown
} from "lucide-react";

export default function ResumeOptimizerPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedDriveId, setSelectedDriveId] = useState("");
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [sampleJobs, setSampleJobs] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("experience"); // experience | projects | summary | skills

  useEffect(() => {
    const init = async () => {
      try {
        const [jobs, profileRes] = await Promise.all([
          getSampleJobDescriptionsAction(),
          getStudentProfileAction()
        ]);
        setSampleJobs(jobs || []);
        if (jobs && jobs.length > 0) {
          setSelectedDriveId(jobs[0].id);
          setSelectedDrive(jobs[0]);
          setJobDescription(jobs[0].description);
        }
        if (profileRes?.success && profileRes.student) {
          setResumeData(profileRes.student);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSelectDrive = (id) => {
    setSelectedDriveId(id);
    const found = sampleJobs.find(j => j.id === id);
    if (found) {
      setSelectedDrive(found);
      setJobDescription(found.description);
      setResult(null);
      setAppliedSuccess(false);
    }
  };

  const handleOptimize = async () => {
    if (!jobDescription || jobDescription.trim().length < 20) return;
    setOptimizing(true);
    setAppliedSuccess(false);
    try {
      const res = await optimizeResumeAgainstJobAction({
        jobDescription,
        resumeData
      });
      if (res?.success) {
        setResult(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyToProfile = async () => {
    if (!result) return;
    setApplying(true);
    try {
      const res = await applyOptimizedResumeToProfileAction({
        optimizedSummary: result.optimizedSummary,
        optimizedExperience: result.optimizedExperience,
        optimizedProjects: result.optimizedProjects,
        targetSkills: result.targetSkills || [],
        optimizedScore: result.optimizedScore
      });
      if (res?.success) {
        setAppliedSuccess(true);
        // Refresh local student resume data
        const profileRes = await getStudentProfileAction();
        if (profileRes?.success && profileRes.student) {
          setResumeData(profileRes.student);
        }
      }
    } catch (err) {
      console.error("Failed to apply optimized resume to profile:", err);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1C4980] mb-1">
            <Link href="/dashboard/student" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <span>•</span>
            <Link href="/dashboard/student/profile/resume-builder" className="hover:underline">
              Resume Builder
            </Link>
            <span>•</span>
            <span className="bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
              ATS 95%+ OPTIMIZER
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-7 w-7 text-amber-500" />
            AI "Instant ATS 95%+" Resume Optimizer
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Analyze any target Job Description (Data Analyst, SDE, Cloud, DevOps) and transform ordinary bullets into high-impact corporate accomplishments using the official <strong>Google XYZ Formula</strong>.
          </p>
        </div>

        {/* Top Action */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/student/profile/resume-builder"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>Open Resume Builder</span>
          </Link>
        </div>
      </div>

      {/* Google XYZ Formula Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900 via-[#1C4980] to-indigo-900 text-white shadow-md space-y-2">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Zap className="h-4 w-4" />
          The Official Google XYZ Formula for Top-Tier Resumes
        </div>
        <p className="text-sm md:text-base font-serif italic text-blue-50">
          "Accomplished <strong className="text-amber-300 font-sans not-italic">[X: Core Goal]</strong>, as measured by <strong className="text-amber-300 font-sans not-italic">[Y: Quantifiable Metric / %]</strong>, by doing <strong className="text-amber-300 font-sans not-italic">[Z: Technical Tools & Method]</strong>."
        </p>
        <p className="text-[11px] text-blue-200">
          Corporate ATS scanners and Tier-1 hiring managers score candidates significantly higher when achievements contain measurable metrics, power verbs, and exact skill matches against the target role.
        </p>
      </div>

      {/* Main Grid: Input Column vs Output Column */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Target Campus Drive Dropdown & Auto-Extracted Details */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#1C4980]" />
                Select Target Campus Drive / Internship
              </h3>
              <span className="text-[10px] font-bold bg-blue-50 text-[#1C4980] px-2.5 py-0.5 rounded-full">
                Auto-Extract JD
              </span>
            </div>

            {/* Dropdown Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Choose Posted Drive / Opening
              </label>
              <div className="relative">
                <select
                  value={selectedDriveId}
                  onChange={(e) => handleSelectDrive(e.target.value)}
                  className="w-full appearance-none pl-3.5 pr-10 py-3 rounded-2xl border border-slate-300 bg-slate-50/80 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 focus:border-[#1C4980] cursor-pointer shadow-xs transition-all"
                >
                  <optgroup label="💼 Full-Time Campus Placement Drives">
                    {sampleJobs.filter(j => j.type !== "INTERNSHIP").map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.company} — {job.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🎓 Campus Internship Drives">
                    {sampleJobs.filter(j => j.type === "INTERNSHIP").map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.company} — {job.title}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Auto-Extracted Details Card */}
            {selectedDrive && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/90 text-left animate-in fade-in duration-200">
                {/* Company & Role Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <span className="text-base">{selectedDrive.companyLogo || "🏢"}</span>
                      <span>{selectedDrive.company}</span>
                    </div>
                    <p className="text-xs font-extrabold text-[#1C4980] mt-0.5">
                      {selectedDrive.title}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shrink-0">
                    {selectedDrive.categoryLabel || (selectedDrive.type === "INTERNSHIP" ? "Internship" : "Full-Time")}
                  </span>
                </div>

                {/* Location & Package Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium text-slate-600">
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedDrive.location}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 font-bold text-emerald-700">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{selectedDrive.package}</span>
                  </span>
                </div>

                {/* Extracted Key Skills */}
                {selectedDrive.extractedSkills && selectedDrive.extractedSkills.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Tag className="h-3 w-3 text-[#1C4980]" />
                      Target Skills Extracted:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedDrive.extractedSkills.map((sk, idx) => (
                        <span key={idx} className="text-[10px] font-bold bg-white text-[#1C4980] border border-blue-200/80 px-2 py-0.5 rounded-md shadow-2xs">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Requirements Preview */}
                {selectedDrive.requirements && selectedDrive.requirements.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Key Eligibility & Requirements:
                    </span>
                    <ul className="space-y-1 pl-1 text-[11px] text-slate-600 leading-snug">
                      {selectedDrive.requirements.slice(0, 3).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Full Extracted Description Drawer/Preview */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Auto-Extracted Description:
                  </span>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 max-h-36 overflow-y-auto text-[11px] text-slate-600 leading-relaxed font-mono">
                    {selectedDrive.description}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleOptimize}
                disabled={optimizing || !jobDescription}
                className="w-full py-3.5 rounded-2xl bg-[#1C4980] hover:bg-[#153862] text-white font-extrabold text-xs shadow-md shadow-[#1C4980]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {optimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Extracting Keywords & Rewriting Bullets...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 text-amber-300" />
                    <span>Scan JD & Rewrite Bullets to ATS 95%+</span>
                  </>
                )}
              </button>

              {/* Consult AI Placement Coach Button */}
              {selectedDrive && (
                <Link
                  href={`/dashboard/student/ai-coach?jobId=${selectedDrive.id}&company=${encodeURIComponent(selectedDrive.company)}&role=${encodeURIComponent(selectedDrive.title)}`}
                  className="w-full py-2.5 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
                >
                  <Bot className="h-4 w-4 text-amber-600" />
                  <span>Ask AI Placement Coach About This Drive</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Score Comparison & Rewritten Bullets */}
        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4 shadow-xs">
              <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-3xl font-bold">
                ⚡
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">Ready to Supercharge Your Resume</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a campus job description on the left or paste your own JD, then click <strong>"Scan JD & Rewrite Bullets"</strong> to see your live score increase from ~60% to 95%+.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* ATS Score Differential Meter */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Live ATS Match Scoring</span>
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        result.domain === "DATA_ANALYTICS" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-[#1C4980]"
                      }`}>
                        {result.domain === "DATA_ANALYTICS" ? "📊 Data Analytics & BI Role" : "💻 Software & Cloud Engineering"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">Automated Parser Compatibility</h3>
                  </div>

                  {/* Score Delta Badges */}
                  <div className="flex items-center gap-3">
                    <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Original</p>
                      <p className="text-lg font-black text-slate-600">{result.initialScore}%</p>
                    </div>

                    <ArrowRight className="h-5 w-5 text-emerald-500" />

                    <div className="text-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase">Optimized</p>
                      <p className="text-2xl font-black text-emerald-700">+{result.optimizedScore}%</p>
                    </div>
                  </div>
                </div>

                {/* Keywords Analysis */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-emerald-700 mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Matched Target Keywords ({result.matchedKeywords?.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.matchedKeywords?.length === 0 ? (
                        <span className="text-[10px] text-slate-400 italic">None present in current raw text</span>
                      ) : (
                        result.matchedKeywords?.map((kw, idx) => (
                          <span key={idx} className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ {kw}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {result.missingKeywords?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase text-amber-700 mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Missing Skills Injected into Deliverables ({result.missingKeywords?.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.missingKeywords?.map((kw, idx) => (
                          <span key={idx} className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                            + {kw.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Applied Success Callout Banner */}
              {appliedSuccess && (
                <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
                      <BadgeCheck className="h-5 w-5 text-emerald-600" />
                      Successfully Applied to Your Student Profile & Resume!
                    </p>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Updated Summary, <strong>{result.optimizedExperience?.length || 2} Experience items</strong>, <strong>{result.optimizedProjects?.length || 2} Projects</strong>, and <strong>{result.targetSkills?.length || 0} Target Skills</strong>. ATS Score set to <strong>{result.optimizedScore}%</strong>.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/student/profile/resume-builder"
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 whitespace-nowrap shadow-sm transition-all"
                  >
                    <span>View in Resume Builder</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              {/* Tabs for Rewritten Bullets */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl flex-wrap">
                    <button
                      onClick={() => setActiveTab("experience")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "experience" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Experience Bullets ({result.optimizedExperience?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "projects" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Project Bullets ({result.optimizedProjects?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("summary")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "summary" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Summary
                    </button>
                    <button
                      onClick={() => setActiveTab("skills")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "skills" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Target Skills ({result.targetSkills?.length || 0})
                    </button>
                  </div>

                  <button
                    onClick={handleApplyToProfile}
                    disabled={applying}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                  >
                    {applying ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : appliedSuccess ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Zap className="h-3.5 w-3.5 text-amber-300" />
                    )}
                    <span>{appliedSuccess ? "Sync Again to Profile" : "Apply to My Resume"}</span>
                  </button>
                </div>

                {/* 1. Experience Tab */}
                {activeTab === "experience" && (
                  <div className="space-y-4">
                    {result.optimizedExperience?.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-slate-900">{exp.role} @ {exp.company}</p>
                          <span className="text-[9px] font-extrabold bg-blue-100 text-[#1C4980] px-2 py-0.5 rounded-full">
                            Google XYZ Formula
                          </span>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                          {exp.bullets?.map((b, bIdx) => (
                            <li key={bIdx} className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex items-start justify-between gap-3 group">
                              <span className="flex-1">{b}</span>
                              <button
                                onClick={() => handleCopy(b, `exp-${idx}-${bIdx}`)}
                                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-all cursor-pointer flex-shrink-0"
                                title="Copy Bullet Point"
                              >
                                {copiedKey === `exp-${idx}-${bIdx}` ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Projects Tab */}
                {activeTab === "projects" && (
                  <div className="space-y-4">
                    {result.optimizedProjects?.map((proj, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-slate-900">{proj.title}</p>
                            <p className="text-[10px] font-mono text-emerald-700 font-bold">{proj.tech}</p>
                          </div>
                          <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Quantified Output
                          </span>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                          {proj.bullets?.map((b, bIdx) => (
                            <li key={bIdx} className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex items-start justify-between gap-3">
                              <span className="flex-1">{b}</span>
                              <button
                                onClick={() => handleCopy(b, `proj-${idx}-${bIdx}`)}
                                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-all cursor-pointer flex-shrink-0"
                                title="Copy Bullet Point"
                              >
                                {copiedKey === `proj-${idx}-${bIdx}` ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Summary Tab */}
                {activeTab === "summary" && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">Tailored Professional Summary</p>
                      <button
                        onClick={() => handleCopy(result.optimizedSummary, "summary")}
                        className="text-xs text-[#1C4980] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "summary" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedKey === "summary" ? "Copied" : "Copy Summary"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed p-3 bg-white rounded-xl border border-slate-200 font-serif italic">
                      "{result.optimizedSummary}"
                    </p>
                  </div>
                )}

                {/* 4. Skills Tab */}
                {activeTab === "skills" && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">Target Role Skills Stack ({result.targetSkills?.length})</p>
                      <button
                        onClick={() => handleCopy(result.targetSkills?.join(", "), "skills-all")}
                        className="text-xs text-[#1C4980] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "skills-all" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedKey === "skills-all" ? "Copied All" : "Copy All Skills"}</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {result.targetSkills?.map((skill, sIdx) => (
                        <span key={sIdx} className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl shadow-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

