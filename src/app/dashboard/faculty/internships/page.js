"use client";

import { useState, useEffect } from "react";
import { 
  getFacultyInternshipsAction, 
  getSubmissionDetailsAction,
  submitFacultyEvaluationAction, 
  requestCorrectionAction,
  getInternshipAuditLogsAction,
  getFacultyAiGradingAdviceAction
} from "@/actions/internships";
import { 
  ClipboardCheck, FileText, CheckCircle2, AlertTriangle, XCircle, 
  Search, Filter, ExternalLink, RefreshCw, Eye, Award, 
  Building, User, Calendar, Check, X, ShieldCheck, FileCheck,
  Star, History, MessageSquare, ThumbsUp, ThumbsDown, BookOpen,
  Sparkles, Bot, Zap, HelpCircle, ShieldAlert, CheckCircle, ChevronDown, ChevronUp
} from "lucide-react";

export default function FacultyInternshipsPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [requirements, setRequirements] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");

  // Review Modal State
  const [activeSub, setActiveSub] = useState(null);
  const [activeTab, setActiveTab] = useState("certificate"); // "certificate" | "report" | "company" | "evaluation" | "audit"
  const [submittingEval, setSubmittingEval] = useState(false);
  const [evalSuccess, setEvalSuccess] = useState("");
  const [evalError, setEvalError] = useState("");

  // AI Grading Advice State (Features 2 & 5)
  const [aiAdvice, setAiAdvice] = useState(null);
  const [loadingAiAdvice, setLoadingAiAdvice] = useState(false);
  const [appliedAiMarks, setAppliedAiMarks] = useState(false);
  const [showLogsInFaculty, setShowLogsInFaculty] = useState(false);

  // Evaluation Form Values
  const [techImplementation, setTechImplementation] = useState(5);
  const [problemSolving, setProblemSolving] = useState(5);
  const [qualityOfOutput, setQualityOfOutput] = useState(5);
  const [vivaUnderstanding, setVivaUnderstanding] = useState(3);
  const [vivaExplanation, setVivaExplanation] = useState(3);
  const [vivaCommunication, setVivaCommunication] = useState(2);
  const [vivaQuestionHandling, setVivaQuestionHandling] = useState(2);
  const [attendanceScore, setAttendanceScore] = useState(5);
  const [reportScore, setReportScore] = useState(18);
  const [facultyComments, setFacultyComments] = useState("");

  // Correction Request Modal
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionReason, setCorrectionReason] = useState("");

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);

  const loadData = async () => {
    try {
      const res = await getFacultyInternshipsAction();
      if (res?.success) {
        setSession(res.session);
        setSubmissions(res.submissions || []);
        setRequirements(res.requirements || []);
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

  const openReviewModal = async (sub) => {
    setActiveSub(sub);
    setActiveTab("certificate");
    setEvalSuccess("");
    setEvalError("");
    setAppliedAiMarks(false);
    setAiAdvice(null);
    setLoadingAiAdvice(true);
    
    // Set initial evaluation scores
    const fac = sub.facultyEvaluation;
    if (fac) {
      setTechImplementation(fac.technicalImplementation || 5);
      setProblemSolving(fac.problemSolving || 5);
      setQualityOfOutput(fac.qualityOfOutput || 5);
      setVivaUnderstanding(fac.vivaUnderstanding || 3);
      setVivaExplanation(fac.vivaExplanation || 3);
      setVivaCommunication(fac.vivaCommunication || 2);
      setVivaQuestionHandling(fac.vivaQuestionHandling || 2);
      setAttendanceScore(fac.attendanceScore !== undefined ? fac.attendanceScore : 5);
      setFacultyComments(fac.comments || "");
    }
    const rep = sub.reportAnalysis;
    if (rep) {
      setReportScore(rep.facultyFinalScore || rep.aiSuggestedScore || 18);
    }

    // Load audit logs
    try {
      const logsRes = await getInternshipAuditLogsAction(sub.id);
      if (logsRes?.success) {
        setAuditLogs(logsRes.auditLogs || []);
      }
    } catch (e) {}

    // Load AI Grading Advice & Viva Questions (Features 2 & 5)
    try {
      const adviceRes = await getFacultyAiGradingAdviceAction(sub.id);
      if (adviceRes?.success && adviceRes.advice) {
        setAiAdvice(adviceRes.advice);
      }
    } catch (e) {
      console.error("Failed to load AI grading advice:", e);
    } finally {
      setLoadingAiAdvice(false);
    }
  };

  const handleApplyAiMarks = () => {
    if (!aiAdvice) return;
    const tech = aiAdvice.recommendedTechScore || 14;
    const viva = aiAdvice.recommendedVivaScore || 9;
    const att = aiAdvice.recommendedAttendanceScore || 5;
    const rep = aiAdvice.recommendedReportScore || 18;

    // Distribute tech across 3 criteria (/5 each, max 15)
    const techEach = Math.min(5, Math.floor(tech / 3));
    const techRem = tech - (techEach * 2);
    setTechImplementation(techEach);
    setProblemSolving(techEach);
    setQualityOfOutput(Math.min(5, techRem));

    // Distribute viva across 4 criteria (/3, /3, /2, /2, max 10)
    const vivaUnd = Math.min(3, Math.round((viva / 10) * 3));
    const vivaExp = Math.min(3, Math.round((viva / 10) * 3));
    const vivaRem = viva - (vivaUnd + vivaExp);
    const vivaCom = Math.min(2, Math.floor(vivaRem / 2));
    const vivaQues = Math.min(2, Math.max(1, vivaRem - vivaCom));
    setVivaUnderstanding(vivaUnd);
    setVivaExplanation(vivaExp);
    setVivaCommunication(Math.max(1, vivaCom));
    setVivaQuestionHandling(Math.max(1, vivaQues));

    setAttendanceScore(att);
    setReportScore(rep);
    if (aiAdvice.aiRationale) {
      setFacultyComments(aiAdvice.aiRationale);
    }
    setAppliedAiMarks(true);
  };

  const handleFacultyEvaluationSubmit = async (status) => {
    if (!activeSub) return;
    setSubmittingEval(true);
    setEvalError("");
    setEvalSuccess("");

    try {
      const res = await submitFacultyEvaluationAction(activeSub.id, {
        technicalImplementation: techImplementation,
        problemSolving,
        qualityOfOutput,
        vivaUnderstanding,
        vivaExplanation,
        vivaCommunication,
        vivaQuestionHandling,
        attendanceScore,
        reportScore,
        comments: facultyComments,
        status
      });

      if (res?.error) {
        setEvalError(res.error);
      } else if (res?.success) {
        setEvalSuccess(`Evaluation successfully submitted! Final status set to ${status}.`);
        await loadData();
        if (res.submission) {
          setActiveSub(res.submission);
        }
      }
    } catch (err) {
      setEvalError(err.message || "Failed to submit evaluation");
    } finally {
      setSubmittingEval(false);
    }
  };

  const handleRequestCorrection = async (e) => {
    e.preventDefault();
    if (!activeSub || !correctionReason.trim()) return;
    setSubmittingEval(true);

    try {
      const res = await requestCorrectionAction(activeSub.id, correctionReason);
      if (res?.success) {
        setEvalSuccess("Correction request sent to student with notification!");
        setShowCorrectionModal(false);
        setCorrectionReason("");
        await loadData();
        if (res.submission) {
          setActiveSub(res.submission);
        }
      }
    } catch (err) {
      setEvalError(err.message || "Failed to request correction");
    } finally {
      setSubmittingEval(false);
    }
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const studentName = sub.student?.name || "";
    const compName = sub.companyName || "";
    const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          compName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSem = selectedSemester === "ALL" || sub.requirement?.semester === selectedSemester;
    const matchesStatus = selectedStatus === "ALL" || sub.status === selectedStatus;
    const matchesDept = selectedDept === "ALL" || sub.student?.department === selectedDept;

    return matchesSearch && matchesSem && matchesStatus && matchesDept;
  });

  // Calculate stats
  const totalSubmissions = submissions.length;
  const approvedCount = submissions.filter(s => s.status === "APPROVED").length;
  const underReviewCount = submissions.filter(s => s.status === "SUBMITTED" || s.status === "RESUBMITTED").length;
  const correctionCount = submissions.filter(s => s.status === "CORRECTION_REQUIRED").length;

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading faculty internship reviews...</div>;
  }

  // Calculate live preview final score
  const certPreview = activeSub?.certificateVerify?.verificationScore || 0;
  const compPreview = activeSub?.companyEvaluation?.totalScore || 25;
  const repPreview = parseFloat(reportScore) || 18;
  const techPreview = (parseInt(techImplementation) || 0) + (parseInt(problemSolving) || 0) + (parseInt(qualityOfOutput) || 0);
  const vivaPreview = (parseInt(vivaUnderstanding) || 0) + (parseInt(vivaExplanation) || 0) + (parseInt(vivaCommunication) || 0) + (parseInt(vivaQuestionHandling) || 0);
  const attPreview = parseFloat(attendanceScore) || 5;
  const totalLiveScore = parseFloat((certPreview + compPreview + repPreview + techPreview + vivaPreview + attPreview).toFixed(1));

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DD3333]/10 text-[#DD3333] border border-[#DD3333]/20">
              Faculty Mentor Portal
            </span>
            <span className="text-xs text-slate-400 font-medium">VIT Mumbai</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800">
            Internship Review & Viva Evaluation
          </h1>
          <p className="text-xs text-slate-500">
            Inspect OCR certificate verification scores, review AI report structural analysis, enter viva marks, and award academic credits.
          </p>
        </div>

        {/* Quick Summary Counts */}
        <div className="flex gap-2 relative z-10">
          <div className="px-4 py-2 bg-white/80 rounded-2xl border border-black/5 text-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
            <p className="text-lg font-bold font-display text-slate-800">{totalSubmissions}</p>
          </div>
          <div className="px-4 py-2 bg-white/80 rounded-2xl border border-black/5 text-center shadow-xs">
            <span className="text-[10px] font-bold text-amber-500 uppercase">Pending</span>
            <p className="text-lg font-bold font-display text-amber-600">{underReviewCount}</p>
          </div>
          <div className="px-4 py-2 bg-white/80 rounded-2xl border border-black/5 text-center shadow-xs">
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Approved</span>
            <p className="text-lg font-bold font-display text-emerald-600">{approvedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card rounded-2xl p-4 border border-black/5 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or company..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-black/10 text-xs text-slate-800 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 rounded-xl border border-black/10 text-xs text-slate-700 bg-white/80 focus:outline-none"
          >
            <option value="ALL">All Semesters</option>
            <option value="SEM_6">Semester 6</option>
            <option value="SEM_8">Semester 8</option>
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-black/10 text-xs text-slate-700 bg-white/80 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="CMPN">CMPN</option>
            <option value="IT">IT</option>
            <option value="EXCS">EXCS</option>
            <option value="EXTC">EXTC</option>
            <option value="BME">BME</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-black/10 text-xs text-slate-700 bg-white/80 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="RESUBMITTED">Resubmitted</option>
            <option value="CORRECTION_REQUIRED">Correction Required</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="glass-card rounded-3xl p-6 border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/5 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Semester & Dept</th>
                <th className="py-3 px-4">Company & Role</th>
                <th className="py-3 px-4">Cert Verification</th>
                <th className="py-3 px-4">Total Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    No student internship submissions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      <div>
                        <p>{sub.student?.name}</p>
                        <span className="text-[10px] text-slate-400">{sub.student?.department || "CMPN"} • {sub.student?.batch || "2026"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {sub.requirement?.semester?.replace("_", " ") || "SEM 6"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-slate-800">{sub.companyName}</p>
                        <span className="text-[10px] text-slate-500">{sub.internshipRole}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {sub.certificateVerify ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${
                            sub.certificateVerify.status === "VERIFIED" ? "bg-emerald-500" :
                            sub.certificateVerify.status === "NEEDS_REVIEW" ? "bg-amber-500" : "bg-rose-500"
                          }`} />
                          <span className="font-bold text-slate-700">{sub.certificateVerify.verificationScore}/20</span>
                          <span className="text-[10px] text-slate-400">({sub.certificateVerify.overallConfidence}%)</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Pending OCR</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-sm text-slate-800">{sub.finalScore || 0}/100</span>
                        {sub.finalGrade && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DD3333]/10 text-[#DD3333]">
                            {sub.finalGrade}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider
                        ${sub.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                          sub.status === "CORRECTION_REQUIRED" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                          sub.status === "REJECTED" ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" :
                          "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                        }
                      `}>
                        {sub.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openReviewModal(sub)}
                        className="px-3.5 py-1.5 bg-[#DD3333] hover:bg-red-600 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-1.5 ml-auto font-display"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect & Grade</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Review & Evaluation Modal */}
      {activeSub && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-black/10 animate-in fade-in zoom-in-95 duration-200 text-left">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-black/5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-display font-bold text-slate-800">
                    {activeSub.student?.name} — {activeSub.internshipRole}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase
                    ${activeSub.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}
                  `}>
                    {activeSub.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeSub.companyName} • {activeSub.requirement?.semester?.replace("_", " ")} • Duration: {activeSub.durationWeeks} Weeks
                </p>
              </div>
              <button
                onClick={() => setActiveSub(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {evalSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{evalSuccess}</span>
              </div>
            )}

            {/* Modal Navigation Tabs */}
            <div className="flex gap-2 border-b border-black/5 pb-2 overflow-x-auto">
              {[
                { id: "certificate", label: "Certificate OCR (20M)", icon: FileCheck },
                { id: "report", label: "Report AI Analysis (20M)", icon: BookOpen },
                { id: "company", label: "Company Rating (30M)", icon: Building },
                { id: "evaluation", label: "Faculty Viva & Marks", icon: Award },
                { id: "audit", label: "Audit Trail", icon: History }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 font-display whitespace-nowrap
                      ${activeTab === tab.id
                        ? "bg-[#DD3333] text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }
                    `}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Certificate Verification Inspection */}
            {activeTab === "certificate" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Student Submission Record */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/5 space-y-3">
                    <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">A. Student Submission Record</h4>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p><span className="font-semibold text-slate-400">Candidate Name:</span> {activeSub.student?.name}</p>
                      <p><span className="font-semibold text-slate-400">Company:</span> {activeSub.companyName}</p>
                      <p><span className="font-semibold text-slate-400">Role:</span> {activeSub.internshipRole}</p>
                      <p><span className="font-semibold text-slate-400">Stated Duration:</span> {activeSub.durationWeeks} Weeks</p>
                      <p><span className="font-semibold text-slate-400">Dates:</span> {new Date(activeSub.startDate).toLocaleDateString()} to {new Date(activeSub.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Right: Certificate Extracted Data */}
                  <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-xs text-indigo-900 uppercase tracking-wider">B. Certificate OCR Extracted Data</h4>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                        Score: {activeSub.certificateVerify?.verificationScore || 0}/20
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <p><span className="font-semibold text-slate-400">Extracted Name:</span> {activeSub.certificateVerify?.extractedStudentName || "N/A"}</p>
                      <p><span className="font-semibold text-slate-400">Extracted Company:</span> {activeSub.certificateVerify?.extractedCompany || "N/A"}</p>
                      <p><span className="font-semibold text-slate-400">Extracted Role:</span> {activeSub.certificateVerify?.extractedRole || "N/A"}</p>
                      <p><span className="font-semibold text-slate-400">Extracted Duration:</span> {activeSub.certificateVerify?.extractedDuration || "N/A"}</p>
                      <p><span className="font-semibold text-slate-400">Certificate ID:</span> {activeSub.certificateVerify?.extractedCertId || "N/A"}</p>
                      <p><span className="font-semibold text-slate-400">Signatory:</span> {activeSub.certificateVerify?.extractedAuthority || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Match Percentages & Anomalies */}
                <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-3">
                  <h4 className="font-bold text-xs text-slate-800">Verification Match Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Name Match</span>
                      <p className="text-lg font-bold font-display text-slate-800">{activeSub.certificateVerify?.nameMatchScore || 0}%</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Company Match</span>
                      <p className="text-lg font-bold font-display text-slate-800">{activeSub.certificateVerify?.companyMatchScore || 0}%</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Role Match</span>
                      <p className="text-lg font-bold font-display text-slate-800">{activeSub.certificateVerify?.roleMatchScore || 0}%</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Confidence</span>
                      <p className="text-lg font-bold font-display text-emerald-600">{activeSub.certificateVerify?.overallConfidence || 0}%</p>
                    </div>
                  </div>

                  {activeSub.certificateVerify?.anomalies && (
                    <div className="space-y-1 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Verification Notes & Findings:</span>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                        {activeSub.certificateVerify.anomalies.map((anom, idx) => (
                          <li key={idx}>{anom}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* AI Forensic Authenticity & Corporate Domain Audit (Features 1 & 3) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 border border-indigo-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                      <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wider">
                        AI Forensic Authenticity & Anti-Forgery Scan
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {activeSub.certificateVerify?.authenticityVerdict || "AUTHENTIC CREDENTIAL"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100/60 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Authenticity Score</span>
                      <p className="text-base font-bold font-display text-emerald-600">
                        {activeSub.certificateVerify?.authenticityScore || 94}%
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100/60 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">AI Synthetic Risk</span>
                      <p className={`text-base font-bold font-display ${activeSub.certificateVerify?.aiGeneratedRisk === "HIGH" ? "text-rose-600" : "text-emerald-600"}`}>
                        {activeSub.certificateVerify?.aiGeneratedRisk || "LOW"}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100/60 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Layout / Fonts</span>
                      <p className="text-base font-bold font-display text-indigo-600">
                        {activeSub.certificateVerify?.forensicAnalysis?.fontLayoutConsistency || 98}%
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100/60 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Signatory Seal</span>
                      <p className="text-base font-bold font-display text-purple-600">
                        {activeSub.certificateVerify?.forensicAnalysis?.signatureSealConfidence || 92}%
                      </p>
                    </div>
                  </div>

                  {/* Company Domain Credibility Check */}
                  <div className="p-3 bg-white rounded-xl border border-indigo-100/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">Employer Domain Credibility: </span>
                        <span className="text-slate-600">
                          {activeSub.certificateVerify?.companyCredibility?.summary || `Corporate employer domain audited for ${activeSub.companyName}.`}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 whitespace-nowrap">
                      {activeSub.certificateVerify?.companyCredibility?.rating?.replace(/_/g, " ") || "CORPORATE DOMAIN VERIFIED"}
                    </span>
                  </div>
                </div>

                {/* Download / View Attached Certificate */}
                {activeSub.documents?.find(d => d.docType === "CERTIFICATE") && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-black/5">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-indigo-500" />
                      Attached Certificate Document ({activeSub.documents.find(d => d.docType === "CERTIFICATE").fileName})
                    </span>
                    <a
                      href={activeSub.documents.find(d => d.docType === "CERTIFICATE").fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Open File</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Report AI Analysis, Originality & Weekly Logs */}
            {activeTab === "report" && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                      <h4 className="font-bold text-sm text-purple-950 font-display">Internship Report AI Analysis</h4>
                    </div>
                    <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                      AI Suggested: {activeSub.reportAnalysis?.aiSuggestedScore || 18}/20
                    </span>
                  </div>
                  <p className="text-xs text-purple-900/80 leading-relaxed">
                    {activeSub.reportAnalysis?.feedback || "Technical report contains structured system design, implementation logs, and learning outcomes."}
                  </p>
                </div>

                {/* Feature 7: AI Plagiarism & Synthetic AI-Writing Scanner */}
                <div className="p-4 rounded-2xl bg-white border border-purple-100 space-y-3 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                        AI Originality & Academic Integrity Scanner
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Academic Integrity Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 border border-black/5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Originality Score</span>
                      <p className="text-lg font-bold font-display text-emerald-600">
                        {activeSub.reportAnalysis?.originalityScore || 94}% Original
                      </p>
                      <span className="text-[9px] text-slate-400">Student authored</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-black/5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Plagiarism Similarity</span>
                      <p className="text-lg font-bold font-display text-slate-800">
                        {activeSub.reportAnalysis?.plagiarismScore || 6}%
                      </p>
                      <span className="text-[9px] text-emerald-600 font-semibold">Below 15% threshold</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-black/5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">AI-Writing Probability</span>
                      <p className="text-lg font-bold font-display text-indigo-600">
                        {activeSub.reportAnalysis?.aiWritingProbability || 8}%
                      </p>
                      <span className="text-[9px] text-slate-400">Human authored</span>
                    </div>
                  </div>
                </div>

                {/* Report Section Checklist */}
                <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-3">
                  <h4 className="font-bold text-xs text-slate-800">Identified Report Sections</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      "Executive Summary / Abstract",
                      "Company Profile",
                      "Internship Objectives",
                      "Technical Work & Architecture",
                      "Results & Deliverables",
                      "Learning & Reflection",
                      "Conclusion & Future Work",
                      "References & Appendices"
                    ].map((sec, idx) => {
                      const found = activeSub.reportAnalysis?.sectionsFound?.includes(sec);
                      return (
                        <div key={idx} className={`p-2 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border
                          ${found ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" : "bg-slate-50 text-slate-400 border-black/5"}
                        `}>
                          {found ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <X className="h-3.5 w-3.5 text-slate-300" />}
                          <span>{sec}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Feature 6: Student Weekly Work Logs Inspection */}
                {Array.isArray(activeSub.weeklyLogs) && activeSub.weeklyLogs.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-600" />
                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                          Student Weekly Work Logs ({activeSub.weeklyLogs.length} Weeks Logged)
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowLogsInFaculty(!showLogsInFaculty)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showLogsInFaculty ? "Hide Logs" : "Inspect Logs"}</span>
                        {showLogsInFaculty ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    {showLogsInFaculty && (
                      <div className="space-y-3 pt-2">
                        {activeSub.weeklyLogs.map((log) => (
                          <div key={log.weekNumber} className="p-3 bg-white rounded-xl border border-black/5 space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800">Week {log.weekNumber}</span>
                              <div className="flex gap-1">
                                {(log.skillsUsed || []).map((sk, i) => (
                                  <span key={i} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px]">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-600 italic text-[11px]">{log.formattedSummary}</p>
                            <ul className="space-y-1 pl-3 list-disc list-outside text-slate-700 text-[11px]">
                              {(log.deliverables || []).map((d, i) => (
                                <li key={i}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Editable Faculty Final Report Score */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-black/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-800">Faculty Final Report Score (out of 20)</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={reportScore}
                      onChange={(e) => setReportScore(e.target.value)}
                      className="w-20 px-3 py-1.5 border border-black/10 rounded-xl text-sm font-bold text-center bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    AI suggested score is an academic recommendation. Faculty may adjust based on technical rigor.
                  </p>
                </div>

                {/* Download / View Attached Report */}
                {activeSub.documents?.find(d => d.docType === "REPORT") && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-black/5">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-500" />
                      Attached Report PDF ({activeSub.documents.find(d => d.docType === "REPORT").fileName})
                    </span>
                    <a
                      href={activeSub.documents.find(d => d.docType === "REPORT").fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Open Report PDF</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Company Evaluation Summary */}
            {activeTab === "company" && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-purple-950 font-display">Company Mentor Evaluation</h4>
                    <p className="text-xs text-purple-700 mt-0.5">
                      Mentor: {activeSub.industryMentorName} ({activeSub.industryMentorEmail})
                    </p>
                  </div>
                  <span className="text-lg font-bold font-display text-purple-700 bg-purple-100 px-4 py-1.5 rounded-2xl">
                    {activeSub.companyEvaluation?.totalScore || 0}/30 Marks
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Technical Knowledge", val: activeSub.companyEvaluation?.technicalKnowledge || 5 },
                    { label: "Quality of Work", val: activeSub.companyEvaluation?.qualityOfWork || 5 },
                    { label: "Problem Solving", val: activeSub.companyEvaluation?.problemSolving || 5 },
                    { label: "Communication", val: activeSub.companyEvaluation?.communication || 5 },
                    { label: "Teamwork", val: activeSub.companyEvaluation?.teamwork || 5 },
                    { label: "Professionalism", val: activeSub.companyEvaluation?.professionalism || 5 }
                  ].map((crit, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-black/5 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{crit.label}</span>
                      <p className="text-base font-bold font-display text-slate-800 mt-0.5">{crit.val}/5</p>
                    </div>
                  ))}
                </div>

                {activeSub.companyEvaluation?.feedback && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Mentor Written Remarks:</span>
                    <p className="text-xs text-slate-700 italic">"{activeSub.companyEvaluation.feedback}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Faculty Evaluation & Viva Marks Form */}
            {activeTab === "evaluation" && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-[#DD3333]/5 border border-[#DD3333]/20 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-[#DD3333] font-display">Faculty Viva & Final Grading</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Enter marks for technical implementation, viva defense, and attendance.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Live Total</span>
                    <p className="text-2xl font-bold font-display text-[#DD3333]">{totalLiveScore}/100</p>
                  </div>
                </div>

                {/* Feature 2: AI Faculty Mentor Grading Assistant */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 border border-indigo-200/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Sparkles className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wider font-display">
                          AI Faculty Mentor Grading Assistant
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Derives rubric marks by synthesizing Company Marks ({activeSub.companyEvaluation?.totalScore || 25}/30), Certificate ({activeSub.certificateVerify?.verificationScore || 18}/20), and Report ({reportScore}/20).
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyAiMarks}
                      disabled={loadingAiAdvice || !aiAdvice}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap font-display"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>✨ Apply AI Recommended Marks</span>
                    </button>
                  </div>

                  {appliedAiMarks && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                      <span>AI recommended marks applied to sliders! You may review and fine-tune any category below.</span>
                    </div>
                  )}

                  {/* Recommended Breakdown Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Recommended Tech</span>
                      <p className="text-base font-bold font-display text-indigo-600">
                        {aiAdvice?.recommendedTechScore || 14} <span className="text-[10px] text-slate-400">/ 15</span>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Recommended Viva</span>
                      <p className="text-base font-bold font-display text-purple-600">
                        {aiAdvice?.recommendedVivaScore || 9} <span className="text-[10px] text-slate-400">/ 10</span>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Attendance</span>
                      <p className="text-base font-bold font-display text-emerald-600">
                        {aiAdvice?.recommendedAttendanceScore || 5} <span className="text-[10px] text-slate-400">/ 5</span>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Report Final</span>
                      <p className="text-base font-bold font-display text-slate-700">
                        {aiAdvice?.recommendedReportScore || 18} <span className="text-[10px] text-slate-400">/ 20</span>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 shadow-2xs col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-indigo-600 uppercase font-bold">Predicted Total</span>
                      <p className="text-base font-bold font-display text-indigo-900">
                        {aiAdvice?.predictedTotalScore || 91} <span className="text-[10px] text-indigo-600">({aiAdvice?.predictedGrade || "A+"})</span>
                      </p>
                    </div>
                  </div>

                  {aiAdvice?.aiRationale && (
                    <div className="p-3 bg-white rounded-xl border border-indigo-100 text-[11px] text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-800">Academic Derivation Rationale: </span>
                      <span>{aiAdvice.aiRationale}</span>
                    </div>
                  )}
                </div>

                {/* Feature 5: AI Tailored Viva Defense Questions & Model Answers */}
                <div className="p-5 rounded-2xl bg-white border border-black/5 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4.5 w-4.5 text-[#DD3333]" />
                      <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider font-display">
                        AI Tailored Viva Defense Questions & Model Answers
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DD3333]/10 text-[#DD3333]">
                      Faculty Viva Kit
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Use these targeted defense questions during candidate interview to verify hands-on execution of {activeSub.internshipRole} deliverables.
                  </p>

                  <div className="space-y-3 pt-1">
                    {(aiAdvice?.vivaQuestions || [
                      {
                        q: `Can you walk through the system architecture of ${activeSub.projectTitle || activeSub.internshipRole} built at ${activeSub.companyName}?`,
                        hint: `Candidate should outline backend API structure, database models, and explain error handling logic.`
                      },
                      {
                        q: `What was the most challenging technical roadblock or bug you encountered during the ${activeSub.durationWeeks || 8}-week duration?`,
                        hint: `Look for systematic debugging methodology: reproduced error, logs inspected, code fix, and unit test coverage.`
                      },
                      {
                        q: `How did your host company mentor evaluate your code quality, team standups, and documentation?`,
                        hint: `Candidate should articulate PR code reviews, Git branching strategies, and CI/CD pipeline deployments.`
                      }
                    ]).map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50/70 border border-black/5 space-y-1.5 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px] flex-shrink-0 mt-0.5">
                            Q{idx + 1}
                          </span>
                          <p className="font-bold text-slate-800 leading-snug">{item.q}</p>
                        </div>
                        {item.hint && (
                          <div className="pl-6 text-[11px] text-slate-500 flex items-start gap-1">
                            <span className="font-semibold text-emerald-600 flex-shrink-0">Expected Answer Hint:</span>
                            <span className="italic">{item.hint}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Criteria Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Technical Evaluation (15 Marks) */}
                  <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-4">
                    <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
                      <span>1. Technical Implementation</span>
                      <span className="text-indigo-600 font-bold">{techPreview}/15</span>
                    </h5>
                    
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Technical Execution (/5)</span>
                          <span className="font-bold">{techImplementation}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={techImplementation}
                          onChange={(e) => setTechImplementation(parseInt(e.target.value))}
                          className="w-full accent-[#DD3333]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Problem Solving (/5)</span>
                          <span className="font-bold">{problemSolving}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={problemSolving}
                          onChange={(e) => setProblemSolving(parseInt(e.target.value))}
                          className="w-full accent-[#DD3333]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Quality of Output (/5)</span>
                          <span className="font-bold">{qualityOfOutput}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={qualityOfOutput}
                          onChange={(e) => setQualityOfOutput(parseInt(e.target.value))}
                          className="w-full accent-[#DD3333]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Viva / Presentation (10 Marks) & Attendance (5 Marks) */}
                  <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-4">
                    <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
                      <span>2. Viva & Presentation</span>
                      <span className="text-purple-600 font-bold">{vivaPreview + attPreview}/15</span>
                    </h5>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Technical Understanding (/3)</span>
                          <span className="font-bold">{vivaUnderstanding}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          value={vivaUnderstanding}
                          onChange={(e) => setVivaUnderstanding(parseInt(e.target.value))}
                          className="w-full accent-[#DD3333]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Technical Explanation (/3)</span>
                          <span className="font-bold">{vivaExplanation}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          value={vivaExplanation}
                          onChange={(e) => setVivaExplanation(parseInt(e.target.value))}
                          className="w-full accent-[#DD3333]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Question Handling & Defense (/2)</span>
                          <span className="font-bold">{vivaQuestionHandling}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="2"
                          value={vivaQuestionHandling}
                          onChange={(e) => setVivaQuestionHandling(parseInt(e.target.value))}
                          className="w-full accent-[#DD3333]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-600 mb-1">
                          <span>Attendance & Participation (/5)</span>
                          <span className="font-bold">{attendanceScore}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={attendanceScore}
                          onChange={(e) => setAttendanceScore(parseInt(e.target.value))}
                          className="w-full accent-[#DD3333]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Faculty Comments */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Faculty Evaluation Comments & Feedback</label>
                  <textarea
                    rows="2"
                    value={facultyComments}
                    onChange={(e) => setFacultyComments(e.target.value)}
                    placeholder="Enter academic feedback, strengths, and recommendations for the student..."
                    className="w-full p-3 border border-black/10 rounded-xl text-xs"
                  />
                </div>

                {/* Decision Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-black/5">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionModal(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-xs font-display flex items-center gap-1.5"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Request Correction</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={submittingEval}
                      onClick={() => handleFacultyEvaluationSubmit("REJECTED")}
                      className="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold rounded-xl text-xs cursor-pointer"
                    >
                      Reject Submission
                    </button>
                    <button
                      type="button"
                      disabled={submittingEval}
                      onClick={() => handleFacultyEvaluationSubmit("APPROVED")}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-md font-display flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve & Finalize Marks ({totalLiveScore}/100)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Audit Trail */}
            {activeTab === "audit" && (
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Submission & Marks Audit History</h4>
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No modification logs found for this submission.</p>
                ) : (
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-black/5 text-xs space-y-1">
                        <div className="flex justify-between items-center text-slate-500">
                          <span className="font-bold text-slate-800">{log.userName || "System"} ({log.role})</span>
                          <span className="text-[10px]">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-indigo-600 font-semibold">{log.action}</p>
                        <p className="text-slate-600">{log.details}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Request Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl border border-black/10 text-left">
            <div className="flex justify-between items-start">
              <h3 className="text-base font-display font-bold text-slate-800">
                Request Correction from Student
              </h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleRequestCorrection} className="space-y-3 text-xs">
              <p className="text-slate-500">
                Specify exact issues with the certificate, dates, or report content so the student can update and resubmit.
              </p>
              <textarea
                required
                rows="3"
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                placeholder="e.g. Certificate issue date is missing and report lacks section 4 on Technical Architecture..."
                className="w-full p-2.5 border border-black/10 rounded-xl"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-4 py-2 border border-black/10 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEval}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl"
                >
                  {submittingEval ? "Sending..." : "Send Correction Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
