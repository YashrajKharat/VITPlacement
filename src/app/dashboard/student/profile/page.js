"use client";

import { useState, useEffect, useRef } from "react";
import { getStudentProfileAction, updateStudentProfileAction, deleteStudentResumeAction } from "@/actions/dashboard";
import { autoFillResumeAction, analyzeResumeAction, uploadAndExtractResumeAction } from "@/actions/ai";
import { 
  User, Mail, Phone, Globe, FileText, Link2, Code,
  Plus, Trash2, Save, Sparkles, CheckCircle2, UploadCloud,
  FileUp, File, CheckCircle, AlertCircle, ArrowUpRight,
  Download, RefreshCw, X, Eye, ExternalLink, GraduationCap,
  Briefcase, FolderGit2, Layers, Award, Trash
} from "lucide-react";

export default function StudentProfilePage() {
  const [session, setSession] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  
  // Resume upload & parsing states
  const [activeTab, setActiveTab] = useState("file"); // "file" | "text"
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsingText, setParsingText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [extractedSummary, setExtractedSummary] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getStudentProfileAction();
        if (res?.success) {
          setSession(res.session);
          setStudent(res.student);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Skill Management Handlers
  const handleAddSkill = (skillToAdd) => {
    const raw = (skillToAdd || newSkill).trim();
    if (!raw) return;
    const items = raw.split(",").map(s => s.trim()).filter(Boolean);
    const existing = Array.isArray(student?.skills) ? student.skills : [];
    const updated = [...existing];
    items.forEach(item => {
      if (!updated.some(s => s.toLowerCase() === item.toLowerCase())) {
        updated.push(item);
      }
    });
    setStudent(prev => ({ ...prev, skills: updated }));
    setNewSkill("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill(newSkill);
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    if (!Array.isArray(student?.skills)) return;
    const newSkills = student.skills.filter((_, idx) => idx !== indexToRemove);
    setStudent(prev => ({ ...prev, skills: newSkills }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!student || !session) return;
    setUpdating(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await updateStudentProfileAction({
        name: student.name,
        phone: student.phone,
        bio: student.bio,
        cgpa: parseFloat(student.cgpa) || null,
        department: student.department,
        batch: student.batch,
        github: student.github,
        linkedin: student.linkedin,
        portfolio: student.portfolio,
        resumeUrl: student.resumeUrl,
        resumeText: student.resumeText,
        skills: student.skills,
        education: student.education,
        experience: student.experience,
        projects: student.projects,
        achievements: student.achievements,
        certificates: student.certificates
      });

      if (res?.success) {
        setSuccessMsg("Profile successfully updated and saved to database!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res?.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred while saving.");
    } finally {
      setUpdating(false);
    }
  };

  // Delete / Remove Attached Resume Handler
  const handleDeleteResume = async () => {
    if (!window.confirm("Are you sure you want to remove your attached resume from your profile?")) {
      return;
    }

    setDeletingResume(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await deleteStudentResumeAction();
      if (res?.success) {
        setStudent(prev => ({
          ...prev,
          resumeUrl: null,
          resumeText: null,
          atsScore: 0
        }));
        setSelectedFile(null);
        setExtractedSummary(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setSuccessMsg("Attached resume document has been successfully removed.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res?.error || "Failed to remove resume.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred while deleting the resume.");
    } finally {
      setDeletingResume(false);
    }
  };

  // 1. File Upload & Auto-fill Handler
  const handleFileUpload = async (fileToUpload) => {
    const file = fileToUpload || selectedFile;
    if (!file) {
      setErrorMsg("Please select a valid resume document.");
      return;
    }

    setParsing(true);
    setSuccessMsg("");
    setErrorMsg("");
    setExtractedSummary(null);

    try {
      setParsingStep("Uploading resume document...");
      const formData = new FormData();
      formData.append("resumeFile", file);

      setParsingStep("Extracting text and scanning structure...");
      const res = await uploadAndExtractResumeAction(formData);

      if (res?.error) {
        setErrorMsg(res.error);
        setParsing(false);
        return;
      }

      if (res?.success && res.profileData) {
        setParsingStep("AI structuring details and populating fields...");
        const data = res.profileData;

        // Populate and fully replace student profile fields with new CV data
        setStudent(prev => ({
          ...prev,
          name: data.name || session?.user?.name || "",
          phone: data.phone || "",
          department: data.department || "Computer Engineering",
          cgpa: data.cgpa ? parseFloat(data.cgpa) : null,
          batch: data.batch || "2026",
          bio: data.bio || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          portfolio: data.portfolio || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          education: Array.isArray(data.education) ? data.education : [],
          experience: Array.isArray(data.experience) ? data.experience : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          certificates: Array.isArray(data.certificates) ? data.certificates : [],
          achievements: Array.isArray(data.achievements) ? data.achievements : [],
          languages: Array.isArray(data.languages) ? data.languages : [],
          resumeUrl: res.fileUrl || "",
          resumeText: res.rawText || "",
          atsScore: res.atsScore || 75
        }));

        setExtractedSummary({
          fileName: res.fileName,
          fileUrl: res.fileUrl,
          name: data.name || session?.user?.name,
          department: data.department,
          cgpa: data.cgpa,
          batch: data.batch,
          skillsCount: Array.isArray(data.skills) ? data.skills.length : 0,
          educationCount: Array.isArray(data.education) ? data.education.length : 0,
          experienceCount: Array.isArray(data.experience) ? data.experience.length : 0,
          projectsCount: Array.isArray(data.projects) ? data.projects.length : 0,
          atsScore: res.atsScore
        });

        setSuccessMsg(`Resume "${res.fileName}" processed! Profile content replaced with new CV details.`);
        setSelectedFile(null);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to extract details from the uploaded resume.");
    } finally {
      setParsing(false);
      setParsingStep("");
    }
  };

  // 2. Text Auto-fill Handler
  const handleAutoFillFromText = async () => {
    if (!parsingText || parsingText.trim().length < 20) {
      setErrorMsg("Please paste a comprehensive resume text to extract details.");
      return;
    }
    setParsing(true);
    setSuccessMsg("");
    setErrorMsg("");
    setExtractedSummary(null);
    
    try {
      setParsingStep("Analyzing resume text & extracting candidate credentials...");
      const res = await autoFillResumeAction(parsingText);
      const scoreRes = await analyzeResumeAction(parsingText);
      
      if (res?.error) {
        setErrorMsg(res.error);
        setParsing(false);
        return;
      }

      if (res?.success && res.profileData) {
        const data = res.profileData;
        const atsScore = scoreRes?.atsScore || res.atsScore || 75;

        setStudent(prev => ({
          ...prev,
          name: data.name || session?.user?.name || "",
          phone: data.phone || "",
          department: data.department || "Computer Engineering",
          cgpa: data.cgpa ? parseFloat(data.cgpa) : null,
          batch: data.batch || "2026",
          bio: data.bio || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          portfolio: data.portfolio || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          education: Array.isArray(data.education) ? data.education : [],
          experience: Array.isArray(data.experience) ? data.experience : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          certificates: Array.isArray(data.certificates) ? data.certificates : [],
          achievements: Array.isArray(data.achievements) ? data.achievements : [],
          languages: Array.isArray(data.languages) ? data.languages : [],
          resumeText: parsingText,
          atsScore: atsScore
        }));

        setExtractedSummary({
          fileName: "Pasted Text Resume",
          fileUrl: null,
          name: data.name || session?.user?.name,
          department: data.department,
          cgpa: data.cgpa,
          batch: data.batch,
          skillsCount: Array.isArray(data.skills) ? data.skills.length : 0,
          educationCount: Array.isArray(data.education) ? data.education.length : 0,
          experienceCount: Array.isArray(data.experience) ? data.experience.length : 0,
          projectsCount: Array.isArray(data.projects) ? data.projects.length : 0,
          atsScore: atsScore
        });

        setSuccessMsg("Resume text parsed successfully! Profile form has been auto-populated.");
        setParsingText("");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred during resume text analysis.");
    } finally {
      setParsing(false);
      setParsingStep("");
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      handleFileUpload(files[0]);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="h-9 w-9 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading student profile...</p>
      </div>
    );
  }

  if (!student) {
    return <div className="text-center py-20">Student Profile not found. Please relogin.</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
            Professional Profile Builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Upload your resume or edit your credentials to apply for campus placement drives and job openings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {student.resumeUrl && (
            <a
              href={student.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-zinc-700"
            >
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              <span>View Current Resume</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={updating}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50 transition-all font-display"
          >
            {updating ? (
              <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div className="flex-1">{successMsg}</div>
          <button onClick={() => setSuccessMsg("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex-1">{errorMsg}</div>
          <button onClick={() => setErrorMsg("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 🚀 RESUME UPLOAD & PROFILE EXTRACTION MODULE */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-indigo-200/60 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-white dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-zinc-900/50 shadow-lg shadow-indigo-500/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Resume File Upload & Profile Auto-Fill
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  AI Powered
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Upload your resume file (.PDF, .DOCX, .TXT) to automatically extract your skills, education, experience, and projects.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-200/70 dark:bg-zinc-800/80 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("file")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "file"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Upload Document
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "text"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* Tab 1: File Upload Zone */}
        {activeTab === "file" && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt,.md,.rtf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="hidden"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !parsing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
                isDragging
                  ? "border-indigo-500 bg-indigo-500/10 scale-[0.99]"
                  : "border-slate-300 dark:border-zinc-700/80 bg-white/60 dark:bg-zinc-900/40 hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20"
              } ${parsing ? "pointer-events-none opacity-80" : ""}`}
            >
              {parsing ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="h-10 w-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display">
                      {parsingStep || "Processing Resume Document..."}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Extracting candidate name, CGPA, technical skills, education history, and projects...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span className="text-indigo-600 dark:text-indigo-400 hover:underline">Click to browse</span> or drag & drop your resume file here
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                      Supports PDF, DOCX, TXT, and Markdown (Max 10MB)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">.PDF</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">.DOCX</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">.TXT</span>
                  </div>
                </>
              )}
            </div>

            {/* If a file is selected manually */}
            {selectedFile && !parsing && (
              <div className="flex items-center justify-between p-3.5 bg-slate-100 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
                    title="Remove selected file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFileUpload(selectedFile)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Extract & Auto-Fill</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Text Paste Zone */}
        {activeTab === "text" && (
          <div className="space-y-3">
            <textarea
              value={parsingText}
              onChange={(e) => setParsingText(e.target.value)}
              placeholder="Paste plain text content of your resume here (e.g. from LinkedIn or Word)..."
              rows={4}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200 font-mono"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAutoFillFromText}
                disabled={parsing || !parsingText.trim()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-semibold shadow flex items-center gap-2 cursor-pointer disabled:opacity-50 font-display"
              >
                {parsing ? (
                  <div className="h-3.5 w-3.5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>Auto-Fill from Text</span>
              </button>
            </div>
          </div>
        )}

        {/* Extracted Details Pill Strip (Displayed when extraction completes) */}
        {extractedSummary && (
          <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/30 border border-indigo-500/20 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>Extracted & Filled Profile Data</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                ATS Rating: <strong className="text-emerald-500">{extractedSummary.atsScore || 78}/100</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              {extractedSummary.name && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300">
                  <User className="h-3 w-3 text-indigo-500" />
                  <strong>Name:</strong> {extractedSummary.name}
                </span>
              )}
              {extractedSummary.department && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300">
                  <GraduationCap className="h-3 w-3 text-purple-500" />
                  <strong>Dept:</strong> {extractedSummary.department}
                </span>
              )}
              {extractedSummary.cgpa && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300">
                  <Award className="h-3 w-3 text-amber-500" />
                  <strong>CGPA:</strong> {extractedSummary.cgpa}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300">
                <Code className="h-3 w-3 text-emerald-500" />
                <strong>Skills:</strong> {extractedSummary.skillsCount} detected
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300">
                <Briefcase className="h-3 w-3 text-blue-500" />
                <strong>Experience:</strong> {extractedSummary.experienceCount} entries
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300">
                <FolderGit2 className="h-3 w-3 text-pink-500" />
                <strong>Projects:</strong> {extractedSummary.projectsCount} found
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 italic">
              All extracted values are now loaded in the form below. Review them and click &quot;Save Changes&quot; when ready.
            </p>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Personal and social links */}
        <div className="lg:col-span-1 space-y-6">
          {/* Active Attached Resume Card */}
          {student.resumeUrl && (
            <div className="glass-card rounded-3xl p-5 border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span>Attached Resume Document</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Attached
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 break-all">
                {student.resumeUrl.split("/").pop()}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={student.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </a>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all border border-slate-200 dark:border-zinc-700"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  disabled={deletingResume}
                  className="py-1.5 px-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all border border-rose-200 dark:border-rose-900/50 disabled:opacity-50"
                  title="Delete attached resume document"
                >
                  {deletingResume ? (
                    <div className="h-3 w-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 space-y-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-500" />
              <span>Personal Details</span>
            </h3>
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={student.name || ""}
                  onChange={(e) => setStudent({ ...student, name: e.target.value })}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Department / Branch</label>
              <input
                type="text"
                value={student.department || ""}
                onChange={(e) => setStudent({ ...student, department: e.target.value })}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* CGPA */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">CGPA / GPA (Out of 10 or 4.0)</label>
              <input
                type="number"
                step="0.01"
                max="10"
                value={student.cgpa || ""}
                onChange={(e) => setStudent({ ...student, cgpa: e.target.value })}
                placeholder="e.g. 9.2"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Graduation Year */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Graduation Year (Batch)</label>
              <input
                type="text"
                value={student.batch || ""}
                onChange={(e) => setStudent({ ...student, batch: e.target.value })}
                placeholder="e.g. 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={student.phone || ""}
                  onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                  placeholder="e.g. +1 555-0199"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Short Bio / Summary</label>
              <textarea
                value={student.bio || ""}
                onChange={(e) => setStudent({ ...student, bio: e.target.value })}
                rows="3"
                placeholder="Brief introduction describing your engineering interests..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Social Profiles & Web Links */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 space-y-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-500" />
              <span>Professional Links</span>
            </h3>
            
            {/* Portfolio Link */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Portfolio Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={student.portfolio || ""}
                  onChange={(e) => setStudent({ ...student, portfolio: e.target.value })}
                  placeholder="https://yourportfolio.dev"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* LinkedIn Profile */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">LinkedIn Profile</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={student.linkedin || ""}
                  onChange={(e) => setStudent({ ...student, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* GitHub Profile */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">GitHub Profile</label>
              <div className="relative">
                <Code className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={student.github || ""}
                  onChange={(e) => setStudent({ ...student, github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills, Education, Experience, Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Technical Skills Area */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Code className="h-4 w-4 text-indigo-500" />
                <span>Technical Skills</span>
              </h3>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-zinc-700/60">
                {Array.isArray(student.skills) ? `${student.skills.length} skills added` : "0 skills"}
              </span>
            </div>

            {/* Input Box with Comma & Enter Support */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Code className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => {
                    if (e.target.value.includes(",")) {
                      handleAddSkill(e.target.value);
                    } else {
                      setNewSkill(e.target.value);
                    }
                  }}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter or comma (e.g. React, Python, Docker)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddSkill(newSkill)}
                disabled={!newSkill.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all font-display"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Active Skill Chips */}
            {Array.isArray(student.skills) && student.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
                {student.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 shadow-xs animate-in fade-in transition-all"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(sIdx)}
                      className="text-indigo-400 hover:text-rose-500 transition-colors p-0.5 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer ml-0.5"
                      title={`Remove ${skill}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                No skills added yet. Type a skill above and press Enter (or comma), or upload a resume.
              </p>
            )}

            {/* Quick Suggestions */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/60">
              <p className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Quick Suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {["React", "Node.js", "Next.js", "TypeScript", "Python", "Java", "Tailwind", "PostgreSQL", "MongoDB", "Docker", "AWS", "Git"].map((suggestion) => {
                  const alreadyHas = Array.isArray(student.skills) && student.skills.some(s => s.toLowerCase() === suggestion.toLowerCase());
                  if (alreadyHas) return null;
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleAddSkill(suggestion)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 border border-slate-200 dark:border-zinc-700 cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      <span>{suggestion}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Education Records */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                <span>Education Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setStudent({
                  ...student,
                  education: [...(student.education || []), { school: "", degree: "", startYear: "", endYear: "", grade: "" }]
                })}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Institution
              </button>
            </div>

            <div className="space-y-4">
              {(student.education || []).map((edu, index) => (
                <div key={index} className="p-4 bg-slate-50/70 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/50 rounded-2xl relative space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newList = [...student.education];
                      newList.splice(index, 1);
                      setStudent({ ...student, education: newList });
                    }}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                    <input
                      type="text"
                      placeholder="School / College / University"
                      value={edu.school || ""}
                      onChange={(e) => {
                        const newList = [...student.education];
                        newList[index].school = e.target.value;
                        setStudent({ ...student, education: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 md:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Degree / Program (e.g. B.Tech Computer Science)"
                      value={edu.degree || ""}
                      onChange={(e) => {
                        const newList = [...student.education];
                        newList[index].degree = e.target.value;
                        setStudent({ ...student, education: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Grade / CGPA (e.g. 9.2 CGPA)"
                      value={edu.grade || ""}
                      onChange={(e) => {
                        const newList = [...student.education];
                        newList[index].grade = e.target.value;
                        setStudent({ ...student, education: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                    <div className="grid grid-cols-2 gap-2 md:col-span-2">
                      <input
                        type="text"
                        placeholder="Start Year (e.g. 2022)"
                        value={edu.startYear || ""}
                        onChange={(e) => {
                          const newList = [...student.education];
                          newList[index].startYear = e.target.value;
                          setStudent({ ...student, education: newList });
                        }}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="End / Expected Year (e.g. 2026)"
                        value={edu.endYear || ""}
                        onChange={(e) => {
                          const newList = [...student.education];
                          newList[index].endYear = e.target.value;
                          setStudent({ ...student, education: newList });
                        }}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!student.education || student.education.length === 0) && (
                <p className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                  No education records yet. Click &quot;Add Institution&quot; or upload a resume to auto-fill.
                </p>
              )}
            </div>
          </div>

          {/* Work History / Experience */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-500" />
                <span>Work Experience & Internships</span>
              </h3>
              <button
                type="button"
                onClick={() => setStudent({
                  ...student,
                  experience: [...(student.experience || []), { company: "", role: "", duration: "", description: "" }]
                })}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {(student.experience || []).map((exp, index) => (
                <div key={index} className="p-4 bg-slate-50/70 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/50 rounded-2xl relative space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newList = [...student.experience];
                      newList.splice(index, 1);
                      setStudent({ ...student, experience: newList });
                    }}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                    <input
                      type="text"
                      placeholder="Company / Organization Name"
                      value={exp.company || ""}
                      onChange={(e) => {
                        const newList = [...student.experience];
                        newList[index].company = e.target.value;
                        setStudent({ ...student, experience: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Role / Title (e.g. Software Engineer Intern)"
                      value={exp.role || ""}
                      onChange={(e) => {
                        const newList = [...student.experience];
                        newList[index].role = e.target.value;
                        setStudent({ ...student, experience: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. Jun 2025 - Aug 2025)"
                      value={exp.duration || ""}
                      onChange={(e) => {
                        const newList = [...student.experience];
                        newList[index].duration = e.target.value;
                        setStudent({ ...student, experience: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 md:col-span-2"
                    />
                    <textarea
                      placeholder="Description of responsibilities, achievements, and impact..."
                      value={exp.description || ""}
                      onChange={(e) => {
                        const newList = [...student.experience];
                        newList[index].description = e.target.value;
                        setStudent({ ...student, experience: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 md:col-span-2"
                      rows="2"
                    />
                  </div>
                </div>
              ))}
              {(!student.experience || student.experience.length === 0) && (
                <p className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                  No work experience entries yet. Click &quot;Add Experience&quot; or upload a resume.
                </p>
              )}
            </div>
          </div>

          {/* Project Records */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-indigo-500" />
                <span>Personal & Academic Projects</span>
              </h3>
              <button
                type="button"
                onClick={() => setStudent({
                  ...student,
                  projects: [...(student.projects || []), { title: "", description: "", repoLink: "", liveLink: "" }]
                })}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-4">
              {(student.projects || []).map((proj, index) => (
                <div key={index} className="p-4 bg-slate-50/70 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/50 rounded-2xl relative space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newList = [...student.projects];
                      newList.splice(index, 1);
                      setStudent({ ...student, projects: newList });
                    }}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                    <input
                      type="text"
                      placeholder="Project Name / Title"
                      value={proj.title || ""}
                      onChange={(e) => {
                        const newList = [...student.projects];
                        newList[index].title = e.target.value;
                        setStudent({ ...student, projects: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 md:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Repository Link (e.g. https://github.com/...)"
                      value={proj.repoLink || ""}
                      onChange={(e) => {
                        const newList = [...student.projects];
                        newList[index].repoLink = e.target.value;
                        setStudent({ ...student, projects: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Live Demo URL (optional)"
                      value={proj.liveLink || ""}
                      onChange={(e) => {
                        const newList = [...student.projects];
                        newList[index].liveLink = e.target.value;
                        setStudent({ ...student, projects: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                    <textarea
                      placeholder="Project summary, technical stack used, and key features..."
                      value={proj.description || ""}
                      onChange={(e) => {
                        const newList = [...student.projects];
                        newList[index].description = e.target.value;
                        setStudent({ ...student, projects: newList });
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 md:col-span-2"
                      rows="2"
                    />
                  </div>
                </div>
              ))}
              {(!student.projects || student.projects.length === 0) && (
                <p className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                  No projects added yet. Click &quot;Add Project&quot; or auto-fill from your uploaded resume.
                </p>
              )}
            </div>
          </div>

          {/* Save Profile Button */}
          <button
            type="submit"
            disabled={updating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
          >
            {updating ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save & Persist Profile to Database</span>
          </button>
        </div>
      </form>
    </div>
  );
}
