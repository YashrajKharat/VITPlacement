"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, BarChart3, Users, 
  Brain, ShieldCheck, Mail, ArrowRight, Star, HelpCircle, GraduationCap, ArrowUpRight, Trophy, Briefcase
} from "lucide-react";

export default function LandingPage() {
  const [progress, setProgress] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Preloader count-up effect
  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + Math.floor(Math.random() * 12) + 6, 100));
      }, 70);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsPreloading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  // Mouse tracker for light cursor glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const recruiters = [
    { name: "Stripe", logo: "💳" },
    { name: "Apple", logo: "🍎" },
    { name: "Vercel", logo: "▲" },
    { name: "Linear", logo: "⧉" },
    { name: "Notion", logo: "▤" },
    { name: "Google", logo: "G" }
  ];

  const stats = [
    { num: "01", label: "Placement Rate", value: "98.7%", desc: "Verified corporate drive selections." },
    { num: "02", label: "Highest CTC", value: "48.2 LPA", desc: "Highest package in IT / CS department." },
    { num: "03", label: "Average CTC", value: "14.8 LPA", desc: "Overall engineering average." },
    { num: "04", label: "Corporate Link", value: "220+", desc: "Verified recruiters visiting Wadala." }
  ];

  const features = [
    {
      num: "01",
      title: "Placement Drives & Corporate Recruitment",
      description: "Apply to 220+ verified corporate tech drives, manage eligibility rules, and track selection rounds in real-time.",
      icon: Briefcase
    },
    {
      num: "02",
      title: "1:1 Mentorship with FAANG Leaders",
      description: "Book live 1-on-1 mock coding interviews, resume roasts, and case prep with senior mentors at Google, Microsoft, and McKinsey.",
      icon: Users
    },
    {
      num: "03",
      title: "Code Arena & Timed Practice Quizzes",
      description: "Practice in-browser DSA challenges with AI complexity reviews and earn verified skill certificates on TCS NQT sprints.",
      icon: Brain
    },
    {
      num: "04",
      title: "AI ATS Resume & Voice Mock Studio",
      description: "Generate Harvard & Modern ATS resumes and practice real-time speech interviews with live filler-word detection.",
      icon: Sparkles
    }
  ];

  const faqs = [
    {
      q: "How does the AI Resume Analyzer score ATS compatibility?",
      a: "Our analyzer scans resume structures, section layouts, and checks the occurrence of specific keywords against custom job specifications to calculate an automated score. It advises single-column layouts and active verb substitutions."
    },
    {
      q: "Is there a charge to use the AI interview modules?",
      a: "No, all interactive AI coach chats, interview loops, cover letter builds, and roadmaps are completely free for students registered on the university network."
    },
    {
      q: "How are recruiters verified on the portal?",
      a: "Every corporate account is checked and verified by Vidyalankar Institute of Technology's Placement Officers (TPO) before they can post job drives or search student databases."
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmailSubmitted(true);
  };

  // Scroll variants
  const scrollReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <>
      {/* 1. CINEMATIC PRELOADER */}
      <AnimatePresence>
        {isPreloading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ 
              y: "-100%",
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 z-[9999] bg-[#1d1d1f] text-white flex flex-col justify-between p-8 lg:p-16 font-sans select-none"
          >
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-[#DD3333] flex items-center justify-center text-white font-bold text-sm">
                V
              </div>
              <span className="font-display font-bold text-xs uppercase tracking-widest">
                VIT Wadala • Placement OS
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-3">
                [ Loading Assets & AI Weights ]
              </span>
              <h2 className="text-[16vw] lg:text-[12vw] font-display font-extrabold tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                {progress}%
              </h2>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4">
              <span>© 2026 Vidyalankar Institute of Technology</span>
              <span>Wadala, Mumbai</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Website View */}
      <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-[#DD3333] selection:text-white relative overflow-x-hidden">
        
        {/* 2. INTERACTIVE MOUSE TRACKER GLOW */}
        <div 
          className="pointer-events-none fixed z-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DD3333]/3 blur-[80px] transition-all duration-300 ease-out hidden lg:block"
          style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }}
        />

        {/* Navigation Header - Minimal & Bordered */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#f5f5f7]/80 border-b border-black/5 px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#DD3333] flex items-center justify-center text-white font-bold shadow-sm shadow-[#DD3333]/25">
              V
            </div>
            <span className="font-display font-bold tracking-tight text-lg text-slate-800 uppercase">
              VIT Placement<span className="text-[#DD3333]">.</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-xs uppercase tracking-widest font-semibold text-slate-500">
            <a href="#about" className="hover:text-[#DD3333] transition-colors">About</a>
            <a href="#features" className="hover:text-[#DD3333] transition-colors">Features</a>
            <a href="#stats" className="hover:text-[#DD3333] transition-colors">Stats</a>
            <a href="#faq" className="hover:text-[#DD3333] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-xs uppercase tracking-widest font-semibold text-slate-600 hover:text-[#DD3333] transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="group relative inline-flex items-center gap-1.5 px-4.5 py-2 border border-[#DD3333] bg-[#DD3333] text-white hover:bg-transparent hover:text-[#DD3333] text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300"
            >
              <span>Register</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </nav>

        {/* Hero Section - Giant Editorial Typography */}
        <header className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20 text-left space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-3 py-1 rounded-full border border-[#DD3333]/15 bg-[#DD3333]/5 text-[#DD3333] text-[10px] uppercase font-bold tracking-widest"
          >
            [ ! ] Vidyalankar Institute of Technology • Wadala, Mumbai
          </motion.div>

          {/* Big Giant Outline Title inspired by DZ!NR */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-8xl font-display font-extrabold tracking-tighter leading-[0.9] text-slate-800 uppercase max-w-5xl"
          >
            CAMPUS TO CORPORATE ISN&apos;T AUTOMATIC. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DD3333] via-red-500 to-rose-600">
              CAREERS AREN&apos;T EITHER.
            </span>
          </motion.h1>

          <div className="grid md:grid-cols-3 gap-8 pt-6 border-t border-black/5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-2"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ 01 ] Strategy</span>
              <p className="text-sm text-slate-600 leading-relaxed">
                We align student credentials directly to verified industry job openings, helping your profiles stand out.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-2"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ 02 ] AI Optimization</span>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automated portfolio grading, cover letter generation, and real-time skill gaps computed instantly.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-2"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ 03 ] Outcomes</span>
              <p className="text-sm text-slate-600 leading-relaxed">
                Simplifying recruiter selection, TPO analytics, and drive announcements on a single hub.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link 
              href="/register" 
              className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white hover:bg-[#DD3333] text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md cursor-pointer"
            >
              <span>Initialize Workspace</span>
              <ArrowUpRight className="h-4.5 w-4.5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </Link>
            <a 
              href="#features" 
              className="px-8 py-4 border border-slate-200 bg-white/80 hover:bg-white text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 rounded-xl transition-all shadow-sm"
            >
              Learn More
            </a>
          </div>
        </header>

        {/* Recruiter Banner - Minimalist Marquee Style (Animated Scroll Reveal) */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={scrollReveal}
          className="py-8 border-t border-b border-black/5 bg-white/50 text-left px-6 lg:px-12 relative z-10"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#DD3333]">
              [ Corporate partners hiring from Wadala ]
            </span>
            <div className="flex flex-wrap items-center gap-8 md:gap-12 opacity-80">
              {recruiters.map((r, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.06, color: "#DD3333" }}
                  className="flex items-center gap-1.5 font-display font-bold uppercase text-xs text-slate-700 cursor-default transition-all"
                >
                  <span>{r.logo}</span>
                  <span>{r.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Stats Section - Large Bold Panel (Animated Scroll Reveal) */}
        <section id="stats" className="max-w-7xl mx-auto px-6 lg:px-12 py-24 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((s, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ y: -6, borderColor: "#DD3333" }}
                className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-4 transition-all duration-300 text-left cursor-default"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 tracking-wider">
                  <span>[ STAT {s.num} ]</span>
                  <span>{s.label}</span>
                </div>
                <h3 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-800 tracking-tighter">
                  {s.value}
                </h3>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Features Grid - Editorial List View (Animated Scroll Reveal) */}
        <section id="features" className="max-w-7xl mx-auto px-6 lg:px-12 py-24 border-t border-black/5 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scrollReveal}
            className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter text-slate-800">
              Engineered For <br />
              Outcome.
            </h2>
            <p className="max-w-md text-slate-500 text-sm leading-relaxed pt-2">
              A centralized career resource suite built to verify recruitment loops, audit profiles, and deploy interactive coding challenges.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-8"
          >
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div 
                  key={idx} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, borderColor: "#DD3333" }}
                  className="bg-white p-10 rounded-3xl border border-black/5 transition-all duration-300 space-y-6 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#DD3333] tracking-widest uppercase">
                      [ MODULE {f.num} ]
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-[#DD3333]/5 flex items-center justify-center text-[#DD3333]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-800 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Testimonials - Editorial Grid (Animated Scroll Reveal) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 border-t border-black/5 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scrollReveal}
            className="mb-16"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ TESTIMONIALS ]</span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold uppercase tracking-tighter text-slate-800 mt-2">
              Campus Stories
            </h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8 text-left"
          >
            <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-8 rounded-2xl border border-black/5 space-y-6">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                &quot;The Skill Gap Analyzer recommended specific Redis projects which matched the exact interview questions asked during the technical round at Stripe. Placed in my dream role!&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">AM</div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Alex Mercer</p>
                  <p className="text-[10px] text-slate-400">Placed at Stripe (IT 2026)</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-8 rounded-2xl border border-black/5 space-y-6">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                &quot;Reviewing candidate portfolios and screening responses using the TPO logs reduced our recruiting lifecycle by nearly 4 weeks. Best campus placement experience.&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">SJ</div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Sarah Jenkins</p>
                  <p className="text-[10px] text-slate-400">HR Director, Stripe</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white p-8 rounded-2xl border border-black/5 space-y-6">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                &quot;Placement auditing, exporting drive stats, and managing verified recruiters has become entirely automated. The analytics dashboards are highly visual and clean.&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">RC</div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Prof. R. Chawla</p>
                  <p className="text-[10px] text-slate-400">Placement Officer (TPO)</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* FAQ Section (Animated Scroll Reveal) */}
        <section id="faq" className="max-w-4xl mx-auto px-6 py-24 border-t border-black/5 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scrollReveal}
            className="text-center mb-12"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ SUPPORT ]</span>
            <h2 className="text-4xl font-display font-extrabold uppercase tracking-tighter text-slate-800 mt-2">FAQ</h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={scrollReveal}
            className="space-y-4 text-left"
          >
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left font-semibold text-sm text-slate-800 hover:text-[#DD3333] flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-xs text-slate-400">[ OPEN ]</span>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="px-6 pb-6 text-xs text-slate-500 leading-relaxed pt-4 bg-slate-50/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Newsletter / Contact Loop (Animated Scroll Reveal) */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scrollReveal}
          className="max-w-5xl mx-auto px-6 py-16 mb-24 bg-gradient-to-r from-red-50/30 via-slate-100 to-slate-50 rounded-3xl border border-black/5 text-center space-y-6 relative z-10"
        >
          <span className="text-[10px] font-bold text-[#DD3333] uppercase tracking-widest">[ CONNECT DRIVE ]</span>
          <h2 className="text-4xl font-display font-extrabold uppercase tracking-tighter text-slate-800">
            Subscribe to Placement Recalls
          </h2>
          <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
            Enter your university email to receive immediate notifications of verified placement announcements, coding loops, and recruiter updates.
          </p>

          {emailSubmitted ? (
            <div className="text-red-700 font-bold text-xs bg-red-50 border border-red-200 w-fit mx-auto px-6 py-2.5 rounded-xl animate-bounce">
              ✓ Successfully subscribed to placement notifications!
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="name@vit.edu.in"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD3333]/40 transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-[#DD3333] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-sm"
              >
                <Mail className="h-4 w-4" />
                <span>Subscribe</span>
              </button>
            </form>
          )}
        </motion.section>

        {/* Footer (Animated Scroll Reveal) */}
        <motion.footer 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scrollReveal}
          className="border-t border-black/5 bg-white py-12 text-slate-400 text-xs relative z-10"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded bg-[#DD3333] flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                V
              </div>
              <span className="font-display font-semibold tracking-tight text-slate-800 uppercase">VIT Wadala.</span>
            </div>

            <p>© 2026 Vidyalankar Institute of Technology, Wadala, Mumbai. Placement Operating System.</p>

            <div className="flex items-center gap-6 font-semibold uppercase tracking-widest text-[10px]">
              <a href="#features" className="hover:text-[#DD3333] transition-colors">Features</a>
              <a href="#stats" className="hover:text-[#DD3333] transition-colors">Stats</a>
              <a href="#faq" className="hover:text-[#DD3333] transition-colors">FAQ</a>
            </div>
          </div>
        </motion.footer>
      </div>
    </>
  );
}
