"use client";

import { useState, useEffect } from "react";
import { 
  getCoordinatorInternshipsAction, 
  saveInternshipRequirementAction, 
  deleteInternshipRequirementAction 
} from "@/actions/internships";
import { 
  FileCheck, Plus, Edit2, Trash2, CheckCircle2, AlertTriangle, 
  Calendar, Award, Building, Download, BarChart3, Users, 
  Clock, Shield, Check, Layers, ArrowDownToLine, RefreshCw, XCircle
} from "lucide-react";

export default function CoordinatorInternshipsPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);

  // Form State for creating/editing requirements
  const [showFormModal, setShowFormModal] = useState(false);
  const [savingReq, setSavingReq] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  // Requirement Form Fields
  const [editingId, setEditingId] = useState("");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [semester, setSemester] = useState("SEM_6");
  const [department, setDepartment] = useState("CMPN");
  const [year, setYear] = useState("Third Year");
  const [divisions, setDivisions] = useState("A, B, C");
  const [internshipType, setInternshipType] = useState("Industry Internship");
  const [startDate, setStartDate] = useState("2026-01-05");
  const [endDate, setEndDate] = useState("2026-10-30");
  const [minDurationWeeks, setMinDurationWeeks] = useState(4);
  const [maxDurationWeeks, setMaxDurationWeeks] = useState(8);
  const [requiredCredits, setRequiredCredits] = useState(4);
  const [certMarks, setCertMarks] = useState(20);
  const [companyMarks, setCompanyMarks] = useState(30);
  const [reportMarks, setReportMarks] = useState(20);
  const [techMarks, setTechMarks] = useState(15);
  const [vivaMarks, setVivaMarks] = useState(10);
  const [attendanceMarks, setAttendanceMarks] = useState(5);
  const [reqStatus, setReqStatus] = useState("OPEN");

  const loadData = async () => {
    try {
      const res = await getCoordinatorInternshipsAction();
      if (res?.success) {
        setSession(res.session);
        setRequirements(res.requirements || []);
        setSubmissions(res.submissions || []);
        setStudents(res.students || []);
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

  const handleOpenCreate = () => {
    setEditingId("");
    setAcademicYear("2025-2026");
    setSemester("SEM_6");
    setDepartment("CMPN");
    setYear("Third Year");
    setDivisions("A, B, C");
    setInternshipType("Industry Internship");
    setStartDate("2026-01-05");
    setEndDate("2026-10-30");
    setMinDurationWeeks(4);
    setMaxDurationWeeks(8);
    setRequiredCredits(4);
    setCertMarks(20);
    setCompanyMarks(30);
    setReportMarks(20);
    setTechMarks(15);
    setVivaMarks(10);
    setAttendanceMarks(5);
    setReqStatus("OPEN");
    setFormError("");
    setFormSuccess("");
    setShowFormModal(true);
  };

  const handleOpenEdit = (req) => {
    setEditingId(req.id);
    setAcademicYear(req.academicYear || "2025-2026");
    setSemester(req.semester || "SEM_6");
    setDepartment(req.department || "CMPN");
    setYear(req.year || "Third Year");
    setDivisions(Array.isArray(req.divisions) ? req.divisions.join(", ") : "A, B, C");
    setInternshipType(req.internshipType || "Industry Internship");
    setStartDate(req.startDate ? new Date(req.startDate).toISOString().split("T")[0] : "2026-01-05");
    setEndDate(req.endDate ? new Date(req.endDate).toISOString().split("T")[0] : "2026-10-30");
    setMinDurationWeeks(req.minDurationWeeks || 4);
    setMaxDurationWeeks(req.maxDurationWeeks || 8);
    setRequiredCredits(req.requiredCredits || 4);
    setCertMarks(req.marksConfig?.certificate || 20);
    setCompanyMarks(req.marksConfig?.company || 30);
    setReportMarks(req.marksConfig?.report || 20);
    setTechMarks(req.marksConfig?.technical || 15);
    setVivaMarks(req.marksConfig?.viva || 10);
    setAttendanceMarks(req.marksConfig?.attendance || 5);
    setReqStatus(req.status || "OPEN");
    setFormError("");
    setFormSuccess("");
    setShowFormModal(true);
  };

  const handleSaveRequirement = async (e) => {
    e.preventDefault();
    setSavingReq(true);
    setFormError("");
    setFormSuccess("");

    try {
      const parsedDivisions = divisions.split(",").map(d => d.trim()).filter(Boolean);
      const totalMarks = (
        parseInt(certMarks) +
        parseInt(companyMarks) +
        parseInt(reportMarks) +
        parseInt(techMarks) +
        parseInt(vivaMarks) +
        parseInt(attendanceMarks)
      );

      const payload = {
        id: editingId || undefined,
        academicYear,
        semester,
        department,
        year,
        divisions: parsedDivisions,
        internshipType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        minDurationWeeks: parseInt(minDurationWeeks),
        maxDurationWeeks: parseInt(maxDurationWeeks),
        requiredCredits: parseInt(requiredCredits),
        requiredDocuments: ["CERTIFICATE", "REPORT"],
        marksConfig: {
          certificate: parseInt(certMarks),
          company: parseInt(companyMarks),
          report: parseInt(reportMarks),
          technical: parseInt(techMarks),
          viva: parseInt(vivaMarks),
          attendance: parseInt(attendanceMarks),
          total: totalMarks
        },
        gradeBoundaries: {
          "A+": [90, 100],
          "A": [80, 89.9],
          "B": [70, 79.9],
          "C": [60, 69.9],
          "D": [50, 59.9],
          "F": [0, 49.9]
        },
        status: reqStatus
      };

      const res = await saveInternshipRequirementAction(payload);
      if (res?.error) {
        setFormError(res.error);
      } else if (res?.success) {
        setFormSuccess("Internship Requirement saved successfully!");
        await loadData();
        setTimeout(() => setShowFormModal(false), 1200);
      }
    } catch (err) {
      setFormError(err.message || "Failed to save requirement");
    } finally {
      setSavingReq(false);
    }
  };

  const handleDeleteRequirement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship requirement?")) return;
    try {
      await deleteInternshipRequirementAction(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = "Student Name,Roll/Batch,Department,Semester,Company,Role,Cert Score (20),Company Score (30),Report Score (20),Faculty Score (30),Final Score (100),Grade,Status\n";
    const rows = submissions.map(sub => {
      const studentName = sub.student?.name || "N/A";
      const batch = sub.student?.batch || "2026";
      const dept = sub.student?.department || "CMPN";
      const sem = sub.requirement?.semester || "SEM_6";
      const comp = sub.companyName || "N/A";
      const role = sub.internshipRole || "N/A";
      const cert = sub.certificateVerify?.verificationScore || 0;
      const compEval = sub.companyEvaluation?.totalScore || 0;
      const rep = sub.reportAnalysis?.facultyFinalScore || sub.reportAnalysis?.aiSuggestedScore || 0;
      const fac = sub.facultyEvaluation?.totalFacultyScore || 0;
      const final = sub.finalScore || 0;
      const grade = sub.finalGrade || "P";
      const status = sub.status || "SUBMITTED";

      return `"${studentName}","${batch}","${dept}","${sem}","${comp}","${role}",${cert},${compEval},${rep},${fac},${final},"${grade}","${status}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `VIT_Internship_Compliance_Report_${new Date().toISOString().split("T")[0]}.csv`);
    a.click();
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading coordinator portal...</div>;
  }

  // Calculate stats
  const totalSubmissions = submissions.length;
  const approvedCount = submissions.filter(s => s.status === "APPROVED").length;
  const pendingCount = submissions.filter(s => s.status === "SUBMITTED" || s.status === "RESUBMITTED").length;
  const correctionCount = submissions.filter(s => s.status === "CORRECTION_REQUIRED").length;
  const avgScore = totalSubmissions > 0 
    ? (submissions.reduce((acc, curr) => acc + (curr.finalScore || 0), 0) / totalSubmissions).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DD3333]/10 text-[#DD3333] border border-[#DD3333]/20">
              Internship Coordinator Panel
            </span>
            <span className="text-xs text-slate-400 font-medium">VIT Mumbai Academic Control</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800">
            Internship Requirement & Policy Engine
          </h1>
          <p className="text-xs text-slate-500">
            Configure credit requirements, submission deadlines, scoring criteria, and monitor university-wide compliance.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 relative z-10">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-black/10 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer font-display"
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#DD3333] hover:bg-red-600 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer font-display"
          >
            <Plus className="h-4 w-4" />
            <span>Create Requirement</span>
          </button>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-black/5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Submissions</span>
          <p className="text-3xl font-bold font-display text-slate-800 mt-1">{totalSubmissions}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-black/5">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Awaiting Evaluation</span>
          <p className="text-3xl font-bold font-display text-amber-600 mt-1">{pendingCount}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-black/5">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Approved for Credits</span>
          <p className="text-3xl font-bold font-display text-emerald-600 mt-1">{approvedCount}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-black/5">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Average Final Score</span>
          <p className="text-3xl font-bold font-display text-indigo-600 mt-1">{avgScore}<span className="text-sm font-normal text-slate-400">/100</span></p>
        </div>
      </div>

      {/* Active Requirements Management */}
      <div className="glass-card rounded-3xl p-6 border border-black/5 space-y-4">
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-lg font-display font-bold text-slate-800">
            Active Internship Curriculum Requirements
          </h2>
          <span className="text-xs text-slate-400">
            {requirements.length} Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requirements.map((req) => {
            const isClosed = req.endDate && new Date(req.endDate) < new Date() && req.status !== "OPEN";
            return (
              <div key={req.id} className="p-5 rounded-2xl bg-white border border-black/5 space-y-4 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#DD3333]/10 text-[#DD3333] font-bold text-xs font-display">
                        {req.semester.replace("_", " ")}
                      </span>
                      <span className="font-semibold text-sm text-slate-800">{req.department} • {req.year}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Academic Year: {req.academicYear} • Credits: {req.requiredCredits}
                    </p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase
                    ${req.status === "OPEN" && !isClosed ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}
                  `}>
                    {req.status === "OPEN" && !isClosed ? "Open for Submissions" : "Closed"}
                  </span>
                </div>

                {/* Details Breakdown */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Configured Divisions:</span>
                    <span className="font-semibold text-slate-800">{Array.isArray(req.divisions) ? req.divisions.join(", ") : "All"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration Requirement:</span>
                    <span className="font-semibold text-slate-800">{req.minDurationWeeks} - {req.maxDurationWeeks} Weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Submission Window:</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(req.startDate).toLocaleDateString()} – {new Date(req.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scoring Schema:</span>
                    <span className="font-semibold text-indigo-600">
                      Cert {req.marksConfig?.certificate || 20}M • Co {req.marksConfig?.company || 30}M • Rep {req.marksConfig?.report || 20}M • Viva {req.marksConfig?.viva || 10}M
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleOpenEdit(req)}
                    className="px-3 py-1.5 rounded-xl border border-black/10 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit Config</span>
                  </button>
                  <button
                    onClick={() => handleDeleteRequirement(req.id)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requirement Create/Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-black/10 text-left">
            <div className="flex justify-between items-start pb-2 border-b border-black/5">
              <div>
                <h3 className="text-lg font-display font-bold text-slate-800">
                  {editingId ? "Edit Internship Requirement" : "Create New Internship Requirement"}
                </h3>
                <p className="text-xs text-slate-500">
                  Set academic criteria, submission deadlines, and evaluation weights.
                </p>
              </div>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {formSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3 rounded-xl text-xs font-semibold">
                {formSuccess}
              </div>
            )}
            {formError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-3 rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveRequirement} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Academic Year *</label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g. 2025-2026"
                    className="w-full p-2.5 border border-black/10 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Semester *</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2.5 border border-black/10 rounded-xl"
                  >
                    <option value="SEM_6">Semester 6</option>
                    <option value="SEM_8">Semester 8</option>
                    <option value="SEM_5">Semester 5 (Summer)</option>
                    <option value="SEM_7">Semester 7</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 border border-black/10 rounded-xl"
                  >
                    <option value="CMPN">CMPN (Computer Engineering)</option>
                    <option value="IT">IT (Information Technology)</option>
                    <option value="EXCS">EXCS (Electronics & Computer)</option>
                    <option value="EXTC">EXTC (Electronics & Telecom)</option>
                    <option value="BME">BME (Biomedical)</option>
                    <option value="ALL">ALL Departments</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Class Year *</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-2.5 border border-black/10 rounded-xl"
                  >
                    <option value="Third Year">Third Year (TE)</option>
                    <option value="Fourth Year">Fourth Year (BE)</option>
                    <option value="Second Year">Second Year (SE)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Configurable Divisions *</label>
                  <input
                    type="text"
                    required
                    value={divisions}
                    onChange={(e) => setDivisions(e.target.value)}
                    placeholder="e.g. A, B, C, D"
                    className="w-full p-2.5 border border-black/10 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Required Credits *</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    required
                    value={requiredCredits}
                    onChange={(e) => setRequiredCredits(e.target.value)}
                    className="w-full p-2.5 border border-black/10 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Submission Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 border border-black/10 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Submission End Deadline *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 border border-black/10 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Min Duration (Weeks) *</label>
                  <input
                    type="number"
                    min="2"
                    max="24"
                    required
                    value={minDurationWeeks}
                    onChange={(e) => setMinDurationWeeks(e.target.value)}
                    className="w-full p-2.5 border border-black/10 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Max Duration (Weeks) *</label>
                  <input
                    type="number"
                    min="4"
                    max="32"
                    required
                    value={maxDurationWeeks}
                    onChange={(e) => setMaxDurationWeeks(e.target.value)}
                    className="w-full p-2.5 border border-black/10 rounded-xl"
                  />
                </div>
              </div>

              {/* Mark Weightage Configuration */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-black/5 space-y-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Evaluation Marks Breakdown (Total: 100)</h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400">Cert (20)</label>
                    <input
                      type="number"
                      value={certMarks}
                      onChange={(e) => setCertMarks(e.target.value)}
                      className="w-full p-2 border border-black/10 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400">Company (30)</label>
                    <input
                      type="number"
                      value={companyMarks}
                      onChange={(e) => setCompanyMarks(e.target.value)}
                      className="w-full p-2 border border-black/10 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400">Report (20)</label>
                    <input
                      type="number"
                      value={reportMarks}
                      onChange={(e) => setReportMarks(e.target.value)}
                      className="w-full p-2 border border-black/10 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400">Tech (15)</label>
                    <input
                      type="number"
                      value={techMarks}
                      onChange={(e) => setTechMarks(e.target.value)}
                      className="w-full p-2 border border-black/10 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400">Viva (10)</label>
                    <input
                      type="number"
                      value={vivaMarks}
                      onChange={(e) => setVivaMarks(e.target.value)}
                      className="w-full p-2 border border-black/10 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400">Att (5)</label>
                    <input
                      type="number"
                      value={attendanceMarks}
                      onChange={(e) => setAttendanceMarks(e.target.value)}
                      className="w-full p-2 border border-black/10 rounded-lg text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 border border-black/10 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReq}
                  className="px-5 py-2 bg-[#DD3333] hover:bg-red-600 text-white font-semibold rounded-xl"
                >
                  {savingReq ? "Saving..." : "Save Requirement Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
