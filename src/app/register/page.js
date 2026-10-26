"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerAction, getCompaniesListAction } from "@/actions/auth";
import { 
  Eye, EyeOff, Lock, Mail, ShieldAlert, User, Building2, Sparkles, 
  Plus, GraduationCap, UserCheck, BookOpen, Briefcase, Award, ArrowLeft, CheckCircle2
} from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role");

  const [role, setRole] = useState(
    ["STUDENT", "RECRUITER", "TPO", "FACULTY_MENTOR"].includes(initialRoleParam) 
      ? initialRoleParam 
      : "STUDENT"
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Student Fields
  const [department, setDepartment] = useState("CMPN");
  const [rollNumber, setRollNumber] = useState("");
  const [batch, setBatch] = useState("2026");
  const [cgpa, setCgpa] = useState("");
  const [division, setDivision] = useState("A");

  // Recruiter Fields
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("Technology & Software");
  const [companyLocation, setCompanyLocation] = useState("Mumbai / Hybrid");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [designation, setDesignation] = useState("");

  // Staff Fields
  const [employeeId, setEmployeeId] = useState("");
  const [facultyRole, setFacultyRole] = useState("FACULTY_MENTOR");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getCompaniesListAction();
        if (res?.success && res.companies?.length > 0) {
          setCompanies(res.companies);
          setSelectedCompanyId(res.companies[0].id);
        } else {
          setCompanies([]);
          setSelectedCompanyId("new-company");
        }
      } catch (err) {
        setSelectedCompanyId("new-company");
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in your full name, email, and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (role === "STUDENT" && !rollNumber.trim()) {
      setError("Please enter your Student Roll Number / PRN.");
      return;
    }

    if (role === "RECRUITER") {
      if (selectedCompanyId === "new-company" && !newCompanyName.trim()) {
        setError("Please enter your company's official name.");
        return;
      }
      if (!designation.trim()) {
        setError("Please enter your official recruiter designation.");
        return;
      }
    }

    setLoading(true);

    const submissionData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: role === "FACULTY_MENTOR" ? facultyRole : role,
      // Student
      department,
      rollNumber: rollNumber.trim(),
      batch,
      cgpa: cgpa ? parseFloat(cgpa) : null,
      division,
      // Recruiter
      companyId: selectedCompanyId,
      newCompanyName: newCompanyName.trim(),
      companyIndustry,
      companyLocation,
      companyWebsite,
      designation: designation.trim(),
      // Faculty / Staff
      employeeId: employeeId.trim()
    };

    try {
      const res = await registerAction(submissionData);

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.success && res.redirectUrl) {
        router.push(res.redirectUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Registration failed. Please check your network and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glowing effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(28,73,128,0.06),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,51,102,0.04),transparent_45%)]" />

      <div className="w-full max-w-xl relative z-10 space-y-6 my-8">
        {/* Logo Banner */}
        <div className="text-center">
          <div className="inline-flex h-13 w-13 rounded-2xl bg-[#1C4980] items-center justify-center text-white font-bold text-2xl shadow-lg shadow-[#1C4980]/20 mb-3 font-display">
            V
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-[#1C4980]">
            Create Portal Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vidyalankar Institute of Technology Placement & Corporate Recruiting System
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-5 text-left">
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Registering As:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              {[
                { id: "STUDENT", label: "Student", icon: GraduationCap },
                { id: "RECRUITER", label: "Recruiter", icon: Building2 },
                { id: "TPO", label: "TPO Officer", icon: UserCheck },
                { id: "FACULTY_MENTOR", label: "Faculty / Staff", icon: BookOpen }
              ].map((r) => {
                const IconComponent = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setRole(r.id);
                      setError("");
                    }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1C4980] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields: Name, Email, Password */}
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Full Name */}
              <div className="space-y-1 text-left sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700" htmlFor="name">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "RECRUITER" ? "Sarah Jenkins (HR Lead)" : "Aarav Sharma"}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 focus:border-[#1C4980] transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1 text-left sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700" htmlFor="email">
                  {role === "RECRUITER" ? "Corporate Work Email" : "Email Address"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === "RECRUITER" ? "recruiter@company.com" : "student@college.edu"}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 focus:border-[#1C4980] transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 text-left sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700" htmlFor="password">
                  Account Password (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 focus:border-[#1C4980] transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* STUDENT-SPECIFIC FIELDS */}
            {role === "STUDENT" && (
              <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C4980] mb-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>Student Academic Credentials</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Department */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="department">
                      Engineering Department
                    </label>
                    <select
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 cursor-pointer"
                    >
                      <option value="CMPN">Computer Engineering (CMPN)</option>
                      <option value="INFT">Information Technology (INFT)</option>
                      <option value="EXTC">Electronics & Telecom (EXTC)</option>
                      <option value="AIDS">Artificial Intelligence & Data Science (AIDS)</option>
                      <option value="BIOM">Biomedical Engineering (BIOM)</option>
                    </select>
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="rollNumber">
                      Roll Number / PRN
                    </label>
                    <input
                      id="rollNumber"
                      type="text"
                      required
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="e.g. 22102A0045"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Batch Year */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="batch">
                      Graduation Batch Year
                    </label>
                    <select
                      id="batch"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 cursor-pointer"
                    >
                      <option value="2027">Batch of 2027 (Second Year)</option>
                      <option value="2026">Batch of 2026 (Third Year)</option>
                      <option value="2025">Batch of 2025 (Final Year)</option>
                    </select>
                  </div>

                  {/* CGPA */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="cgpa">
                      Current Cumulative CGPA
                    </label>
                    <input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 8.75"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* RECRUITER-SPECIFIC FIELDS */}
            {role === "RECRUITER" && (
              <div className="space-y-3 p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C4980] mb-1">
                  <Building2 className="h-4 w-4" />
                  <span>Corporate Recruiting Organization Details</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Designation */}
                  <div className="space-y-1 text-left sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="designation">
                      Official Designation / Job Title
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="designation"
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Lead Campus Recruiter, University Talent Acquisition"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Company Selection */}
                  <div className="space-y-1 text-left sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="companyId">
                      Select Corporate Partner Company
                    </label>
                    <select
                      id="companyId"
                      required
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 cursor-pointer"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.industry ? `(${c.industry})` : ""}
                        </option>
                      ))}
                      <option value="new-company">[ + ] Register New Company / Hiring Partner</option>
                    </select>
                  </div>

                  {/* New Company Registration Sub-Form */}
                  {selectedCompanyId === "new-company" && (
                    <>
                      <div className="space-y-1 text-left sm:col-span-2">
                        <label className="text-xs font-semibold text-[#1C4980]" htmlFor="newCompanyName">
                          Company Legal Name
                        </label>
                        <input
                          id="newCompanyName"
                          type="text"
                          required
                          value={newCompanyName}
                          onChange={(e) => setNewCompanyName(e.target.value)}
                          placeholder="e.g. Morgan Stanley, Stripe, Barclays, Razorpay"
                          className="w-full px-3 py-2.5 rounded-xl border border-[#1C4980]/40 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 placeholder:text-slate-400"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-xs font-semibold text-slate-700" htmlFor="companyIndustry">
                          Industry Sector
                        </label>
                        <select
                          id="companyIndustry"
                          value={companyIndustry}
                          onChange={(e) => setCompanyIndustry(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs cursor-pointer"
                        >
                          <option value="Technology & Software">Technology & Cloud Software</option>
                          <option value="Banking & FinTech">Investment Banking & FinTech</option>
                          <option value="E-Commerce & Retail">E-Commerce & Supply Chain</option>
                          <option value="Consulting & Analytics">IT Consulting & Management</option>
                        </select>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-xs font-semibold text-slate-700" htmlFor="companyWebsite">
                          Official Website URL
                        </label>
                        <input
                          id="companyWebsite"
                          type="url"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          placeholder="https://company.com"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 placeholder:text-slate-400"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* TPO-SPECIFIC FIELDS */}
            {role === "TPO" && (
              <div className="space-y-3 p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-1">
                  <UserCheck className="h-4 w-4" />
                  <span>Training & Placement Officer Credentials</span>
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="designation">
                    Placement Cell Designation
                  </label>
                  <input
                    id="designation"
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Training & Placement Officer (TPO), Assistant TPO"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* FACULTY-SPECIFIC FIELDS */}
            {role === "FACULTY_MENTOR" && (
              <div className="space-y-3 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Academic Staff & Mentor Profile</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="facultyRole">
                      Faculty Responsibility
                    </label>
                    <select
                      id="facultyRole"
                      value={facultyRole}
                      onChange={(e) => setFacultyRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs cursor-pointer"
                    >
                      <option value="FACULTY_MENTOR">Faculty Mentor (Evaluator)</option>
                      <option value="INTERNSHIP_COORDINATOR">Department Internship Coordinator</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="employeeId">
                      Faculty Employee ID
                    </label>
                    <input
                      id="employeeId"
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g. VIT-FAC-401"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#1C4980]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display mt-2"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Complete Registration & Open Dashboard</span>
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1C4980] hover:underline font-bold">
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="h-8 w-8 border-3 border-[#1C4980]/30 border-t-[#1C4980] rounded-full animate-spin" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
