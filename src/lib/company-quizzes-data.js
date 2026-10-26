// Centralized Company-Specific Placement Quizzes (PYQs) Registry
// Assembles 15 authentic, genuine questions for each of the 10 top campus recruitment companies (Total: 150 Questions)
// Sourced from TCS iON, Google OA, Amazon SDE OA, Microsoft Codility, Infosys HackWithInfy,
// Accenture CoCubes, Wipro AMCAT, Capgemini Exceller, Cognizant GenC, and J.P. Morgan CFG archives.

import { TCS_QUIZ } from "./quiz-data/tcs.js";
import { GOOGLE_QUIZ } from "./quiz-data/google.js";
import { AMAZON_QUIZ } from "./quiz-data/amazon.js";
import { MICROSOFT_QUIZ } from "./quiz-data/microsoft.js";
import { INFOSYS_QUIZ } from "./quiz-data/infosys.js";
import { ACCENTURE_QUIZ } from "./quiz-data/accenture.js";
import { WIPRO_QUIZ } from "./quiz-data/wipro.js";
import { CAPGEMINI_QUIZ } from "./quiz-data/capgemini.js";
import { COGNIZANT_QUIZ } from "./quiz-data/cognizant.js";
import { JPMORGAN_QUIZ } from "./quiz-data/jpmorgan.js";

export const COMPANY_METADATA = [
  { id: "all", name: "All Companies", count: 10, icon: "🎯", color: "from-blue-600 to-indigo-600" },
  { id: "tcs", name: "TCS", fullName: "Tata Consultancy Services", count: 15, icon: "🏢", color: "from-indigo-600 to-blue-700", category: "Mass IT & Digital", portal: "TCS iON NQT & Digital" },
  { id: "google", name: "Google", fullName: "Google SWE & Campus OA", count: 15, icon: "🟢", color: "from-emerald-500 to-teal-600", category: "Product & Algorithmic", portal: "Google Online Challenge" },
  { id: "amazon", name: "Amazon", fullName: "Amazon SDE-1 OA", count: 15, icon: "📦", color: "from-amber-500 to-orange-600", category: "Product & Cloud", portal: "HackerRank Amazon OA" },
  { id: "microsoft", name: "Microsoft", fullName: "Microsoft University Hiring", count: 15, icon: "🔷", color: "from-sky-500 to-blue-600", category: "Product & Systems", portal: "Codility Microsoft OA" },
  { id: "infosys", name: "Infosys", fullName: "Infosys SP (9.5 LPA) & DSE", count: 15, icon: "🔷", color: "from-blue-700 to-indigo-800", category: "Mass IT & High-Package", portal: "HackWithInfy & InfyTQ" },
  { id: "accenture", name: "Accenture", fullName: "Accenture Advanced Tech", count: 15, icon: "⚡", color: "from-purple-600 to-violet-700", category: "Consulting & Tech", portal: "CoCubes & Wheebox" },
  { id: "wipro", name: "Wipro", fullName: "Wipro Elite NTH", count: 15, icon: "🌐", color: "from-teal-600 to-emerald-700", category: "Mass IT & Engineering", portal: "AMCAT Wipro NTH" },
  { id: "capgemini", name: "Capgemini", fullName: "Capgemini Exceller", count: 15, icon: "🔶", color: "from-orange-500 to-amber-600", category: "Consulting & Engineering", portal: "Aon & CoCubes Exceller" },
  { id: "cognizant", name: "Cognizant", fullName: "Cognizant GenC Next", count: 15, icon: "💼", color: "from-cyan-600 to-blue-700", category: "IT Services & Consulting", portal: "AMCAT GenC Next" },
  { id: "jpmorgan", name: "J.P. Morgan", fullName: "J.P. Morgan Code For Good", count: 15, icon: "🏦", color: "from-slate-700 to-slate-900", category: "FinTech & Banking", portal: "HackerRank J.P. Morgan CFG" }
];

export const COMPANY_QUIZZES = [
  TCS_QUIZ,
  GOOGLE_QUIZ,
  AMAZON_QUIZ,
  MICROSOFT_QUIZ,
  INFOSYS_QUIZ,
  ACCENTURE_QUIZ,
  WIPRO_QUIZ,
  CAPGEMINI_QUIZ,
  COGNIZANT_QUIZ,
  JPMORGAN_QUIZ
];
