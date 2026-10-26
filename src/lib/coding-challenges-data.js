// Master Coding Challenges Registry (100 Genuine Company Problems)
// Sourced from top recruitment drives: TCS, Google, Amazon, Microsoft, Infosys, Accenture, Wipro, Capgemini, Cognizant, J.P. Morgan

import { TCS_CODING_CHALLENGES } from "./coding-challenges/tcs.js";
import { GOOGLE_CODING_CHALLENGES } from "./coding-challenges/google.js";
import { AMAZON_CODING_CHALLENGES } from "./coding-challenges/amazon.js";
import { MICROSOFT_CODING_CHALLENGES } from "./coding-challenges/microsoft.js";
import { INFOSYS_CODING_CHALLENGES } from "./coding-challenges/infosys.js";
import { ACCENTURE_CODING_CHALLENGES } from "./coding-challenges/accenture.js";
import { WIPRO_CODING_CHALLENGES } from "./coding-challenges/wipro.js";
import { CAPGEMINI_CODING_CHALLENGES } from "./coding-challenges/capgemini.js";
import { COGNIZANT_CODING_CHALLENGES } from "./coding-challenges/cognizant.js";
import { JPMORGAN_CODING_CHALLENGES } from "./coding-challenges/jpmorgan.js";

export const CODING_COMPANIES_METADATA = [
  {
    id: "all",
    name: "All Companies",
    logo: "🏆",
    count: 100,
    accent: "#1C4980",
    badge: "Full Syllabus (100 Problems)",
    description: "Complete curated pool of repeatedly tested coding questions across tier-1 product & tech services firms."
  },
  {
    id: "tcs",
    name: "TCS (Ninja / Digital / Prime)",
    logo: "🏢",
    count: TCS_CODING_CHALLENGES.length,
    accent: "#0070F3",
    badge: "TCS NQT & Xplore",
    description: "Arrays, hash maps, string frequency, and two-pointer classics from TCS NQT national placement drives."
  },
  {
    id: "google",
    name: "Google",
    logo: "🔍",
    count: GOOGLE_CODING_CHALLENGES.length,
    accent: "#EA4335",
    badge: "Google SWE & STEP",
    description: "Sliding window, monotonic queue, interval trees, topological sorting, and dynamic programming."
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "📦",
    count: AMAZON_CODING_CHALLENGES.length,
    accent: "#FF9900",
    badge: "Amazon OA & SDE-1",
    description: "BFS graph traversal, LRU cache design, median from data stream, and binary tree paths."
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "🪟",
    count: MICROSOFT_CODING_CHALLENGES.length,
    accent: "#00A4EF",
    badge: "Microsoft Codility & SWE",
    description: "Linked list loops, tree lowest common ancestor, string decoding, and cycle detection."
  },
  {
    id: "infosys",
    name: "Infosys (DSE / SP)",
    logo: "💻",
    count: INFOSYS_CODING_CHALLENGES.length,
    accent: "#007CC3",
    badge: "InfyTQ & HackWithInfy",
    description: "Kadane's algorithm, Dutch National Flag, longest common subsequence, and matrix search."
  },
  {
    id: "accenture",
    name: "Accenture",
    logo: "🚀",
    count: ACCENTURE_CODING_CHALLENGES.length,
    accent: "#A100FF",
    badge: "Accenture ASE & FSE",
    description: "Bit manipulation, binary exponentiation, container with most water, and array rearrangement."
  },
  {
    id: "wipro",
    name: "Wipro (Elite / Turbo)",
    logo: "🌐",
    count: WIPRO_CODING_CHALLENGES.length,
    accent: "#FF5A36",
    badge: "Wipro NTH Automata",
    description: "Two-pointer string reversal, DP Fibonacci, Roman numeral parser, and binary search."
  },
  {
    id: "capgemini",
    name: "Capgemini (Exceller)",
    logo: "🔷",
    count: CAPGEMINI_CODING_CHALLENGES.length,
    accent: "#0070AD",
    badge: "Capgemini CoCubes",
    description: "Interval merging, array prefix products, 3Sum, matrix rotation, and daily temperatures stack."
  },
  {
    id: "cognizant",
    name: "Cognizant (GenC / Next)",
    logo: "⚡",
    count: COGNIZANT_CODING_CHALLENGES.length,
    accent: "#1565C0",
    badge: "GenC Elevate & Next",
    description: "Jump game reachability, house robber DP, word search grid, and coin change."
  },
  {
    id: "jpmorgan",
    name: "J.P. Morgan",
    logo: "🏦",
    count: JPMORGAN_CODING_CHALLENGES.length,
    accent: "#5C3D2E",
    badge: "Code For Good & OA",
    description: "Stock trading optimization, subarray sum equals k, gas station circuit, and network delay."
  }
];

export const ALL_CODING_CHALLENGES = [
  ...TCS_CODING_CHALLENGES,
  ...GOOGLE_CODING_CHALLENGES,
  ...AMAZON_CODING_CHALLENGES,
  ...MICROSOFT_CODING_CHALLENGES,
  ...INFOSYS_CODING_CHALLENGES,
  ...ACCENTURE_CODING_CHALLENGES,
  ...WIPRO_CODING_CHALLENGES,
  ...CAPGEMINI_CODING_CHALLENGES,
  ...COGNIZANT_CODING_CHALLENGES,
  ...JPMORGAN_CODING_CHALLENGES
];

export function getChallengeById(id) {
  return ALL_CODING_CHALLENGES.find(c => c.id === id) || null;
}

export function getChallengesByCompany(companyId) {
  if (!companyId || companyId === "all") return ALL_CODING_CHALLENGES;
  return ALL_CODING_CHALLENGES.filter(c => c.companyId === companyId);
}

export function getChallengesByDifficulty(difficulty) {
  if (!difficulty || difficulty === "ALL") return ALL_CODING_CHALLENGES;
  return ALL_CODING_CHALLENGES.filter(c => c.difficulty.toUpperCase() === difficulty.toUpperCase());
}

export function searchChallenges(query) {
  if (!query || !query.trim()) return ALL_CODING_CHALLENGES;
  const q = query.toLowerCase().trim();
  return ALL_CODING_CHALLENGES.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.company.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.tags.some(t => t.toLowerCase().includes(q)) ||
    c.description.toLowerCase().includes(q)
  );
}
