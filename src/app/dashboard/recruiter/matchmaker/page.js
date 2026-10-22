"use client";

import { useState } from "react";
import { matchCandidatesAction } from "@/actions/ai";
import { Sparkles, Brain, Search, Mail } from "lucide-react";

export default function RecruiterMatchmaker() {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!jdText.trim() || jdText.trim().length < 10) {
      setError("Please paste a detailed job description.");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);

    try {
      const res = await matchCandidatesAction(jdText);
      if (res?.success) {
        setResults(res.matches || []);
      } else {
        setError(res?.error || "Matchmaker failed.");
      }
    } catch (err) {
      setError("Failed to query candidates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 text-left">
      <div className="glass-card rounded-3xl p-8 space-y-3 relative overflow-hidden">
        <div className="inline-block px-3 py-1 rounded-full border border-[#DD3333]/15 bg-[#DD3333]/5 text-[#DD3333] text-[9px] uppercase font-bold tracking-widest">
          [ Corporate Analytics ]
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-slate-800 uppercase tracking-tighter leading-none flex items-center gap-3">
          AI <span className="text-[#DD3333]">Matchmaker.</span>
        </h1>
        <p className="text-xs text-slate-500">
          Paste a Job Description (JD) below. The AI will cross-reference all student profiles, computing their technical compatibility index and fit reasons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Input JD Panel */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4 lg:col-span-1">
          <h2 className="text-sm font-bold uppercase tracking-tight text-slate-850 flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#DD3333]" />
            <span>Job Description Input</span>
          </h2>
          <form onSubmit={handleMatch} className="space-y-4">
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job description details, qualifications, and tech stack here..."
              rows={10}
              className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40 focus:border-[#DD3333] text-slate-800 transition-all leading-relaxed resize-none"
            />
            {error && (
              <p className="text-[10px] text-red-650 bg-red-50 p-2.5 rounded-xl font-semibold">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 hover:bg-[#DD3333] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display shadow-sm"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Analyze Candidate Pools</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-tight text-slate-850 flex items-center gap-2">
              <Search className="h-4 w-4 text-[#DD3333]" />
              <span>Ranked Candidates ({results.length})</span>
            </h2>
          </div>

          {loading && (
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-16 text-center space-y-3">
              <div className="h-8 w-8 border-4 border-[#DD3333] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Running semantic evaluation matrix...</p>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-16 text-center space-y-3">
              <Brain className="h-10 w-10 text-slate-350 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Matchmaker Results</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Paste a Job Description on the left panel to query candidate profiles.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((match, idx) => (
                <div 
                  key={match.studentId}
                  className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm hover:border-[#DD3333]/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left"
                >
                  <div className="space-y-3 flex-1 text-left">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold font-mono text-slate-400">#{idx + 1}</span>
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs uppercase">
                        {match.student?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{match.student?.name}</h4>
                        <p className="text-[10px] text-slate-500">{match.student?.department} • CGPA: {match.student?.cgpa || "N/A"}</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-650 bg-slate-50 p-3 rounded-xl border border-black/5 leading-relaxed font-sans text-left">
                      <span className="font-bold text-slate-800 uppercase tracking-wider text-[9px] block mb-1">AI Match Justification</span>
                      {match.fitReason}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(match.student?.skills || []).slice(0, 5).map((skill) => (
                        <span 
                          key={skill}
                          className="px-2 py-0.5 rounded-md border border-slate-100 bg-slate-50 text-slate-500 text-[9px] uppercase font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                      {(match.student?.skills || []).length > 5 && (
                        <span className="text-[9px] text-slate-400 font-bold self-center">
                          +{match.student.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match score visual and outreach */}
                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                    <div className="text-left md:text-right space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Match Score</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-display font-extrabold 
                          ${match.matchScore >= 80 ? "text-emerald-600" : match.matchScore >= 60 ? "text-amber-500" : "text-rose-500"}
                        `}>
                          {match.matchScore}%
                        </span>
                      </div>
                      <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all 
                            ${match.matchScore >= 80 ? "bg-emerald-500" : match.matchScore >= 60 ? "bg-amber-400" : "bg-rose-500"}
                          `} 
                          style={{ width: `${match.matchScore}%` }}
                        />
                      </div>
                    </div>

                    <a
                      href={`mailto:student@vit.edu`}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer font-display"
                    >
                      <Mail className="h-3.5 w-3.5 text-slate-450" />
                      <span>Contact</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
