"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  getCodingChallengesAction, runCodeSandboxAction, 
  submitCodeAction, analyzeCodeWithAIAction, getStudentCodingStatsAction 
} from "@/actions/assessments";
import { 
  ALL_CODING_CHALLENGES, CODING_COMPANIES_METADATA 
} from "@/lib/coding-challenges-data";
import { 
  Code, Play, Send, Sparkles, CheckCircle2, XCircle, 
  RefreshCw, Clock, Brain, Flame, Building, ArrowLeft,
  ChevronRight, BookOpen, Layers, Terminal, AlertCircle, Copy, Check, RotateCcw,
  Search, Filter, Lightbulb, ChevronDown, ChevronUp, Cpu, Award
} from "lucide-react";

export default function CodeArenaPage() {
  const [challenges, setChallenges] = useState(ALL_CODING_CHALLENGES);
  const [selectedChallenge, setSelectedChallenge] = useState(ALL_CODING_CHALLENGES[0]);
  const [stats, setStats] = useState({ totalSolved: 0, streakDays: 0, faangScore: 0 });
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showHints, setShowHints] = useState(false);

  // Code editor states
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(ALL_CODING_CHALLENGES[0].starterCode.javascript);
  const [activeTab, setActiveTab] = useState("testcases"); // testcases | aianalysis

  // Execution states
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load server-backed challenges and student stats
  const loadData = async () => {
    try {
      const [chalRes, statsRes] = await Promise.all([
        getCodingChallengesAction({ 
          difficulty: difficultyFilter, 
          company: selectedCompany !== "all" ? selectedCompany : undefined 
        }),
        getStudentCodingStatsAction()
      ]);

      if (chalRes?.success && chalRes.challenges?.length > 0) {
        setChallenges(chalRes.challenges);
        const match = chalRes.challenges.find(c => c.id === selectedChallenge?.id);
        if (match) {
          setSelectedChallenge(match);
        } else {
          selectChallenge(chalRes.challenges[0], language);
        }
      }

      if (statsRes?.success) {
        setStats(statsRes);
      }
    } catch (err) {
      console.warn("Could not load fresh challenges from server, falling back to local dataset:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [difficultyFilter, selectedCompany]);

  // Client-side filtering for instant response
  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      const matchCompany = selectedCompany === "all" || 
        c.companyId === selectedCompany || 
        c.company.toLowerCase().includes(selectedCompany.toLowerCase());
      
      const matchDiff = difficultyFilter === "ALL" || 
        c.difficulty.toUpperCase() === difficultyFilter.toUpperCase();

      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        c.title.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.tags?.some(t => t.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q);

      return matchCompany && matchDiff && matchSearch;
    });
  }, [challenges, selectedCompany, difficultyFilter, searchQuery]);

  const selectChallenge = (ch, lang = language) => {
    setSelectedChallenge(ch);
    const starter = ch?.starterCode?.[lang] || ch?.starterCode?.javascript || "// Write your code here";
    setCode(starter);
    setRunResult(null);
    setAiAnalysis(null);
    setShowHints(false);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const target = selectedChallenge || filteredChallenges[0] || ALL_CODING_CHALLENGES[0];
    if (target?.starterCode?.[newLang]) {
      setCode(target.starterCode[newLang]);
    }
  };

  // 1. Run Sandbox Tests
  const handleRunCode = async () => {
    const target = selectedChallenge || filteredChallenges[0] || ALL_CODING_CHALLENGES[0];
    const chId = target?.id || "algo-tcs-1";
    
    setRunning(true);
    setRunResult(null);
    setActiveTab("testcases");

    try {
      const res = await runCodeSandboxAction(chId, code, language);
      setRunResult(res);
    } catch (err) {
      setRunResult({ error: err.message || "Failed to execute code." });
    } finally {
      setRunning(false);
    }
  };

  // 2. Submit Solution to DB
  const handleSubmitCode = async () => {
    const target = selectedChallenge || filteredChallenges[0] || ALL_CODING_CHALLENGES[0];
    const chId = target?.id || "algo-tcs-1";

    setSubmitting(true);
    setRunResult(null);
    setActiveTab("testcases");

    try {
      const res = await submitCodeAction(chId, code, language);
      setRunResult(res);
      if (res?.allPassed) {
        const statsRes = await getStudentCodingStatsAction();
        if (statsRes?.success) setStats(statsRes);
        setChallenges(prev => prev.map(c => c.id === chId ? { ...c, isSolved: true } : c));
        if (selectedChallenge?.id === chId) {
          setSelectedChallenge(prev => ({ ...prev, isSolved: true }));
        }
      }
    } catch (err) {
      setRunResult({ error: err.message || "Submission failed." });
    } finally {
      setSubmitting(false);
    }
  };

  // 3. AI Complexity & Code Review
  const handleAiAnalysis = async () => {
    const target = selectedChallenge || filteredChallenges[0] || ALL_CODING_CHALLENGES[0];
    const chId = target?.id || "algo-tcs-1";

    setAnalyzing(true);
    setActiveTab("aianalysis");

    try {
      const res = await analyzeCodeWithAIAction(chId, code);
      if (res?.success) {
        setAiAnalysis(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyRefactored = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const activeChallenge = selectedChallenge || filteredChallenges[0] || ALL_CODING_CHALLENGES[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-left pb-20">
      {/* Top Header & Placement Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1C4980] mb-1.5">
            <Link href="/dashboard/student" className="hover:underline flex items-center gap-1 font-bold">
              <ArrowLeft className="h-3.5 w-3.5" /> Student Dashboard
            </Link>
            <span className="text-slate-300">•</span>
            <span className="bg-[#1C4980]/10 text-[#1C4980] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
              AUTHENTIC CODING REPOSITORY (100 PYQS)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Company Placement Code Arena
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Solve 100 genuine, repeatedly tested coding problems from official technical rounds of 10 major campus recruiters.
          </p>
        </div>

        {/* Live Metrics Pill Group */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-800 font-bold text-xs shadow-xs">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{stats?.streakDays || 0} Day Streak</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 font-bold text-xs shadow-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Solved: <strong className="text-emerald-700">{stats?.totalSolved || 0}</strong> / {challenges.length}</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200/70 text-indigo-800 font-bold text-xs shadow-xs">
            <Award className="h-4 w-4 text-indigo-600" />
            <span>10 Companies</span>
          </div>
        </div>
      </div>

      {/* Horizontal Company Navigator Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-3 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Select Company Placement Drive:
          </span>
          <span className="text-[11px] font-bold text-slate-500">
            Showing {filteredChallenges.length} of {challenges.length} Challenges
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CODING_COMPANIES_METADATA.map((comp) => {
            const isSelected = selectedCompany === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedCompany(comp.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1C4980] text-white shadow-md shadow-[#1C4980]/20 scale-[1.02]"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <span className="text-sm">{comp.logo}</span>
                <span>{comp.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                }`}>
                  {comp.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Layout: Left Problem List + Details, Right Editor */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Challenge Selection & Description */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Difficulty Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5 shadow-xs">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, algorithm, or title (e.g. DP, Two Pointers, Stock)..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 text-slate-800"
              />
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold uppercase transition-all cursor-pointer ${
                      difficultyFilter === diff
                        ? diff === "EASY" ? "bg-emerald-600 text-white" :
                          diff === "MEDIUM" ? "bg-amber-600 text-white" :
                          diff === "HARD" ? "bg-rose-600 text-white" :
                          "bg-[#1C4980] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {(selectedCompany !== "all" || difficultyFilter !== "ALL" || searchQuery) && (
                <button
                  onClick={() => { setSelectedCompany("all"); setDifficultyFilter("ALL"); setSearchQuery(""); }}
                  className="text-[11px] font-bold text-slate-500 hover:text-[#1C4980] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Problem List Stack */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {filteredChallenges.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No coding challenges match your filter. Try clearing filters or searching for another term.
              </div>
            ) : (
              filteredChallenges.map((ch) => {
                const isSelected = activeChallenge?.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => selectChallenge(ch)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#1C4980] bg-blue-50/50 shadow-xs ring-1 ring-[#1C4980]/20"
                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        ch.isSolved ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {ch.isSolved ? <CheckCircle2 className="h-4 w-4" /> : <span>{ch.companyLogo || "💻"}</span>}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate leading-snug">{ch.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                            <Building className="h-3 w-3" /> {ch.company}
                          </span>
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                            ch.difficulty === "EASY" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            ch.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-700 border border-amber-200" : 
                            "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {ch.difficulty}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono truncate hidden sm:inline">
                            {ch.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? "text-[#1C4980] translate-x-0.5" : "text-slate-400"}`} />
                  </button>
                );
              })
            )}
          </div>

          {/* Selected Problem Deep-Dive Card */}
          {activeChallenge && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs">{activeChallenge.companyLogo || "🏢"}</span>
                    <span className="text-[10px] font-bold text-[#1C4980] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                      {activeChallenge.company}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                      {activeChallenge.frequencyTag || "⭐ Campus Placement Classic"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-display text-slate-900 mt-1">
                    {activeChallenge.title}
                  </h3>
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shrink-0 ${
                  activeChallenge.difficulty === "EASY" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  activeChallenge.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>
                  {activeChallenge.difficulty}
                </span>
              </div>

              {/* Description Body */}
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                {activeChallenge.description}
              </div>

              {/* Examples */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sample Test Cases</p>
                {activeChallenge.examples?.map((ex, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                    <p className="font-bold text-slate-900 text-[11px]">Example {idx + 1}:</p>
                    <p className="font-mono text-[11px] text-slate-700"><strong>Input:</strong> {ex.input}</p>
                    <p className="font-mono text-[11px] text-slate-700"><strong>Output:</strong> {ex.output}</p>
                    {ex.explanation && (
                      <p className="text-[10px] text-slate-500 italic mt-0.5">Explanation: {ex.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Target Complexity Benchmarks */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white text-xs">
                <span className="font-semibold text-slate-300">
                  Target Time: <strong className="text-emerald-400 font-mono">{activeChallenge.timeComplexity}</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-semibold text-slate-300">
                  Target Space: <strong className="text-indigo-400 font-mono">{activeChallenge.spaceComplexity}</strong>
                </span>
              </div>

              {/* Hints Accordion */}
              {activeChallenge.hints && activeChallenge.hints.length > 0 && (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-amber-700">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <span>Need a Hint? ({activeChallenge.hints.length} available)</span>
                    </div>
                    {showHints ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </button>
                  {showHints && (
                    <div className="p-3 bg-white space-y-2 border-t border-slate-200">
                      {activeChallenge.hints.map((hint, hIdx) => (
                        <div key={hIdx} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="font-bold text-[#1C4980]">#{hIdx + 1}:</span>
                          <span>{hint}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Code Editor & Execution Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            {/* Editor Toolbar */}
            <div className="min-h-14 bg-slate-900 border-b border-slate-800 px-5 py-2.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 mr-1">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <div className="flex rounded-xl bg-slate-800 p-1">
                  <button
                    onClick={() => handleLanguageChange("javascript")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      language === "javascript" ? "bg-[#1C4980] text-white shadow-xs" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => handleLanguageChange("python")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      language === "python" ? "bg-[#1C4980] text-white shadow-xs" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Python 3
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiAnalysis}
                  disabled={analyzing}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {analyzing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-amber-400" />}
                  <span>AI Review</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={running || submitting}
                  className="px-4 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  {running ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                  <span>Run Tests</span>
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={submitting || running}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
                >
                  {submitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  <span>Submit</span>
                </button>
              </div>
            </div>

            {/* Code Textarea Area */}
            <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed min-h-[360px]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full h-full bg-transparent font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed"
                placeholder="// Write your solution function or test scripts here..."
              />
            </div>

            {/* Bottom Output Tray */}
            <div className="border-t border-slate-800 bg-slate-900 p-4 space-y-3">
              {/* Output Tabs */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveTab("testcases")}
                  className={`text-xs font-bold flex items-center gap-1.5 pb-1 cursor-pointer ${
                    activeTab === "testcases" ? "text-white border-b-2 border-[#1C4980]" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Test Case Results</span>
                  {runResult && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      runResult.allPassed ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                    }`}>
                      {runResult.allPassed ? "PASSED" : "FAILED"}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("aianalysis")}
                  className={`text-xs font-bold flex items-center gap-1.5 pb-1 cursor-pointer ${
                    activeTab === "aianalysis" ? "text-white border-b-2 border-[#1C4980]" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>AI Complexity & Code Review</span>
                </button>
              </div>

              {/* TAB CONTENT: Testcases */}
              {activeTab === "testcases" && (
                <div className="space-y-3">
                  {runResult ? (
                    runResult.error ? (
                      <div className="p-3.5 bg-rose-950/40 border border-rose-800/80 rounded-2xl text-rose-300 text-xs font-mono">
                        <p className="font-bold mb-1 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 text-rose-400" /> Execution Error
                        </p>
                        <p>{runResult.error}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold">
                            Status: <strong className={runResult.allPassed ? "text-emerald-400" : "text-rose-400"}>
                              {runResult.status}
                            </strong>
                          </span>
                          <span>Total Execution Time: <strong className="text-white">{runResult.totalRuntime} ms</strong></span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2">
                          {runResult.results?.map((tc) => (
                            <div
                              key={tc.testCaseIndex}
                              className={`p-3 rounded-2xl border text-xs font-mono space-y-1 ${
                                tc.passed
                                  ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-300"
                                  : "bg-rose-950/30 border-rose-800/60 text-rose-300"
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span>Test Case #{tc.testCaseIndex} {tc.isHidden && "(Hidden)"}</span>
                                <span>{tc.passed ? "✔ PASS" : "✖ FAIL"}</span>
                              </div>
                              <p className="text-[10px] opacity-80 truncate">Expected: {JSON.stringify(tc.expected)}</p>
                              <p className="text-[10px] opacity-80 truncate">Output: {JSON.stringify(tc.actual)}</p>
                              <p className="text-[9px] text-slate-400">{tc.runtimeMs} ms</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      Click <strong>&quot;Run Tests&quot;</strong> to test your solution against test cases or <strong>&quot;Submit&quot;</strong> to record placement score.
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: AI Analysis */}
              {activeTab === "aianalysis" && (
                <div>
                  {aiAnalysis ? (
                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="p-3 bg-slate-800 rounded-xl">
                          <p className="text-[9px] uppercase font-bold text-slate-400">Time Complexity</p>
                          <p className="text-sm font-extrabold text-emerald-400 mt-0.5">{aiAnalysis.timeComplexity}</p>
                        </div>
                        <div className="p-3 bg-slate-800 rounded-xl">
                          <p className="text-[9px] uppercase font-bold text-slate-400">Space Complexity</p>
                          <p className="text-sm font-extrabold text-indigo-400 mt-0.5">{aiAnalysis.spaceComplexity}</p>
                        </div>
                        <div className="p-3 bg-slate-800 rounded-xl">
                          <p className="text-[9px] uppercase font-bold text-slate-400">Efficiency Rating</p>
                          <p className="text-sm font-extrabold text-amber-400 mt-0.5">{aiAnalysis.rating}</p>
                        </div>
                        <div className="p-3 bg-slate-800 rounded-xl">
                          <p className="text-[9px] uppercase font-bold text-slate-400">FAANG Code Score</p>
                          <p className="text-sm font-extrabold text-white mt-0.5">{aiAnalysis.score}/100</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                        <p className="font-bold text-white mb-1">Architectural Review:</p>
                        <p className="text-slate-300 leading-relaxed">{aiAnalysis.analysis}</p>
                      </div>

                      {aiAnalysis.refactoredCode && (
                        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[11px] relative">
                          <div className="flex items-center justify-between text-slate-400 mb-1.5">
                            <span>Clean Production Refactoring:</span>
                            <button
                              onClick={() => handleCopyRefactored(aiAnalysis.refactoredCode)}
                              className="flex items-center gap-1 text-[10px] text-blue-400 hover:underline cursor-pointer"
                            >
                              {copiedCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                            </button>
                          </div>
                          <pre className="text-emerald-400 overflow-x-auto whitespace-pre">
                            {aiAnalysis.refactoredCode}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      Click <strong>&quot;AI Review&quot;</strong> to get a comprehensive Big-O analysis and clean code suggestions.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
