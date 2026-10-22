"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJobAction } from "@/actions/jobs";
import { Send, Plus, Trash2, CheckCircle } from "lucide-react";

export default function RecruiterPostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [requirements, setRequirements] = useState(["React experience", "Knowledge of SQL"]);
  const [reqInput, setReqInput] = useState("");

  const handleAddRequirement = () => {
    if (!reqInput.trim()) return;
    setRequirements([...requirements, reqInput.trim()]);
    setReqInput("");
  };

  const handleRemoveRequirement = (index) => {
    setRequirements(requirements.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const description = formData.get("description");
    const salaryRange = formData.get("salaryRange");
    const location = formData.get("location");
    const type = formData.get("type");

    const res = await createJobAction({
      title,
      description,
      salaryRange,
      location,
      type,
      requirements
    });

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess("Job drive successfully published on student board!");
      // Reset form
      e.target.reset();
      setRequirements([]);
      setTimeout(() => {
        router.push("/dashboard/recruiter");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto text-left space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
          Create Placement Drive
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Publish a new software role or internship for student application drives.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl text-xs font-semibold">
          <CheckCircle className="h-4.5 w-4.5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-semibold">
          <Trash2 className="h-4.5 w-4.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-zinc-800/80">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400">Position Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Frontend Engineer"
                className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Job Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Job Type</label>
              <select
                name="type"
                required
                className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg bg-transparent text-xs focus:outline-none"
              >
                <option value="FULL_TIME">Full Time Employment</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract Basis</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Job Location</label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. San Francisco, CA (Hybrid)"
                className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Salary CTC */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400">Salary Package / CTC (per annum)</label>
              <input
                type="text"
                name="salaryRange"
                placeholder="e.g. 15 - 20 LPA or $120,000"
                className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400">Job Description & Responsibilities</label>
              <textarea
                name="description"
                required
                rows="5"
                placeholder="Write a clear list of what the candidate will solve..."
                className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Requirements Manager */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-900">
            <label className="text-[10px] uppercase font-bold text-slate-400">Key Requirements / Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                placeholder="Add requirement bullet points..."
                className="flex-1 px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg bg-transparent text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
              {requirements.map((req, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-zinc-900/50 rounded-lg border border-slate-100 dark:border-zinc-800/40 text-xs">
                  <span className="text-slate-700 dark:text-zinc-300">{req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(index)}
                    className="text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-slate-950 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>Publish Job Drive</span>
          </button>
        </form>
      </div>
    </div>
  );
}
