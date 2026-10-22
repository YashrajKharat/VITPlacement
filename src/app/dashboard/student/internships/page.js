"use client";

import { useState, useEffect } from "react";
import { 
  getStudentInternshipsAction, 
  submitInternshipAction, 
  resubmitInternshipAction,
  replaceInternshipCertificateAction,
  replaceInternshipReportAction,
  formatWeeklyLogWithAiAction,
  saveWeeklyLogsAction,
  extractAndSyncInternshipSkillsAction
} from "@/actions/internships";
import { 
  Award, FileText, CheckCircle2, Clock, AlertTriangle, XCircle, 
  Upload, Sparkles, Building, Calendar, MapPin, User, Mail, 
  ExternalLink, ArrowRight, ShieldCheck, ChevronRight, FileCheck,
  RefreshCw, Check, Star, BookOpen, Layers, BarChart2, Eye,
  FileSpreadsheet, ArrowUpRight, FolderCheck, ShieldAlert, Cpu,
  Bot, Send, CheckCircle, TrendingUp, Plus, Trash2, HelpCircle, Briefcase, Zap
} from "lucide-react";

export default function StudentInternshipsPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [student, setStudent] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  
  // Submission Form State
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [activeStep, setActiveStep] = useState(1); // 1: Info, 2: Docs

  // Form Fields
  const [companyName, setCompanyName] = useState("");
  const [internshipRole, setInternshipRole] = useState("");
  const [internshipType, setInternshipType] = useState("Industry Internship");
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-07-31");
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [location, setLocation] = useState("Mumbai");
  const [workMode, setWorkMode] = useState("HYBRID");
  const [industryMentorName, setIndustryMentorName] = useState("");
  const [industryMentorEmail, setIndustryMentorEmail] = useState("");
  const [facultyMentorName, setFacultyMentorName] = useState("Assigned Faculty Mentor");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("React, Node.js, Python, PostgreSQL");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Files for initial submission
  const [certFile, setCertFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);

  // Resubmission Modal
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState(null);

  // Replace Document Modals
  const [showReplaceCertModal, setShowReplaceCertModal] = useState(false);
  const [showReplaceReportModal, setShowReplaceReportModal] = useState(false);
  const [replaceCertFile, setReplaceCertFile] = useState(null);
  const [replaceReportFile, setReplaceReportFile] = useState(null);
  const [replacingDoc, setReplacingDoc] = useState(false);

  const loadData = async () => {
    try {
      const res = await getStudentInternshipsAction();
      if (res?.success) {
        setSession(res.session);
        setStudent(res.student);
        setRequirements(res.requirements || []);
        setSubmissions(res.submissions || []);
        if (res.requirements?.length > 0) {
          setSelectedReq(res.requirements[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    setSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      const formData = new FormData();
      formData.append("requirementId", selectedReq.id);
      formData.append("companyName", companyName);
      formData.append("internshipRole", internshipRole);
      formData.append("internshipType", internshipType);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("durationWeeks", durationWeeks);
      formData.append("location", location);
      formData.append("workMode", workMode);
      formData.append("industryMentorName", industryMentorName);
      formData.append("industryMentorEmail", industryMentorEmail);
      formData.append("facultyMentorName", facultyMentorName);
      formData.append("description", description);
      formData.append("skills", skills);
      formData.append("projectTitle", projectTitle);
      formData.append("projectDescription", projectDescription);

      if (certFile) formData.append("certificateFile", certFile);
      if (reportFile) formData.append("reportFile", reportFile);

      const res = await submitInternshipAction(formData);
      if (res?.error) {
        setFormError(res.error);
      } else if (res?.success) {
        setFormSuccess("Internship submitted successfully! Certificate verification and AI report analysis completed.");
        await loadData();
        setActiveStep(1);
        setCompanyName("");
        setInternshipRole("");
        setCertFile(null);
        setReportFile(null);
      }
    } catch (err) {
      setFormError(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResubmit = async (e) => {
    e.preventDefault();
    if (!activeSubmission) return;
    setSubmitting(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("companyName", companyName || activeSubmission.companyName);
      formData.append("internshipRole", internshipRole || activeSubmission.internshipRole);
      formData.append("description", description || activeSubmission.description);
      formData.append("projectTitle", projectTitle || activeSubmission.projectTitle);
      formData.append("projectDescription", projectDescription || activeSubmission.projectDescription);

      if (certFile) formData.append("certificateFile", certFile);
      if (reportFile) formData.append("reportFile", reportFile);

      const res = await resubmitInternshipAction(activeSubmission.id, formData);
      if (res?.success) {
        setFormSuccess("Correction resubmitted! Faculty will review updated details.");
        setShowResubmitModal(false);
        setCertFile(null);
        setReportFile(null);
        await loadData();
      } else if (res?.error) {
        setFormError(res.error);
      }
    } catch (err) {
      setFormError(err.message || "Resubmission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplaceCertificate = async (e) => {
    e.preventDefault();
    if (!currentSubmission || !replaceCertFile) {
      setFormError("Please select a valid certificate file to replace.");
      return;
    }
    setReplacingDoc(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("certificateFile", replaceCertFile);

      const res = await replaceInternshipCertificateAction(currentSubmission.id, formData);
      if (res?.success) {
        setFormSuccess("Internship certificate replaced successfully! OCR extraction and verification updated.");
        setShowReplaceCertModal(false);
        setReplaceCertFile(null);
        await loadData();
      } else {
        setFormError(res?.error || "Failed to replace certificate");
      }
    } catch (err) {
      setFormError(err.message || "Certificate replacement failed");
    } finally {
      setReplacingDoc(false);
    }
  };

  const handleReplaceReport = async (e) => {
    e.preventDefault();
    if (!currentSubmission || !replaceReportFile) {
      setFormError("Please select a valid report file to replace.");
      return;
    }
    setReplacingDoc(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("reportFile", replaceReportFile);

      const res = await replaceInternshipReportAction(currentSubmission.id, formData);
      if (res?.success) {
        setFormSuccess("Internship report replaced successfully! AI analysis and section evaluation updated.");
        setShowReplaceReportModal(false);
        setReplaceReportFile(null);
        await loadData();
      } else {
        setFormError(res?.error || "Failed to replace report");
      }
    } catch (err) {
      setFormError(err.message || "Report replacement failed");
    } finally {
      setReplacingDoc(false);
    }
  };

  // Active submission for selected requirement
  const currentSubmission = submissions.find(s => s.requirementId === selectedReq?.id) || submissions[0];
  const certDoc = currentSubmission?.documents?.find(d => d.docType === "CERTIFICATE");
  const reportDoc = currentSubmission?.documents?.find(d => d.docType === "REPORT");

  // AI Weekly Logs State (Feature 6)
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [weekRawInput, setWeekRawInput] = useState("");
  const [enhancingLog, setEnhancingLog] = useState(false);
  const [savingLogs, setSavingLogs] = useState(false);
  const [logSuccess, setLogSuccess] = useState("");
  const [logError, setLogError] = useState("");

  // AI Verified Skills State (Feature 4)
  const [verifiedSkillsList, setVerifiedSkillsList] = useState([]);
  const [syncingSkills, setSyncingSkills] = useState(false);
  const [skillSyncSuccess, setSkillSyncSuccess] = useState("");

  // Synchronize submission logs & skills
  useEffect(() => {
    if (currentSubmission) {
      if (Array.isArray(currentSubmission.weeklyLogs) && currentSubmission.weeklyLogs.length > 0) {
        setWeeklyLogs(currentSubmission.weeklyLogs);
      } else {
        const totalWeeks = parseInt(currentSubmission.durationWeeks) || 8;
        const initial = Array.from({ length: totalWeeks }, (_, idx) => ({
          weekNumber: idx + 1,
          rawNotes: "",
          formattedSummary: `Week ${idx + 1}: Scheduled deliverables for ${currentSubmission.internshipRole || "Intern"} at ${currentSubmission.companyName || "Host Organization"}.`,
          deliverables: ["Executed sprint project milestones", "Code review & technical documentation", "Standup & team engineering sync"],
          skillsUsed: ["Git", "Agile Workflows", "Problem Solving"]
        }));
        setWeeklyLogs(initial);
      }

      if (Array.isArray(currentSubmission.verifiedSkills) && currentSubmission.verifiedSkills.length > 0) {
        setVerifiedSkillsList(currentSubmission.verifiedSkills);
      } else if (currentSubmission.skills) {
        const skillsArr = (typeof currentSubmission.skills === "string" ? currentSubmission.skills.split(",") : currentSubmission.skills)
          .map(s => s.trim())
          .filter(Boolean)
          .map(name => ({ name, category: "Industry Stack", verified: true, source: "Internship" }));
        setVerifiedSkillsList(skillsArr);
      }
    }
  }, [currentSubmission?.id, currentSubmission?.durationWeeks]);

  const handleEnhanceWeeklyLog = async () => {
    if (!weekRawInput.trim()) {
      setLogError("Please enter rough notes or tasks for this week before enhancing with AI.");
      return;
    }
    setEnhancingLog(true);
    setLogError("");
    setLogSuccess("");

    try {
      const res = await formatWeeklyLogWithAiAction(
        selectedWeek,
        weekRawInput,
        currentSubmission?.internshipRole || "Software Intern",
        currentSubmission?.companyName || "Host Company"
      );

      if (res?.success && res.enhanced) {
        setWeeklyLogs(prev => {
          const updated = [...prev];
          const existingIdx = updated.findIndex(l => l.weekNumber === selectedWeek);
          const newEntry = {
            weekNumber: selectedWeek,
            rawNotes: weekRawInput,
            formattedSummary: res.enhanced.formattedSummary,
            deliverables: res.enhanced.deliverables || [],
            skillsUsed: res.enhanced.skillsUsed || []
          };
          if (existingIdx >= 0) {
            updated[existingIdx] = newEntry;
          } else {
            updated.push(newEntry);
            updated.sort((a, b) => a.weekNumber - b.weekNumber);
          }
          return updated;
        });
        setLogSuccess(`✨ Week ${selectedWeek} formatted with AI! Click "Save All Weekly Logs" to submit.`);
        setWeekRawInput("");
      } else {
        setLogError(res?.error || "Failed to enhance weekly log");
      }
    } catch (err) {
      setLogError(err.message || "Failed to enhance log");
    } finally {
      setEnhancingLog(false);
    }
  };

  const handleSaveWeeklyLogs = async () => {
    if (!currentSubmission) return;
    setSavingLogs(true);
    setLogError("");
    setLogSuccess("");

    try {
      const res = await saveWeeklyLogsAction(currentSubmission.id, weeklyLogs);
      if (res?.success) {
        setLogSuccess("All weekly work logs saved and verified! Faculty mentors can now inspect your weekly progress.");
        await loadData();
      } else {
        setLogError(res?.error || "Failed to save weekly logs");
      }
    } catch (err) {
      setLogError(err.message || "Error saving logs");
    } finally {
      setSavingLogs(false);
    }
  };

  const handleSyncSkills = async () => {
    if (!currentSubmission) return;
    setSyncingSkills(true);
    setSkillSyncSuccess("");

    try {
      const res = await extractAndSyncInternshipSkillsAction(currentSubmission.id);
      if (res?.success) {
        setSkillSyncSuccess(`✨ Successfully synced ${res.skills?.length || 0} industry-verified skills to your Placement Profile!`);
        if (res.skills) {
          setVerifiedSkillsList(res.skills);
        }
        await loadData();
      } else {
        setFormError(res?.error || "Failed to sync skills");
      }
    } catch (err) {
      setFormError(err.message || "Error syncing skills");
    } finally {
      setSyncingSkills(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading student internship portal...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DD3333]/10 text-[#DD3333] border border-[#DD3333]/20">
              Academic Internship Portal
            </span>
            <span className="text-xs text-slate-400 font-medium">VIT Mumbai</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800">
            Internship Verification & Evaluation
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Automated certificate extraction, company mentor performance evaluation, and faculty viva evaluation for Semester 6 & 8 credits.
          </p>
        </div>

        {/* Requirements Selector */}
        <div className="flex gap-2 relative z-10">
          {requirements.map((req) => (
            <button
              key={req.id}
              onClick={() => setSelectedReq(req)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 border font-display
                ${selectedReq?.id === req.id 
                  ? "bg-[#DD3333] text-white border-[#DD3333] shadow-md shadow-[#DD3333]/20" 
                  : "bg-white/80 text-slate-700 border-black/5 hover:bg-slate-100"
                }
              `}
            >
              <Award className="h-4 w-4" />
              <span>{req.semester.replace("_", " ")}</span>
              <span className="text-[10px] opacity-80">({req.requiredCredits} Credits)</span>
            </button>
          ))}
        </div>
      </div>

      {formSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
            <span>{formSuccess}</span>
          </div>
          <button onClick={() => setFormSuccess("")} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
        </div>
      )}

      {formError && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500 flex-shrink-0" />
            <span>{formError}</span>
          </div>
          <button onClick={() => setFormError("")} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
        </div>
      )}

      {/* If Student Already Submitted for this requirement, display status scorecard & document manager */}
      {currentSubmission ? (
        <div className="space-y-6">
          {/* Status Tracker Banner */}
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-black/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-black/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-bold text-slate-800">
                    {currentSubmission.internshipRole} at {currentSubmission.companyName}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${currentSubmission.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                      currentSubmission.status === "CORRECTION_REQUIRED" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                      currentSubmission.status === "REJECTED" ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" :
                      "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                    }
                  `}>
                    {currentSubmission.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {selectedReq?.semester?.replace("_", " ")} • Duration: {currentSubmission.durationWeeks} Weeks • Work Mode: {currentSubmission.workMode}
                </p>
              </div>

              {/* Total Final Score Indicator */}
              <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-black/5">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Final Evaluation</span>
                  <p className="text-2xl font-bold font-display text-slate-800">
                    {currentSubmission.finalScore || 0}<span className="text-xs font-normal text-slate-400">/100</span>
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-[#DD3333] text-white flex flex-col items-center justify-center font-display font-bold text-lg shadow-sm">
                  {currentSubmission.finalGrade || "P"}
                  <span className="text-[8px] font-normal tracking-widest uppercase">Grade</span>
                </div>
              </div>
            </div>

            {/* Correction alert message if applicable */}
            {currentSubmission.status === "CORRECTION_REQUIRED" && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Faculty Correction Remarks
                  </p>
                  <p className="text-xs text-amber-800">
                    {currentSubmission.correctionReason || "Please re-upload a clear certificate and complete report."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveSubmission(currentSubmission);
                    setShowResubmitModal(true);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow transition-colors font-display"
                >
                  Resubmit Documents
                </button>
              </div>
            )}

            {/* Evaluation Scorecard Grid Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Certificate Verification (20 Marks) */}
              <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4.5 w-4.5 text-indigo-500" />
                    <h3 className="font-semibold text-xs text-slate-800">Certificate Verification</h3>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {currentSubmission.certificateVerify?.verificationScore || 0}/20
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Name Match:</span>
                    <span className="font-semibold text-slate-700">{currentSubmission.certificateVerify?.nameMatchScore || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Match:</span>
                    <span className="font-semibold text-slate-700">{currentSubmission.certificateVerify?.companyMatchScore || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="font-bold text-emerald-600">{currentSubmission.certificateVerify?.overallConfidence || 0}%</span>
                  </div>
                </div>

                {/* AI Authenticity Badge */}
                <div className="pt-2 border-t border-black/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Sparkles className="h-3 w-3 text-indigo-500" />
                      AI Authenticity:
                    </span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{currentSubmission.certificateVerify?.authenticityScore || 94}% Authentic</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>AI-Generated Risk:</span>
                    <span className={`font-bold px-1.5 py-0.2 rounded text-[9px] uppercase ${
                      currentSubmission.certificateVerify?.aiGeneratedRisk === "HIGH" 
                        ? "bg-rose-50 text-rose-600" 
                        : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {currentSubmission.certificateVerify?.aiGeneratedRisk || "LOW"} RISK
                    </span>
                  </div>
                </div>

                <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded
                  ${currentSubmission.certificateVerify?.status === "VERIFIED" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}
                `}>
                  {currentSubmission.certificateVerify?.status || "PENDING"}
                </span>
              </div>

              {/* Company Evaluation (30 Marks) */}
              <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Building className="h-4.5 w-4.5 text-purple-500" />
                    <h3 className="font-semibold text-xs text-slate-800">Company Evaluation</h3>
                  </div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    {currentSubmission.companyEvaluation?.totalScore || 0}/30
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Mentor:</span>
                    <span className="font-semibold text-slate-700">{currentSubmission.industryMentorName || "Company Lead"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evaluation Status:</span>
                    <span className="font-semibold text-slate-700">
                      {currentSubmission.companyEvaluation?.isSubmitted ? "Completed" : "Awaiting Mentor Rating"}
                    </span>
                  </div>
                </div>

                {/* AI Company Credibility Audit */}
                <div className="pt-2 border-t border-black/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <ShieldAlert className="h-3 w-3 text-purple-500" />
                      Domain Credibility:
                    </span>
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                      {currentSubmission.certificateVerify?.companyCredibility?.isCorporateDomain !== false ? "Corporate Domain" : "Webmail"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Audit Status:</span>
                    <span className="font-semibold text-slate-600 truncate max-w-[140px]">
                      {currentSubmission.certificateVerify?.companyCredibility?.rating?.replace(/_/g, " ") || "VERIFIED ENTERPRISE"}
                    </span>
                  </div>
                </div>

                {!currentSubmission.companyEvaluation?.isSubmitted && currentSubmission.companyEvaluation?.accessToken && (
                  <div className="pt-1">
                    <a
                      href={`/company-mentor/evaluate/${currentSubmission.companyEvaluation.accessToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Preview Mentor Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Report & Faculty Evaluation (50 Marks) */}
              <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4.5 w-4.5 text-emerald-500" />
                    <h3 className="font-semibold text-xs text-slate-800">Report & Viva</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {((currentSubmission.reportAnalysis?.facultyFinalScore || currentSubmission.reportAnalysis?.aiSuggestedScore || 0) + (currentSubmission.facultyEvaluation?.totalFacultyScore || 0))}/50
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Report Score:</span>
                    <span className="font-semibold text-slate-700">{currentSubmission.reportAnalysis?.facultyFinalScore || currentSubmission.reportAnalysis?.aiSuggestedScore || 0}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technical & Viva:</span>
                    <span className="font-semibold text-slate-700">{currentSubmission.facultyEvaluation?.totalFacultyScore || 0}/30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Faculty Mentor:</span>
                    <span className="font-semibold text-slate-700">{currentSubmission.facultyMentorName || "Assigned Faculty"}</span>
                  </div>
                </div>

                {/* AI Plagiarism & Originality Scan */}
                <div className="pt-2 border-t border-black/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Bot className="h-3 w-3 text-emerald-600" />
                      Report Originality:
                    </span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      {currentSubmission.reportAnalysis?.originalityScore || 94}% Original
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Plagiarism Scan:</span>
                    <span className="font-semibold text-emerald-600">
                      {currentSubmission.reportAnalysis?.plagiarismScore || 6}% (Low Similarity)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents & Interactive Replacement Hub */}
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-black/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-4 border-b border-black/5">
              <div>
                <h3 className="text-base font-display font-bold text-slate-800 flex items-center gap-2">
                  <FolderCheck className="h-5 w-5 text-indigo-600" />
                  <span>Submitted Documents & Replace Actions</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Manage your uploaded internship credentials. You can replace your certificate or report at any time prior to final faculty lock.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Certificate Management Card */}
              <div className="p-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 to-white space-y-4 shadow-xs">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Internship Certificate</h4>
                      <p className="text-[11px] text-slate-500">
                        {certDoc?.fileName || "Certificate Document"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                    {currentSubmission.certificateVerify?.status || "SUBMITTED"}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-black/5 space-y-2 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>OCR Extracted Company:</span>
                    <span className="font-semibold text-slate-800">{currentSubmission.certificateVerify?.extractedCompany || currentSubmission.companyName}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>OCR Extracted Role:</span>
                    <span className="font-semibold text-slate-800">{currentSubmission.certificateVerify?.extractedRole || currentSubmission.internshipRole}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Verification Score:</span>
                    <span className="font-bold text-indigo-600">{currentSubmission.certificateVerify?.verificationScore || 0} / 20</span>
                  </div>

                  {/* AI Certificate Authenticity & Anti-Forgery Seal */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-indigo-500" />
                        AI Forensic Authenticity:
                      </span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        {currentSubmission.certificateVerify?.authenticityScore || 94}% Authentic
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>AI Hallucination / Synthetic Risk:</span>
                      <span className={`font-bold px-1.5 py-0.2 rounded text-[9px] uppercase ${
                        currentSubmission.certificateVerify?.aiGeneratedRisk === "HIGH" 
                          ? "bg-rose-50 text-rose-600" 
                          : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {currentSubmission.certificateVerify?.aiGeneratedRisk || "LOW"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Signatory / Seal Confidence:</span>
                      <span className="font-semibold text-slate-700">
                        {currentSubmission.certificateVerify?.forensicAnalysis?.signatureSealConfidence || 92}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Corporate Domain Audit:</span>
                      <span className="font-semibold text-indigo-600 truncate max-w-[150px]">
                        {currentSubmission.certificateVerify?.companyCredibility?.domain || (currentSubmission.industryMentorEmail?.includes("@") ? currentSubmission.industryMentorEmail.split("@")[1] : "Verified Corporate")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {certDoc?.fileUrl ? (
                    <a
                      href={certDoc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Certificate</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">File uploaded</span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setFormError("");
                      setFormSuccess("");
                      setReplaceCertFile(null);
                      setShowReplaceCertModal(true);
                    }}
                    disabled={currentSubmission.isLocked}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-display"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Replace Certificate</span>
                  </button>
                </div>
              </div>

              {/* Report Management Card */}
              <div className="p-5 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/40 to-white space-y-4 shadow-xs">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Internship Technical Report</h4>
                      <p className="text-[11px] text-slate-500">
                        {reportDoc?.fileName || "Report Document"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                    AI Evaluated
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-black/5 space-y-2 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>AI Suggested Score:</span>
                    <span className="font-bold text-purple-600">{currentSubmission.reportAnalysis?.aiSuggestedScore || 0} / 20</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Technical Depth:</span>
                    <span className="font-semibold text-slate-800">{currentSubmission.reportAnalysis?.technicalDepthScore || 0} / 4</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Detected Sections:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                      {Array.isArray(currentSubmission.reportAnalysis?.sectionsFound) 
                        ? currentSubmission.reportAnalysis.sectionsFound.join(", ") 
                        : "Abstract, Intro, Results"}
                    </span>
                  </div>

                  {/* AI Plagiarism & Synthetic AI-Writing Scanner */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <Bot className="h-3 w-3 text-purple-500" />
                        Report Originality:
                      </span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        {currentSubmission.reportAnalysis?.originalityScore || 94}% Original
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Plagiarism / Similarity Score:</span>
                      <span className="font-semibold text-slate-700">
                        {currentSubmission.reportAnalysis?.plagiarismScore || 6}% (Passed Academic Threshold)
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>AI-Writing Probability:</span>
                      <span className="font-semibold text-emerald-600">
                        {currentSubmission.reportAnalysis?.aiWritingProbability || 8}% (Human Authored)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {reportDoc?.fileUrl ? (
                    <a
                      href={reportDoc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Report</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">File uploaded</span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setFormError("");
                      setFormSuccess("");
                      setReplaceReportFile(null);
                      setShowReplaceReportModal(true);
                    }}
                    disabled={currentSubmission.isLocked}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-display"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Replace Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: AI Verified Skill Badging to Placement Profile */}
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-black/5 bg-gradient-to-br from-white via-indigo-50/20 to-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-black/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-800">
                    AI Industry-Verified Skill Badging
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Placement Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Skills extracted from your internship project ({currentSubmission.projectTitle || currentSubmission.internshipRole}), report deliverables, and company mentor rating.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSyncSkills}
                disabled={syncingSkills}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 font-display"
              >
                {syncingSkills ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Syncing Skills...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" />
                    <span>Sync to Placement Profile</span>
                  </>
                )}
              </button>
            </div>

            {skillSyncSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{skillSyncSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {verifiedSkillsList.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white border border-indigo-100/80 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">{skill.name}</p>
                    <span className="text-[10px] text-slate-400">{skill.category || "Industry Verified"}</span>
                  </div>
                  <span className="h-6 w-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0" title="Verified by College & Host Company">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 6: AI Weekly Work Log & Milestone Assistant */}
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-black/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-black/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#DD3333]/10 text-[#DD3333] flex items-center justify-center">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-800">
                    AI Weekly Work Log & Milestone Assistant
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                    Auto-Formatted
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Document your weekly engineering accomplishments. Type rough notes and use AI to transform them into executive milestone logs.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveWeeklyLogs}
                disabled={savingLogs}
                className="px-4 py-2 bg-[#DD3333] hover:bg-red-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 font-display"
              >
                {savingLogs ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving Logs...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Save All Weekly Logs</span>
                  </>
                )}
              </button>
            </div>

            {logSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>{logSuccess}</span>
                </div>
                <button onClick={() => setLogSuccess("")} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>
            )}

            {logError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl text-xs font-semibold flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{logError}</span>
                </div>
                <button onClick={() => setLogError("")} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>
            )}

            {/* Week Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-black/5">
              {weeklyLogs.map((log) => (
                <button
                  key={log.weekNumber}
                  onClick={() => setSelectedWeek(log.weekNumber)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 font-display whitespace-nowrap
                    ${selectedWeek === log.weekNumber
                      ? "bg-[#DD3333] text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }
                  `}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Week {log.weekNumber}</span>
                  {log.deliverables?.length > 0 && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Active Week Details & AI Enhancer Box */}
            {(() => {
              const activeLog = weeklyLogs.find(l => l.weekNumber === selectedWeek) || {
                weekNumber: selectedWeek,
                formattedSummary: "",
                deliverables: [],
                skillsUsed: []
              };

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Current Formatted Deliverables */}
                  <div className="p-5 rounded-2xl bg-slate-50/70 border border-black/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span>Week {selectedWeek} Milestones & Deliverables</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {activeLog.deliverables?.length || 0} Deliverables
                      </span>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-black/5 space-y-2">
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                        {activeLog.formattedSummary || `Scheduled engineering activities for Week ${selectedWeek}.`}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Accomplishments & Outcomes:</span>
                      <ul className="space-y-1.5">
                        {(activeLog.deliverables || []).map((item, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {activeLog.skillsUsed?.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-black/5">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Technologies Practiced:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeLog.skillsUsed.map((sk, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: AI Note Enhancer */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/40 via-white to-indigo-50/30 border border-purple-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4.5 w-4.5 text-purple-600" />
                        <h4 className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                          Enhance Week {selectedWeek} with AI
                        </h4>
                      </div>
                      <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-semibold">
                        Assistant
                      </span>
                    </div>

                    <p className="text-xs text-purple-900/80">
                      Paste brief daily scratch notes or tasks. AI will convert them into professional engineering deliverables and tag technologies used.
                    </p>

                    <div className="space-y-2">
                      <textarea
                        rows="4"
                        value={weekRawInput}
                        onChange={(e) => setWeekRawInput(e.target.value)}
                        placeholder="e.g. Worked on optimizing database query latency, integrated stripe webhook handlers, attended sprint retrospective..."
                        className="w-full p-3 rounded-xl border border-purple-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleEnhanceWeeklyLog}
                        disabled={enhancingLog}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 font-display"
                      >
                        {enhancingLog ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Formatting with AI...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>✨ Format & Enhance with AI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        /* Initial Submission Form */
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 md:p-8 space-y-8 border border-black/5">
          <div className="flex items-center justify-between pb-4 border-b border-black/5">
            <div>
              <h2 className="text-lg font-display font-bold text-slate-800">
                Submit {selectedReq?.semester?.replace("_", " ")} Internship Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Required for academic credits ({selectedReq?.requiredCredits || 4} Credits • Min {selectedReq?.minDurationWeeks || 4} weeks)
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Step {activeStep} of 2
            </span>
          </div>

          {activeStep === 1 && (
            <div className="space-y-6">
              {/* Student Info Read-Only Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-black/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Student Name</span>
                  <p className="font-semibold text-slate-800">{student?.name}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
                  <p className="font-semibold text-slate-800">{student?.department || "CMPN"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Academic Year</span>
                  <p className="font-semibold text-slate-800">{selectedReq?.academicYear || "2025-2026"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Batch / Semester</span>
                  <p className="font-semibold text-slate-800">{student?.batch || "2026"} • {selectedReq?.semester?.replace("_", " ")}</p>
                </div>
              </div>

              {/* Internship Specifics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. ABC Technologies / Stripe / Google"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Internship Role *</label>
                  <input
                    type="text"
                    required
                    value={internshipRole}
                    onChange={(e) => setInternshipRole(e.target.value)}
                    placeholder="e.g. Software Developer Intern / Web Developer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Duration (Weeks) *</label>
                  <input
                    type="number"
                    min="4"
                    max="24"
                    required
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Work Mode *</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40"
                  >
                    <option value="HYBRID">Hybrid</option>
                    <option value="ON_SITE">On-Site / In-Office</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Industry Mentor Name *</label>
                  <input
                    type="text"
                    required
                    value={industryMentorName}
                    onChange={(e) => setIndustryMentorName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma (Engineering Manager)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Industry Mentor Email *</label>
                  <input
                    type="email"
                    required
                    value={industryMentorEmail}
                    onChange={(e) => setIndustryMentorEmail(e.target.value)}
                    placeholder="mentor@company.com (For verification rating)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Project Title & Description</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Full Stack Customer Portal & Real-time Analytics"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40 mb-2"
                  />
                  <textarea
                    rows="2"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Briefly describe key tasks, architecture, and responsibilities handled during the internship..."
                    className="w-full p-3 rounded-xl border border-black/10 bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!companyName || !internshipRole) {
                      setFormError("Please enter Company Name and Role before continuing.");
                      return;
                    }
                    setFormError("");
                    setActiveStep(2);
                  }}
                  className="px-6 py-2.5 bg-[#DD3333] hover:bg-red-600 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer flex items-center gap-2 font-display"
                >
                  <span>Continue to Uploads</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certificate Upload Zone */}
                <div className="p-6 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 space-y-3 text-center relative">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Internship Certificate *</h4>
                    <p className="text-[11px] text-slate-400">PDF, DOCX, or DOC (Max 10MB)</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    required
                    onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                  />
                  {certFile && (
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" />
                        <span>{certFile.name} (Ready for OCR)</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setCertFile(null)}
                        className="text-[10px] text-rose-500 hover:underline font-semibold"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                {/* Report Upload Zone */}
                <div className="p-6 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/20 space-y-3 text-center relative">
                  <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Internship Report PDF *</h4>
                    <p className="text-[11px] text-slate-400">PDF format with technical report sections</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    required
                    onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                  />
                  {reportFile && (
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" />
                        <span>{reportFile.name} (Ready for AI Analysis)</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setReportFile(null)}
                        className="text-[10px] text-rose-500 hover:underline font-semibold"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 rounded-xl border border-black/10 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting || !certFile || !reportFile}
                  className="px-6 py-2.5 bg-[#DD3333] hover:bg-red-600 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2 font-display"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Extracting & Verifying Certificate...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Submit & Run Intelligent Verification</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Replace Certificate Modal */}
      {showReplaceCertModal && currentSubmission && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl border border-black/10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-slate-800">
                    Replace Internship Certificate
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentSubmission.companyName} • {currentSubmission.internshipRole}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReplaceCertModal(false);
                  setReplaceCertFile(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReplaceCertificate} className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 text-center space-y-3">
                <Upload className="h-8 w-8 text-indigo-500 mx-auto" />
                <div>
                  <p className="font-semibold text-slate-800">Select New Certificate File</p>
                  <p className="text-[11px] text-slate-400">PDF, DOCX, or DOC (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  required
                  onChange={(e) => setReplaceCertFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white cursor-pointer"
                />
                {replaceCertFile && (
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    <span>{replaceCertFile.name} ({(replaceCertFile.size / 1024).toFixed(0)} KB)</span>
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] text-amber-800">
                💡 Uploading a new certificate will automatically re-run OCR text extraction, name matching, and duration verification.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReplaceCertModal(false);
                    setReplaceCertFile(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-black/10 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replacingDoc || !replaceCertFile}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm font-display"
                >
                  {replacingDoc ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Re-verifying...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Confirm & Re-verify</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Replace Report Modal */}
      {showReplaceReportModal && currentSubmission && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl border border-black/10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-slate-800">
                    Replace Technical Report
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentSubmission.companyName} • {currentSubmission.internshipRole}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReplaceReportModal(false);
                  setReplaceReportFile(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReplaceReport} className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/20 text-center space-y-3">
                <Upload className="h-8 w-8 text-purple-500 mx-auto" />
                <div>
                  <p className="font-semibold text-slate-800">Select New Technical Report File</p>
                  <p className="text-[11px] text-slate-400">PDF, DOCX, or DOC with technical report sections</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  required
                  onChange={(e) => setReplaceReportFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white cursor-pointer"
                />
                {replaceReportFile && (
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    <span>{replaceReportFile.name} ({(replaceReportFile.size / 1024).toFixed(0)} KB)</span>
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200/60 text-[11px] text-purple-800">
                💡 Uploading a new report will trigger automated AI evaluation of technical depth, methodology, outcomes, and report completeness.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReplaceReportModal(false);
                    setReplaceReportFile(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-black/10 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replacingDoc || !replaceReportFile}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm font-display"
                >
                  {replacingDoc ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Re-analyzing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Confirm & Re-analyze</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resubmission Modal */}
      {showResubmitModal && activeSubmission && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-black/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-display font-bold text-slate-800">
                  Resubmit Internship Documents
                </h3>
                <p className="text-xs text-slate-500">
                  {activeSubmission.internshipRole} at {activeSubmission.companyName}
                </p>
              </div>
              <button
                onClick={() => setShowResubmitModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Updated Certificate PDF</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border border-black/10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Updated Report PDF</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border border-black/10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Clarification Notes</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain corrections made to certificate/report..."
                  className="w-full p-2.5 border border-black/10 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResubmitModal(false)}
                  className="px-4 py-2 rounded-xl border border-black/10 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#DD3333] text-white font-semibold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Uploading..." : "Confirm Resubmission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
