"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getStudentDashboardAction } from "@/actions/dashboard";
import { calculateReadinessScoreAction, calculatePlacementDnaAction } from "@/actions/ai";
import { 
  Sparkles, Briefcase, Calendar, ArrowUpRight, 
  FileText, Award, Layers, ChevronRight, Brain, Trophy, Users
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

export default function StudentDashboard() {
  const [session, setSession] = useState(null);
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculatingScore, setCalculatingScore] = useState(false);

  // Animated scorecard state variables
  const [animatedReadiness, setAnimatedReadiness] = useState(0);
  const [animatedAts, setAnimatedAts] = useState(0);
  const [animatedSkill, setAnimatedSkill] = useState(0);

  // AI DNA Radar coordinates
  const [dnaData, setDnaData] = useState([]);
  const [loadingDna, setLoadingDna] = useState(true);

  // View toggle state for Job applications (LIST or KANBAN)
  const [viewMode, setViewMode] = useState("LIST");

  const loadData = async () => {
    try {
      const res = await getStudentDashboardAction();
      if (res?.success) {
        setSession(res.session);
        setStudent(res.student);
        setApplications(res.applications || []);
        setInterviews(res.interviews || []);
        setLogs(res.activityLogs || []);

        // Load DNA metrics
        const dnaRes = await calculatePlacementDnaAction(res.student.id);
        if (dnaRes?.success) {
          setDnaData(dnaRes.dna || []);
        }
      }
    } catch (err) {
      console.error("Error loading student dashboard details:", err);
    } finally {
      setLoading(false);
      setLoadingDna(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Score count-up animator on data load
  useEffect(() => {
    if (student) {
      const targetReadiness = student.placementReadinessScore || 0;
      const targetAts = student.atsScore || 0;
      const targetSkill = student.skillGapScore || 0;
      
      let start = 0;
      const duration = 800; // ms
      const stepTime = 16;  // ~60fps
      const steps = duration / stepTime;
      
      const interval = setInterval(() => {
        start += 1;
        setAnimatedReadiness(Math.min(Math.floor((targetReadiness / steps) * start), targetReadiness));
        setAnimatedAts(Math.min(Math.floor((targetAts / steps) * start), targetAts));
        setAnimatedSkill(Math.min(Math.floor((targetSkill / steps) * start), targetSkill));
        
        if (start >= steps) {
          clearInterval(interval);
          setAnimatedReadiness(targetReadiness);
          setAnimatedAts(targetAts);
          setAnimatedSkill(targetSkill);
        }
      }, stepTime);
      return () => clearInterval(interval);
    }
  }, [student]);

  const handleRecalculate = async () => {
    if (!student) return;
    setCalculatingScore(true);
    const res = await calculateReadinessScoreAction(student.id);
    if (res?.success) {
      await loadData();
    }
    setCalculatingScore(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-slate-200 rounded-3xl" />
          <div className="h-40 bg-slate-200 rounded-3xl" />
          <div className="h-40 bg-slate-200 rounded-3xl" />
        </div>
        <div className="h-60 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!session || !student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Session not found. Please log in again.</h2>
      </div>
    );
  }

  const activeInterviews = interviews.filter(i => i.status === "SCHEDULED");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Header welcome card */}
      <motion.div 
        variants={itemVariants}
        className="glass-card rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden text-left"
      >
        <div className="space-y-3">
          <div className="inline-block px-3 py-1 rounded-full border border-[#DD3333]/15 bg-[#DD3333]/5 text-[#DD3333] text-[9px] uppercase font-bold tracking-widest">
            [ ! ] Vidyalankar Institute of Technology • Student Workspace
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-slate-800 uppercase tracking-tighter leading-none">
            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DD3333] via-red-500 to-rose-600">Control.</span>
          </h1>
          <p className="text-xs text-slate-500">
            Welcome back, <span className="font-bold text-slate-850">{student.name}</span> • Department of {student.department || "Information Technology"} • Batch of {student.batch || "2026"}
          </p>
        </div>
        
        {/* Readiness calculate button */}
        <button
          onClick={handleRecalculate}
          disabled={calculatingScore}
          className="group px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-[#DD3333] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 font-display shadow-sm"
        >
          {calculatingScore ? (
            <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          <span>Audit Career Score</span>
        </button>
      </motion.div>

      {/* Analytics Scorecards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placement Readiness Score */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, borderColor: "#DD3333" }}
          className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between h-48 text-left transition-all duration-300 cursor-default"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ 01 ] Placement Readiness</span>
            <Award className="h-5 w-5 text-[#DD3333]" />
          </div>
          <div>
            <h3 className="text-5xl font-display font-extrabold text-slate-850 tracking-tighter">
              {animatedReadiness}%
            </h3>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-[#DD3333] rounded-full transition-all duration-300" 
                style={{ width: `${animatedReadiness}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* ATS Score card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, borderColor: "#DD3333" }}
          className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between h-48 text-left transition-all duration-300 cursor-default"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ 02 ] Resume ATS Score</span>
            <FileText className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-5xl font-display font-extrabold text-slate-850 tracking-tighter">
              {animatedAts}%
            </h3>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                style={{ width: `${animatedAts}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Skill Matching Rate card */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, borderColor: "#DD3333" }}
          className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between h-48 text-left transition-all duration-300 cursor-default"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ 03 ] Skill Matching Rate</span>
            <Layers className="h-5 w-5 text-slate-800" />
          </div>
          <div>
            <h3 className="text-5xl font-display font-extrabold text-slate-850 tracking-tighter">
              {animatedSkill}%
            </h3>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-slate-800 rounded-full transition-all duration-300" 
                style={{ width: `${animatedSkill}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* FLAGSHIP AI PLACEMENT ACCELERATORS (NEW) */}
      <motion.div variants={itemVariants} className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#DD3333]" />
            <span>Flagship AI Placement Accelerators</span>
          </h2>
          <span className="text-[10px] font-bold text-white bg-[#DD3333] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
            NEW 2026 SUITE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. AI Resume Optimizer */}
          <Link
            href="/dashboard/student/resume-optimizer"
            className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white border border-slate-800 shadow-md hover:border-indigo-400 hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
            <div className="flex justify-between items-start relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-2xl">
                📄
              </div>
              <span className="text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 px-3 py-1 rounded-full uppercase tracking-wider">
                ATS 95%+ & Google XYZ
              </span>
            </div>
            <div className="mt-6 relative z-10">
              <h3 className="text-xl font-display font-extrabold text-white group-hover:text-indigo-200 transition-colors flex items-center gap-2">
                <span>AI Resume Optimizer</span>
                <ArrowUpRight className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Transform ordinary bullet points into high-impact Google XYZ formula accomplishments (<code className="text-indigo-300 font-mono text-[11px]">&quot;Accomplished [X], measured by [Y], by doing [Z]&quot;</code>) and bridge keyword gaps against top corporate JDs.
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Target 95%+ ATS</span>
                <span>•</span>
                <span>Role Preset Library</span>
                <span>•</span>
                <span className="text-indigo-300 font-bold">1-Click Profile Sync</span>
              </div>
            </div>
          </Link>

          {/* 2. AI GD Multi-Agent Voice Simulator */}
          <Link
            href="/dashboard/student/gd-simulator"
            className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1C4980] via-[#0f3460] to-slate-900 text-white border border-blue-900/50 shadow-md hover:border-blue-400 hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />
            <div className="flex justify-between items-start relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-200 font-bold text-2xl">
                🎙️
              </div>
              <span className="text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
                5-Agent Voice Arena
              </span>
            </div>
            <div className="mt-6 relative z-10">
              <h3 className="text-xl font-display font-extrabold text-white group-hover:text-blue-200 transition-colors flex items-center gap-2">
                <span>AI Group Discussion (GD) Simulator</span>
                <ArrowUpRight className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </h3>
              <p className="text-xs text-blue-100/90 mt-2 leading-relaxed">
                Take the floor at a 5-person virtual roundtable with 4 autonomous AI peer candidates. Features Web Speech turn-taking, real-time interruptions, counter-arguments, and full placement verdict rubrics.
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-[11px] text-blue-200/70 font-medium">
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-amber-300" /> 4 AI Candidates</span>
                <span>•</span>
                <span>Live Speech Recognition</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">Campus Drive Topics</span>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* CAREER PREPARATION & ASSESSMENT SUITE */}
      <motion.div variants={itemVariants} className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#1C4980]" />
            <span>Career Preparation & Technical Assessments</span>
          </h2>
          <span className="text-[10px] font-bold text-white bg-[#1C4980] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
            VIT PLACEMENTS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Practice Quizzes */}
          <Link
            href="/dashboard/student/quizzes"
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#1C4980] hover:shadow-lg hover:scale-[1.01] transition-all flex flex-col justify-between h-48"
          >
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-[#1C4980] flex items-center justify-center text-xl font-bold">
                ⚡
              </div>
              <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full uppercase">
                MCQ Assessment
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#1C4980] transition-colors">
                Practice Quizzes
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">
                TCS NQT Tech sprint, Google DSA speed tests, and verified certificates.
              </p>
            </div>
          </Link>

          {/* 2. Code Arena OA */}
          <Link
            href="/dashboard/student/code-arena"
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#1C4980] hover:shadow-lg hover:scale-[1.01] transition-all flex flex-col justify-between h-48"
          >
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
                💻
              </div>
              <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full uppercase">
                Live OA
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#1C4980] transition-colors">
                Code Arena (DSA)
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">
                Real-time online assessment code runner with AI algorithmic complexity feedback.
              </p>
            </div>
          </Link>

          {/* 3. 1:1 Mentorship */}
          <Link
            href="/dashboard/student/mentorship"
            className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#1C4980] hover:shadow-lg hover:scale-[1.01] transition-all flex flex-col justify-between h-48"
          >
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
                🧑‍🏫
              </div>
              <span className="text-[9px] font-extrabold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full uppercase">
                FAANG Mentors
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#1C4980] transition-colors">
                1-on-1 Mentorship
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">
                Live mock interviews & resume reviews with leaders at Google & Microsoft.
              </p>
            </div>
          </Link>

          {/* 4. AI Voice Simulator */}
          <Link
            href="/dashboard/student/interviews/simulator"
            className="group p-6 rounded-3xl bg-gradient-to-br from-[#1C4980] via-[#0055B3] to-[#0A2540] text-white shadow-md hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between h-48 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl">
                🎙️
              </div>
              <span className="text-[9px] font-extrabold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase">
                AI Voice 2.0
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors">
                AI Voice Simulator
              </h3>
              <p className="text-xs text-blue-100 mt-1 leading-snug line-clamp-2">
                Live conversational technical interviews with real-time speech sentiment analysis.
              </p>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* STANDOUT FEATURE LAUNCHPAD SUITE */}
      <motion.div variants={itemVariants} className="space-y-3 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-display font-extrabold uppercase tracking-widest text-slate-800 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#DD3333]" />
            <span>Placement Excellence & Code Arena</span>
          </h2>
          <span className="text-[10px] font-bold text-[#DD3333] bg-red-50 px-2.5 py-0.5 rounded-full uppercase">
            5 Core Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Code Arena */}
          <Link
            href="/dashboard/student/code-arena"
            className="group p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm hover:border-[#DD3333] hover:scale-[1.02] transition-all flex flex-col justify-between h-44"
          >
            <div className="flex justify-between items-start">
              <div className="h-9 w-9 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                <Brain className="h-4 w-4 text-rose-400" />
              </div>
              <span className="text-[9px] font-extrabold bg-[#DD3333] text-white px-2 py-0.5 rounded-full uppercase">
                OA Sandbox
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
                Code Arena
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                Solve real OA coding rounds from Google, Morgan Stanley, & Barclays.
              </p>
            </div>
          </Link>

          {/* 2. AI Voice Simulator */}
          <Link
            href="/dashboard/student/interviews/simulator"
            className="group p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-[#DD3333] hover:scale-[1.02] transition-all flex flex-col justify-between h-44"
          >
            <div className="flex justify-between items-start">
              <div className="h-9 w-9 rounded-2xl bg-red-50 text-[#DD3333] flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-extrabold bg-red-50 text-[#DD3333] px-2 py-0.5 rounded-full uppercase">
                AI 2.0
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#DD3333] transition-colors">
                Voice & Video Studio
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">
                Simulated AI interviewer with speech recognition & posture coach.
              </p>
            </div>
          </Link>

          {/* 3. Alumni Archive */}
          <Link
            href="/dashboard/student/experiences"
            className="group p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-[#DD3333] hover:scale-[1.02] transition-all flex flex-col justify-between h-44"
          >
            <div className="flex justify-between items-start">
              <div className="h-9 w-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                Archive
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                Alumni Experiences
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">
                Round-by-round drive walkthroughs & questions from placed seniors.
              </p>
            </div>
          </Link>

          {/* 4. Offer Comparator */}
          <Link
            href="/dashboard/student/offers/compare"
            className="group p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-[#DD3333] hover:scale-[1.02] transition-all flex flex-col justify-between h-44"
          >
            <div className="flex justify-between items-start">
              <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
                Tax Calc
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                Offer Battleground
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">
                In-hand take-home salary, city living costs, & AI bond scanner.
              </p>
            </div>
          </Link>

          {/* 5. Resume Builder */}
          <Link
            href="/dashboard/student/profile/resume-builder"
            className="group p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-[#DD3333] hover:scale-[1.02] transition-all flex flex-col justify-between h-44"
          >
            <div className="flex justify-between items-start">
              <div className="h-9 w-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-extrabold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full uppercase">
                1-Click PDF
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                Resume Builder
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">
                Harvard Classic & Modern ATS-compliant single-column templates.
              </p>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Radar Chart & AI Placement DNA Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Radar Chart Card (Span 2) */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm lg:col-span-2 flex flex-col justify-between h-96 text-left"
        >
          <h2 className="text-lg font-display font-bold uppercase tracking-tight text-slate-850 pb-4 border-b border-black/5">
            [ AI Placement DNA Radar ]
          </h2>
          
          <div className="flex-1 w-full min-h-[220px] flex items-center justify-center pt-4">
            {loadingDna ? (
              <div className="text-xs text-slate-400 flex flex-col items-center gap-2">
                <div className="h-5 w-5 border-2 border-[#DD3333] border-t-transparent rounded-full animate-spin" />
                <span>Computing DNA coordinates...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dnaData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar name="Student DNA" dataKey="value" stroke="#DD3333" fill="#DD3333" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* AI Career Coach Quick Advisory (Span 1) */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between h-96 text-left"
        >
          <div className="space-y-4">
            <h2 className="text-lg font-display font-bold uppercase tracking-tight text-slate-850 pb-4 border-b border-black/5 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#DD3333] animate-pulse" />
              <span>[ AI Advisory ]</span>
            </h2>
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-[#DD3333]/5 border border-[#DD3333]/10 rounded-xl space-y-1">
                <p className="font-bold text-slate-800">Placement Standing</p>
                <p className="text-slate-500 leading-relaxed">
                  {animatedReadiness > 85 
                    ? "Excellent metrics! Your project velocity and academics place you in the top tier. Keep applying to elite corporate drives."
                    : "Moderate standing. Focus on adding 2-3 more project links and details in your profile builder to scale matching ratios."
                  }
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-800">Direct Improvement Tip</p>
                <p className="text-slate-500 leading-relaxed">
                  {dnaData.find(d => d.subject === "Work Experience")?.value < 50 
                    ? "Add technical descriptions for your past internships to improve recruiter screening alignment."
                    : "Scan your resume using the AI Tools tab to audit ATS keyword matches."
                  }
                </p>
              </div>
            </div>
          </div>
          <Link 
            href="/dashboard/student/ai-tools"
            className="w-full py-3 bg-slate-900 hover:bg-[#DD3333] text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-display block"
          >
            Open AI Suite
          </Link>
        </motion.div>
      </div>

      {/* Main Grid: Applications, Interviews & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Applications list (Span 2) */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm lg:col-span-2 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/5 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-display font-bold uppercase tracking-tight text-slate-850">
                [ Active Job Applications ]
              </h2>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-250/60">
                {["LIST", "KANBAN"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      viewMode === mode
                        ? "bg-[#DD3333] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {mode === "LIST" ? "List View" : "Kanban Board"}
                  </button>
                ))}
              </div>
            </div>
            <Link 
              href="/dashboard/student/jobs" 
              className="group text-xs font-bold uppercase tracking-wider text-[#DD3333] flex items-center gap-1 hover:underline"
            >
              <span>Explore Roles</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl p-6">
                <Briefcase className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-500">No active applications</p>
                <p className="text-xs text-slate-400 mt-1">Submit applications on the Jobs Board to track progress here.</p>
              </div>
            ) : viewMode === "KANBAN" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Lane 1: Applied */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-black/5 min-h-[220px]">
                  <div className="flex justify-between items-center pb-2 border-b border-black/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Applied</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200/50 text-slate-650 rounded-full font-mono">
                      {applications.filter(a => a.status === "APPLIED").length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {applications.filter(a => a.status === "APPLIED").length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-8 italic">No applications in this stage</p>
                    ) : (
                      applications.filter(a => a.status === "APPLIED").map(app => (
                        <div key={app.id} className="p-3 bg-white border border-black/5 rounded-xl space-y-1 shadow-sm text-left">
                          <p className="font-bold text-xs text-slate-800 truncate">{app.job?.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{app.job?.company?.name}</p>
                          <div className="flex justify-between items-center pt-1.5 border-t border-slate-50 mt-1.5">
                            <span className="text-[9px] text-slate-400 font-mono">{app.job?.salary} LPA</span>
                            <span className="text-[9px] text-slate-450 uppercase font-semibold">Applied</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Lane 2: Shortlisted */}
                <div className="space-y-3 bg-[#DD3333]/5 p-4 rounded-2xl border border-[#DD3333]/10 min-h-[220px]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#DD3333]/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#DD3333]">Shortlisted</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#DD3333]/10 text-[#DD3333] rounded-full font-mono">
                      {applications.filter(a => a.status === "SHORTLISTED").length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {applications.filter(a => a.status === "SHORTLISTED").length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-8 italic">No applications in this stage</p>
                    ) : (
                      applications.filter(a => a.status === "SHORTLISTED").map(app => (
                        <div key={app.id} className="p-3 bg-white border border-[#DD3333]/15 rounded-xl space-y-1 shadow-sm text-left">
                          <p className="font-bold text-xs text-[#DD3333] truncate">{app.job?.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{app.job?.company?.name}</p>
                          <div className="flex justify-between items-center pt-1.5 border-t border-slate-50 mt-1.5">
                            <span className="text-[9px] text-[#DD3333] font-mono font-bold">{app.job?.salary} LPA</span>
                            <span className="text-[9px] text-amber-500 uppercase font-bold tracking-tight">Interview Prep</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Lane 3: Offered */}
                <div className="space-y-3 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-500/10 min-h-[220px]">
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Offered</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full font-mono">
                      {applications.filter(a => a.status === "OFFERED").length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {applications.filter(a => a.status === "OFFERED").length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-8 italic">No applications in this stage</p>
                    ) : (
                      applications.filter(a => a.status === "OFFERED").map(app => (
                        <div key={app.id} className="p-3 bg-white border border-emerald-500/15 rounded-xl space-y-1 shadow-sm text-left">
                          <p className="font-bold text-xs text-emerald-600 truncate">{app.job?.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{app.job?.company?.name}</p>
                          <div className="flex justify-between items-center pt-1.5 border-t border-slate-50 mt-1.5">
                            <span className="text-[9px] text-emerald-600 font-mono font-bold">{app.job?.salary} LPA</span>
                            <span className="text-[9px] text-emerald-600 uppercase font-bold animate-pulse">Select Offer</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              applications.map((app) => (
                <div 
                  key={app.id} 
                  className="p-4 bg-slate-50/50 rounded-2xl border border-black/5 hover:border-[#DD3333] transition-all flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-slate-800">{app.job?.title}</p>
                    <p className="text-xs text-slate-500">{app.job?.company?.name} • {app.job?.location} • {app.job?.salary} LPA</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider
                        ${app.status === "APPLIED" && "bg-slate-250/50 text-slate-600"}
                        ${app.status === "SHORTLISTED" && "bg-red-50 text-[#DD3333]"}
                        ${app.status === "REJECTED" && "bg-rose-50 text-rose-600"}
                        ${app.status === "OFFERED" && "bg-emerald-50 text-emerald-600"}
                      `}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Sidebar panels: Upcoming Interviews & Logs */}
        <div className="space-y-6">
          {/* Upcoming interviews list */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-4"
          >
            <h2 className="text-lg font-display font-bold uppercase tracking-tight text-slate-850 pb-3 border-b border-black/5">
              [ Interviews Calendar ]
            </h2>
            <div className="space-y-3 pt-1">
              {activeInterviews.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No upcoming interviews scheduled</p>
              ) : (
                activeInterviews.map((int) => (
                  <div key={int.id} className="p-3 bg-red-50/20 border border-[#DD3333]/10 rounded-xl space-y-2 text-left">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-slate-800">Technical Loop</p>
                      <span className="text-[9px] uppercase font-bold text-[#DD3333]">[ {int.format} ]</span>
                    </div>
                    <p className="text-[10px] text-slate-500">{new Date(int.dateTime).toLocaleString()}</p>
                    {int.link && (
                      <a 
                        href={int.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-[#DD3333] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
                      >
                        <span>Join Meeting</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Activity Logs */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-4"
          >
            <h2 className="text-lg font-display font-bold uppercase tracking-tight text-slate-850 pb-3 border-b border-black/5">
              [ Recent Activity ]
            </h2>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1 pt-1">
              {logs.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No recent activities</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="text-xs space-y-0.5 border-l-2 border-[#DD3333] pl-3">
                    <p className="font-semibold text-slate-700">{log.action}</p>
                    <p className="text-[10px] text-slate-400">{log.details}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
