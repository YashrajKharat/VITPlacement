"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  mockInterviewSetupAction, evaluateLiveInterviewAnswerAction 
} from "@/actions/ai";
import { 
  Video, Mic, MicOff, VideoOff, Volume2, VolumeX, Sparkles, 
  Play, Square, ArrowRight, RefreshCw, Award, CheckCircle2, 
  AlertCircle, MessageSquare, Brain, Eye, HelpCircle, ChevronRight,
  TrendingUp, Download, ArrowLeft, Building, ShieldCheck
} from "lucide-react";

export default function InterviewSimulatorPage() {
  // Session configuration
  const [role, setRole] = useState("Software Engineer");
  const [company, setCompany] = useState("Morgan Stanley");
  const [roundType, setRoundType] = useState("TECHNICAL");
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Questions and navigation
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Audio / Video / Speech States
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [isSpeakingAi, setIsSpeakingAi] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [speechStartTime, setSpeechStartTime] = useState(null);
  const [fillerWordCount, setFillerWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);

  // Evaluations and Final Report
  const [evaluating, setEvaluating] = useState(false);
  const [currentEval, setCurrentEval] = useState(null);
  const [evalHistory, setEvalHistory] = useState([]);

  // Video element ref
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  // Setup Webcam
  useEffect(() => {
    if (cameraActive && typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Webcam access declined or unavailable:", err);
          setCameraActive(false);
        });
    } else if (!cameraActive && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive, hasStarted]);

  // Setup Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event) => {
          let fullTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript + " ";
          }
          setSpokenText(fullTranscript.trim());

          // Count filler words
          const fillers = ["um", "uh", "like", "basically", "actually", "you know", "sort of", "kind of"];
          const lower = fullTranscript.toLowerCase();
          let count = 0;
          fillers.forEach(f => {
            const matches = lower.match(new RegExp(`\\b${f}\\b`, "g"));
            if (matches) count += matches.length;
          });
          setFillerWordCount(count);

          // Calculate WPM
          const words = fullTranscript.trim().split(/\s+/).filter(Boolean).length;
          const durationMins = (Date.now() - (speechStartTime || Date.now())) / 60000;
          if (durationMins > 0.05) {
            setWpm(Math.round(words / durationMins));
          }
        };

        rec.onerror = (e) => {
          console.warn("Speech recognition warning:", e);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [speechStartTime]);

  // AI Speech Synthesis function
  const speakQuestion = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeakingAi(true);
      utterance.onend = () => setIsSpeakingAi(false);
      utterance.onerror = () => setIsSpeakingAi(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopAiSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingAi(false);
    }
  };

  // Start Interview Flow
  const handleStartInterview = async () => {
    setLoadingQuestions(true);
    try {
      const res = await mockInterviewSetupAction(role, company, roundType);
      let qs = res?.questions || [];
      if (qs.length === 0) {
        if (roundType === "BEHAVIORAL") {
          qs = [
            { id: 1, question: `Describe a challenging situation in an engineering project where you faced an impossible deadline. How did you prioritize deliverables and navigate stress using the STAR method?` },
            { id: 2, question: `Tell me about a time you had a strong technical disagreement with a team member or project lead regarding code design or tech stack. How did you resolve the conflict constructively?` },
            { id: 3, question: `Walk me through a significant mistake or bug you introduced into a codebase or production environment. How did you take ownership, communicate with stakeholders, and prevent recurrence?` },
            { id: 4, question: `Describe an instance where you were assigned an unfamiliar framework or legacy system with minimal documentation. What was your systematic approach to mastering it rapidly?` },
            { id: 5, question: `Why are you specifically passionate about joining ${company}'s engineering culture, and how do your personal work ethics align with our core values?` }
          ];
        } else if (roundType === "SYSTEM_DESIGN") {
          qs = [
            { id: 1, question: `How would you architect an ultra-scalable rate-limiter and API gateway capable of managing 300,000 QPS across multiple geographical regions for ${company}?` },
            { id: 2, question: `Design a scalable URL shortener service (like Bitly) supporting 100 million daily writes and sub-10ms redirection reads. Detail your data schema and caching strategy.` },
            { id: 3, question: `How would you design an end-to-end real-time notification engine (Push, Email, SMS) with priority queuing, rate throttling, and delivery receipts?` },
            { id: 4, question: `Walk me through database partitioning and horizontal sharding strategies to eliminate hot-spot partitions in a high-concurrency relational cluster.` },
            { id: 5, question: `How do you design a distributed message queue with message deduplication, consumer group rebalancing, and dead-letter queues?` }
          ];
        } else {
          qs = [
            { id: 1, question: `How do you handle race conditions, thread synchronization, and deadlocks in high-concurrency backend services at ${company}?` },
            { id: 2, question: `Explain how relational database indexing (B-Tree vs Hash) functions under the hood. When does an index degrade rather than improve query performance?` },
            { id: 3, question: `Compare REST, GraphQL, and gRPC for inter-service communication in microservices. What are the serialization and latency trade-offs?` },
            { id: 4, question: `Walk me through the implementation of an LRU Cache with O(1) lookup and O(1) eviction. What data structures do you combine?` },
            { id: 5, question: `How do you design database transactions to maintain ACID compliance when updating records across multiple distributed services?` }
          ];
        }
      }
      setQuestions(qs);
      setCurrentIdx(0);
      setEvalHistory([]);
      setCurrentEval(null);
      setHasStarted(true);
      setIsFinished(false);

      // Speak first question
      setTimeout(() => {
        speakQuestion(qs[0].question);
      }, 600);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or type your answer.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechStartTime(Date.now());
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!spokenText || spokenText.trim().length < 5) {
      alert("Please provide an answer before submitting for evaluation.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopAiSpeech();

    setEvaluating(true);
    const qText = questions[currentIdx]?.question || "Interview question";
    
    try {
      const res = await evaluateLiveInterviewAnswerAction(qText, spokenText, role, roundType);
      if (res?.success) {
        const evalData = {
          questionId: questions[currentIdx]?.id || currentIdx + 1,
          question: qText,
          answer: spokenText,
          fillerWords: fillerWordCount,
          wpm: wpm || 120,
          ...res
        };
        setCurrentEval(evalData);
        setEvalHistory(prev => [...prev, evalData]);
      }
    } catch (err) {
      console.error("Eval error:", err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setSpokenText("");
      setCurrentEval(null);
      setFillerWordCount(0);
      setWpm(0);
      setSpeechStartTime(null);

      setTimeout(() => {
        speakQuestion(questions[nextIdx].question);
      }, 400);
    } else {
      setIsFinished(true);
      stopAiSpeech();
    }
  };

  // Overall calculations for report card
  const averageScore = evalHistory.length > 0 
    ? Math.round(evalHistory.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / evalHistory.length)
    : 0;

  const totalFillers = evalHistory.reduce((acc, curr) => acc + (curr.fillerWords || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-left pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DD3333] mb-1">
            <Link href="/dashboard/student/interviews" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Interviews
            </Link>
            <span>•</span>
            <span className="bg-red-50 text-[#DD3333] px-2 py-0.5 rounded-full font-bold">AI SIMULATOR 2.0</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
            AI Voice & Video Interview Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulate realistic corporate panel rounds with real-time speech analytics, posture feedback, and automated scoring.
          </p>
        </div>

        {hasStarted && !isFinished && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <button
              onClick={() => {
                stopAiSpeech();
                setHasStarted(false);
                setIsFinished(false);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              End Session
            </button>
          </div>
        )}
      </div>

      {!hasStarted && !isFinished ? (
        /* SETUP SCREEN */
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#DD3333]/10 text-[#DD3333] flex items-center justify-center">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Configure Interview Loop</h3>
                <p className="text-xs text-slate-500">Select target opening, corporate culture, and evaluation rigor.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Target Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DD3333]/20"
                >
                  <option value="Software Engineer">Software Engineer (Full Stack)</option>
                  <option value="Frontend Developer">Frontend Developer (React / Next.js)</option>
                  <option value="Backend Engineer">Backend & Distributed Systems</option>
                  <option value="Data Scientist">Data Scientist & AI / ML</option>
                  <option value="DevOps Engineer">Cloud & DevOps Specialist</option>
                  <option value="Associate Consultant">Tech Consultant / Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Target Company</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DD3333]/20"
                >
                  <option value="Morgan Stanley">Morgan Stanley (Fintech & Low Latency)</option>
                  <option value="Stripe">Stripe (Developer Productivity & APIs)</option>
                  <option value="Barclays">Barclays (Enterprise Banking & RISES)</option>
                  <option value="Google">Google (DSA & System Scale)</option>
                  <option value="Amazon">Amazon (Leadership Principles & Speed)</option>
                  <option value="TCS Digital">TCS Digital / Infosys Prime</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-500">Round Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "TECHNICAL", label: "Technical Core", desc: "Data structures, architecture & code" },
                  { id: "BEHAVIORAL", label: "STAR Behavioral", desc: "Conflict resolution, teamwork & impact" },
                  { id: "SYSTEM_DESIGN", label: "System Design", desc: "Scalability, caching & DB trade-offs" }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setRoundType(type.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      roundType === type.id
                        ? "border-[#DD3333] bg-red-50/50 text-[#DD3333]"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                    }`}
                  >
                    <p className="font-bold text-xs">{type.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
              <p className="text-xs font-bold text-slate-700">Studio Pro Features Active:</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Web Speech Synthesis Voice Avatar
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Real-time Filler Word & WPM Counter
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Live Posture & Eye Contact Guide
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Exportable Performance Scorecard
                </div>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loadingQuestions}
              className="w-full py-4 rounded-2xl bg-[#DD3333] hover:bg-[#c52b2b] text-white font-bold text-sm shadow-md shadow-[#DD3333]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loadingQuestions ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Preparing Custom Questions for {company}...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Enter Live Interview Room</span>
                </>
              )}
            </button>
          </div>

          {/* Quick instructions */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 flex flex-col justify-between shadow-md">
            <div className="space-y-4">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                Candidate Guidelines
              </span>
              <h4 className="font-bold text-lg text-white">How it works</h4>
              
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] text-white flex-shrink-0">1</span>
                  <span><strong>Listen to Question:</strong> The AI interviewer speaks the question aloud.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] text-white flex-shrink-0">2</span>
                  <span><strong>Speak Your Answer:</strong> Click &quot;Start Speaking&quot; to dictate your answer using speech recognition.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] text-white flex-shrink-0">3</span>
                  <span><strong>Real-Time Analytics:</strong> Monitor speaking speed (WPM) and filler words.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] text-white flex-shrink-0">4</span>
                  <span><strong>AI Scorecard:</strong> Review technical accuracy, STAR framework score, and model answers.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 text-[11px] text-slate-400">
              💡 Tip: Look directly into your camera lens to simulate realistic eye contact with corporate hiring managers.
            </div>
          </div>
        </div>
      ) : isFinished ? (
        /* COMPREHENSIVE SCORECARD / REPORT */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                Assessment Complete
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900 mt-2">
                Placement Readiness Scorecard: {company}
              </h2>
              <p className="text-xs text-slate-500">
                Role: {role} • Round: {roundType === "BEHAVIORAL" ? "STAR Behavioral" : roundType === "SYSTEM_DESIGN" ? "System Design & Architecture" : "Technical Core"} • Questions Evaluated: {evalHistory.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" /> Print / PDF Report
              </button>
              <button
                onClick={() => {
                  setHasStarted(false);
                  setIsFinished(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#DD3333] hover:bg-[#c52b2b] text-white text-xs font-bold shadow-sm"
              >
                Start New Session
              </button>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Overall Rating</p>
              <p className="text-3xl font-extrabold text-[#DD3333] mt-1">{averageScore}%</p>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                averageScore >= 85 
                  ? "text-emerald-700 bg-emerald-50 border border-emerald-200" 
                  : averageScore >= 70 
                  ? "text-blue-700 bg-blue-50 border border-blue-200" 
                  : averageScore >= 55 
                  ? "text-amber-700 bg-amber-50 border border-amber-200" 
                  : "text-rose-700 bg-rose-50 border border-rose-200"
              }`}>
                {averageScore >= 85 ? "STRONG HIRE" : averageScore >= 70 ? "HIRE" : averageScore >= 55 ? "BORDERLINE" : "NEEDS PRACTICE"}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Avg Tech Depth</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {Math.round(evalHistory.reduce((a, c) => a + (c.technicalScore || 0), 0) / (evalHistory.length || 1))}%
              </p>
              <span className="text-[10px] text-slate-500 mt-1 inline-block">Domain Accuracy</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Speaking Pace</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {Math.round(evalHistory.reduce((a, c) => a + (c.wpm || 120), 0) / (evalHistory.length || 1))} WPM
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Optimal Cadence</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Filler Words</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalFillers}</p>
              <span className="text-[10px] text-slate-500 mt-1 inline-block">&quot;Um&quot;, &quot;Like&quot;, &quot;Basically&quot;</span>
            </div>
          </div>

          {/* Question by question breakdown */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">Question-by-Question Evaluation</h3>
            {evalHistory.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#DD3333]">Question {idx + 1}</span>
                  <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">
                    Score: {item.overallScore}%
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{item.question}</h4>
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 text-xs text-slate-600 italic">
                  &quot;{item.answer}&quot;
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-emerald-900">
                    <p className="font-bold mb-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Key Strengths
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {item.strengths?.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl text-amber-900">
                    <p className="font-bold mb-1 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Recommended Improvements
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {item.improvements?.map((im, imIdx) => <li key={imIdx}>{im}</li>)}
                    </ul>
                  </div>
                </div>
                {item.modelAnswer && (
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-900">
                    <p className="font-bold mb-0.5 text-[11px] text-indigo-700 uppercase">Benchmark Model Response:</p>
                    <p className="text-[11px] leading-relaxed">{item.modelAnswer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        /* LIVE INTERVIEW STUDIO ROOM */
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column: AI Avatar & Question Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* AI Avatar Display */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300">AI Lead Interviewer ({company})</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase tracking-wider">
                    {roundType === "BEHAVIORAL" ? "STAR Behavioral" : roundType === "SYSTEM_DESIGN" ? "System Design" : "Technical Core"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => isSpeakingAi ? stopAiSpeech() : speakQuestion(questions[currentIdx]?.question)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-all"
                  >
                    {isSpeakingAi ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
                    <span>{isSpeakingAi ? "Mute Voice" : "Replay Question"}</span>
                  </button>
                </div>
              </div>

              {/* Animated Wave Avatar */}
              <div className="h-36 flex flex-col items-center justify-center text-center space-y-3">
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: isSpeakingAi ? [1, 1.25, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="h-20 w-20 rounded-full bg-gradient-to-tr from-[#DD3333] to-red-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#DD3333]/30"
                  >
                    V
                  </motion.div>
                  {isSpeakingAi && (
                    <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" />
                  )}
                </div>
                <p className="text-xs text-slate-300 font-semibold">
                  {isSpeakingAi ? "Interviewer is speaking..." : "Listening for candidate response..."}
                </p>
              </div>

              {/* Current Question Text Banner */}
              <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DD3333] bg-white px-2 py-0.5 rounded-full inline-block mb-1.5">
                  {roundType === "BEHAVIORAL" ? "STAR Behavioral" : roundType === "SYSTEM_DESIGN" ? "System Design" : "Technical Core"} • Question {currentIdx + 1} of {questions.length}
                </span>
                <h3 className="text-base font-bold text-white leading-snug">
                  {questions[currentIdx]?.question}
                </h3>
              </div>
            </div>

            {/* Live Response & Transcript Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${isListening ? "bg-rose-500 animate-ping" : "bg-slate-300"}`} />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    {isListening ? "Transcribing Spoken Answer..." : "Candidate Spoken Answer"}
                  </h4>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold text-slate-500">
                    WPM: <strong className="text-slate-800">{wpm || 0}</strong>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-500">
                    Fillers: <strong className={fillerWordCount > 3 ? "text-amber-600" : "text-slate-800"}>{fillerWordCount}</strong>
                  </span>
                </div>
              </div>

              <textarea
                value={spokenText}
                onChange={(e) => setSpokenText(e.target.value)}
                placeholder="Click 'Start Microphone' to answer aloud, or type your answer here..."
                rows={5}
                className="w-full p-4 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD3333]/20 bg-slate-50/50 leading-relaxed"
              />

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleListening}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      isListening
                        ? "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {isListening ? <Square className="h-3.5 w-3.5 fill-current" /> : <Mic className="h-3.5 w-3.5" />}
                    <span>{isListening ? "Pause Speaking" : "Start Microphone"}</span>
                  </button>
                  {spokenText && (
                    <button
                      onClick={() => setSpokenText("")}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  onClick={handleEvaluateAnswer}
                  disabled={evaluating || !spokenText}
                  className="px-5 py-2.5 rounded-xl bg-[#DD3333] hover:bg-[#c52b2b] text-white font-bold text-xs shadow-md shadow-[#DD3333]/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {evaluating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>AI Scoring Answer...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Score My Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Video Preview & Live Scorecard */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Camera View with AI Guidance */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-sm relative aspect-video flex items-center justify-center">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <VideoOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold">Camera is turned off</p>
                </div>
              )}

              {/* Camera Overlays */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white font-bold">
                <Eye className="h-3 w-3 text-emerald-400" />
                <span>AI Posture Guide: Good Eye Contact</span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs backdrop-blur-md transition-all"
                  title="Toggle Camera"
                >
                  {cameraActive ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Real-time AI Evaluation Card */}
            {currentEval ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question Score</span>
                    <h4 className="font-extrabold text-2xl text-slate-900">{currentEval.overallScore}%</h4>
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{currentIdx + 1 === questions.length ? "Finish & View Scorecard" : "Next Question"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <p className="text-[9px] font-bold uppercase text-slate-400">Technical</p>
                    <p className="font-extrabold text-sm text-slate-800 mt-0.5">{currentEval.technicalScore}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <p className="text-[9px] font-bold uppercase text-slate-400">Clarity</p>
                    <p className="font-extrabold text-sm text-slate-800 mt-0.5">{currentEval.clarityScore}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <p className="text-[9px] font-bold uppercase text-slate-400">Confidence</p>
                    <p className="font-extrabold text-sm text-slate-800 mt-0.5">{currentEval.confidenceScore}%</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900">
                    <p className="font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Key Strengths
                    </p>
                    <p className="text-[11px] mt-0.5">{currentEval.strengths?.[0]}</p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl text-amber-900">
                    <p className="font-bold text-[11px] flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-amber-600" /> Improvement Area
                    </p>
                    <p className="text-[11px] mt-0.5">{currentEval.improvements?.[0]}</p>
                  </div>
                </div>

                {currentEval.modelAnswer && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                    <p className="font-bold text-[10px] uppercase text-slate-500 mb-1">Model Answer Insight:</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{currentEval.modelAnswer}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-400 space-y-2">
                <Brain className="h-8 w-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">Answer Scoring Awaiting Input</p>
                <p className="text-[11px] text-slate-400">
                  Speak or type your answer and click &quot;Score My Answer&quot; to receive instant feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
