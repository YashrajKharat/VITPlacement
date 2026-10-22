"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction, getCompaniesListAction } from "@/actions/auth";
import { Eye, EyeOff, Lock, Mail, ShieldAlert, User, Building, Sparkles, Plus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("STUDENT");
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

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
        console.error(err);
        setSelectedCompanyId("new-company");
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const companyId = formData.get("companyId");
    const newCompanyName = formData.get("newCompanyName");

    const res = await registerAction({
      email,
      password,
      name,
      role,
      companyId,
      newCompanyName
    });

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
      {/* Background glowing mesh effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(221,51,51,0.04),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(221,51,51,0.04),transparent_45%)]" />

      <div className="w-full max-w-md relative z-10 space-y-6 my-8">
        {/* Logo Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-[#DD3333] items-center justify-center text-white font-bold text-2xl shadow-md shadow-[#DD3333]/20">
            V
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tighter uppercase text-slate-850 leading-none">
            Create <span className="text-[#DD3333]">Account.</span>
          </h1>
          <p className="text-xs text-slate-500">
            Join Vidyalankar Institute of Technology placement cell.
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl space-y-6 text-left">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-650 p-3.5 rounded-xl text-xs font-semibold animate-in fade-in duration-150">
              <ShieldAlert className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-4 p-1 bg-slate-100 rounded-xl border border-slate-200/50">
            {["STUDENT", "RECRUITER", "TPO", "ADMIN"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setError("");
                }}
                className={`py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  role === r
                    ? "bg-[#DD3333] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {r === "STUDENT" && "Student"}
                {r === "RECRUITER" && "Recruiter"}
                {r === "TPO" && "TPO"}
                {r === "ADMIN" && "Admin"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40 focus:border-[#DD3333] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

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
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40 focus:border-[#DD3333] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Recruiter-only selection */}
            {role === "RECRUITER" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="companyId">
                    Select Corporate Partner
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <select
                      id="companyId"
                      name="companyId"
                      required
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40 focus:border-[#DD3333] transition-all cursor-pointer"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                      <option value="new-company">[ + ] Add New Company / Other</option>
                    </select>
                  </div>
                </div>

                {selectedCompanyId === "new-company" && (
                  <div className="space-y-1.5 text-left animate-in slide-in-from-top-2 duration-200">
                    <label className="text-xs font-semibold text-[#DD3333]" htmlFor="newCompanyName">
                      New Company Name
                    </label>
                    <div className="relative">
                      <Plus className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-[#DD3333]" />
                      <input
                        id="newCompanyName"
                        name="newCompanyName"
                        type="text"
                        required
                        placeholder="e.g. Acme Corp, Google, Microsoft"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DD3333]/30 bg-white text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40 focus:border-[#DD3333] transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40 focus:border-[#DD3333] transition-all placeholder:text-slate-400"
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
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-[#DD3333] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Create Account</span>
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-[#DD3333] hover:underline font-semibold">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
