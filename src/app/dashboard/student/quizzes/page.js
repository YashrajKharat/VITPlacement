"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  getQuizzesAction, getQuizByIdAction, submitQuizAttemptAction, getStudentQuizCertificatesAction 
} from "@/actions/quizzes";
import { COMPANY_METADATA } from "@/lib/company-quizzes-data";
import { 
  HelpCircle, Clock, Award, CheckCircle2, XCircle, 
  ArrowRight, ArrowLeft, RefreshCw, Flame, Sparkles, 
  ShieldCheck, Printer, Star, BookOpen, Layers, Check,
  Search, Building2, TrendingUp, CheckCircle, Lightbulb, Compass
} from "lucide-react";

export default function QuizzesAssessmentPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("explore"); // explore | my_certificates
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [qRes, cRes] = await Promise.all([
        getQuizzesAction(),
        getStudentQuizCertificatesAction()
      ]);
      if (qRes?.success) setQuizzes(qRes.quizzes || []);
      if (cRes?.success) setCertificates(cRes.attempts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Timer countdown when taking a quiz
  useEffect(() => {
    if (!activeQuiz || quizResult) return;
    if (timeLeftSeconds <= 0) {
      handleFinishQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeQuiz, timeLeftSeconds, quizResult]);

  const handleStartQuiz = async (quizId) => {
    setLoading(true);
    try {
      const res = await getQuizByIdAction(quizId);
      if (res?.success) {
        setActiveQuiz(res.quiz);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setTimeLeftSeconds((res.quiz.durationMinutes || 10) * 60);
        setQuizResult(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleFinishQuiz = async () => {
    if (!activeQuiz) return;
    setSubmittingQuiz(true);
    try {
      const durationTaken = (activeQuiz.durationMinutes * 60) - timeLeftSeconds;
      const res = await submitQuizAttemptAction(activeQuiz.id, userAnswers, durationTaken);
      if (res?.success) {
        setQuizResult(res);
        // Refresh certificates list
        const certRes = await getStudentQuizCertificatesAction();
        if (certRes?.success) setCertificates(certRes.attempts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  // Filter quizzes by company and search query
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      // Company match
      if (selectedCompany !== "all") {
        const compMatch = 
          (quiz.companyId && quiz.companyId.toLowerCase() === selectedCompany.toLowerCase()) ||
          (quiz.company && quiz.company.toLowerCase().includes(selectedCompany.toLowerCase()));
        if (!compMatch) return false;
      }
      // Search match
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const inTitle = quiz.title?.toLowerCase().includes(q);
        const inDesc = quiz.description?.toLowerCase().includes(q);
        const inComp = quiz.company?.toLowerCase().includes(q);
        const inCat = quiz.category?.toLowerCase().includes(q);
        const inQuestions = quiz.questions?.some(
          item => item.question?.toLowerCase().includes(q) || item.topic?.toLowerCase().includes(q)
        );
        return inTitle || inDesc || inComp || inCat || inQuestions;
      }
      return true;
    });
  }, [quizzes, selectedCompany, searchQuery]);

  // ACTIVE QUIZ RUNNER INTERFACE
  if (activeQuiz) {
    const questions = activeQuiz.questions || [];
    const currentQ = questions[currentQuestionIndex];

    return (
      <div className="max-w-4xl mx-auto space-y-6 text-left pb-24">
        {/* Top Assessment Header */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeQuiz.companyLogo || "🏢"}</span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {activeQuiz.company || "Company"} • {activeQuiz.placementRound || "Placement Assessment"}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {activeQuiz.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown Clock */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl font-mono text-sm font-black ${
              timeLeftSeconds < 120 
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse" 
                : "bg-slate-800 text-emerald-400 border border-slate-700"
            }`}>
              <Clock className="h-4 w-4" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={() => { setActiveQuiz(null); setQuizResult(null); }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {/* RESULTS SCREEN */}
        {quizResult ? (
          <div className="space-y-6">
            {/* Scorecard Summary */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 text-center space-y-5 shadow-sm">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
                🎉
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Assessment Completed • Verified Score
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{activeQuiz.title}</h3>
                <p className="text-xs text-slate-500">
                  Target: {activeQuiz.company} Campus Recruitment Screening Benchmark
                </p>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</p>
                  <p className="text-xl font-black text-[#1C4980]">{quizResult.accuracyPercent}%</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Score</p>
                  <p className="text-xl font-black text-slate-900">{quizResult.correctCount} / {quizResult.totalQuestions}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Points Won</p>
                  <p className="text-xl font-black text-indigo-600">+{quizResult.earnedPoints}</p>
                </div>
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
                  <p className="text-[10px] font-bold text-amber-800 uppercase">Campus Coins</p>
                  <p className="text-xl font-black text-amber-700">+{quizResult.unstopCoinsEarned} 🪙</p>
                </div>
              </div>

              {/* CERTIFICATE DISPLAY */}
              <div className="pt-6 border-t border-slate-100 max-w-xl mx-auto">
                <div className="bg-gradient-to-br from-slate-900 via-[#0A2540] to-indigo-950 text-white p-6 md:p-8 rounded-3xl border-4 border-amber-400/80 shadow-2xl text-center space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] text-amber-300 font-mono">
                    <span className="flex items-center gap-1 font-bold">
                      <ShieldCheck className="h-4 w-4" /> VERIFIED RECRUITER MERIT CERTIFICATE
                    </span>
                    <span>ID: {quizResult.certificateId}</span>
                  </div>
                  <div className="space-y-1.5 py-2">
                    <p className="text-xs uppercase tracking-widest text-slate-300">This certifies that</p>
                    <h4 className="text-2xl md:text-3xl font-serif font-bold text-amber-300">
                      {quizResult.attempt?.studentName || "Candidate"}
                    </h4>
                    <p className="text-xs text-blue-100">
                      has demonstrated competence in verified placement questions for
                    </p>
                    <p className="text-base font-bold text-white underline decoration-amber-400 underline-offset-4">
                      {activeQuiz.company} • {activeQuiz.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 pt-3 border-t border-white/20">
                    <span>Issued by: <strong>Vidyalankar Institute of Technology</strong></span>
                    <span>Score: <strong>{quizResult.accuracyPercent}%</strong></span>
                    <span>Date: <strong>{new Date().toISOString().split("T")[0]}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-5">
                  <button
                    onClick={handlePrintCertificate}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print / Save Certificate</span>
                  </button>
                  <button
                    onClick={() => { setActiveQuiz(null); setQuizResult(null); }}
                    className="px-5 py-2.5 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                  >
                    Back to Quizzes
                  </button>
                </div>
              </div>

              {/* Question Review Accordion */}
              {quizResult.attempt?.questionReview && (
                <div className="pt-6 border-t border-slate-100 text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Detailed Question Review & Recruiter Insights:
                    </h4>
                    <span className="text-xs text-slate-500 font-semibold">
                      {quizResult.correctCount} of {quizResult.totalQuestions} Correct
                    </span>
                  </div>
                  <div className="space-y-3">
                    {quizResult.attempt.questionReview.map((qr, idx) => {
                      const origQ = questions[idx] || {};
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                            qr.isCorrect ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-[10px] text-slate-700">
                                  Q{idx + 1}
                                </span>
                                {origQ.frequencyTag && (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    {origQ.frequencyTag}
                                  </span>
                                )}
                              </div>
                              <p className="font-bold text-slate-900 text-xs sm:text-sm mt-1">{qr.question}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                              qr.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                            }`}>
                              {qr.isCorrect ? "✔ Correct" : "✖ Incorrect"}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 bg-white/60 p-3 rounded-xl border border-slate-200/60 space-y-1">
                            <p>Your Answer: <strong className={qr.isCorrect ? "text-emerald-700" : "text-rose-600"}>{qr.options[qr.selected] || "Unanswered"}</strong></p>
                            {!qr.isCorrect && (
                              <p className="text-emerald-700">Correct Answer: <strong>{qr.options[qr.correctAnswer]}</strong></p>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-700 bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-1 leading-relaxed">
                            <p>
                              💡 <strong>Technical Explanation:</strong> {qr.explanation}
                            </p>
                            {origQ.whyCompanyAsks && (
                              <p className="text-[#1C4980] font-semibold pt-1 border-t border-blue-200/50 mt-1">
                                🎯 <strong>Why {activeQuiz.company} asks this:</strong> {origQ.whyCompanyAsks}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ACTIVE QUESTION STEPPER */
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            {/* Progress Stepper & Metadata Header */}
            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1C4980]">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  {currentQ?.topic && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {currentQ.topic}
                    </span>
                  )}
                </div>

                {currentQ?.frequencyTag && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    {currentQ.frequencyTag}
                  </span>
                )}
              </div>

              {/* Progress Dots / Question Navigator */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentQuestionIndex
                        ? "w-8 bg-[#1C4980]"
                        : userAnswers[idx] !== undefined
                        ? "w-4 bg-emerald-500 hover:bg-emerald-600"
                        : "w-4 bg-slate-200 hover:bg-slate-300"
                    }`}
                    title={`Go to Question ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug whitespace-pre-line">
                {currentQ?.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-1">
                {currentQ?.options?.map((option, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#1C4980] bg-blue-50/60 text-[#1C4980] shadow-sm font-semibold"
                          : "border-slate-200 bg-white hover:border-slate-300 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-6 w-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? "border-[#1C4980] bg-[#1C4980] text-white" : "border-slate-300 text-slate-500"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs font-medium">{option}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-[#1C4980] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  disabled={submittingQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  {submittingQuiz ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>Submit Assessment</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // QUIZZES CATALOGUE VIEW
  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1C4980] mb-1.5">
            <Link href="/dashboard/student" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <span>•</span>
            <span className="bg-blue-50 text-[#1C4980] px-2.5 py-0.5 rounded-full font-bold">
              VERIFIED PLACEMENT PYQs
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="h-7 w-7 text-indigo-600" />
            Company-Specific Placement Practice Quizzes
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Practice authentic questions repeatedly tested in past campus placement drives & technical assessments of <strong>TCS, Google, Amazon, Microsoft, Infosys, Accenture, Wipro, Capgemini, Cognizant</strong>, and <strong>J.P. Morgan</strong>.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("explore")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "explore" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All Companies ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveTab("my_certificates")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "my_certificates" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            My Merit Certificates ({certificates.length})
          </button>
        </div>
      </div>

      {activeTab === "explore" ? (
        <div className="space-y-6">
          {/* SEARCH & RECRUITER FILTER BAR */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by company, topic (e.g. LRU, AVL, SQL, Kadane's, Bitwise, Bayes)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1C4980] focus:bg-white transition-all"
                />
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold px-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span>Showing <strong>{filteredQuizzes.length}</strong> Company Sprints</span>
              </div>
            </div>

            {/* Company Pills Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
              {COMPANY_METADATA.map((comp) => {
                const isSelected = selectedCompany === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompany(comp.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-[#1C4980] text-white shadow-md shadow-[#1C4980]/20"
                        : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    <span>{comp.icon}</span>
                    <span>{comp.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUIZ CARDS GRID */}
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
              <Compass className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No company quizzes found matching your search</h3>
              <p className="text-xs text-slate-500">Try clearing the search query or selecting "All Companies".</p>
              <button
                onClick={() => { setSelectedCompany("all"); setSearchQuery(""); }}
                className="px-4 py-2 rounded-xl bg-[#1C4980] text-white font-bold text-xs cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Company Badge & Difficulty */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl p-1.5 bg-slate-100 rounded-xl">{quiz.companyLogo || "🏢"}</span>
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                            {quiz.company || "Recruiter"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {quiz.category || "Placement"}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        quiz.difficulty === "EASY" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                        quiz.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                        "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>

                    {/* Placement Round & PYQ Frequency Banner */}
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-1 text-left">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1C4980]">
                        <Award className="h-3 w-3 text-indigo-500" />
                        <span>{quiz.placementRound || "Round 1: Online Technical Assessment"}</span>
                      </div>
                      {quiz.frequencyInfo && (
                        <p className="text-[10px] text-amber-700 font-semibold line-clamp-1">
                          {quiz.frequencyInfo}
                        </p>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-base leading-snug group-hover:text-[#1C4980] transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                        {quiz.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Metadata & Start Action */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-600 text-left">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-slate-400" />
                        <span>{quiz.totalQuestions || 6} PYQs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{quiz.durationMinutes} Mins</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end text-amber-700 font-bold">
                        <Flame className="h-3 w-3 text-amber-500" />
                        <span>+{quiz.unstopCoinsReward || 50} 🪙</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartQuiz(quiz.id)}
                      className="w-full py-2.5 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#1C4980]/15 transition-all cursor-pointer"
                    >
                      <span>{quiz.isCompleted ? "Retake Assessment" : "Start Company Quiz"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* MY CERTIFICATES TAB */
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
              <Award className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No verified company certificates earned yet</h3>
              <p className="text-xs text-slate-500">Take a company placement quiz and score 60%+ to unlock verified recruiter certificates!</p>
              <button
                onClick={() => setActiveTab("explore")}
                className="px-4 py-2 rounded-xl bg-[#1C4980] text-white font-bold text-xs cursor-pointer shadow-md mt-2"
              >
                Explore Company Quizzes
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-xl font-bold">
                      🏆
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-400">{cert.certificateId}</p>
                      <h4 className="font-bold text-xs text-slate-900 mt-0.5">{cert.quizTitle}</h4>
                      <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                        Score: {cert.accuracyPercent}% • +{cert.unstopCoinsEarned || 50} Coins
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px] border border-emerald-200">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
