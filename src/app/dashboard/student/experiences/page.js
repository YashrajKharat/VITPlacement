"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getInterviewExperiencesAction, createInterviewExperienceAction, upvoteInterviewExperienceAction 
} from "@/actions/experiences";
import { 
  BookOpen, Building, ThumbsUp, Plus, Search, Filter, 
  CheckCircle2, AlertCircle, ArrowLeft, Star, Clock, 
  HelpCircle, Sparkles, MessageSquare, ChevronDown, ChevronUp, Share2, Award
} from "lucide-react";

export default function InterviewExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  // Expanded cards state
  const [expandedId, setExpandedId] = useState(null);

  // Modal for sharing experience
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "Software Development Engineer",
    package: "16.0 LPA",
    packageTier: "DREAM",
    verdict: "SELECTED",
    difficulty: "MEDIUM",
    cgpaRequired: "7.5+",
    summary: "",
    rounds: [
      { roundNumber: 1, title: "Online Assessment", duration: "90 Mins", details: "Coding & CS Fundamentals." },
      { roundNumber: 2, title: "Technical Interview 1", duration: "60 Mins", details: "DSA & Problem Solving." }
    ],
    tips: ["Practice core DSA patterns.", "Explain trade-offs clearly."]
  });

  const loadExperiences = async () => {
    try {
      const res = await getInterviewExperiencesAction({
        company: companyFilter,
        tier: tierFilter,
        department: departmentFilter,
        search: searchQuery
      });
      if (res?.success) {
        setExperiences(res.experiences || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, [companyFilter, tierFilter, departmentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadExperiences();
  };

  const handleUpvote = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await upvoteInterviewExperienceAction(id);
      if (res?.success) {
        setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, upvotes: res.upvotes } : exp));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateExperience = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createInterviewExperienceAction(formData);
      if (res?.success) {
        setShowModal(false);
        await loadExperiences();
      } else {
        alert(res?.error || "Failed to submit experience.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-left pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DD3333] mb-1">
            <Link href="/dashboard/student" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <span>•</span>
            <span className="bg-red-50 text-[#DD3333] px-2 py-0.5 rounded-full font-bold">ALUMNI KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Senior Placement Archive & Interview Guides
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified step-by-step interview round breakdowns, questions asked, and prep strategies from placed seniors.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-[#DD3333] hover:bg-[#c52b2b] text-white font-bold text-xs shadow-md shadow-[#DD3333]/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Share My Drive Experience</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, role, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DD3333]/20"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="text-xs font-semibold p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
          >
            <option value="ALL">All Companies</option>
            <option value="Morgan Stanley">Morgan Stanley</option>
            <option value="Barclays">Barclays</option>
            <option value="Stripe">Stripe</option>
            <option value="TCS">TCS Digital</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="text-xs font-semibold p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
          >
            <option value="ALL">All CTC Tiers</option>
            <option value="SUPER_DREAM">Super Dream (&gt;20 LPA)</option>
            <option value="DREAM">Dream (10-20 LPA)</option>
            <option value="REGULAR">Regular (&lt;10 LPA)</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs font-semibold p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
          >
            <option value="ALL">All Branches</option>
            <option value="CMPN">Computer Engg (CMPN)</option>
            <option value="IT">Information Tech (IT)</option>
            <option value="EXTC">Electronics & Telecom (EXTC)</option>
          </select>
        </div>
      </div>

      {/* Experience Cards Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 font-semibold text-slate-400">Loading placement archive...</div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">No interview experiences matching filters</p>
            <p className="text-xs text-slate-500">Be the first student to publish an interview experience for this company!</p>
          </div>
        ) : (
          experiences.map((exp) => {
            const isExpanded = expandedId === exp.id;
            return (
              <div 
                key={exp.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 transition-all hover:border-slate-300"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider">
                        {exp.company}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase">
                        {exp.package} • {exp.packageTier?.replace("_", " ")}
                      </span>
                      <span className="text-[11px] text-slate-400">• {exp.date}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">
                      {exp.role} Placement Drive Walkthrough
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Shared by <strong className="text-slate-800">{exp.studentName}</strong> • Department: {exp.department} • CGPA Cutoff: {exp.cgpaRequired || "7.5+"}
                    </p>
                  </div>

                  {/* Upvote Pill */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleUpvote(exp.id, e)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-[#DD3333] border border-slate-200/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ThumbsUp className="h-3.5 w-3.5 text-[#DD3333]" />
                      <span>{exp.upvotes || 0} Helpful</span>
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Summary Quote */}
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                  &quot;{exp.summary}&quot;
                </p>

                {/* EXPANDABLE SECTION: Round by Round Breakdown */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-2 border-t border-slate-100"
                  >
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      Detailed Round-by-Round Breakdown
                    </h4>

                    <div className="space-y-2.5">
                      {exp.rounds?.map((round, rIdx) => (
                        <div key={rIdx} className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#DD3333]">
                              Round {round.roundNumber || rIdx + 1}: {round.title}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {round.duration}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{round.details}</p>
                        </div>
                      ))}
                    </div>

                    {/* Senior Tips */}
                    {exp.tips?.length > 0 && (
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 space-y-1.5">
                        <p className="font-bold text-[11px] flex items-center gap-1.5 text-amber-800">
                          <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Key Advice from Senior:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-[11px]">
                          {exp.tips.map((tip, tIdx) => (
                            <li key={tIdx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* SHARE EXPERIENCE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Share Campus Placement Experience</h3>
                <p className="text-xs text-slate-500">Help juniors understand actual interview patterns and expectations.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExperience} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Morgan Stanley"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Technology Analyst"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Offered CTC / Package</label>
                  <input
                    type="text"
                    placeholder="e.g. 24.5 LPA"
                    value={formData.package}
                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Overall Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Drive Experience Summary & Overview</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline the overall placement drive process, topics tested, and main takeaways..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#DD3333] hover:bg-[#c52b2b] text-white text-xs font-bold shadow-sm"
                >
                  {submitting ? "Publishing..." : "Publish Experience"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
