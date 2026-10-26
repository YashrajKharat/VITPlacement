"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { askAiDriveCoachAction } from "@/actions/aiCoach";
import { getPostedDrivesAndInternshipsAction } from "@/actions/aiResumeOptimizer";
import { getStudentProfileAction } from "@/actions/dashboard";
import { 
  Bot, Send, Sparkles, ArrowLeft, RefreshCw, Briefcase, 
  Building2, GraduationCap, Award, CheckCircle2, ChevronDown, 
  FileText, ExternalLink, MessageSquare, Zap, Mic, MicOff, Copy, Check
} from "lucide-react";

function AiCoachContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";
  const initialCompany = searchParams.get("company") || "";
  const initialRole = searchParams.get("role") || "";

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);

  // Chat conversation state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Voice speech-to-text
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Initialize data and select target drive
  useEffect(() => {
    const init = async () => {
      try {
        const [drivesList, profileRes] = await Promise.all([
          getPostedDrivesAndInternshipsAction(),
          getStudentProfileAction()
        ]);

        const validDrives = drivesList || [];
        setDrives(validDrives);

        if (profileRes?.success && profileRes.student) {
          setStudent(profileRes.student);
        }

        // Find matched drive from query params or default to first
        let matched = null;
        if (initialJobId) {
          matched = validDrives.find(d => d.id === initialJobId);
        }
        if (!matched && initialCompany) {
          matched = validDrives.find(d => 
            d.company?.toLowerCase().includes(initialCompany.toLowerCase()) ||
            d.title?.toLowerCase().includes((initialRole || "").toLowerCase())
          );
        }
        if (!matched && validDrives.length > 0) {
          matched = validDrives[0];
        }

        setSelectedDrive(matched);

        // Seed initial welcoming message
        if (matched) {
          const companyName = matched.company;
          const roleTitle = matched.title;
          const studentSkills = profileRes?.student?.skills || ["JavaScript", "HTML/CSS", "Python"];
          const studentDept = profileRes?.student?.department || "CMPN";
          const studentCgpa = profileRes?.student?.cgpa || "8.5";

          // Request authentic initial analysis from coach
          const initialRes = await askAiDriveCoachAction({
            messages: [{ role: "user", content: "Analyze this drive and tell me what activities, projects, and certifications will strengthen my chances." }],
            studentProfile: profileRes?.student,
            jobDetails: matched,
            companyName,
            roleTitle
          });

          setMessages([
            {
              role: "assistant",
              content: initialRes.reply || `Hello! I'm your AI Placement & Drive Coach for **${companyName} (${roleTitle})**. Ask me for customized project ideas, certifications, interview topics, or Google XYZ resume bullets!`
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to load AI Coach data:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [initialJobId, initialCompany, initialRole]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Switch drive handler
  const handleSwitchDrive = async (driveId) => {
    const target = drives.find(d => d.id === driveId);
    if (!target) return;
    setSelectedDrive(target);
    setIsTyping(true);

    try {
      const res = await askAiDriveCoachAction({
        messages: [{ role: "user", content: `I am switching target to ${target.company} (${target.title}). Give me a fresh gap analysis and recommendations.` }],
        studentProfile: student,
        jobDetails: target,
        companyName: target.company,
        roleTitle: target.title
      });

      setMessages([
        {
          role: "assistant",
          content: res.reply
        }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  // Send message handler
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping || !selectedDrive) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await askAiDriveCoachAction({
        messages: newMessages,
        studentProfile: student,
        jobDetails: selectedDrive,
        companyName: selectedDrive.company,
        roleTitle: selectedDrive.title
      });

      if (res?.reply) {
        setMessages([...newMessages, { role: "assistant", content: res.reply }]);
      }
    } catch (err) {
      console.error("AI Coach reply error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "I encountered a momentary latency connecting to the career model. In general, focusing on real-world projects with measurable metrics, mastering core language internals, and highlighting verifiable certifications will substantially elevate your selection rate."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Voice speech recognition
  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(prev => prev ? `${prev} ${transcript}` : transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Quick prompt pills
  const promptPills = [
    { label: "🚀 3 High-Impact Projects", query: `Suggest 3 impressive, non-trivial production projects I should build to stand out for ${selectedDrive?.company || "Google"} (${selectedDrive?.title || "Frontend Developer"})` },
    { label: "📜 High-Value Certifications", query: `Which industry certifications will strengthen my chances of getting selected for ${selectedDrive?.company || "this company"}?` },
    { label: "🧠 Top Technical Interview Questions", query: `What are the exact technical questions and live coding rounds ${selectedDrive?.company || "this company"} asks for this role?` },
    { label: "📝 Google XYZ Resume Bullets", query: `Write 3 high-impact resume bullets in the Google XYZ format for this role that I can add to my resume.` },
    { label: "🗺️ 30-Day Preparation Roadmap", query: `Give me a structured 30-day week-by-week preparation roadmap to crack this drive.` }
  ];

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <RefreshCw className="h-8 w-8 text-[#1C4980] animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Initializing Dynamic AI Placement Coach...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-left pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1C4980] mb-1">
            <Link href="/dashboard/student/jobs" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Placement Drives
            </Link>
            <span>•</span>
            <Link href="/dashboard/student/resume-optimizer" className="hover:underline">
              AI Resume Optimizer
            </Link>
            <span>•</span>
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              DYNAMIC ADVISOR
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bot className="h-8 w-8 text-[#1C4980]" />
            AI Placement & Career Advisory Coach
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Contextual AI mentor analyzing target company hiring benchmarks, student resume gaps, and providing actionable project blueprints & certifications.
          </p>
        </div>

        {/* Target Drive Dropdown Switcher */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 min-w-[280px]">
            <Building2 className="h-4 w-4 text-[#1C4980] shrink-0" />
            <div className="flex-1">
              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                Target Drive / Opening:
              </label>
              <select
                value={selectedDrive?.id || ""}
                onChange={(e) => handleSwitchDrive(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                {drives.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.company} — {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Target Drive Context Banner */}
      {selectedDrive && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1C4980] to-blue-950 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-white/10 shrink-0">
              {selectedDrive.companyLogo || "🏢"}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-extrabold tracking-tight">
                  {selectedDrive.company}
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-200 border border-blue-300/30">
                  {selectedDrive.categoryLabel || selectedDrive.type}
                </span>
              </div>
              <p className="text-xs text-blue-100 font-semibold mt-0.5">
                Role: {selectedDrive.title} • Package: <span className="text-amber-300 font-bold">{selectedDrive.package}</span>
              </p>
              <p className="text-[11px] text-blue-200/80 mt-1 line-clamp-1">
                Location: {selectedDrive.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/dashboard/student/resume-optimizer`}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/15"
            >
              <FileText className="h-3.5 w-3.5 text-amber-300" />
              <span>Optimize Resume for this Role</span>
            </Link>
          </div>
        </div>
      )}

      {/* Chat Messages Feed Area */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[580px]">
        {/* Chat Feed */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
              >
                {!isUser && (
                  <div className="h-8 w-8 rounded-xl bg-[#1C4980] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] md:max-w-[78%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs relative group ${
                    isUser
                      ? "bg-[#1C4980] text-white rounded-tr-none font-medium"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none font-normal"
                  }`}
                >
                  {/* Markdown formatted content */}
                  <div className="space-y-2 whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Copy button for code/bullets */}
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                      title="Copy response"
                    >
                      {copiedIdx === idx ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                </div>

                {isUser && (
                  <div className="h-8 w-8 rounded-xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 shadow-xs mt-1 text-xs">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start animate-in fade-in duration-150">
              <div className="h-8 w-8 rounded-xl bg-[#1C4980] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="bg-white text-slate-600 border border-slate-200 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-xs">
                <div className="h-2 w-2 rounded-full bg-[#1C4980] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 rounded-full bg-[#1C4980] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 rounded-full bg-[#1C4980] animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-[11px] font-semibold text-slate-400 pl-1">
                  AI Placement Coach is analyzing requirements...
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggested Prompt Pills */}
        <div className="p-3 bg-slate-100/80 border-t border-slate-200/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
            <Sparkles className="h-3 w-3 text-amber-500" /> Quick Prompts:
          </span>
          {promptPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(pill.query)}
              disabled={isTyping}
              className="text-[11px] font-semibold bg-white hover:bg-blue-50 text-slate-700 hover:text-[#1C4980] border border-slate-200/90 hover:border-blue-300 py-1.5 px-3 rounded-xl shrink-0 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isListening 
                ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse" 
                : "border-slate-200 hover:bg-slate-100 text-slate-500"
            }`}
            title={isListening ? "Listening... click to stop" : "Voice input"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Ask about projects, certifications, or interview questions for ${selectedDrive?.company || "Google"}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30 focus:border-[#1C4980]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className="py-2.5 px-4 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AiCoachPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading AI Coach...</div>}>
      <AiCoachContent />
    </Suspense>
  );
}
