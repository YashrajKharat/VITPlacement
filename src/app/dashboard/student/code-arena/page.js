"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getCodingChallengesAction, runCodeSandboxAction, 
  submitCodeAction, analyzeCodeWithAIAction, getStudentCodingStatsAction 
} from "@/actions/assessments";
import { 
  Code, Play, Send, Sparkles, CheckCircle2, XCircle, 
  RefreshCw, Clock, Brain, Flame, Building, ArrowLeft,
  ChevronRight, BookOpen, Layers, Terminal, AlertCircle, Copy, Check, RotateCcw
} from "lucide-react";

const DEFAULT_CHALLENGES = [
  {
    id: "algo-1",
    title: "Two Sum Target Indices",
    slug: "two-sum",
    company: "Google",
    difficulty: "EASY",
    category: "Arrays & Hash Maps",
    tags: ["Google", "Array", "Hash Table", "Hot"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]." },
      { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]." }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums, target):
    # Your code here
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], isHidden: false },
      { input: [[3, 2, 4], 6], expected: [1, 2], isHidden: false },
      { input: [[3, 3], 6], expected: [0, 1], isHidden: false },
      { input: [[1, 5, 8, 12, 19], 20], expected: [0, 4], isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    hints: [
      "A brute force approach checks all pairs in O(N^2) time.",
      "Can you use a Hash Map to store elements and look up complements in O(1) time?"
    ]
  },
  {
    id: "algo-2",
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring",
    company: "Microsoft",
    difficulty: "MEDIUM",
    category: "Strings & Sliding Window",
    tags: ["Microsoft", "String", "Sliding Window"],
    description: "Given a string `s`, find the length of the longest substring without duplicate characters.\n\nA substring is a contiguous non-empty sequence of characters within a string.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with length 3.' }
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const set = new Set();
  
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    char_set = set()
    left = 0
    res = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        res = max(res, right - left + 1)
    return res`
    },
    testCases: [
      { input: ["abcabcbb"], expected: 3, isHidden: false },
      { input: ["bbbbb"], expected: 1, isHidden: false },
      { input: ["pwwkew"], expected: 3, isHidden: false },
      { input: [""], expected: 0, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(min(N, M))",
    hints: [
      "Use a sliding window with two pointers left and right.",
      "Keep a Set of characters in the current active window."
    ]
  },
  {
    id: "algo-3",
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    company: "Barclays",
    difficulty: "HARD",
    category: "Arrays & Two Pointers",
    tags: ["Barclays", "Array", "Two Pointers", "Dynamic Programming"],
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "The elevation map traps 6 units of rain water." },
      { input: "height = [4,2,0,3,2,5]", output: "9", explanation: "The elevation map traps 9 units of rain water." }
    ],
    starterCode: {
      javascript: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;
  
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else totalWater += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else totalWater += rightMax - height[right];
      right--;
    }
  }
  return totalWater;
}`,
      python: `def trap(height: list[int]) -> int:
    if not height: return 0
    l, r = 0, len(height) - 1
    left_max, right_max = height[l], height[r]
    res = 0
    while l < r:
        if left_max < right_max:
            l += 1
            left_max = max(left_max, height[l])
            res += left_max - height[l]
        else:
            r -= 1
            right_max = max(right_max, height[r])
            res += right_max - height[r]
    return res`
    },
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, isHidden: false },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9, isHidden: false },
      { input: [[3, 0, 2, 0, 4]], expected: 7, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: [
      "Water above index i is min(maxLeft, maxRight) - height[i].",
      "Can we optimize space to O(1) using Two Pointers from both ends?"
    ]
  },
  {
    id: "algo-4",
    title: "Top K Frequent Elements",
    slug: "top-k-frequent",
    company: "Morgan Stanley",
    difficulty: "MEDIUM",
    category: "Heaps & Hash Maps",
    tags: ["Morgan Stanley", "Heap", "Hash Table", "Bucket Sort"],
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]", explanation: "1 appears 3 times and 2 appears 2 times." },
      { input: "nums = [1], k = 1", output: "[1]", explanation: "1 appears once." }
    ],
    starterCode: {
      javascript: `function topKFrequent(nums, k) {
  const counts = new Map();
  nums.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, k).map(entry => entry[0]);
}`,
      python: `def top_k_frequent(nums: list[int], k: int) -> list[int]:
    import collections
    count = collections.Counter(nums)
    return [item[0] for item in count.most_common(k)]`
    },
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], isHidden: false },
      { input: [[1], 1], expected: [1], isHidden: false },
      { input: [[4, 1, -1, 2, -1, 2, 3], 2], expected: [-1, 2], isHidden: true }
    ],
    timeComplexity: "O(N log K)",
    spaceComplexity: "O(N)",
    hints: [
      "Count frequencies with a Hash Map first.",
      "Use a min-heap of size K or bucket sort to achieve O(N) or O(N log K)."
    ]
  },
  {
    id: "algo-5",
    title: "Valid Anagram & Subsequence",
    slug: "valid-anagram",
    company: "TCS Digital",
    difficulty: "EASY",
    category: "Strings & Sorting",
    tags: ["TCS", "Infosys", "String", "Easy"],
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true", explanation: "All characters match frequencies." },
      { input: 's = "rat", t = "car"', output: "false", explanation: "Frequencies do not match." }
    ],
    starterCode: {
      javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const char of s) count[char] = (count[char] || 0) + 1;
  for (const char of t) {
    if (!count[char]) return false;
    count[char]--;
  }
  return true;
}`,
      python: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t): return False
    return sorted(s) == sorted(t)`
    },
    testCases: [
      { input: ["anagram", "nagaram"], expected: true, isHidden: false },
      { input: ["rat", "car"], expected: false, isHidden: false },
      { input: ["aacc", "ccac"], expected: false, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: [
      "What if the strings contain Unicode characters?",
      "Can you count character occurrences in an array of size 26?"
    ]
  }
];

export default function CodeArenaPage() {
  const [challenges, setChallenges] = useState(DEFAULT_CHALLENGES);
  const [selectedChallenge, setSelectedChallenge] = useState(DEFAULT_CHALLENGES[0]);
  const [stats, setStats] = useState({ totalSolved: 0, streakDays: 0, faangScore: 0 });
  const [loading, setLoading] = useState(false);

  // Filter states
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");

  // Code editor states
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CHALLENGES[0].starterCode.javascript);
  const [activeTab, setActiveTab] = useState("testcases"); // description | testcases | aianalysis

  // Execution states
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load challenges and student stats
  const loadData = async () => {
    try {
      const [chalRes, statsRes] = await Promise.all([
        getCodingChallengesAction({ difficulty: difficultyFilter, company: companyFilter }),
        getStudentCodingStatsAction()
      ]);

      if (chalRes?.success && chalRes.challenges?.length > 0) {
        setChallenges(chalRes.challenges);
        // If current selected challenge is in new list, keep it; else set to first
        const match = chalRes.challenges.find(c => c.id === selectedChallenge?.id);
        if (match) {
          setSelectedChallenge(match);
        } else {
          selectChallenge(chalRes.challenges[0], language);
        }
      } else {
        // Apply client-side filter to DEFAULT_CHALLENGES
        const filtered = DEFAULT_CHALLENGES.filter(ch => {
          const matchCompany = companyFilter === "ALL" || ch.company.toLowerCase().includes(companyFilter.toLowerCase());
          const matchDiff = difficultyFilter === "ALL" || ch.difficulty === difficultyFilter;
          return matchCompany && matchDiff;
        });
        setChallenges(filtered.length > 0 ? filtered : DEFAULT_CHALLENGES);
      }

      if (statsRes?.success) {
        setStats(statsRes);
      }
    } catch (err) {
      console.warn("Could not load fresh challenges, using defaults:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [difficultyFilter, companyFilter]);

  const selectChallenge = (ch, lang = language) => {
    setSelectedChallenge(ch);
    const starter = ch?.starterCode?.[lang] || ch?.starterCode?.javascript || "// Write your code here";
    setCode(starter);
    setRunResult(null);
    setAiAnalysis(null);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const targetChallenge = selectedChallenge || challenges[0] || DEFAULT_CHALLENGES[0];
    if (targetChallenge?.starterCode?.[newLang]) {
      setCode(targetChallenge.starterCode[newLang]);
    }
  };

  // 1. Run Sandbox Tests
  const handleRunCode = async () => {
    const targetChallenge = selectedChallenge || challenges[0] || DEFAULT_CHALLENGES[0];
    const chId = targetChallenge?.id || "algo-1";
    
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
    const targetChallenge = selectedChallenge || challenges[0] || DEFAULT_CHALLENGES[0];
    const chId = targetChallenge?.id || "algo-1";

    setSubmitting(true);
    setRunResult(null);
    setActiveTab("testcases");

    try {
      const res = await submitCodeAction(chId, code, language);
      setRunResult(res);
      if (res?.allPassed) {
        // Refresh stats
        const statsRes = await getStudentCodingStatsAction();
        if (statsRes?.success) setStats(statsRes);
        // Mark as solved locally
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
    const targetChallenge = selectedChallenge || challenges[0] || DEFAULT_CHALLENGES[0];
    const chId = targetChallenge?.id || "algo-1";

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

  const displayChallenges = challenges.length > 0 ? challenges : DEFAULT_CHALLENGES;
  const activeChallenge = selectedChallenge || displayChallenges[0] || DEFAULT_CHALLENGES[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-left pb-16">
      {/* Top Header & Streak Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DD3333] mb-1">
            <Link href="/dashboard/student" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <span>•</span>
            <span className="bg-red-50 text-[#DD3333] px-2 py-0.5 rounded-full font-bold">ASSESSMENT ARENA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Company Placement Code Arena
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Practice actual technical online assessment (OA) questions from Google, Morgan Stanley, Barclays, and Stripe.
          </p>
        </div>

        {/* Solved Stats Pill */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{stats?.streakDays || 0} Day Streak</span>
          </div>
          <div className="text-xs font-bold text-slate-700 px-3 py-1.5 rounded-xl bg-slate-50">
            Solved: <span className="text-[#DD3333]">{stats?.totalSolved || 0}</span> / {displayChallenges.length}
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Problem List + Details, Right Editor */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Challenge Selection & Description */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Filter Pill Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="text-xs font-bold p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Companies</option>
                <option value="Google">Google</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Barclays">Barclays</option>
                <option value="Morgan Stanley">Morgan Stanley</option>
                <option value="TCS">TCS Digital</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="text-xs font-bold p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {(companyFilter !== "ALL" || difficultyFilter !== "ALL") && (
              <button
                onClick={() => { setCompanyFilter("ALL"); setDifficultyFilter("ALL"); }}
                className="text-[11px] font-bold text-slate-500 hover:text-[#DD3333] flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Problem List Horizontal Carousel / Stack */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {displayChallenges.map((ch) => {
              const isSelected = activeChallenge?.id === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => selectChallenge(ch)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#DD3333] bg-red-50/40 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      ch.isSolved ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {ch.isSolved ? <CheckCircle2 className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 leading-snug">{ch.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                          <Building className="h-3 w-3" /> {ch.company}
                        </span>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                          ch.difficulty === "EASY" ? "bg-emerald-50 text-emerald-600" :
                          ch.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                        }`}>
                          {ch.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              );
            })}
          </div>

          {/* Selected Problem Deep-Dive Card */}
          {activeChallenge && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#DD3333] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-md">
                    {activeChallenge.category}
                  </span>
                  <h3 className="text-lg font-bold font-display text-slate-900 mt-1">
                    {activeChallenge.title}
                  </h3>
                </div>
                <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                  activeChallenge.difficulty === "EASY" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                  activeChallenge.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                  "bg-rose-50 text-rose-600 border border-rose-200"
                }`}>
                  {activeChallenge.difficulty}
                </span>
              </div>

              {/* Description Body */}
              <div className="text-xs text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                {activeChallenge.description}
              </div>

              {/* Examples */}
              {activeChallenge.examples?.map((ex, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                  <p className="font-bold text-slate-900 text-[11px]">Example {idx + 1}:</p>
                  <p className="font-mono text-[11px] text-slate-600"><strong>Input:</strong> {ex.input}</p>
                  <p className="font-mono text-[11px] text-slate-600"><strong>Output:</strong> {ex.output}</p>
                  {ex.explanation && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">Explanation: {ex.explanation}</p>
                  )}
                </div>
              ))}

              {/* Complexity Benchmark */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white text-xs">
                <span className="font-semibold text-slate-300">Target Time: <strong className="text-white">{activeChallenge.timeComplexity}</strong></span>
                <span>•</span>
                <span className="font-semibold text-slate-300">Target Space: <strong className="text-white">{activeChallenge.spaceComplexity}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Code Editor & Execution Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            {/* Editor Toolbar */}
            <div className="h-14 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <div className="flex rounded-xl bg-slate-800 p-1">
                  <button
                    onClick={() => handleLanguageChange("javascript")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      language === "javascript" ? "bg-[#DD3333] text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => handleLanguageChange("python")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      language === "python" ? "bg-[#DD3333] text-white" : "text-slate-400 hover:text-white"
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
                  className="px-4 py-1.5 rounded-xl bg-[#DD3333] hover:bg-[#c52b2b] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#DD3333]/20 transition-all cursor-pointer"
                >
                  {submitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  <span>Submit</span>
                </button>
              </div>
            </div>

            {/* Code Textarea Area */}
            <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed min-h-[340px]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={15}
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
                    activeTab === "testcases" ? "text-white border-b-2 border-[#DD3333]" : "text-slate-500 hover:text-slate-300"
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
                    activeTab === "aianalysis" ? "text-white border-b-2 border-[#DD3333]" : "text-slate-500 hover:text-slate-300"
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
                              <p className="text-[10px] opacity-80">Expected: {JSON.stringify(tc.expected)}</p>
                              <p className="text-[10px] opacity-80">Output: {JSON.stringify(tc.actual)}</p>
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
                              className="flex items-center gap-1 text-[10px] text-[#DD3333] hover:underline cursor-pointer"
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
