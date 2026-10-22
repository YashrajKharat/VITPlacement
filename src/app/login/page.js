"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Quick credentials for institutional access
  const quickAccounts = [
    { label: "Faculty Mentor", email: "faculty@college.edu", role: "Faculty" },
    { label: "Coordinator", email: "coordinator@college.edu", role: "Coordinator" },
    { label: "TPO Officer", email: "tpo@college.edu", role: "TPO" },
    { label: "Super Admin", email: "admin@portal.com", role: "Admin" },
  ];

  const handleQuickLogin = async (email) => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    if (emailInput && passwordInput) {
      emailInput.value = email;
      passwordInput.value = "password123";
      
      // Auto-submit login for maximum convenience
      setError("");
      setLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", "password123");
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.success && res.redirectUrl) {
        router.push(res.redirectUrl);
        router.refresh();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success && res.redirectUrl) {
      router.push(res.redirectUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glowing effects - matching VIT colors */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,51,102,0.04),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,204,0,0.04),transparent_45%)]" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo Banner */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-[#003366] items-center justify-center text-white font-bold text-2xl shadow-md shadow-[#003366]/20 mb-4 font-display">
            V
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-[#003366]">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access the Vidyalankar Institute of Technology placement & internship cell.
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="glass-card rounded-3xl p-8 shadow-xl space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 p-3.5 rounded-xl text-xs font-semibold">
              <ShieldAlert className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@university.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/40 focus:border-[#003366] transition-all placeholder:text-slate-400"
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
                  className="text-xs text-blue-900 hover:underline font-semibold"
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
                  placeholder="••••••••"
                  className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/40 focus:border-[#003366] transition-all placeholder:text-slate-400"
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
              className="w-full py-3.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Authenticate Session</span>
            </button>
          </form>

          {/* Quick Demo Access Pad */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-center gap-1.5">
              <span className="h-px w-8 bg-slate-200" />
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">1-Click Fast Pass Logins</span>
              <span className="h-px w-8 bg-slate-200" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {quickAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white/60 text-[10px] text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-350 transition-all text-left flex flex-col justify-between h-13 cursor-pointer shadow-2xs"
                >
                  <span className="text-[#003366]">{acc.label}</span>
                  <span className="font-normal text-slate-400 truncate text-[9px]">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-900 hover:underline font-semibold">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
