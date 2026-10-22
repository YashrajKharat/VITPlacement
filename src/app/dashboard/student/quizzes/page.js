"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getQuizzesAction, getQuizByIdAction, submitQuizAttemptAction, getStudentQuizCertificatesAction 
} from "@/actions/quizzes";
import { 
  HelpCircle, Clock, Award, CheckCircle2, XCircle, 
  ArrowRight, ArrowLeft, RefreshCw, Flame, Sparkles, 
  ShieldCheck, Printer, Star, BookOpen, Layers, Check
} from "lucide-react";

export default function QuizzesAssessmentPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("explore"); // explore | my_certificates

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
        if (certRes?.success) setCertificates(certRes.attempts);
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

  // QUIZ RUNNER INTERFACE
  if (activeQuiz) {
    const questions = activeQuiz.questions || [];
    const currentQ = questions[currentQuestionIndex];

    return (
      <div className="max-w-4xl mx-auto space-y-6 text-left pb-24">
        {/* Top Assessment Header */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{activeQuiz.category}</span>
            <h2 className="text-base font-bold text-white mt-0.5">{activeQuiz.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Clock */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl font-mono text-sm font-black ${
              timeLeftSeconds < 120 ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "bg-slate-800 text-emerald-400 border border-slate-700"
            }`}>
              <Clock className="h-4 w-4" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={() => { setActiveQuiz(null); setQuizResult(null); }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
            >
              Exit
            </button>
          </div>
        </div>

        {/* RESULTS SCREEN */}
        {quizResult ? (
          <div className="space-y-6">
            {/* Scorecard Summary */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                🎉
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Assessment Completed
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{activeQuiz.title}</h3>
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
                <div className="bg-gradient-to-br from-slate-900 via-[#1C4980] to-indigo-950 text-white p-6 md:p-8 rounded-3xl border-4 border-amber-400/80 shadow-xl text-center space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] text-amber-300 font-mono">
                    <span>OFFICIAL SKILL CERTIFICATION</span>
                    <span>ID: {quizResult.certificateId}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-slate-300">This is to certify that</p>
                    <h4 className="text-2xl font-serif font-bold text-amber-300">Yashraj Nana kharat</h4>
                    <p className="text-xs text-blue-100">
                      has successfully passed the verified assessment for
                    </p>
                    <p className="text-base font-bold text-white underline decoration-amber-400 underline-offset-4">
                      {activeQuiz.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 pt-3 border-t border-white/20">
                    <span>Issued by: <strong>Vidyalankar Institute of Technology</strong></span>
                    <span>Accuracy: <strong>{quizResult.accuracyPercent}%</strong></span>
                    <span>Date: <strong>{new Date().toISOString().split("T")[0]}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={handlePrintCertificate}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print / Save Certificate</span>
                  </button>
                  <button
                    onClick={() => { setActiveQuiz(null); setQuizResult(null); }}
                    className="px-5 py-2.5 rounded-xl bg-[#1C4980] text-white font-bold text-xs"
                  >
                    Back to Quizzes
                  </button>
                </div>
              </div>

              {/* Question Review Accordion */}
              {quizResult.attempt?.questionReview && (
                <div className="pt-6 border-t border-slate-100 text-left space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Detailed Question Review & Explanations:</h4>
                  <div className="space-y-3">
                    {quizResult.attempt.questionReview.map((qr, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border text-xs space-y-2 ${
                          qr.isCorrect ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">Question {idx + 1}: {qr.question}</span>
                          <span className={`font-bold ${qr.isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                            {qr.isCorrect ? "✔ Correct" : "✖ Incorrect"}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-0.5">
                          <p>Your Answer: <strong>{qr.options[qr.selected] || "Unanswered"}</strong></p>
                          {!qr.isCorrect && (
                            <p className="text-emerald-700">Correct Answer: <strong>{qr.options[qr.correctAnswer]}</strong></p>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 italic bg-white/70 p-2.5 rounded-xl border border-slate-200/50">
                          💡 <strong>Explanation:</strong> {qr.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ACTIVE QUESTION STEPPER */
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            {/* Progress Stepper */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-[#1C4980]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-1.5">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentQuestionIndex
                        ? "w-8 bg-[#1C4980]"
                        : userAnswers[idx] !== undefined
                        ? "w-4 bg-emerald-500"
                        : "w-4 bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                {currentQ?.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ?.options?.map((option, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#1C4980] bg-blue-50/50 text-[#1C4980] shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-6 w-6 rounded-full border flex items-center justify-center font-bold text-xs ${
                          isSelected ? "border-[#1C4980] bg-[#1C4980] text-white" : "border-slate-300 text-slate-500"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs font-semibold">{option}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-[#1C4980]" />}
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
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40"
              >
                Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  disabled={submittingQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1C4980] mb-1">
            <Link href="/dashboard/student" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <span>•</span>
            <span className="bg-blue-50 text-[#1C4980] px-2 py-0.5 rounded-full font-bold">CAMPUS PRACTICE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <HelpCircle className="h-7 w-7 text-indigo-600" />
            Practice Quizzes & Skill Assessments
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Timed MCQs covering placement tech rounds, TCS NQT, Google DSA sprints, and speed quantitative logic.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("explore")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "explore" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All Quizzes
          </button>
          <button
            onClick={() => setActiveTab("my_certificates")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "my_certificates" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            My Certificates ({certificates.length})
          </button>
        </div>
      </div>

      {activeTab === "explore" ? (
        <div className="grid md:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1C4980] font-bold text-[10px]">
                    {quiz.category}
                  </span>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    quiz.difficulty === "EASY" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                    quiz.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                    "bg-rose-50 text-rose-600 border border-rose-200"
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="font-display font-bold text-slate-900 text-base leading-snug">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {quiz.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{quiz.durationMinutes} Mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end text-amber-700 font-bold">
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    <span>+{quiz.unstopCoinsReward || 50} Coins</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="w-full py-2.5 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#1C4980]/15 transition-all cursor-pointer"
                >
                  <span>{quiz.isCompleted ? "Retake Assessment" : "Start Quiz"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* MY CERTIFICATES TAB */
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
              <Award className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No certificates earned yet</h3>
              <p className="text-xs text-slate-500">Take a skill quiz and score 60%+ to unlock verified certificates!</p>
              <button
                onClick={() => setActiveTab("explore")}
                className="px-4 py-2 rounded-xl bg-[#1C4980] text-white font-bold text-xs"
              >
                Take a Quiz
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
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px]">
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
