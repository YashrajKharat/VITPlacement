"use client";

import { useState, useEffect } from "react";
import { getTpoDashboardAction, verifyCompanyAction } from "@/actions/dashboard";
import { 
  Building, Users, FileSpreadsheet, 
  ArrowDownToLine, TrendingUp, DollarSign, Award
} from "lucide-react";

export default function TpoDashboard() {
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");

  const loadTpoData = async () => {
    try {
      const res = await getTpoDashboardAction();
      if (res?.success) {
        setCompanies(res.companies || []);
        setStudents(res.students || []);
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTpoData();
  }, []);

  const handleVerifyCompany = async (companyId, status) => {
    setActionId(companyId);
    try {
      await verifyCompanyAction(companyId, status);
      await loadTpoData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId("");
    }
  };

  // Export report helpers
  const handleExportCSV = () => {
    const headers = "Student Name,Department,Applied Job,Company,CTC Package,Status\n";
    const rows = applications.map(app => 
      `"${app.student?.name}","${app.student?.department}","${app.job?.title}","${app.job?.company?.name}","${app.status === "OFFERED" ? "15 LPA" : "N/A"}","${app.status}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `Placement_Report_${new Date().toLocaleDateString()}.csv`);
    a.click();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(applications, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `Placement_Analytics_${new Date().toLocaleDateString()}.json`);
    a.click();
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading placement officer dashboard...</div>;
  }

  // Calculate statistics
  const totalStudents = students.length;
  const totalCompanies = companies.length;
  const pendingVerification = companies.filter(c => !c.isVerified);
  
  const placedStudentsCount = applications.filter(a => a.status === "OFFERED").length;
  const placementRate = totalStudents > 0 ? Math.round((placedStudentsCount / totalStudents) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Header welcome banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
            Placement Officer Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Overview of university placement drives, recruiter verification, and statistics reporting.
          </p>
        </div>

        {/* Export controls */}
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-1.5 cursor-pointer font-display"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer font-display"
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Stats Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement Rate</span>
            <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold font-display text-slate-800 dark:text-slate-200 mt-1">{placementRate}%</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest Package</span>
            <DollarSign className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1">48 LPA</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Package</span>
            <Award className="h-4.5 w-4.5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold font-display text-purple-500 mt-1">14.2 LPA</p>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Corporations</span>
            <Building className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <p className="text-3xl font-bold font-display text-slate-800 dark:text-slate-200 mt-1">{totalCompanies}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Pending Company verification list (Span 2) */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">Pending Employer Verifications</h2>
          
          {pendingVerification.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-zinc-500 py-6 text-center">No companies awaiting verification</p>
          ) : (
            <div className="space-y-3.5">
              {pendingVerification.map((comp) => (
                <div 
                  key={comp.id}
                  className="p-4 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl border border-slate-200/50 dark:border-zinc-800/30 flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{comp.name}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">{comp.website} • {comp.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerifyCompany(comp.id, true)}
                      disabled={actionId === comp.id}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer disabled:opacity-50 font-display"
                    >
                      Verify Company
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Campus statistics tables */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 space-y-6">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Department Stats</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-900/50">
              <span className="text-slate-600 dark:text-zinc-400">Computer Science</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">92% placed</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-900/50">
              <span className="text-slate-600 dark:text-zinc-400">Electronics</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">86% placed</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 dark:text-zinc-400">Mechanical Eng</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">74% placed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
