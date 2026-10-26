"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { 
  Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles, 
  Building2, GraduationCap, UserCheck, BookOpen, ArrowRight, CheckCircle2
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("STUDENT");

  // Controlled form states - starts clean, no dummy data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roleConfigs = {
    STUDENT: {
      name: "Student Candidate",
      description: "Access placement tests, code arena, AI mock interviews, and job applications.",
      icon: GraduationCap,
      placeholder: "student@college.edu or personal email",
      registerUrl: "/register?role=STUDENT"
    },
    RECRUITER: {
      name: "Corporate Recruiter",
      description: "Post jobs, screen verified candidate resumes, match applicants, and conduct interviews.",
      icon: Building2,
      placeholder: "recruiter@company.com or work email",
      registerUrl: "/register?role=RECRUITER"
    },
    TPO: {
      name: "Placement Officer (TPO)",
      description: "Manage campus drives, verify recruiter partnerships, and monitor institute placement statistics.",
      icon: UserCheck,
      placeholder: "tpo@college.edu",
      registerUrl: "/register?role=TPO"
    },
    FACULTY: {
      name: "Faculty & Coordinator",
      description: "Audit internship submissions, verify student credentials, and evaluate academic credits.",
      icon: BookOpen,
      placeholder: "faculty@college.edu",
      registerUrl: "/register?role=FACULTY"
    }
  };

  const currentRoleConfig = roleConfigs[selectedRole];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email address and password.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password.trim());
    
    try {
      const res = await loginAction(formData);

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.success && res.redirectUrl) {
        router.push(res.redirectUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred during sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glowing mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,51,102,0.05),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(28,73,128,0.05),transparent_45%)]" />

      <div className="w-full max-w-md relative z-10 space-y-6 my-6">
        {/* Logo Banner */}
        <div className="text-center">
          <div className="inline-flex h-13 w-13 rounded-2xl bg-[#1C4980] items-center justify-center text-white font-bold text-2xl shadow-lg shadow-[#1C4980]/20 mb-3 font-display">
            V
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-[#1C4980]">
            Sign In to Career Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vidyalankar Institute of Technology Placement & Career Management Cell
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/90 space-y-5 text-left">
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Persona Toggle Switch */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Login Persona:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              {[
                { id: "STUDENT", label: "Student", icon: GraduationCap },
                { id: "RECRUITER", label: "Recruiter", icon: Building2 },
                { id: "TPO", label: "TPO Cell", icon: UserCheck },
                { id: "FACULTY", label: "Faculty", icon: BookOpen }
              ].map((r) => {
                const IconComponent = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r.id);
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

          {/* Role Guidance Pill */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-[#1C4980]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#1C4980]" />
              <span>{currentRoleConfig.name}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {currentRoleConfig.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700" htmlFor="email">
                Registered Email Address
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
                  placeholder={currentRoleConfig.placeholder}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 focus:border-[#1C4980] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700" htmlFor="password">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#1C4980] hover:underline font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 focus:border-[#1C4980] transition-all placeholder:text-slate-400"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#1C4980]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          {/* Registration Redirect Banner */}
          <div className="pt-3 text-center space-y-2 text-xs border-t border-slate-100">
            <div className="text-slate-600">
              Don&apos;t have an account yet?{" "}
              <Link 
                href={currentRoleConfig.registerUrl} 
                className="text-[#1C4980] font-bold hover:underline inline-flex items-center gap-1"
              >
                Register as {currentRoleConfig.name} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
