"use client";

import { useState, useEffect } from "react";
import { getRecruiterCompanyAction, updateCompanyAction } from "@/actions/dashboard";
import { Save, CheckCircle, Building, Globe, MapPin } from "lucide-react";

export default function RecruiterCompanyPage() {
  const [session, setSession] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const res = await getRecruiterCompanyAction();
        if (res?.success) {
          setSession(res.session);
          setCompany(res.company);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCompany();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!company) return;
    setUpdating(true);
    setSuccess("");

    try {
      const res = await updateCompanyAction(company.id, {
        name: company.name,
        website: company.website,
        location: company.location,
        about: company.about
      });
      if (res?.success) {
        setSuccess("Company details updated! (TPO will verify new changes)");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading company details...</div>;
  }

  if (!company) {
    return <div className="text-center py-20">Company details not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto text-left space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
          Company Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Customize corporate recruitment cards presented to student applicants.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl text-xs font-semibold">
          <CheckCircle className="h-4.5 w-4.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-zinc-800/80 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-indigo-500" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Organization Settings</h3>
          </div>
          <span 
            className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider
              ${company.isVerified ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}
            `}
          >
            {company.isVerified ? "Verified Employer" : "Pending Verification"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="space-y-1.5 col-span-2">
            <label className="text-[10px] uppercase font-bold text-slate-400">Company Name</label>
            <input
              type="text"
              value={company.name || ""}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400">Website Address</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={company.website || ""}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400">HQ Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={company.location || ""}
                onChange={(e) => setCompany({ ...company, location: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400">Industry Sector</label>
            <input
              type="text"
              value={company.industry || ""}
              onChange={(e) => setCompany({ ...company, industry: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Logo URL */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400">Logo Image Link</label>
            <input
              type="text"
              value={company.logo || ""}
              onChange={(e) => setCompany({ ...company, logo: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 col-span-2">
            <label className="text-[10px] uppercase font-bold text-slate-400">Corporate Summary</label>
            <textarea
              value={company.description || ""}
              onChange={(e) => setCompany({ ...company, description: e.target.value })}
              rows="4"
              className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="w-full py-3 rounded-xl bg-slate-950 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
        >
          {updating ? (
            <div className="h-4 w-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
}
