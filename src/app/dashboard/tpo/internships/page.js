"use client";

import { useState, useEffect } from "react";
import { getTpoInternshipsAction } from "@/actions/internships";
import { 
  Award, Building, Users, BarChart3, TrendingUp, Download, 
  Search, Filter, CheckCircle2, AlertTriangle, FileSpreadsheet,
  ArrowDownToLine, Layers, Check, FileCheck
} from "lucide-react";

export default function TpoInternshipsPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [students, setStudents] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedSem, setSelectedSem] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getTpoInternshipsAction();
        if (res?.success) {
          setSession(res.session);
          setSubmissions(res.submissions || []);
          setRequirements(res.requirements || []);
          setStudents(res.students || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleExportCSV = () => {
    const headers = "Student Name,Department,Batch,Semester,Company,Role,Work Mode,Cert Score (20),Company Score (30),Final Score (100),Grade,Status\n";
    const rows = submissions.map(sub => {
      return `"${sub.student?.name}","${sub.student?.department || "CMPN"}","${sub.student?.batch || "2026"}","${sub.requirement?.semester || "SEM_6"}","${sub.companyName}","${sub.internshipRole}","${sub.workMode}",${sub.certificateVerify?.verificationScore || 0},${sub.companyEvaluation?.totalScore || 0},${sub.finalScore || 0},"${sub.finalGrade || "P"}","${sub.status}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `VIT_TPO_Internship_Analytics_${new Date().toISOString().split("T")[0]}.csv`);
    a.click();
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading TPO internship analytics...</div>;
  }

  // Filter Submissions
  const filtered = submissions.filter(sub => {
    const name = sub.student?.name || "";
    const comp = sub.companyName || "";
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || comp.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "ALL" || sub.student?.department === selectedDept;
    const matchesSem = selectedSem === "ALL" || sub.requirement?.semester === selectedSem;
    const matchesStatus = selectedStatus === "ALL" || sub.status === selectedStatus;
    return matchesSearch && matchesDept && matchesSem && matchesStatus;
  });

  // Calculate Statistics
  const totalStudents = students.length || 120;
  const totalSubmissions = submissions.length;
  const approvedCount = submissions.filter(s => s.status === "APPROVED").length;
  const pendingCount = submissions.filter(s => s.status === "SUBMITTED" || s.status === "RESUBMITTED").length;
  const avgScore = totalSubmissions > 0 
    ? (submissions.reduce((acc, curr) => acc + (curr.finalScore || 0), 0) / totalSubmissions).toFixed(1)
    : 0;

  // Department Distribution
  const departments = ["CMPN", "IT", "EXCS", "EXTC", "BME"];
  const deptStats = departments.map(d => {
    const count = submissions.filter(s => (s.student?.department || "CMPN") === d).length;
    const approved = submissions.filter(s => (s.student?.department || "CMPN") === d && s.status === "APPROVED").length;
    return { dept: d, count, approved };
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DD3333]/10 text-[#DD3333] border border-[#DD3333]/20">
              Training & Placement Office (TPO)
            </span>
            <span className="text-xs text-slate-400 font-medium">VIT Mumbai</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800">
            University Internship Analytics & Compliance
          </h1>
          <p className="text-xs text-slate-500">
            Monitor university-wide semester 6 & 8 internship drives, certificate verification rates, and corporate partner performance.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer font-display relative z-10"
        >
          <ArrowDownToLine className="h-4 w-4" />
          <span>Export University Report</span>
        </button>
      </div>

      {/* Stats Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-black/5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Internships Active</span>
          <p className="text-3xl font-bold font-display text-slate-800 mt-1">{totalSubmissions}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-black/5">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Approved & Verified</span>
          <p className="text-3xl font-bold font-display text-emerald-600 mt-1">{approvedCount}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-black/5">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Awaiting Viva Review</span>
          <p className="text-3xl font-bold font-display text-amber-600 mt-1">{pendingCount}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-black/5">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Average Performance Score</span>
          <p className="text-3xl font-bold font-display text-indigo-600 mt-1">{avgScore}<span className="text-sm font-normal text-slate-400">/100</span></p>
        </div>
      </div>

      {/* Department Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {deptStats.map((item) => (
          <div key={item.dept} className="p-4 rounded-2xl bg-white border border-black/5 space-y-1 text-center shadow-xs">
            <span className="text-xs font-bold text-slate-800 font-display">{item.dept}</span>
            <p className="text-xl font-bold font-display text-[#DD3333]">{item.count}</p>
            <p className="text-[10px] text-slate-400">{item.approved} Approved</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-black/5 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or hiring company..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-black/10 text-xs text-slate-800 bg-white/50 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-black/10 text-xs text-slate-700 bg-white/80"
          >
            <option value="ALL">All Departments</option>
            <option value="CMPN">CMPN</option>
            <option value="IT">IT</option>
            <option value="EXCS">EXCS</option>
            <option value="EXTC">EXTC</option>
            <option value="BME">BME</option>
          </select>

          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="px-3 py-2 rounded-xl border border-black/10 text-xs text-slate-700 bg-white/80"
          >
            <option value="ALL">All Semesters</option>
            <option value="SEM_6">Semester 6</option>
            <option value="SEM_8">Semester 8</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-black/10 text-xs text-slate-700 bg-white/80"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="CORRECTION_REQUIRED">Correction Required</option>
          </select>
        </div>
      </div>

      {/* Internships Directory Table */}
      <div className="glass-card rounded-3xl p-6 border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/5 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Dept & Batch</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Employer Brand</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Final Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    No matching internship records found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{sub.student?.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{sub.student?.department || "CMPN"} • {sub.student?.batch || "2026"}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[10px]">
                        {sub.requirement?.semester?.replace("_", " ") || "SEM 6"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-600">{sub.companyName}</td>
                    <td className="py-3.5 px-4 text-slate-700">{sub.internshipRole}</td>
                    <td className="py-3.5 px-4 font-bold font-display">
                      {sub.finalScore || 0}/100 {sub.finalGrade ? `(${sub.finalGrade})` : ""}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase
                        ${sub.status === "APPROVED" ? "bg-emerald-50 text-emerald-600" :
                          sub.status === "CORRECTION_REQUIRED" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}
                      `}>
                        {sub.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
