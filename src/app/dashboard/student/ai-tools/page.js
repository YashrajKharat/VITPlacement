"use client";

import { useState, useEffect } from "react";
import { getStudentProfileAction } from "@/actions/dashboard";
import { 
  analyzeResumeAction, analyzeSkillGapAction, careerCoachChatAction,
  mockInterviewSetupAction, evaluateMockAnswerAction, companyFitPredictorAction,
  generateResumeSuggestionsAction, generateCoverLetterAction, analyzePortfolioAction,
  codingInterviewAssistantAction, hrChatbotAction, generateEmailAction,
  generateRoadmapAction, analyzeJdAction, salaryNegotiatorCoachAction,
  generateColdEmailAction, generateProfileBioAction, evaluateStarAnswerAction
} from "@/actions/ai";
import { 
  Sparkles, FileText, Brain, MessageSquare, GraduationCap, 
  Layers, Code, Mail, ShieldAlert, Award, Compass, Send, CheckCircle,
  Plus, Play, RefreshCw, Star, Info
} from "lucide-react";

export default function StudentAiToolsPage() {
  const [session, setSession] = useState(null);
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("resume");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Input States
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [companyName, setCompanyName] = useState("Stripe");
  const [coachMsg, setCoachMsg] = useState("");
  const [coachChat, setCoachChat] = useState([
    { role: "assistant", content: "Hi! I'm your AI Career Coach. Ask me about interview prep, resume structures, or salary negotiations." }
  ]);
  const [hrMsg, setHrMsg] = useState("");
  const [hrChat, setHrChat] = useState([
    { role: "assistant", content: "Hello! I'm the HR screening assistant. What is your notice period and preferred base salary location?" }
  ]);
  
  // Mock Interview States
  const [mockQuestions, setMockQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [mockFeedback, setMockFeedback] = useState(null);

  // STAR Coach States
  const [starSubTab, setStarSubTab] = useState("TECH"); // TECH or STAR
  const [starSituation, setStarSituation] = useState("");
  const [starTask, setStarTask] = useState("");
  const [starAction, setStarAction] = useState("");
  const [starResult, setStarResult] = useState("");
  const [starFeedback, setStarFeedback] = useState(null);

  // HTML5 Voice Recognition States
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";
        
        rec.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setAnswerText(transcript);
        };
        
        rec.onerror = (e) => {
          console.error("Speech recognition error:", e);
          setIsRecording(false);
        };
        
        rec.onend = () => {
          setIsRecording(false);
        };
        
        setRecognition(rec);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome.");
      return;
    }
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // Portfolio Analyzer States
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [portfolioResult, setPortfolioResult] = useState(null);

  // Coding Helper States
  const [problemDesc, setProblemDesc] = useState("Write a function to check if a binary tree is symmetric.");
  const [studentCode, setStudentCode] = useState("function isSymmetric(root) {\n  return true;\n}");
  const [codeReview, setCodeReview] = useState(null);

  // Output States
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [emailTemplates, setEmailTemplates] = useState(null);
  const [customRoadmap, setCustomRoadmap] = useState(null);
  const [jdAnalysis, setJdAnalysis] = useState(null);
  const [negotiationScript, setNegotiationScript] = useState(null);
  const [profileBioSuggestions, setProfileBioSuggestions] = useState(null);
  const [fitPrediction, setFitPrediction] = useState(null);

  // Activity Loaders
  const [runningAction, setRunningAction] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getStudentProfileAction();
        if (res?.success) {
          setStudent(res.student);
          if (res.student?.resumeText) {
            setResumeText(res.student.resumeText);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const triggerResumeAnalysis = async () => {
    setRunningAction("resume");
    const res = await analyzeResumeAction(resumeText);
    if (res?.success) {
      setResumeAnalysis(res);
      // Generate headlines and bios suggestions
      const bioRes = await generateProfileBioAction(resumeText);
      if (bioRes?.success) {
        setProfileBioSuggestions(bioRes);
      }
      setSuccess("Resume ATS scan and bio generation complete!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setRunningAction("");
  };

  const triggerSkillGapAnalysis = async () => {
    if (!student) return;
    setRunningAction("skillgap");
    const res = await analyzeSkillGapAction(student.id, jdText);
    const jdRes = await analyzeJdAction(jdText);
    const roadmapRes = await generateRoadmapAction(targetRole);

    if (res?.success) {
      setSkillGapAnalysis(res);
      setJdAnalysis(jdRes);
      setCustomRoadmap(roadmapRes);
      setSuccess("ATS Skill Gap matching, JD analysis, and Roadmap complete!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setRunningAction("");
  };

  const sendCoachMessage = async () => {
    if (!coachMsg.trim()) return;
    const updatedChat = [...coachChat, { role: "user", content: coachMsg }];
    setCoachChat(updatedChat);
    setCoachMsg("");
    setRunningAction("coach");

    const res = await careerCoachChatAction(updatedChat);
    if (res?.success) {
      setCoachChat([...updatedChat, { role: "assistant", content: res.reply }]);
    }
    setRunningAction("");
  };

  const sendHrMessage = async () => {
    if (!hrMsg.trim()) return;
    const updatedChat = [...hrChat, { role: "user", content: hrMsg }];
    setHrChat(updatedChat);
    setHrMsg("");
    setRunningAction("hr");

    const res = await hrChatbotAction(updatedChat);
    if (res?.success) {
      setHrChat([...updatedChat, { role: "assistant", content: res.reply }]);
    }
    setRunningAction("");
  };

  const setupMockInterview = async () => {
    setRunningAction("interview-setup");
    const res = await mockInterviewSetupAction(targetRole, companyName);
    const fitRes = await companyFitPredictorAction(student?.id || "temp", companyName);
    
    if (res?.success) {
      setMockQuestions(res.questions);
      setCurrentQIndex(0);
      setAnswerText("");
      setMockFeedback(null);
      setFitPrediction(fitRes);
      setSuccess(`Mock interview loaded for ${companyName}!`);
      setTimeout(() => setSuccess(""), 3000);
    }
    setRunningAction("");
  };

  const evaluateMockAnswer = async () => {
    if (!answerText.trim() || mockQuestions.length === 0) return;
    setRunningAction("interview-eval");
    const currentQ = mockQuestions[currentQIndex].question;
    
    const res = await evaluateMockAnswerAction(currentQ, answerText);
    if (res?.success) {
      setMockFeedback(res);
      setSuccess("Answer evaluated!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setRunningAction("");
  };

  const triggerStarEvaluation = async () => {
    if (!starSituation.trim() || !starTask.trim() || !starAction.trim() || !starResult.trim()) {
      setError("Please fill in all Situation, Task, Action, and Result fields.");
      return;
    }
    setError("");
    setRunningAction("star-eval");
    setStarFeedback(null);

    const res = await evaluateStarAnswerAction(starSituation, starTask, starAction, starResult);
    if (res?.success) {
      setStarFeedback(res);
      setSuccess("AI STAR behavioral analysis complete!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(res?.error || "Failed to analyze response.");
    }
    setRunningAction("");
  };

  const generateDocuments = async () => {
    if (!student) return;
    setRunningAction("docs");
    
    const letterRes = await generateCoverLetterAction(student.id, targetRole, companyName);
    const referralRes = await generateEmailAction("REFERRAL", "Jane Recruiter", companyName, targetRole);
    const followUpRes = await generateEmailAction("FOLLOW_UP", "Interview Loop", companyName, targetRole);
    const coldRes = await generateColdEmailAction(companyName, "Engineering Lead");
    const negotiateRes = await salaryNegotiatorCoachAction({ currentOffer: "12 LPA" }, "16 LPA");

    if (letterRes?.success) {
      setCoverLetter(letterRes.coverLetter);
      setEmailTemplates({
        referral: referralRes,
        followUp: followUpRes,
        cold: coldRes
      });
      setNegotiationScript(negotiateRes);
      setSuccess("Cover letter, Cold Email sheets, and Negotiation scripts prepared!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setRunningAction("");
  };

  const triggerPortfolioAnalysis = async () => {
    if (!portfolioUrl) return;
    setRunningAction("portfolio");
    const res = await analyzePortfolioAction(portfolioUrl);
    if (res?.success) {
      setPortfolioResult(res);
      setSuccess("Portfolio scans completed!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setRunningAction("");
  };

  const triggerCodeReview = async () => {
    if (!studentCode) return;
    setRunningAction("code");
    const res = await codingInterviewAssistantAction(problemDesc, studentCode);
    if (res?.success) {
      setCodeReview(res);
      setSuccess("Code optimization review complete!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setRunningAction("");
  };

  if (loading) {
    return <div className="text-center py-20 font-semibold text-slate-400">Loading Student AI suite...</div>;
  }

  const aiTabs = [
    { id: "resume", name: "ATS Resume Scan", icon: FileText },
    { id: "skillgap", name: "Skill Gaps", icon: Layers },
    { id: "coach", name: "Coach Chatbots", icon: MessageSquare },
    { id: "mock", name: "Mock Interviews", icon: Award },
    { id: "docs", name: "Job Docs Builder", icon: Mail },
    { id: "portfolio", name: "Portfolio Analyzer", icon: Compass },
    { id: "coding", name: "Code Assistant", icon: Code }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      <div className="space-y-3">
        <div className="inline-block px-3 py-1 rounded-full border border-[#DD3333]/15 bg-[#DD3333]/5 text-[#DD3333] text-[9px] uppercase font-bold tracking-widest">
          [ ! ] Vidyalankar Institute of Technology • AI Suite
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-slate-800 uppercase tracking-tighter leading-none">
          AI Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DD3333] via-red-500 to-rose-600">Suite.</span>
        </h1>
        <p className="text-xs text-slate-500">
          Utilize custom algorithms to audit your profile, practice interviews, and generate letters.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-xs font-semibold">
          <CheckCircle className="h-4.5 w-4.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-2 border-b border-black/5 pb-3">
        {aiTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer
                ${activeTab === tab.id
                  ? "bg-[#DD3333] text-white border-transparent shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Tab Inputs Panel */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-tight">[ AI Input Panel ]</h3>

          {/* TAB 1: RESUME */}
          {activeTab === "resume" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Copy Resume Content</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste work experience and skill bullet points here..."
                  className="w-full min-h-[180px] p-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40 focus:border-[#DD3333] text-slate-800 transition-all placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={triggerResumeAnalysis}
                disabled={runningAction === "resume" || !resumeText}
                className="w-full py-3.5 bg-slate-900 hover:bg-[#DD3333] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display shadow-sm"
              >
                {runningAction === "resume" && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>Analyze Resume ATS</span>
              </button>
            </div>
          )}

          {/* TAB 2: SKILL GAP */}
          {activeTab === "skillgap" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Target Role Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-855 dark:text-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Copy Job Description (JD)</label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste details of the job listing description here..."
                  className="w-full min-h-[120px] p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
              <button
                onClick={triggerSkillGapAnalysis}
                disabled={runningAction === "skillgap" || !jdText}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
              >
                {runningAction === "skillgap" && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>Scan Gaps & Roadmap</span>
              </button>
            </div>
          )}

          {/* TAB 3: COACH CHAT */}
          {activeTab === "coach" && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/30 rounded-xl space-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Simulate Screening Chatbots</p>
                <p>Toggle dialogue boxes on the right to mock Career review or HR screening loops.</p>
              </div>
            </div>
          )}

          {/* TAB 4: MOCK INTERVIEWS */}
          {activeTab === "mock" && (
            <div className="space-y-4">
              {/* Sub-tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200/50">
                {["TECH", "STAR"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setStarSubTab(mode);
                      setError("");
                    }}
                    className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      starSubTab === mode
                        ? "bg-[#DD3333] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-200"
                    }`}
                  >
                    {mode === "TECH" ? "Technical Mock" : "Behavioral STAR"}
                  </button>
                ))}
              </div>

              {starSubTab === "TECH" ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Target Role</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <button
                    onClick={setupMockInterview}
                    disabled={runningAction === "interview-setup"}
                    className="w-full py-3 bg-slate-900 hover:bg-[#DD3333] text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
                  >
                    {runningAction === "interview-setup" && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    <span>Fetch Interview Loop</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-200 text-left">
                  <div className="p-3 bg-[#DD3333]/5 border border-[#DD3333]/10 rounded-xl text-[10px] text-slate-500 flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#DD3333] flex-shrink-0" />
                    <p className="leading-relaxed">
                      Practice answering behavioral questions using the **STAR Framework** (Situation, Task, Action, Result).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setStarSituation("Our team project's API calls were crashing under heavy load.");
                      setStarTask("I was responsible for optimizing the query latency of database reads.");
                      setStarAction("I implemented PostgreSQL index clusters and configured a Redis caching layer for read hits.");
                      setStarResult("We reduced database query latency by 85% and successfully handled 10,000 concurrent mock queries.");
                    }}
                    type="button"
                    className="text-[9px] font-bold text-[#DD3333] hover:underline cursor-pointer block text-left"
                  >
                    [ + ] Load Sample Response
                  </button>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400">Situation</label>
                    <textarea
                      value={starSituation}
                      onChange={(e) => setStarSituation(e.target.value)}
                      placeholder="Set the scene (context, company, or challenge)"
                      rows={2}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-transparent text-[10px] focus:outline-none text-slate-850 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400">Task</label>
                    <textarea
                      value={starTask}
                      onChange={(e) => setStarTask(e.target.value)}
                      placeholder="What was your specific goal or target?"
                      rows={2}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-transparent text-[10px] focus:outline-none text-slate-855 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400">Action</label>
                    <textarea
                      value={starAction}
                      onChange={(e) => setStarAction(e.target.value)}
                      placeholder="What action steps did you take?"
                      rows={2}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-transparent text-[10px] focus:outline-none text-slate-855 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400">Result</label>
                    <textarea
                      value={starResult}
                      onChange={(e) => setStarResult(e.target.value)}
                      placeholder="What was the quantifiable outcome?"
                      rows={2}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-transparent text-[10px] focus:outline-none text-slate-855 dark:text-slate-100"
                    />
                  </div>

                  <button
                    onClick={triggerStarEvaluation}
                    disabled={runningAction === "star-eval"}
                    className="w-full py-2.5 bg-slate-900 hover:bg-[#DD3333] text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
                  >
                    {runningAction === "star-eval" && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    <span>Audit STAR Framework</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: DOCS */}
          {activeTab === "docs" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Role Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-855 dark:text-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Target Company</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
              <button
                onClick={generateDocuments}
                disabled={runningAction === "docs"}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
              >
                {runningAction === "docs" && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>Create Docs Pack</span>
              </button>
            </div>
          )}

          {/* TAB 6: PORTFOLIO */}
          {activeTab === "portfolio" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Portfolio Address URL</label>
                <input
                  type="url"
                  placeholder="https://alexmercer.dev"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-855 dark:text-slate-200"
                />
              </div>
              <button
                onClick={triggerPortfolioAnalysis}
                disabled={runningAction === "portfolio" || !portfolioUrl}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
              >
                {runningAction === "portfolio" && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>Inspect Portfolio URL</span>
              </button>
            </div>
          )}

          {/* TAB 7: CODING ASSISTANT */}
          {activeTab === "coding" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Algorithm description</label>
                <textarea
                  value={problemDesc}
                  onChange={(e) => setProblemDesc(e.target.value)}
                  className="w-full min-h-[60px] p-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Paste your code (JS)</label>
                <textarea
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  className="w-full min-h-[140px] p-2.5 font-mono rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-900 text-slate-200 text-xs focus:outline-none"
                />
              </div>
              <button
                onClick={triggerCodeReview}
                disabled={runningAction === "code" || !studentCode}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display"
              >
                {runningAction === "code" && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>Audit Complexity & Optimizations</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Tab Outputs Display (Span 2) */}
        <div className="lg:col-span-2 space-y-6 text-left">
          {/* TAB 1: RESUME ANALYSIS OUTPUT */}
          {activeTab === "resume" && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 min-h-[300px] flex flex-col justify-center">
              {resumeAnalysis ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-900">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">ATS Resume Scanner Metrics</h3>
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
                      Score: {resumeAnalysis.atsScore}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50/50 dark:bg-zinc-900/30 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Grammar Check</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{resumeAnalysis.grammarScore}/100</p>
                    </div>
                    <div className="p-3 bg-slate-50/50 dark:bg-zinc-900/30 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Formatting Audit</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{resumeAnalysis.formattingScore}/100</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ATS Key Insights</p>
                    <ul className="space-y-1.5 text-xs">
                      {resumeAnalysis.suggestions.map((s, idx) => (
                        <li key={idx} className="p-2.5 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-lg text-slate-700 dark:text-zinc-300">
                          <span className="font-bold text-indigo-500">[{s.category}]</span> {s.detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {profileBioSuggestions && (
                    <div className="p-4 border-t border-slate-100 dark:border-zinc-900 space-y-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Headline & Bio Recommendations</p>
                      <div className="p-3 bg-indigo-50/10 dark:bg-indigo-950/5 rounded-xl border border-indigo-100/30 space-y-2">
                        <p className="text-xs font-semibold text-indigo-500">Suggested Headlines:</p>
                        {profileBioSuggestions.headlines.map((hl, i) => (
                          <p key={i} className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">• {hl}</p>
                        ))}
                        <p className="text-xs font-semibold text-indigo-500 pt-2">Suggested Bio:</p>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed italic">&quot;{profileBioSuggestions.bio}&quot;</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <FileText className="h-10 w-10 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
                  <p className="text-xs font-semibold">Paste resume plain text and click Analyze to generate metrics here.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SKILL GAP OUTPUT */}
          {activeTab === "skillgap" && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 min-h-[300px] flex flex-col justify-center">
              {skillGapAnalysis ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-900">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Skill Alignment & Gap audit</h3>
                    <span className="text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full">
                      Match: {skillGapAnalysis.matchPercentage}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Missing stack credentials</p>
                    <div className="flex flex-wrap gap-2">
                      {skillGapAnalysis.missingSkills.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 font-bold text-[10px] uppercase">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {jdAnalysis && (
                    <div className="space-y-2 p-3 bg-slate-50/50 dark:bg-zinc-900/30 rounded-xl text-xs space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Job Description Scan Insights</p>
                      <p className="text-slate-600 dark:text-zinc-300"><span className="font-bold">Experience needed:</span> {jdAnalysis.estimatedExperienceNeeded}</p>
                      <p className="text-slate-600 dark:text-zinc-300"><span className="font-bold">Primary ownership:</span> {jdAnalysis.keyResponsibility}</p>
                    </div>
                  )}

                  {customRoadmap && (
                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Custom Learning Roadmap</p>
                      <div className="space-y-2">
                        {customRoadmap.steps.map((st, i) => (
                          <div key={i} className="p-3 bg-indigo-50/15 dark:bg-indigo-950/5 rounded-xl border border-indigo-100/20 text-xs">
                            <p className="font-semibold text-indigo-500">{st.phase}</p>
                            <p className="text-slate-600 dark:text-zinc-400 mt-1">Focus topics: {st.topics.join(", ")}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <Layers className="h-10 w-10 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
                  <p className="text-xs font-semibold">Input target title and copy JD to scan skill gaps here.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COACH CHATBOTS DISPLAY */}
          {activeTab === "coach" && (
            <div className="space-y-6">
              {/* Career Coach Chat block */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                  <Brain className="h-4.5 w-4.5 text-indigo-500" />
                  <span>AI Career Coach Chatbot</span>
                </h3>
                
                <div className="h-48 overflow-y-auto space-y-3 mb-4 p-2 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl border border-slate-100 dark:border-zinc-900">
                  {coachChat.map((m, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl text-xs max-w-[85%]
                      ${m.role === "assistant" 
                        ? "bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-zinc-800 ml-0 mr-auto" 
                        : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 ml-auto mr-0 text-right"
                      }
                    `}
                    >
                      {m.content}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask about resume updates or technical cycles..."
                    value={coachMsg}
                    onChange={(e) => setCoachMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendCoachMessage()}
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={sendCoachMessage}
                    disabled={runningAction === "coach" || !coachMsg.trim()}
                    className="p-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 rounded-xl cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* HR Screening Assistant */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                  <MessageSquare className="h-4.5 w-4.5 text-pink-500" />
                  <span>AI HR screening simulation</span>
                </h3>
                
                <div className="h-40 overflow-y-auto space-y-3 mb-4 p-2 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl border border-slate-100 dark:border-zinc-900">
                  {hrChat.map((m, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl text-xs max-w-[85%]
                      ${m.role === "assistant" 
                        ? "bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-zinc-800 ml-0 mr-auto" 
                        : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 ml-auto mr-0 text-right"
                      }
                    `}
                    >
                      {m.content}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter availability or salary expectations..."
                    value={hrMsg}
                    onChange={(e) => setHrMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendHrMessage()}
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={sendHrMessage}
                    disabled={runningAction === "hr" || !hrMsg.trim()}
                    className="p-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 rounded-xl cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MOCK INTERVIEW LOOP */}
          {activeTab === "mock" && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 min-h-[300px] flex flex-col justify-center text-left">
              {starSubTab === "STAR" ? (
                // STAR Behavioral Coach Report
                starFeedback ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-900">
                      <span className="text-xs font-bold text-[#DD3333] flex items-center gap-1">
                        <Star className="h-4 w-4 text-[#DD3333] fill-[#DD3333]" />
                        <span>AI Behavioral STAR Audit</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${starFeedback.score >= 80 ? "bg-emerald-50 text-emerald-600" : starFeedback.score >= 60 ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-600"}
                      `}>
                        Score: {starFeedback.score}%
                      </span>
                    </div>

                    {/* Breakdown Feedback */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-zinc-900/30 rounded-xl space-y-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[9px]">[ Situation Feedback ]</p>
                        <p className="text-slate-500 leading-relaxed">{starFeedback.feedback.situation}</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-zinc-900/30 rounded-xl space-y-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[9px]">[ Task Feedback ]</p>
                        <p className="text-slate-500 leading-relaxed">{starFeedback.feedback.task}</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-zinc-900/30 rounded-xl space-y-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[9px]">[ Action Feedback ]</p>
                        <p className="text-slate-500 leading-relaxed">{starFeedback.feedback.action}</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-zinc-900/30 rounded-xl space-y-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[9px]">[ Result Feedback ]</p>
                        <p className="text-slate-500 leading-relaxed">{starFeedback.feedback.result}</p>
                      </div>
                    </div>

                    {/* Combined response */}
                    <div className="p-4 bg-[#DD3333]/5 border border-[#DD3333]/10 rounded-2xl space-y-2 text-xs">
                      <p className="font-bold text-[#DD3333] uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#DD3333]" />
                        <span>Optimized STAR Narrative Response</span>
                      </p>
                      <p className="text-slate-650 dark:text-zinc-300 leading-relaxed italic pr-2 select-all">
                        "{starFeedback.optimizedResponse}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400">
                    <Star className="h-10 w-10 text-slate-350 dark:text-zinc-700 mx-auto mb-2" />
                    <p className="text-xs font-semibold">Fill in the STAR components on the left and click Audit to build your optimized narrative.</p>
                  </div>
                )
              ) : (
                // Technical mock interview loop
                mockQuestions.length > 0 ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-900">
                      <span className="text-xs font-bold text-indigo-500">Question {currentQIndex + 1} of 5</span>
                      {fitPrediction && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full">
                          AI Company Fit: {fitPrediction.fitPercentage}%
                        </span>
                      )}
                    </div>

                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      {mockQuestions[currentQIndex].question}
                    </p>

                    <div className="relative">
                      <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Type or speak your answer here..."
                        className="w-full min-h-[120px] p-4 pr-16 rounded-xl border border-slate-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none text-slate-800 dark:text-slate-200 leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={toggleRecording}
                        className={`absolute right-3 bottom-3 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-sm
                          ${isRecording 
                            ? "bg-red-500 text-white animate-pulse" 
                            : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                          }
                        `}
                      >
                        {isRecording ? (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3 text-[#DD3333]" />
                            <span>Speak</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={evaluateMockAnswer}
                        disabled={runningAction === "interview-eval" || !answerText.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Evaluate Answer
                      </button>
                      <button
                        onClick={() => {
                          if (currentQIndex < 4) {
                            setCurrentQIndex(currentQIndex + 1);
                            setAnswerText("");
                            setMockFeedback(null);
                          }
                        }}
                        disabled={currentQIndex >= 4}
                        className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-lg font-semibold text-xs cursor-pointer disabled:opacity-50"
                      >
                        Next Question
                      </button>
                    </div>

                    {mockFeedback && (
                      <div className="p-4 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/30 rounded-xl space-y-2 text-xs">
                        <p className="font-bold text-indigo-500">AI Mock Assessment (Score: {mockFeedback.score}%)</p>
                        <p className="text-slate-600 dark:text-zinc-300"><span className="font-bold">Key Strengths:</span> {mockFeedback.strengths}</p>
                        <p className="text-slate-650 dark:text-zinc-300"><span className="font-bold">Improvements:</span> {mockFeedback.improvements}</p>
                        <details className="mt-2 group">
                          <summary className="font-bold text-indigo-500 cursor-pointer list-none flex items-center gap-1">
                            View Model Answer <Plus className="h-3 w-3 group-open:rotate-45 transition-transform" />
                          </summary>
                          <p className="mt-1.5 p-2 bg-white dark:bg-zinc-900 rounded-lg border border-slate-100 dark:border-zinc-800 leading-relaxed text-slate-500 dark:text-zinc-400 italic">
                            {mockFeedback.modelAnswer}
                          </p>
                        </details>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400">
                    <Award className="h-10 w-10 text-slate-350 dark:text-zinc-700 mx-auto mb-2" />
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB 5: DOCUMENT CREATORS */}
          {activeTab === "docs" && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 min-h-[300px] flex flex-col justify-center">
              {coverLetter ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">AI Cover Letter Copy</h3>
                    <p className="text-[10px] text-slate-400">Personalized for {targetRole} at {companyName}</p>
                  </div>
                  <pre className="p-4 bg-slate-50/50 dark:bg-zinc-900/30 rounded-xl border border-slate-200/50 dark:border-zinc-800/30 font-sans text-xs whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto text-slate-600 dark:text-zinc-300">
                    {coverLetter}
                  </pre>

                  {emailTemplates && (
                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-900">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Email & Cold Outreach templates</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-indigo-50/15 dark:bg-indigo-950/5 border border-indigo-100/20 rounded-xl text-xs space-y-1">
                          <p className="font-semibold text-indigo-500">Referral Request Email</p>
                          <p className="text-[9px] text-slate-400 truncate">Sub: {emailTemplates.referral.subject}</p>
                        </div>
                        <div className="p-3 bg-indigo-50/15 dark:bg-indigo-950/5 border border-indigo-100/20 rounded-xl text-xs space-y-1">
                          <p className="font-semibold text-indigo-500">Cold Outreach Template</p>
                          <p className="text-[9px] text-slate-400 truncate">Sub: {emailTemplates.cold.subject}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {negotiationScript && (
                    <div className="p-4 bg-indigo-50/10 dark:bg-indigo-950/5 rounded-xl border border-indigo-100/20 text-xs space-y-1">
                      <p className="font-bold text-indigo-500">AI Salary Negotiation Script (Base check: 16 LPA)</p>
                      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed italic">&quot;{negotiationScript.suggestedScript}&quot;</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <Mail className="h-10 w-10 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
                  <p className="text-xs font-semibold">Select role details and click Create Docs Pack to generate files here.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: WEB PORTFOLIO Review */}
          {activeTab === "portfolio" && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 min-h-[300px] flex flex-col justify-center">
              {portfolioResult ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-900">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Portfolio URL Scan Metrics</h3>
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
                      Audit: {portfolioResult.score}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-slate-50/50 dark:bg-zinc-900/30 rounded-lg">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Performance</p>
                      <p className="text-sm font-semibold text-emerald-500">{portfolioResult.lighthouse.performance}%</p>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 dark:bg-zinc-900/30 rounded-lg">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Accessibility</p>
                      <p className="text-sm font-semibold text-amber-500">{portfolioResult.lighthouse.accessibility}%</p>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 dark:bg-zinc-900/30 rounded-lg">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">SEO rating</p>
                      <p className="text-sm font-semibold text-emerald-500">{portfolioResult.lighthouse.seo}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Key UI Strengths</p>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-zinc-300">
                      {portfolioResult.strengths.map((str, idx) => (
                        <li key={idx}>• {str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SEO & WCAG Improvements</p>
                    <ul className="space-y-1 text-xs text-rose-500">
                      {portfolioResult.improvements.map((imp, idx) => (
                        <li key={idx}>• {imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <Compass className="h-10 w-10 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
                  <p className="text-xs font-semibold">Enter your portfolio link and run url scanners here.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: CODING ASSISTANT REVIEW */}
          {activeTab === "coding" && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800/80 min-h-[300px] flex flex-col justify-center">
              {codeReview ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-900">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Algorithmic Code Review</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded-full">
                      Time: {codeReview.timeComplexity}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300">
                    <p><span className="font-bold">Space complexity:</span> {codeReview.spaceComplexity}</p>
                    <p><span className="font-bold">Correctness:</span> {codeReview.correctness}</p>
                    <p className="mt-2 bg-slate-50/50 dark:bg-zinc-900/30 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                      {codeReview.review}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Refactored / Optimized Code</p>
                    <pre className="p-3 font-mono bg-slate-900 text-slate-200 text-[10px] rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
                      {codeReview.refactoredCode}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <Code className="h-10 w-10 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
                  <p className="text-xs font-semibold">Write algorithm description, paste your JS solution, and submit.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
