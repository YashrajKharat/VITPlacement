import { prisma, isPrismaHealthy } from "./prisma.js";
import { getMongoDb, seedMongoDbIfEmpty } from "./mongodb.js";
import fs from "fs";
import path from "path";

const MOCK_STORAGE_FILE = path.join(process.cwd(), ".mockdb.json");

function getInitialMockData() {
  return {
    users: [
      { id: "faculty-1", email: "faculty@college.edu", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "FACULTY_MENTOR", name: "Faculty Mentor" },
      { id: "coordinator-1", email: "coordinator@college.edu", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "INTERNSHIP_COORDINATOR", name: "Internship Coordinator" },
      { id: "tpo-1", email: "tpo@college.edu", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "TPO", name: "Training & Placement Officer" },
      { id: "admin-1", email: "admin@portal.com", passwordHash: "$2a$10$abcdefghijklmnopqrstuv", role: "ADMIN", name: "System Admin" }
    ],
    students: [],
    recruiters: [],
    companies: [],
    jobs: [],
    applications: [],
    interviews: [],
    offerLetters: [],
    notifications: [],
    activityLogs: [],
    bookmarks: [],
    internshipRequirements: [
      {
        id: "req-sem6-2026",
        academicYear: "2025-2026",
        semester: "SEM_6",
        department: "CMPN",
        year: "Third Year",
        divisions: ["A", "B", "C"],
        internshipType: "Industry Internship",
        startDate: new Date("2026-01-05"),
        endDate: new Date("2026-10-30"),
        minDurationWeeks: 4,
        maxDurationWeeks: 8,
        requiredCredits: 4,
        requiredDocuments: ["CERTIFICATE", "REPORT"],
        marksConfig: {
          certificate: 20,
          company: 30,
          report: 20,
          technical: 15,
          viva: 10,
          attendance: 5,
          total: 100
        },
        gradeBoundaries: {
          "A+": [90, 100],
          "A": [80, 89.9],
          "B": [70, 79.9],
          "C": [60, 69.9],
          "D": [50, 59.9],
          "F": [0, 49.9]
        },
        status: "OPEN",
        createdAt: new Date("2026-01-01")
      },
      {
        id: "req-sem8-2026",
        academicYear: "2025-2026",
        semester: "SEM_8",
        department: "CMPN",
        year: "Fourth Year",
        divisions: ["A", "B"],
        internshipType: "Industry Internship",
        startDate: new Date("2026-01-10"),
        endDate: new Date("2026-11-15"),
        minDurationWeeks: 8,
        maxDurationWeeks: 16,
        requiredCredits: 8,
        requiredDocuments: ["CERTIFICATE", "REPORT", "OFFER_LETTER"],
        marksConfig: {
          certificate: 20,
          company: 30,
          report: 20,
          technical: 15,
          viva: 10,
          attendance: 5,
          total: 100
        },
        gradeBoundaries: {
          "A+": [90, 100],
          "A": [80, 89.9],
          "B": [70, 79.9],
          "C": [60, 69.9],
          "D": [50, 59.9],
          "F": [0, 49.9]
        },
        status: "OPEN",
        createdAt: new Date("2026-01-01")
      }
    ],
    internshipSubmissions: [],
    internshipDocuments: [],
    certificateVerifications: [],
    reportAnalyses: [],
    companyMentorEvaluations: [],
    facultyEvaluations: [],
    internshipAuditLogs: [],
    codingChallenges: [
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
        tags: ["Microsoft", "String", "Sliding Window", "Amazon"],
        description: "Given a string `s`, find the length of the longest substring without repeating characters.",
        examples: [
          { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
          { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
          { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with the length of 3.' }
        ],
        starterCode: {
          javascript: `function lengthOfLongestSubstring(s) {
  // Your code here
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
    max_len = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len`
        },
        testCases: [
          { input: ["abcabcbb"], expected: 3, isHidden: false },
          { input: ["bbbbb"], expected: 1, isHidden: false },
          { input: ["pwwkew"], expected: 3, isHidden: false },
          { input: [""], expected: 0, isHidden: true },
          { input: ["au"], expected: 2, isHidden: true }
        ],
        timeComplexity: "O(N)",
        spaceComplexity: "O(min(N, M))",
        hints: [
          "Use a sliding window technique with two pointers.",
          "Keep track of characters currently in the window using a Set or Hash Map."
        ]
      },
      {
        id: "algo-3",
        title: "Trapping Rain Water",
        slug: "trapping-rain-water",
        company: "Morgan Stanley",
        difficulty: "HARD",
        category: "Two Pointers & DP",
        tags: ["Morgan Stanley", "Two Pointers", "Dynamic Programming", "Google"],
        description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        examples: [
          { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "The above elevation map is represented by array. In this case, 6 units of rain water are being trapped." },
          { input: "height = [4,2,0,3,2,5]", output: "9", explanation: "9 units of rain water trapped." }
        ],
        starterCode: {
          javascript: `function trap(height) {
  // Your code here
  if (!height || height.length === 0) return 0;
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let water = 0;
  
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
          python: `def trap(height: list[int]) -> int:
    if not height: return 0
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max: left_max = height[left]
            else: water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max: right_max = height[right]
            else: water += right_max - height[right]
            right -= 1
    return water`
        },
        testCases: [
          { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, isHidden: false },
          { input: [[4, 2, 0, 3, 2, 5]], expected: 9, isHidden: false },
          { input: [[3, 0, 2, 0, 4]], expected: 7, isHidden: true }
        ],
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        hints: [
          "For any bar, the water it holds is min(max_left, max_right) - height.",
          "Can you optimize auxiliary space to O(1) using two pointers moving from ends towards middle?"
        ]
      },
      {
        id: "algo-4",
        title: "Top K Frequent Elements",
        slug: "top-k-frequent",
        company: "Barclays",
        difficulty: "MEDIUM",
        category: "Heap & Bucket Sort",
        tags: ["Barclays", "Hash Table", "Bucket Sort", "Heap"],
        description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
        examples: [
          { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]", explanation: "1 occurs 3 times, 2 occurs 2 times." },
          { input: "nums = [1], k = 1", output: "[1]", explanation: "1 occurs 1 time." }
        ],
        starterCode: {
          javascript: `function topKFrequent(nums, k) {
  // Your code here
  const count = {};
  for (const n of nums) count[n] = (count[n] || 0) + 1;
  
  const sorted = Object.keys(count).sort((a, b) => count[b] - count[a]);
  return sorted.slice(0, k).map(Number);
}`,
          python: `from collections import Counter
def top_k_frequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    return [item for item, _ in count.most_common(k)]`
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
    ],
    codeSubmissions: [],
    interviewExperiences: [
      {
        id: "exp-1",
        studentName: "Aditya S. (Alumni '25)",
        department: "CMPN",
        company: "Morgan Stanley",
        role: "Technology Analyst",
        package: "24.5 LPA",
        packageTier: "SUPER_DREAM",
        verdict: "SELECTED",
        difficulty: "HARD",
        date: "2025-10-15",
        upvotes: 42,
        cgpaRequired: "8.0+",
        summary: "Morgan Stanley's campus drive had 4 rounds. Heavy focus on DSA (Trees & Dynamic Programming), Operating System concepts, and Low-Level System Design (Design Parking Lot / LRU Cache).",
        rounds: [
          {
            roundNumber: 1,
            title: "Online Assessment (HackerRank)",
            duration: "90 Mins",
            details: "3 Coding questions (1 Easy string manipulation, 1 Medium Tree BFS/DFS, 1 Hard DP on Grids) + 10 CS Fundamentals MCQs on OS (Virtual Memory, Semaphores) and DBMS."
          },
          {
            roundNumber: 2,
            title: "Technical Round 1 (DSA & Core CS)",
            duration: "60 Mins",
            details: "Live coding on CoderPad: Trapping Rain Water problem, followed by detailed explanation of time & space complexity. Deep-dive into multithreading, race conditions, and mutexes in Java/C++."
          },
          {
            roundNumber: 3,
            title: "Technical Round 2 (System Design & Projects)",
            duration: "45 Mins",
            details: "Walkthrough of my final year project architecture. Asked to design a scalable real-time notification service with Redis and Kafka. Questions on database indexing and B+ trees."
          },
          {
            roundNumber: 4,
            title: "HR / Senior Director Round",
            duration: "30 Mins",
            details: "Behavioral questions using STAR technique: 'Tell me about a conflict in a team project', 'Why Morgan Stanley over tech product firms?', 'Where do you see yourself in 3 years?'."
          }
        ],
        tips: [
          "Master LeetCode Medium/Hard for Trees, Graphs, and DP.",
          "Prepare OS concepts (Paging, Deadlocks, Context Switching) thoroughly.",
          "Be ready to justify every technology choice in your resume projects."
        ]
      },
      {
        id: "exp-2",
        studentName: "Neha P. (Alumni '25)",
        department: "IT",
        company: "Barclays",
        role: "Graduate Technology Developer",
        package: "14.2 LPA",
        packageTier: "DREAM",
        verdict: "SELECTED",
        difficulty: "MEDIUM",
        date: "2025-09-28",
        upvotes: 38,
        cgpaRequired: "7.5+",
        summary: "Barclays evaluates both strong coding foundation and alignment with Barclays RISES core values. Clean code and communication during the interview was the key differentiator.",
        rounds: [
          {
            roundNumber: 1,
            title: "Online Coding & Value Assessment",
            duration: "75 Mins",
            details: "2 Coding Questions (Arrays & String hashing) + Barclays Values situational judgment questions."
          },
          {
            roundNumber: 2,
            title: "Technical Interview Round",
            duration: "50 Mins",
            details: "Questions on SQL joins, grouping, and subqueries. Asked to write Top K Frequent Elements and reverse a linked list in groups of K. Discussion on REST API best practices."
          },
          {
            roundNumber: 3,
            title: "Values & Leadership Round",
            duration: "40 Mins",
            details: "Discussed real-life leadership scenarios, handling tight project deadlines, and ethical considerations in fintech software."
          }
        ],
        tips: [
          "Understand Barclays RISES values (Respect, Integrity, Service, Excellence, Stewardship).",
          "Practice SQL medium queries (Window functions, dense_rank).",
          "Speak your thought process out loud when solving coding problems."
        ]
      },
      {
        id: "exp-3",
        studentName: "Rohan V. (Alumni '25)",
        department: "CMPN",
        company: "Stripe",
        role: "Software Development Engineer",
        package: "36.0 LPA",
        packageTier: "SUPER_DREAM",
        verdict: "SELECTED",
        difficulty: "HARD",
        date: "2025-11-04",
        upvotes: 56,
        cgpaRequired: "8.5+",
        summary: "World-class engineering bar. Focus on practical software development, writing clean maintainable code with unit tests, and production debugging.",
        rounds: [
          {
            roundNumber: 1,
            title: "Practical Take-Home Coding Challenge",
            duration: "120 Mins",
            details: "Building a rate-limiter and idempotency key validator in TypeScript / Node.js with automated test suites."
          },
          {
            roundNumber: 2,
            title: "Pair Programming & Refactoring",
            duration: "60 Mins",
            details: "Refactored an existing microservice module with the interviewer, adding edge case error handling, logging, and concurrency control."
          },
          {
            roundNumber: 3,
            title: "System Architecture & API Design",
            duration: "60 Mins",
            details: "Designed a multi-currency webhook payment notification distributor with retry queues and DLQ (Dead Letter Queue)."
          }
        ],
        tips: [
          "Focus on code readability, modularity, and clean error handling.",
          "Familiarize yourself with distributed systems fundamentals (Idempotency, Eventual Consistency).",
          "Don't rush to code—clarify requirements and edge cases first."
        ]
      },
      {
        id: "exp-4",
        studentName: "Pooja M. (Alumni '25)",
        department: "EXTC",
        company: "TCS Digital",
        role: "System Engineer - Digital",
        package: "7.5 LPA",
        packageTier: "REGULAR",
        verdict: "SELECTED",
        difficulty: "MEDIUM",
        date: "2025-08-20",
        upvotes: 29,
        cgpaRequired: "7.0+",
        summary: "TCS NQT Advanced section has high cutoff. Focus on Speed in Aptitude & Logical reasoning, followed by 2 standard coding questions.",
        rounds: [
          {
            roundNumber: 1,
            title: "TCS National Qualifier Test (NQT)",
            duration: "110 Mins",
            details: "Quantitative Aptitude, Reasoning, Verbal, and Advanced Coding (Matrix rotation & Dynamic Programming basics)."
          },
          {
            roundNumber: 2,
            title: "Technical + Managerial + HR Combined Panel",
            duration: "45 Mins",
            details: "OOPs concepts (Polymorphism, Inheritance), Python list comprehensions vs generators, and final year project demo."
          }
        ],
        tips: [
          "Practice timed aptitude tests on IndiaBIX or PrepInsta.",
          "Solidify OOPs concepts in Java or Python.",
          "Be confident in explaining your project's practical utility."
        ]
      }
    ],
    experienceUpvotes: [],
    offerComparisons: [],

    // UNSTOP REPLICA DATA COLLECTIONS
    competitions: [
      {
        id: "comp-tata-2026",
        title: "Tata Imagination Challenge 2026",
        slug: "tata-imagination-challenge-2026",
        organizer: "Tata Sons",
        organizerLogo: "🏢",
        category: "CASE_STUDY",
        badge: "FEATURED",
        bannerGradient: "from-blue-900 via-indigo-900 to-slate-900",
        prizePool: "₹5,00,000 + Tata Leader Mentorship + Fast-Track PPIs",
        prizeAmountNumeric: 500000,
        impressions: "85.4K",
        registeredCount: 14820,
        daysLeft: 6,
        deadline: "2026-10-25",
        startDate: "2026-10-10",
        endDate: "2026-11-15",
        teamSize: "1 - 3 Members",
        eligibility: "All Undergrads & Postgrads",
        mode: "Online",
        fee: "Free",
        location: "Virtual & Mumbai Final",
        description: "The Tata Imagination Challenge is one of India's largest leadership & case competition platforms. Solve strategic real-world problems facing India across Sustainability, Digital Inclusion, Green Energy, and Next-Gen Mobility. Top winners present directly to Tata Group Executive Directors with direct entry to Tata Administrative Services (TAS) PPIs.",
        tracks: [
          { name: "Green Energy & Circular Economy", desc: "Scaling carbon-neutral manufacturing and EV charging infrastructure across tier-2/3 cities." },
          { name: "Digital Inclusion & FinTech", desc: "Empowering 100M rural micro-merchants with voice-first payments and credit scoring." },
          { name: "Next-Gen AI Mobility", desc: "Smart fleet telemetry and real-time safety automation for connected electric vehicles." }
        ],
        stages: [
          { roundNumber: 1, title: "Tata Brand & Critical Aptitude Assessment", type: "ONLINE_QUIZ", duration: "30 Mins", deadline: "Oct 25, 2026", details: "Online timed assessment covering logical reasoning, business comprehension, and Tata case vignettes." },
          { roundNumber: 2, title: "Executive Case Solution Deck Submission", type: "DECK_SUBMISSION", duration: "10-Slide Deck", deadline: "Nov 05, 2026", details: "Shortlisted teams submit structured PPT proposal with financial feasibility, TAM analysis, and execution roadmap." },
          { roundNumber: 3, title: "Grand National Finale & Jury Pitch", type: "LIVE_PITCH", duration: "15 Mins Pitch + Q&A", deadline: "Nov 15, 2026", details: "Top 10 National Finalists present live before Tata Sons Managing Directors at Bombay House." }
        ],
        prizes: [
          { rank: "1st Place (National Winner)", prize: "₹2,50,000 Cash", perks: "TAS Pre-Placement Interview + 1-Year Executive Mentorship + Gold Trophy" },
          { rank: "2nd Place (1st Runner Up)", prize: "₹1,50,000 Cash", perks: "Tata Group PPIs + Trophy + Merit Certificate" },
          { rank: "3rd Place (2nd Runner Up)", prize: "₹1,00,000 Cash", perks: "Tata Group PPIs + Trophy + Merit Certificate" },
          { rank: "All Round 2 Qualifiers", prize: "Tata Swag Kit", perks: "Certificate of Appreciation + Exclusive Masterclasses" }
        ],
        rules: [
          "Cross-college and cross-department teams are strictly permitted.",
          "Plagiarism or AI-generated unvetted reports will lead to immediate disqualification.",
          "All team members must be registered before the deadline."
        ]
      },
      {
        id: "comp-flipkart-grid-7",
        title: "Flipkart GRiD 7.0 - Robotics & Software Hackathon",
        slug: "flipkart-grid-7",
        organizer: "Flipkart",
        organizerLogo: "🛍️",
        category: "HACKATHON",
        badge: "MEGA HIRING",
        bannerGradient: "from-blue-800 via-sky-900 to-indigo-950",
        prizePool: "₹3,50,000 + SDE-1 Job Offers (32 LPA CTC)",
        prizeAmountNumeric: 350000,
        impressions: "92.1K",
        registeredCount: 18450,
        daysLeft: 4,
        deadline: "2026-10-20",
        startDate: "2026-10-05",
        endDate: "2026-11-20",
        teamSize: "2 - 4 Members",
        eligibility: "B.Tech/M.Tech (2025, 2026, 2027 Batches)",
        mode: "Online / Bangalore HQ Finale",
        fee: "Free",
        location: "Virtual + Flipkart HQ",
        description: "Flipkart GRiD is Flipkart's flagship engineering campus challenge. Now in its 7th edition, GRiD invites top young minds to solve deep-tech algorithmic, distributed systems, and autonomous computer vision challenges powering India's largest e-commerce infrastructure.",
        tracks: [
          { name: "Autonomous Warehouse Robotics", desc: "Real-time edge computer vision for automated parcel sorting and barcode defect detection." },
          { name: "Smart Delivery Route Optimization", desc: "Dynamic multi-vehicle routing with live traffic congestion and hyperlocal delivery constraints." },
          { name: "GenAI Product Discovery & Voice Search", desc: "Multilingual Indian voice-assisted search and conversational buying assistants." }
        ],
        stages: [
          { roundNumber: 1, title: "E-Commerce Tech & DSA Screening Quiz", type: "ONLINE_QUIZ", duration: "45 Mins", deadline: "Oct 20, 2026", details: "Online algorithmic problem solving, distributed computing, and CS fundamentals." },
          { roundNumber: 2, title: "Prototype & Architecture Submission", type: "CODE_SUBMISSION", duration: "GitHub + Demo", deadline: "Nov 08, 2026", details: "Build and deploy working prototype with complete benchmark metrics, video demo, and architecture doc." },
          { roundNumber: 3, title: "Live Hackathon & Bangalore Demo", type: "LIVE_HACKATHON", duration: "24-Hour Prototype Hack", deadline: "Nov 20, 2026", details: "Finalist teams flown to Flipkart Bengaluru HQ to present to VP of Engineering." }
        ],
        prizes: [
          { rank: "National Champion", prize: "₹2,00,000 Cash", perks: "Full-Time SDE-1 Offers (32.0 LPA) + Fast-Track PPIs for all team members" },
          { rank: "1st Runner Up", prize: "₹1,00,000 Cash", perks: "SDE-1 Offers (32.0 LPA) + Flipkart Vouchers" },
          { rank: "2nd Runner Up", prize: "₹50,000 Cash", perks: "SDE Internship Offers + Flipkart Vouchers" },
          { rank: "Top 50 Semi-Finalists", prize: "Exclusive Merch", perks: "Direct Technical Interview Call for SDE Internships" }
        ],
        rules: [
          "Team members must belong to an accredited engineering institution.",
          "Submissions must contain working code and reproducible instructions."
        ]
      },
      {
        id: "comp-sih-2026",
        title: "Smart India Hackathon (SIH) 2026 - Campus Arena",
        slug: "smart-india-hackathon-2026",
        organizer: "Ministry of Education & AICTE",
        organizerLogo: "🇮🇳",
        category: "HACKATHON",
        badge: "GOVT OF INDIA",
        bannerGradient: "from-orange-900 via-amber-950 to-slate-950",
        prizePool: "₹1,00,000 per Problem Statement + Incubation Support",
        prizeAmountNumeric: 100000,
        impressions: "115K",
        registeredCount: 22600,
        daysLeft: 8,
        deadline: "2026-10-30",
        startDate: "2026-10-15",
        endDate: "2026-12-05",
        teamSize: "6 Members (1 Female Mandatory)",
        eligibility: "All Recognized College Students",
        mode: "Hybrid",
        fee: "Free",
        location: "Pan-India Nodal Centers",
        description: "World's biggest open innovation model providing students a platform to solve pressing problems of ministries, government departments, and premier industries. Build scalable digital & hardware solutions for clean water, smart agriculture, disaster response, and cyber security.",
        tracks: [
          { name: "Smart Agriculture & Crop Disease Detection", desc: "Drone imagery and spectral analysis for early pest warning and soil nutrient telemetry." },
          { name: "Disaster Management & Emergency SOS Mesh", desc: "Decentralized offline mesh communication for flood and earthquake rescue squads." },
          { name: "Cyber Crime & Deepfake Audio Defender", desc: "Real-time biometric voice authentication against synthetic voice cloning frauds." }
        ],
        stages: [
          { roundNumber: 1, title: "Internal College Screening & SPOC Nomination", type: "INTERNAL_REVIEW", duration: "PPT Review", deadline: "Oct 30, 2026", details: "Top teams shortlisted by College Single Point of Contact (SPOC) for national portal." },
          { roundNumber: 2, title: "National Jury Idea Evaluation", type: "NATIONAL_EVALUATION", duration: "Concept Assessment", deadline: "Nov 15, 2026", details: "Ministry experts evaluate submissions for technical novelty, feasibility, and impact." },
          { roundNumber: 3, title: "36-Hour Grand Finale Non-Stop Hackathon", type: "36_HOUR_HACK", duration: "36 Hours", deadline: "Dec 05, 2026", details: "Continuous coding hackathon at assigned national nodal center with live mentor evaluations." }
        ],
        prizes: [
          { rank: "Winner (per Problem Statement)", prize: "₹1,00,000 Cash", perks: "National Trophy + MHRD Certificate + Gov Grant Incubation up to ₹10 Lakhs" },
          { rank: "All Finalists", prize: "AICTE Certificate", perks: "Free Cloud Credits ($5,000) + National Hackathon Medal" }
        ],
        rules: [
          "Each team must comprise exactly 6 members with at least 1 female member.",
          "College SPOC authorization required."
        ]
      },
      {
        id: "comp-barclays-2026",
        title: "Barclays FinTech Tech-a-Thon 2026",
        slug: "barclays-fintech-techathon-2026",
        organizer: "Barclays",
        organizerLogo: "🦅",
        category: "HIRING_CHALLENGE",
        badge: "JOB DRIVE",
        bannerGradient: "from-cyan-950 via-slate-900 to-sky-950",
        prizePool: "₹2,00,000 + Graduate Analyst Offers (15.5 LPA)",
        prizeAmountNumeric: 200000,
        impressions: "48.2K",
        registeredCount: 6890,
        daysLeft: 3,
        deadline: "2026-10-18",
        startDate: "2026-10-01",
        endDate: "2026-11-10",
        teamSize: "1 - 2 Members",
        eligibility: "Final & Pre-Final Year (CMPN / IT / EXTC)",
        mode: "Online",
        fee: "Free",
        location: "Virtual",
        description: "Barclays invites tech enthusiasts to build hyper-secure, resilient banking infrastructure. Tackle high-throughput transaction processing, AI fraud prevention, and real-time ledger settlement.",
        tracks: [
          { name: "Real-Time AI Fraud Prevention Engine", desc: "Sub-50ms transaction risk evaluation using streaming graph neural networks." },
          { name: "High-Frequency Payments Ledger", desc: "Idempotent, zero-downtime distributed ledger handling 50,000 transactions/sec." }
        ],
        stages: [
          { roundNumber: 1, title: "Barclays Algorithmic Coding Challenge", type: "ONLINE_CODE", duration: "90 Mins", deadline: "Oct 18, 2026", details: "Data structures, multi-threading, concurrency, and SQL optimization." },
          { roundNumber: 2, title: "FinTech Prototype Build & Video Walkthrough", type: "PROTOTYPE", duration: "GitHub + Demo", deadline: "Oct 30, 2026", details: "Implement core financial ledger microservice with unit tests and benchmark report." },
          { roundNumber: 3, title: "Barclays Leadership Interview Loop", type: "INTERVIEW", duration: "Technical + Values", deadline: "Nov 10, 2026", details: "Virtual interview panel with Barclays Senior Directors for Graduate Analyst hires." }
        ],
        prizes: [
          { rank: "Grand Champion", prize: "₹1,25,000 Cash", perks: "Full-Time Graduate Analyst Offers (15.5 LPA) + Direct Placement" },
          { rank: "Runner Up", prize: "₹75,000 Cash", perks: "Summer Analyst Internship Offers + Barclays Swag Box" },
          { rank: "Top 25 Scorers", prize: "PPI Call", perks: "Fast-track Technical Interview Voucher" }
        ],
        rules: [
          "Minimum 7.0 CGPA required for full-time offer conversion.",
          "Original code submissions with MIT or Apache license."
        ]
      },
      {
        id: "comp-google-girl-2026",
        title: "Google Girl Hackathon 2026",
        slug: "google-girl-hackathon-2026",
        organizer: "Google",
        organizerLogo: "🌈",
        category: "HACKATHON",
        badge: "FAANG DIVERSITY",
        bannerGradient: "from-purple-950 via-indigo-950 to-slate-900",
        prizePool: "₹1,50,000 + Google SWE Internships & Goodies",
        prizeAmountNumeric: 150000,
        impressions: "65.3K",
        registeredCount: 8900,
        daysLeft: 10,
        deadline: "2026-11-05",
        startDate: "2026-10-20",
        endDate: "2026-12-01",
        teamSize: "1 - 2 Members",
        eligibility: "Women in Engineering (All Years)",
        mode: "Online",
        fee: "Free",
        location: "Virtual",
        description: "Google Girl Hackathon is designed to provide women students across India an engaging platform to showcase technical competence, learn from Google mentors, and fast-track into Google Software Engineering roles.",
        tracks: [
          { name: "Accessible Computing for All", desc: "Assistive AI tools for visually impaired and neurodiverse learners." },
          { name: "Urban Climate Intelligence", desc: "Satellite data mapping and heat island mitigation analytics." }
        ],
        stages: [
          { roundNumber: 1, title: "Google Online Challenge (GOC)", type: "CODING_ROUND", duration: "60 Mins", deadline: "Nov 05, 2026", details: "Two algorithmic questions focused on graphs and dynamic programming." },
          { roundNumber: 2, title: "Design Document & Technical Architecture", type: "DESIGN_DOC", duration: "Doc Submission", deadline: "Nov 18, 2026", details: "Structured architectural RFC outlining scalability, latency, and database schemas." },
          { roundNumber: 3, title: "Virtual Hackathon & Google Mentorship", type: "VIRTUAL_HACK", duration: "3 Days", deadline: "Dec 01, 2026", details: "Direct 1-on-1 coaching by Google SWE engineers and final prototype demo." }
        ],
        prizes: [
          { rank: "Winner Team", prize: "₹1,00,000 Cash", perks: "Google SWE Summer Internship Interview + Google Pixel Devices" },
          { rank: "Runner Up", prize: "₹50,000 Cash", perks: "Google Mentorship Program + Google Swag Bag" },
          { rank: "All Finalists", prize: "Certificate of Merit", perks: "Exclusive Google Tech Workshop Access" }
        ],
        rules: [
          "Open to all women engineering students in India.",
          "Solo participation or duo teams permitted."
        ]
      },
      {
        id: "comp-tcs-quiz-2026",
        title: "TCS Tech Bytes & Aptitude Speed Quiz 2026",
        slug: "tcs-tech-bytes-speed-quiz-2026",
        organizer: "Tata Consultancy Services",
        organizerLogo: "⚡",
        category: "QUIZ",
        badge: "SPEED SPRINT",
        bannerGradient: "from-rose-950 via-slate-900 to-red-950",
        prizePool: "₹75,000 Cash + TCS Digital Direct Interviews",
        prizeAmountNumeric: 75000,
        impressions: "42.1K",
        registeredCount: 11400,
        daysLeft: 2,
        deadline: "2026-10-15",
        startDate: "2026-10-01",
        endDate: "2026-10-16",
        teamSize: "Individual",
        eligibility: "Open to All College Students",
        mode: "Online",
        fee: "Free",
        location: "Virtual",
        description: "India's premier IT quiz championship designed to test student agility, general tech awareness, emerging software trends, and logical puzzle speed.",
        tracks: [
          { name: "Emerging Tech & Generative AI", desc: "LLMs, quantum computing, cloud architecture, and cybersecurity breakthroughs." },
          { name: "Logic & Data Interpretation", desc: "Rapid speed math, pattern recognition, and algorithm complexity trivia." }
        ],
        stages: [
          { roundNumber: 1, title: "Online Preliminary Speed Quiz", type: "ONLINE_QUIZ", duration: "20 Mins (30 Questions)", deadline: "Oct 15, 2026", details: "Speed-scoring MCQ test with negative marking for wrong answers." },
          { roundNumber: 2, title: "Live Grand Finale Buzzer Round", type: "LIVE_BUZZER", duration: "45 Mins", deadline: "Oct 16, 2026", details: "Top 20 scorers enter live interactive broadcast hosted by TCS Quizmasters." }
        ],
        prizes: [
          { rank: "1st Place (National Champion)", prize: "₹40,000 Cash", perks: "TCS Digital Direct Job Interview + Champion Trophy" },
          { rank: "2nd Place", prize: "₹25,000 Cash", perks: "TCS Digital Direct Job Interview + Trophy" },
          { rank: "3rd Place", prize: "₹10,000 Cash", perks: "TCS Merit Certificate + Tech Goodies" }
        ],
        rules: [
          "Individual participation only.",
          "Strict anti-cheating browser tab switch monitoring."
        ]
      }
    ],
    competitionRegistrations: [
      {
        id: "reg-1",
        competitionId: "comp-flipkart-grid-7",
        studentId: "student-1788620582804",
        teamName: "Algorithmic Titans",
        teamCode: "GRID-TITANS-99",
        role: "TEAM_LEAD",
        members: [
          { name: "Yashraj Kharat", email: "yashraj200@gmail.com", role: "Team Leader (Frontend & ML)" },
          { name: "Aditya Sawant", email: "aditya@college.edu", role: "Backend Developer" },
          { name: "Sneha Patil", email: "sneha@college.edu", role: "UI/UX & PPT" }
        ],
        registeredAt: new Date("2026-10-06"),
        status: "CONFIRMED",
        submission: {
          projectTitle: "Autonomous Edge Sort: Sub-10ms Parcel Sorting with YOLOv9 & WASM",
          repoUrl: "https://github.com/yashraj/flipkart-grid-edge-sort",
          demoUrl: "https://edge-sort-demo.vercel.app",
          deckUrl: "https://drive.google.com/sample-deck.pdf",
          submittedAt: new Date("2026-10-08")
        }
      }
    ],

    // UNSTOP INTERACTIVE QUIZZES
    quizzes: [
      {
        id: "quiz-tcs-nqt",
        title: "TCS NQT Advanced Technical Sprint",
        slug: "tcs-nqt-technical-sprint",
        category: "Placement Technical",
        difficulty: "MEDIUM",
        durationMinutes: 10,
        totalQuestions: 5,
        points: 250,
        unstopCoinsReward: 50,
        description: "Test your core computer science fundamentals, DSA time complexity, memory management, and SQL query prediction based on actual TCS Digital NQT papers.",
        badge: "TCS Certified",
        questions: [
          {
            id: "q1",
            question: "What is the worst-case time complexity of searching an element in a Balanced Binary Search Tree (AVL / Red-Black Tree) containing N nodes?",
            options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
            correctAnswer: 1,
            explanation: "In a balanced BST, tree height is strictly bounded by O(log N). Hence lookup, insertion, and deletion all run in O(log N) worst-case time."
          },
          {
            id: "q2",
            question: "In Python, what is the output of: `print(type(lambda x: x + 1))`?",
            options: ["<class 'lambda'>", "<class 'function'>", "<class 'expression'>", "<class 'builtin_function'>"],
            correctAnswer: 1,
            explanation: "Lambda expressions in Python construct instances of the standard `<class 'function'>` type."
          },
          {
            id: "q3",
            question: "Which database isolation level prevents 'Dirty Reads', 'Non-Repeatable Reads', and 'Phantom Reads' simultaneously?",
            options: ["Read Committed", "Read Uncommitted", "Repeatable Read", "Serializable"],
            correctAnswer: 3,
            explanation: "SERIALIZABLE is the highest ANSI SQL isolation level. It guarantees completely serializable execution, eliminating phantom reads, dirty reads, and non-repeatable reads."
          },
          {
            id: "q4",
            question: "What will `[1, 2, 3] + [4, 5]` produce in JavaScript?",
            options: ["[1, 2, 3, 4, 5]", "'1,2,34,5'", "NaN", "TypeError"],
            correctAnswer: 1,
            explanation: "In JavaScript, the `+` operator coerces both arrays to strings ('1,2,3' and '4,5') and concatenates them to produce the string '1,2,34,5'."
          },
          {
            id: "q5",
            question: "Which data structure is primarily used to implement Breadth-First Search (BFS) graph traversal?",
            options: ["Stack", "Queue (FIFO)", "Priority Queue", "Disjoint Set"],
            correctAnswer: 1,
            explanation: "BFS explores vertices layer by layer in First-In-First-Out order using a standard FIFO Queue."
          }
        ]
      },
      {
        id: "quiz-google-dsa",
        title: "Google DSA & Algorithmic Speed Sprint",
        slug: "google-dsa-speed-sprint",
        category: "DSA & Problem Solving",
        difficulty: "HARD",
        durationMinutes: 10,
        totalQuestions: 5,
        points: 300,
        unstopCoinsReward: 75,
        description: "Solve high-yield algorithmic trivia, recursion stack bounds, bitwise manipulation tricks, and amortized complexity benchmarks.",
        badge: "Google Elite",
        questions: [
          {
            id: "gq1",
            question: "What is the result of evaluating `(n & (n - 1)) == 0` for any positive integer `n > 0`?",
            options: ["Checks if n is odd", "Checks if n is a power of 2", "Checks if n is prime", "Checks if n is divisible by 4"],
            correctAnswer: 1,
            explanation: "Subtracting 1 flips all bits after the lowest set bit. Bitwise ANDing `n & (n - 1)` clears the lowest set bit. If the result is 0, exactly one bit was set, meaning `n` is a power of 2."
          },
          {
            id: "gq2",
            question: "What is the amortized time complexity of inserting N elements into a dynamic array (like C++ `std::vector` or Java `ArrayList`) that doubles capacity upon filling?",
            options: ["O(N^2)", "O(N log N)", "O(1) amortized per insert, O(N) total", "O(N) per insert"],
            correctAnswer: 2,
            explanation: "Although resizing takes O(K) when triggered, geometric doubling distributes the copy cost across past insertions, resulting in O(1) amortized time per insertion."
          },
          {
            id: "gq3",
            question: "In Dijkstra's Shortest Path Algorithm with a Min-Heap (Binary Heap), what is the overall time complexity for a graph with V vertices and E edges?",
            options: ["O(V + E)", "O((V + E) log V)", "O(V^2)", "O(V * E)"],
            correctAnswer: 1,
            explanation: "Using a binary min-heap, extracting min takes O(V log V) and decreasing keys / pushing edges takes O(E log V), yielding O((V + E) log V)."
          },
          {
            id: "gq4",
            question: "Which algorithmic paradigm does the '0/1 Knapsack' problem solve using?",
            options: ["Greedy Algorithm", "Dynamic Programming", "Divide & Conquer", "Randomized Sampling"],
            correctAnswer: 1,
            explanation: "0/1 Knapsack exhibits overlapping subproblems and optimal substructure where items cannot be broken, requiring 2D/1D Dynamic Programming."
          },
          {
            id: "gq5",
            question: "What is the space complexity of a recursive Inorder traversal on a skewed binary tree with N nodes?",
            options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
            correctAnswer: 2,
            explanation: "On a degenerated (skewed) tree, recursion depth reaches N, consuming O(N) call-stack memory."
          }
        ]
      },
      {
        id: "quiz-quant-aptitude",
        title: "Quantitative Aptitude & Speed Math Master",
        slug: "quant-aptitude-speed-math",
        category: "Aptitude & Reasoning",
        difficulty: "EASY",
        durationMinutes: 8,
        totalQuestions: 5,
        points: 200,
        unstopCoinsReward: 40,
        description: "Ace speed math, time & work, probability, percentages, and ratios required in campus placement preliminary screening rounds.",
        badge: "Aptitude Pro",
        questions: [
          {
            id: "aq1",
            question: "A can complete a project in 12 days and B can complete it in 24 days. Working together, how many days will they take to complete the project?",
            options: ["6 days", "8 days", "10 days", "16 days"],
            correctAnswer: 1,
            explanation: "Combined 1-day work = 1/12 + 1/24 = (2 + 1)/24 = 3/24 = 1/8. Hence, together they take 8 days."
          },
          {
            id: "aq2",
            question: "A train 180 meters long is traveling at 72 km/h. How long will it take to cross an electric pole?",
            options: ["7 seconds", "9 seconds", "12 seconds", "15 seconds"],
            correctAnswer: 1,
            explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Time = Distance / Speed = 180 / 20 = 9 seconds."
          },
          {
            id: "aq3",
            question: "What is the probability of rolling a sum of 7 when two fair 6-sided dice are thrown simultaneously?",
            options: ["1/6", "1/12", "5/36", "7/36"],
            correctAnswer: 0,
            explanation: "Pairs yielding 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 outcomes out of 36 total. Probability = 6/36 = 1/6."
          },
          {
            id: "aq4",
            question: "If a product is sold at ₹960 with a 20% profit, what was its original cost price (CP)?",
            options: ["₹768", "₹800", "₹820", "₹840"],
            correctAnswer: 1,
            explanation: "Selling Price = CP * 1.20 => 960 = CP * 1.20 => CP = 960 / 1.20 = ₹800."
          },
          {
            id: "aq5",
            question: "Find the missing number in the sequence: 2, 6, 12, 20, 30, ?",
            options: ["40", "42", "44", "48"],
            correctAnswer: 1,
            explanation: "Differences are +4, +6, +8, +10. Next difference is +12 => 30 + 12 = 42 (or n^2 + n formula: 1*2, 2*3, 3*4, 4*5, 5*6, 6*7 = 42)."
          }
        ]
      }
    ],
    quizAttempts: [],

    // UNSTOP 1-ON-1 MENTORSHIP ROSTER
    mentors: [
      {
        id: "mentor-aarav",
        name: "Aarav Mehta",
        title: "Senior Software Engineer",
        company: "Google",
        companyLogo: "🟢",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
        rating: 4.95,
        reviewsCount: 148,
        totalSessions: 320,
        experienceYears: 6,
        alumniStatus: "Alumni '20",
        badge: "Top 1% Mentor",
        bio: "Senior SWE at Google Core Infrastructure (ex-Microsoft). Mentored 300+ students with 85% placement rate at FAANG/Tier-1 product firms.",
        services: [
          { id: "s1", name: "1:1 FAANG Mock Coding Interview", duration: "45 Mins", price: "Free for VIT", desc: "Live coding on Google Meet with real Google interview rubric and immediate scoring feedback." },
          { id: "s2", name: "Resume Roast & ATS Optimization", duration: "30 Mins", price: "Free for VIT", desc: "Line-by-line audit of your projects, metrics, impact bullets, and ATS parser readiness." },
          { id: "s3", name: "FAANG Career Transition Roadmap", duration: "30 Mins", price: "Free for VIT", desc: "Custom 90-day roadmap covering DSA patterns, system design, and recruiter outreach." }
        ],
        skills: ["DSA", "Distributed Systems", "Google Interview Prep", "Go", "C++", "System Architecture"],
        availableSlots: [
          { id: "slot-1", date: "Today", time: "05:00 PM - 05:45 PM" },
          { id: "slot-2", date: "Today", time: "07:00 PM - 07:45 PM" },
          { id: "slot-3", date: "Tomorrow", time: "04:30 PM - 05:15 PM" },
          { id: "slot-4", date: "Tomorrow", time: "06:30 PM - 07:15 PM" }
        ]
      },
      {
        id: "mentor-sneha",
        name: "Sneha Iyer",
        title: "Senior Product Manager",
        company: "Microsoft",
        companyLogo: "🔷",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces",
        rating: 4.92,
        reviewsCount: 94,
        totalSessions: 180,
        experienceYears: 5,
        alumniStatus: "Alumni '21",
        badge: "PM Leader",
        bio: "Product Lead at Microsoft Teams. Ex-Flipkart APM. Expert in Product Sense, Case Studies, GTM strategy, and transitioning from engineering to product roles.",
        services: [
          { id: "pm1", name: "Product Sense & GTM Mock Interview", duration: "45 Mins", price: "Free for VIT", desc: "Cracking root cause analysis, product teardowns, and user journey optimization." },
          { id: "pm2", name: "Case Study & Deck Review", duration: "30 Mins", price: "Free for VIT", desc: "Reviewing competition submissions for Tata Imagination Challenge, Flipkart GRiD, and HUL LIME." }
        ],
        skills: ["Product Management", "Case Interviews", "GTM Strategy", "Figma", "User Analytics", "A/B Testing"],
        availableSlots: [
          { id: "slot-5", date: "Tomorrow", time: "05:30 PM - 06:15 PM" },
          { id: "slot-6", date: "Friday", time: "06:00 PM - 06:45 PM" }
        ]
      },
      {
        id: "mentor-vikram",
        name: "Vikramaditya Rao",
        title: "Staff SDE & Tech Lead",
        company: "Amazon AWS",
        companyLogo: "📦",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
        rating: 4.88,
        reviewsCount: 162,
        totalSessions: 290,
        experienceYears: 8,
        alumniStatus: "Alumni '18",
        badge: "Cloud Architect",
        bio: "Staff Engineer at Amazon Cloud Infrastructure. Specializes in High-Scale Backend Systems, Kubernetes, Kafka, and Salary Negotiation for Senior/Junior engineers.",
        services: [
          { id: "aws1", name: "High-Scale System Design Interview", duration: "50 Mins", price: "Free for VIT", desc: "Designing URL shorteners, Uber ride matching, and Netflix video streaming architectures." },
          { id: "aws2", name: "Multiple Offer Negotiation Coaching", duration: "30 Mins", price: "Free for VIT", desc: "Maximizing base pay, sign-on bonuses, and ESOP vesting schedules across competing offers." }
        ],
        skills: ["System Design", "AWS", "Kafka", "Java", "High Concurrency", "Offer Negotiation"],
        availableSlots: [
          { id: "slot-7", date: "Today", time: "08:00 PM - 08:45 PM" },
          { id: "slot-8", date: "Saturday", time: "11:00 AM - 11:45 AM" }
        ]
      },
      {
        id: "mentor-rhea",
        name: "Rhea Deshmukh",
        title: "Management Consultant",
        company: "McKinsey & Company",
        companyLogo: "📈",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
        rating: 5.0,
        reviewsCount: 78,
        totalSessions: 135,
        experienceYears: 4,
        alumniStatus: "Alumni '22",
        badge: "Top Consultant",
        bio: "Consultant at McKinsey Mumbai Office. Specializes in Guesstimates, Profitability & Market Entry frameworks, and Corporate Presentation Mastery.",
        services: [
          { id: "mck1", name: "Management Consulting Case Prep", duration: "45 Mins", price: "Free for VIT", desc: "Live case interview with profitability tree, market sizing, and structured hypothesis testing." },
          { id: "mck2", name: "Executive Presence & HR Interview Mastery", duration: "30 Mins", price: "Free for VIT", desc: "Storytelling with the STAR framework, leadership principles, and behavioral mastery." }
        ],
        skills: ["Management Consulting", "Guesstimates", "Market Entry", "Executive Presence", "Case Frameworks"],
        availableSlots: [
          { id: "slot-9", date: "Tomorrow", time: "07:30 PM - 08:15 PM" },
          { id: "slot-10", date: "Sunday", time: "04:00 PM - 04:45 PM" }
        ]
      }
    ],
    mentorshipBookings: [
      {
        id: "bk-1",
        mentorId: "mentor-aarav",
        studentId: "student-1788620582804",
        studentName: "Yashraj Nana kharat",
        studentEmail: "yashraj200@gmail.com",
        serviceName: "1:1 FAANG Mock Coding Interview",
        date: "2026-10-12",
        timeSlot: "05:00 PM - 05:45 PM",
        meetLink: "https://meet.google.com/vit-aarav-mentor",
        status: "CONFIRMED",
        notes: "Targeting Google SDE-1 placement drive. Need evaluation on Graph algorithms and Sliding Window."
      }
    ],

    // UNSTOP TEAMMATE MATCHMAKER
    teammateRequests: [
      {
        id: "team-req-1",
        studentId: "student-1788620582804",
        authorName: "Yashraj Kharat",
        authorDepartment: "CMPN (Batch '26)",
        competitionId: "comp-flipkart-grid-7",
        competitionTitle: "Flipkart GRiD 7.0 - Robotics Hackathon",
        rolesNeeded: ["Machine Learning / YOLO Specialist", "UI/UX Designer"],
        skillsRequired: ["PyTorch", "Computer Vision", "Figma", "REST APIs"],
        projectIdea: "Building an Autonomous Edge Parcel Sorter that processes conveyor belt video feeds in sub-10ms using edge TensorRT models.",
        spotsAvailable: 2,
        contactEmail: "yashraj200@gmail.com",
        createdAt: new Date("2026-10-08")
      },
      {
        id: "team-req-2",
        studentId: "std-ananya",
        authorName: "Ananya Sharma",
        authorDepartment: "IT (Batch '26)",
        competitionId: "comp-sih-2026",
        competitionTitle: "Smart India Hackathon 2026 (SIH)",
        rolesNeeded: ["Hardware / IoT Embedded Engineer", "Full-Stack Dev"],
        skillsRequired: ["ESP32 / Arduino", "MQTT", "React.js", "Node.js"],
        projectIdea: "Smart Crop Disease Telemetry with LoRaWAN wireless sensor mesh for rural agricultural fields without internet coverage.",
        spotsAvailable: 3,
        contactEmail: "ananya.sharma@college.edu",
        createdAt: new Date("2026-10-09")
      },
      {
        id: "team-req-3",
        studentId: "std-devendra",
        authorName: "Devendra Patel",
        authorDepartment: "EXTC (Batch '26)",
        competitionId: "comp-tata-2026",
        competitionTitle: "Tata Imagination Challenge 2026",
        rolesNeeded: ["Financial Modeler / Pitch Presenter"],
        skillsRequired: ["Financial TAM Modeling", "PowerPoint Storytelling", "Market Research"],
        projectIdea: "Decarbonizing Indian Tier-2 Trucking via Battery Swapping Franchise Network with 3-year payback financial model.",
        spotsAvailable: 1,
        contactEmail: "devendra.p@college.edu",
        createdAt: new Date("2026-10-10")
      }
    ],

    // UNSTOP LEADERBOARD & REWARDS
    leaderboardUsers: [
      {
        rank: 1,
        name: "Aryan Sharma",
        department: "CMPN",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        points: 4850,
        unstopCoins: 1240,
        streakDays: 18,
        hackathonsWon: 6,
        quizzesCompleted: 24,
        badges: ["Grandmaster", "SIH Winner", "Top Coder", "Flipkart Finalist"],
        isCurrentUser: false
      },
      {
        rank: 2,
        name: "Pooja Nair",
        department: "IT",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        points: 4620,
        unstopCoins: 1100,
        streakDays: 14,
        hackathonsWon: 5,
        quizzesCompleted: 20,
        badges: ["Flipkart GRiD Finalist", "10x Quiz Whiz", "Code Ninja"],
        isCurrentUser: false
      },
      {
        rank: 3,
        name: "Rohan Verma",
        department: "CMPN",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
        points: 4310,
        unstopCoins: 980,
        streakDays: 12,
        hackathonsWon: 4,
        quizzesCompleted: 19,
        badges: ["Barclays Finalist", "Aptitude Champion", "Full-Stack Pro"],
        isCurrentUser: false
      },
      {
        rank: 4,
        name: "Yashraj Nana kharat",
        department: "CMPN",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        points: 3950,
        unstopCoins: 850,
        streakDays: 8,
        hackathonsWon: 3,
        quizzesCompleted: 16,
        badges: ["Code Arena Master", "AI Voice Pro", "Tata Semifinalist", "Resume Ready"],
        isCurrentUser: true
      },
      {
        rank: 5,
        name: "Kavita Patil",
        department: "EXTC",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
        points: 3720,
        unstopCoins: 720,
        streakDays: 9,
        hackathonsWon: 3,
        quizzesCompleted: 14,
        badges: ["Google Diversity Star", "Quiz Whiz"],
        isCurrentUser: false
      }
    ],

    rewardsStore: [
      {
        id: "rew-1",
        title: "1:1 FAANG Mock Interview with Google SDE",
        category: "Mentorship",
        coinsCost: 500,
        icon: "🎯",
        description: "Redeem 500 Campus Coins for a complimentary 45-minute live technical interview with a verified Google SWE.",
        tag: "MOST POPULAR"
      },
      {
        id: "rew-2",
        title: "Campus Verified Gold Badge & Placement Priority",
        category: "Profile Boost",
        coinsCost: 350,
        icon: "👑",
        description: "Stand out to top recruiters with the Campus Verified Gold badge displayed on all job & drive applications.",
        tag: "TOP RATED"
      },
      {
        id: "rew-3",
        title: "AI ATS Resume Deep Audit & Roast",
        category: "Career Prep",
        coinsCost: 250,
        icon: "📄",
        description: "Comprehensive 12-page PDF audit report with line-by-line keyword and formatting suggestions.",
        tag: "INSTANT"
      },
      {
        id: "rew-4",
        title: "Official VIT Tech Swag Pack (Hoodie + Mug + Stickers)",
        category: "Merchandise",
        coinsCost: 1000,
        icon: "🎁",
        description: "Official branded merchandise kit delivered directly to your doorstep or college department.",
        tag: "LIMITED EDITION"
      }
    ]
  };
}

function loadPersistedMockDb() {
  const initial = getInitialMockData();
  try {
    if (fs.existsSync(MOCK_STORAGE_FILE)) {
      const raw = fs.readFileSync(MOCK_STORAGE_FILE, "utf-8");
      const data = JSON.parse(raw);
      let needsSave = false;
      for (const key of Object.keys(initial)) {
        if (!Array.isArray(data[key]) || (data[key].length === 0 && initial[key].length > 0)) {
          data[key] = initial[key];
          needsSave = true;
        }
      }
      if (Array.isArray(data.users)) {
        for (const seedUser of initial.users) {
          if (!data.users.find(u => u.email.toLowerCase() === seedUser.email.toLowerCase())) {
            data.users.push(seedUser);
            needsSave = true;
          }
        }
      }
      if (needsSave) {
        fs.writeFileSync(MOCK_STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
      }
      return data;
    }
  } catch (err) {
    console.warn("Could not read .mockdb.json, using defaults:", err?.message);
  }
  return initial;
}

export function saveMockDbToFile() {
  try {
    if (globalForMock.mockDb) {
      fs.writeFileSync(MOCK_STORAGE_FILE, JSON.stringify(globalForMock.mockDb, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Failed to write .mockdb.json:", err?.message);
  }
}

const globalForMock = global;
if (!globalForMock.mockDb) {
  globalForMock.mockDb = loadPersistedMockDb();
}
const mockDb = globalForMock.mockDb;

// Check MongoDB connection
let mongoSeeded = false;

async function checkMongoConnection() {
  try {
    const mongo = await getMongoDb();
    if (mongo) {
      if (!mongoSeeded) {
        mongoSeeded = true;
        seedMongoDbIfEmpty(mongo, getInitialMockData()).catch(() => {});
      }
      return mongo;
    }
  } catch (err) {
    // MongoDB not available
  }
  return null;
}

// Check PostgreSQL Prisma connection
async function checkConnection() {
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("postgresql://")) {
    return false;
  }
  return await isPrismaHealthy();
}

// Plain object serializer to guarantee 100% Next.js 16 RSC / Turbopack compatibility
export function toPlain(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;
  try {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (value !== null && typeof value === "object") {
        if (value._bsontype === "ObjectID" || (value.constructor && value.constructor.name === "ObjectId")) {
          return value.toString();
        }
        if (key === "_id" && value) {
          return value.toString ? value.toString() : String(value);
        }
      }
      return value;
    }));
  } catch (err) {
    return obj;
  }
}

// Helper to enrich submission
async function enrichSubmission(s, mongo) {
  if (!s) return null;
  if (mongo) {
    const student = await mongo.collection("students").findOne({ id: s.studentId });
    const req = await mongo.collection("internship_requirements").findOne({ id: s.requirementId });
    const docs = await mongo.collection("internship_documents").find({ submissionId: s.id }).toArray();
    const cert = await mongo.collection("certificate_verifications").findOne({ submissionId: s.id });
    const rep = await mongo.collection("report_analyses").findOne({ submissionId: s.id });
    const comp = await mongo.collection("company_mentor_evaluations").findOne({ submissionId: s.id });
    const fac = await mongo.collection("faculty_evaluations").findOne({ submissionId: s.id });
    const logs = await mongo.collection("internship_audit_logs").find({ submissionId: s.id }).sort({ createdAt: -1 }).toArray();

    return toPlain({
      ...s,
      student,
      requirement: req,
      documents: docs,
      certificateVerify: cert,
      reportAnalysis: rep,
      companyEvaluation: comp,
      facultyEvaluation: fac,
      auditLogs: logs
    });
  }

  // Mock enrichment
  return toPlain({
    ...s,
    student: mockDb.students.find(st => st.id === s.studentId),
    requirement: mockDb.internshipRequirements.find(r => r.id === s.requirementId),
    documents: mockDb.internshipDocuments.filter(d => d.submissionId === s.id),
    certificateVerify: mockDb.certificateVerifications.find(c => c.submissionId === s.id),
    reportAnalysis: mockDb.reportAnalyses.find(r => r.submissionId === s.id),
    companyEvaluation: mockDb.companyMentorEvaluations.find(ce => ce.submissionId === s.id),
    facultyEvaluation: mockDb.facultyEvaluations.find(fe => fe.submissionId === s.id),
    auditLogs: mockDb.internshipAuditLogs.filter(al => al.submissionId === s.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
}

// Data access operations
export const db = {
  // Authentication & Users
  users: {
    async findByEmail(email) {
      if (!email) return null;
      const mongo = await checkMongoConnection();
      if (mongo) {
        const user = await mongo.collection("users").findOne({ email: new RegExp("^" + email.trim() + "$", "i") });
        if (!user) return null;
        const result = { ...user };
        if (user.role === "STUDENT") {
          let st = await mongo.collection("students").findOne({ userId: user.id });
          if (!st) {
            st = {
              id: `student-profile-${user.id}`,
              userId: user.id,
              name: user.name || "Student",
              email: user.email,
              cgpa: 0,
              department: "CMPN",
              batch: "2026",
              education: [],
              experience: [],
              projects: [],
              skills: [],
              achievements: [],
              certificates: [],
              placementReadinessScore: 0,
              atsScore: 0,
              skillGapScore: 0,
              createdAt: new Date()
            };
            await mongo.collection("students").insertOne(st);
          }
          result.student = { ...st, email: user.email, name: st.name || user.name };
        }
        if (user.role === "RECRUITER") {
          let rec = await mongo.collection("recruiters").findOne({ userId: user.id });
          if (!rec) {
            rec = {
              id: `recruiter-profile-${user.id}`,
              userId: user.id,
              name: user.name || "Recruiter",
              email: user.email,
              designation: "Recruiter",
              companyId: "company-stripe",
              isVerified: true,
              createdAt: new Date()
            };
            await mongo.collection("recruiters").insertOne(rec);
          }
          result.recruiter = { ...rec, email: user.email, name: rec.name || user.name };
        }
        if (user.role === "FACULTY_MENTOR") result.faculty = { id: user.id, userId: user.id, name: user.name || "Faculty Mentor", email: user.email };
        if (user.role === "INTERNSHIP_COORDINATOR") result.coordinator = { id: user.id, userId: user.id, name: user.name || "Internship Coordinator", email: user.email };
        if (user.role === "TPO") result.tpo = { id: "tpo-profile-1", userId: user.id, name: user.name || "Placement Officer TPO", email: user.email };
        if (user.role === "ADMIN") result.admin = { id: "admin-profile-1", userId: user.id, name: user.name || "Super Admin", email: user.email };
        return toPlain(result);
      }

      const isConnected = await checkConnection();
      if (isConnected) {
        const u = await prisma.user.findUnique({
          where: { email },
          include: { student: true, recruiter: true, tpo: true, admin: true }
        });
        return toPlain(u);
      }

      const user = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) return null;
      const result = { ...user };
      if (user.role === "STUDENT") result.student = mockDb.students.find(s => s.userId === user.id) || { id: `student-profile-${user.id}`, userId: user.id, name: user.name || "Student", email: user.email };
      if (user.role === "RECRUITER") result.recruiter = mockDb.recruiters.find(r => r.userId === user.id) || { id: `recruiter-profile-${user.id}`, userId: user.id, name: user.name || "Recruiter", companyId: "company-stripe", email: user.email };
      if (user.role === "FACULTY_MENTOR") result.faculty = { id: user.id, userId: user.id, name: user.name || "Faculty Mentor", email: user.email };
      if (user.role === "INTERNSHIP_COORDINATOR") result.coordinator = { id: user.id, userId: user.id, name: user.name || "Internship Coordinator", email: user.email };
      if (user.role === "TPO") result.tpo = { id: "tpo-profile-1", userId: user.id, name: user.name || "Placement Officer TPO", email: user.email };
      if (user.role === "ADMIN") result.admin = { id: "admin-profile-1", userId: user.id, name: user.name || "Super Admin", email: user.email };
      return toPlain(result);
    },
    async list() {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const users = await mongo.collection("users").find().sort({ createdAt: -1 }).toArray();
        const students = await mongo.collection("students").find().toArray();
        const recruiters = await mongo.collection("recruiters").find().toArray();
        const companies = await mongo.collection("companies").find().toArray();

        const mapped = users.map(u => {
          let student = students.find(s => s.userId === u.id);
          let recruiter = recruiters.find(r => r.userId === u.id);
          let company = recruiter ? companies.find(c => c.id === recruiter.companyId) : null;
          return {
            ...u,
            name: u.name || student?.name || recruiter?.name || "User",
            student,
            recruiter: recruiter ? { ...recruiter, company } : null
          };
        });
        return toPlain(mapped);
      }

      const isConnected = await checkConnection();
      if (isConnected) {
        const list = await prisma.user.findMany({
          include: { student: true, recruiter: { include: { company: true } } },
          orderBy: { createdAt: "desc" }
        });
        return toPlain(list);
      }

      return toPlain(mockDb.users.map(u => ({
        ...u,
        student: mockDb.students.find(s => s.userId === u.id),
        recruiter: mockDb.recruiters.find(r => r.userId === u.id)
      })));
    },
    async getById(id) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const u = await mongo.collection("users").findOne({ id });
        return toPlain(u);
      }
      return toPlain(mockDb.users.find(u => u.id === id) || null);
    },
    async create({ email, passwordHash, role, name, companyId }) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const id = `${role.toLowerCase()}-${Date.now()}`;
        const newUser = { id, email, passwordHash, role, name, createdAt: new Date() };
        await mongo.collection("users").insertOne(newUser);

        if (role === "STUDENT") {
          await mongo.collection("students").insertOne({
            id: `student-profile-${Date.now()}`,
            userId: id,
            name: name || "Student",
            email,
            department: "CMPN",
            batch: "2026",
            cgpa: null,
            education: [],
            experience: [],
            projects: [],
            skills: [],
            achievements: [],
            certificates: [],
            placementReadinessScore: 0,
            atsScore: 0,
            skillGapScore: 0,
            createdAt: new Date()
          });
        } else if (role === "RECRUITER") {
          await mongo.collection("recruiters").insertOne({
            id: `recruiter-profile-${Date.now()}`,
            userId: id,
            name: name || "Recruiter",
            email,
            designation: "Recruiting Coordinator",
            companyId: companyId || "company-stripe",
            isVerified: true,
            createdAt: new Date()
          });
        }
        return toPlain(newUser);
      }

      const isConnected = await checkConnection();
      if (isConnected) {
        const u = await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: { email, passwordHash, role }
          });
          if (role === "STUDENT") {
            await tx.student.create({ data: { userId: user.id, name } });
          } else if (role === "RECRUITER") {
            await tx.recruiter.create({ data: { userId: user.id, name, companyId: companyId || "default" } });
          } else if (role === "TPO") {
            await tx.tpo.create({ data: { userId: user.id, name } });
          } else if (role === "ADMIN") {
            await tx.admin.create({ data: { userId: user.id, name } });
          }
          return user;
        });
        return toPlain(u);
      }

      // Mock create
      const mockId = `${role.toLowerCase()}-${Date.now()}`;
      const mockNewUser = { id: mockId, email, passwordHash, role, name, createdAt: new Date() };
      mockDb.users.push(mockNewUser);

      if (role === "STUDENT") {
        mockDb.students.push({
          id: `student-profile-${Date.now()}`,
          userId: mockId,
          name: name || "Student",
          email,
          department: "CMPN",
          batch: "2026",
          cgpa: null,
          education: [],
          experience: [],
          projects: [],
          skills: [],
          achievements: [],
          certificates: [],
          placementReadinessScore: 0,
          atsScore: 0,
          skillGapScore: 0
        });
      } else if (role === "RECRUITER") {
        mockDb.recruiters.push({
          id: `recruiter-profile-${Date.now()}`,
          userId: id,
          name: name || "Recruiter",
          email,
          designation: "Recruiting Coordinator",
          companyId: companyId || mockDb.companies?.[0]?.id || "company-stripe",
          isVerified: true
        });
      }

      saveMockDbToFile();
      return toPlain(newUser);
    }
  },

  // Students Profile
  students: {
    async getByUserId(userId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        let student = await mongo.collection("students").findOne({ userId });
        const user = await mongo.collection("users").findOne({ id: userId });
        if (!student && user && user.role === "STUDENT") {
          student = {
            id: `student-profile-${user.id}`,
            userId: user.id,
            name: user.name || "Student",
            email: user.email,
            department: "CMPN",
            batch: "2026",
            cgpa: null,
            education: [],
            experience: [],
            projects: [],
            skills: [],
            achievements: [],
            certificates: [],
            placementReadinessScore: 0,
            atsScore: 0,
            skillGapScore: 0,
            createdAt: new Date()
          };
          await mongo.collection("students").insertOne(student);
        }
        if (student && user) {
          student.email = user.email;
          if (!student.name && user.name) student.name = user.name;
        }
        return toPlain(student);
      }

      const isConnected = await checkConnection();
      if (isConnected) {
        const s = await prisma.student.findUnique({ where: { userId } });
        return toPlain(s);
      }

      let student = mockDb.students.find(s => s.userId === userId);
      const user = mockDb.users.find(u => u.id === userId);
      if (!student && user && user.role === "STUDENT") {
        student = {
          id: `student-profile-${user.id}`,
          userId: user.id,
          name: user.name || "Student",
          email: user.email,
          department: "CMPN",
          batch: "2026",
          cgpa: null,
          education: [],
          experience: [],
          projects: [],
          skills: [],
          achievements: [],
          certificates: [],
          placementReadinessScore: 0,
          atsScore: 0,
          skillGapScore: 0
        };
        mockDb.students.push(student);
        saveMockDbToFile();
      }
      if (student && user) {
        student.email = user.email;
      }
      return toPlain(student || null);
    },
    async getById(id) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        let student = await mongo.collection("students").findOne({ id });
        if (!student) student = await mongo.collection("students").findOne({ userId: id });
        if (student) {
          const user = await mongo.collection("users").findOne({ id: student.userId });
          if (user) student.email = user.email;
        }
        return toPlain(student);
      }
      return toPlain(mockDb.students.find(s => s.id === id || s.userId === id) || null);
    },
    async list() {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const studentDocs = await mongo.collection("students").find().toArray();
        const userDocs = await mongo.collection("users").find({ role: "STUDENT" }).toArray();

        // Ensure all registered STUDENT users have a student record
        for (const u of userDocs) {
          if (!studentDocs.find(s => s.userId === u.id)) {
            const newSt = {
              id: `student-profile-${u.id}`,
              userId: u.id,
              name: u.name || "Student",
              email: u.email,
              department: "CMPN",
              batch: "2026",
              cgpa: null,
              education: [],
              experience: [],
              projects: [],
              skills: [],
              achievements: [],
              certificates: [],
              placementReadinessScore: 0,
              atsScore: 0,
              skillGapScore: 0,
              createdAt: new Date()
            };
            await mongo.collection("students").insertOne(newSt);
            studentDocs.push(newSt);
          }
        }

        const mapped = studentDocs.map(st => {
          const u = userDocs.find(usr => usr.id === st.userId);
          return {
            ...st,
            email: u?.email || st.email || "",
            name: st.name || u?.name || "Student"
          };
        });
        return toPlain(mapped);
      }

      const isConnected = await checkConnection();
      if (isConnected) {
        const list = await prisma.student.findMany();
        return toPlain(list);
      }

      return toPlain(mockDb.students.map(st => {
        const u = mockDb.users.find(usr => usr.id === st.userId);
        return { ...st, email: u?.email || "" };
      }));
    },
    async update(userId, data) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("students").updateOne({ userId }, { $set: data }, { upsert: true });
        if (data.name) {
          await mongo.collection("users").updateOne({ id: userId }, { $set: { name: data.name } });
        }
        const updated = await mongo.collection("students").findOne({ userId });
        return toPlain(updated);
      }

      const isConnected = await checkConnection();
      if (isConnected) {
        const updated = await prisma.student.update({ where: { userId }, data });
        return toPlain(updated);
      }

      const studentIndex = mockDb.students.findIndex(s => s.userId === userId);
      if (studentIndex > -1) {
        mockDb.students[studentIndex] = { ...mockDb.students[studentIndex], ...data };
        if (data.name) {
          const u = mockDb.users.find(usr => usr.id === userId);
          if (u) u.name = data.name;
        }
        saveMockDbToFile();
        return toPlain(mockDb.students[studentIndex]);
      }
      return null;
    }
  },

  // Companies
  companies: {
    async list() {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("companies").find().sort({ name: 1 }).toArray();
        return toPlain(list);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const list = await prisma.company.findMany({ orderBy: { name: "asc" } });
        return toPlain(list);
      }
      return toPlain(mockDb.companies);
    },
    async getById(id) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const c = await mongo.collection("companies").findOne({ id });
        return toPlain(c);
      }
      return toPlain(mockDb.companies.find(c => c.id === id) || null);
    },
    async create(data) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const newCompany = { id: `company-${Date.now()}`, isVerified: true, ...data };
        await mongo.collection("companies").insertOne(newCompany);
        return toPlain(newCompany);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const created = await prisma.company.create({ data });
        return toPlain(created);
      }
      const newCompany = { id: `company-${Date.now()}`, isVerified: true, ...data };
      mockDb.companies.push(newCompany);
      saveMockDbToFile();
      return toPlain(newCompany);
    },
    async update(companyId, data) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("companies").updateOne({ id: companyId }, { $set: data });
        const updated = await mongo.collection("companies").findOne({ id: companyId });
        return toPlain(updated);
      }
      const idx = mockDb.companies.findIndex(c => c.id === companyId);
      if (idx !== -1) {
        mockDb.companies[idx] = { ...mockDb.companies[idx], ...data };
        saveMockDbToFile();
        return toPlain(mockDb.companies[idx]);
      }
      return null;
    },
    async verify(companyId, status) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("companies").updateOne({ id: companyId }, { $set: { isVerified: status } });
        await mongo.collection("recruiters").updateMany({ companyId }, { $set: { isVerified: status } });
        const updated = await mongo.collection("companies").findOne({ id: companyId });
        return toPlain(updated);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const updatedCompany = await prisma.company.update({
          where: { id: companyId },
          data: { isVerified: status }
        });
        await prisma.recruiter.updateMany({ where: { companyId }, data: { isVerified: status } }).catch(() => {});
        return toPlain(updatedCompany);
      }
      const company = mockDb.companies.find(c => c.id === companyId);
      if (company) {
        company.isVerified = status;
        mockDb.recruiters.forEach(r => {
          if (r.companyId === companyId) r.isVerified = status;
        });
        saveMockDbToFile();
      }
      return toPlain(company);
    }
  },

  // Recruiters
  recruiters: {
    async getByUserId(userId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        let rec = await mongo.collection("recruiters").findOne({ userId });
        const user = await mongo.collection("users").findOne({ id: userId });
        if (!rec && user && user.role === "RECRUITER") {
          rec = {
            id: `recruiter-profile-${user.id}`,
            userId: user.id,
            name: user.name || "Recruiter",
            email: user.email,
            designation: "Recruiting Coordinator",
            companyId: "company-stripe",
            isVerified: true,
            createdAt: new Date()
          };
          await mongo.collection("recruiters").insertOne(rec);
        }
        if (rec) {
          const comp = await mongo.collection("companies").findOne({ id: rec.companyId });
          return toPlain({ ...rec, email: user?.email || rec.email, company: comp });
        }
        return null;
      }
      const rec = mockDb.recruiters.find(r => r.userId === userId);
      if (rec) {
        return toPlain({ ...rec, company: mockDb.companies.find(c => c.id === rec.companyId) });
      }
      return null;
    },
    async verify(recruiterId, status) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("recruiters").updateOne({ id: recruiterId }, { $set: { isVerified: status } });
        const rec = await mongo.collection("recruiters").findOne({ id: recruiterId });
        if (rec?.companyId) {
          await mongo.collection("companies").updateOne({ id: rec.companyId }, { $set: { isVerified: status } });
        }
        return toPlain(rec);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const updated = await prisma.recruiter.update({ where: { id: recruiterId }, data: { isVerified: status } });
        if (updated?.companyId) {
          await prisma.company.update({ where: { id: updated.companyId }, data: { isVerified: status } }).catch(() => {});
        }
        return toPlain(updated);
      }
      const recruiter = mockDb.recruiters.find(r => r.id === recruiterId);
      if (recruiter) {
        recruiter.isVerified = status;
        if (recruiter.companyId) {
          const comp = mockDb.companies.find(c => c.id === recruiter.companyId);
          if (comp) comp.isVerified = status;
        }
      }
      return toPlain(recruiter);
    },
    async list() {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("recruiters").find().toArray();
        const companies = await mongo.collection("companies").find().toArray();
        const users = await mongo.collection("users").find({ role: "RECRUITER" }).toArray();

        // Auto-create for any missing RECRUITER users
        for (const u of users) {
          if (!list.find(r => r.userId === u.id)) {
            const newRec = {
              id: `recruiter-profile-${u.id}`,
              userId: u.id,
              name: u.name || "Recruiter",
              email: u.email,
              designation: "Recruiting Coordinator",
              companyId: companies[0]?.id || "company-stripe",
              isVerified: true,
              createdAt: new Date()
            };
            await mongo.collection("recruiters").insertOne(newRec);
            list.push(newRec);
          }
        }

        const mapped = list.map(r => {
          const u = users.find(usr => usr.id === r.userId);
          return {
            ...r,
            email: u?.email || r.email || "",
            company: companies.find(c => c.id === r.companyId)
          };
        });
        return toPlain(mapped);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const list = await prisma.recruiter.findMany({ include: { company: true } });
        return toPlain(list);
      }
      return toPlain(mockDb.recruiters.map(r => ({
        ...r,
        company: mockDb.companies.find(c => c.id === r.companyId)
      })));
    }
  },

  // Jobs Portal
  jobs: {
    async list() {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("jobs").find().sort({ createdAt: -1 }).toArray();
        const comps = await mongo.collection("companies").find().toArray();
        const mapped = list.map(j => ({ ...j, company: comps.find(c => c.id === j.companyId) }));
        return toPlain(mapped);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const list = await prisma.job.findMany({ include: { company: true }, orderBy: { createdAt: "desc" } });
        return toPlain(list);
      }
      return toPlain(mockDb.jobs.map(j => ({
        ...j,
        company: mockDb.companies.find(c => c.id === j.companyId)
      })));
    },
    async getById(id) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const job = await mongo.collection("jobs").findOne({ id });
        if (!job) return null;
        const company = await mongo.collection("companies").findOne({ id: job.companyId });
        return toPlain({ ...job, company });
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const job = await prisma.job.findUnique({ where: { id }, include: { company: true } });
        return toPlain(job);
      }
      const job = mockDb.jobs.find(j => j.id === id);
      if (!job) return null;
      return toPlain({ ...job, company: mockDb.companies.find(c => c.id === job.companyId) });
    },
    async create(data) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const newJob = { id: `job-${Date.now()}`, status: "OPEN", createdAt: new Date(), ...data };
        await mongo.collection("jobs").insertOne(newJob);
        return toPlain(newJob);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const created = await prisma.job.create({ data });
        return toPlain(created);
      }
      const newJob = { id: `job-${Date.now()}`, status: "OPEN", createdAt: new Date(), ...data };
      mockDb.jobs.push(newJob);
      saveMockDbToFile();
      return toPlain(newJob);
    },
    async delete(id) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("jobs").deleteOne({ id });
        return toPlain({ id });
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const deleted = await prisma.job.delete({ where: { id } });
        return toPlain(deleted);
      }
      mockDb.jobs = mockDb.jobs.filter(j => j.id !== id);
      saveMockDbToFile();
      return toPlain({ id });
    },
    async update(id, data) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("jobs").updateOne({ id }, { $set: { ...data, updatedAt: new Date() } });
        const updated = await mongo.collection("jobs").findOne({ id });
        return toPlain(updated);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const updated = await prisma.job.update({ where: { id }, data });
        return toPlain(updated);
      }
      const idx = mockDb.jobs.findIndex(j => j.id === id);
      if (idx !== -1) {
        mockDb.jobs[idx] = { ...mockDb.jobs[idx], ...data, updatedAt: new Date() };
        saveMockDbToFile();
        return toPlain(mockDb.jobs[idx]);
      }
      return null;
    }
  },

  // Applications
  applications: {
    async create({ jobId, studentId, resumeUrl }) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const newApp = { id: `app-${Date.now()}`, jobId, studentId, resumeUrl, status: "APPLIED", appliedAt: new Date(), updatedAt: new Date() };
        await mongo.collection("applications").insertOne(newApp);
        return toPlain(newApp);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const created = await prisma.application.create({ data: { jobId, studentId, resumeUrl, status: "APPLIED" } });
        return toPlain(created);
      }
      const newApp = { id: `app-${Date.now()}`, jobId, studentId, resumeUrl, status: "APPLIED", appliedAt: new Date(), updatedAt: new Date() };
      mockDb.applications.push(newApp);
      saveMockDbToFile();
      return toPlain(newApp);
    },
    async listByStudent(studentId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const apps = await mongo.collection("applications").find({ studentId }).sort({ appliedAt: -1 }).toArray();
        const jobs = await mongo.collection("jobs").find().toArray();
        const comps = await mongo.collection("companies").find().toArray();
        const mapped = apps.map(a => {
          const job = jobs.find(j => j.id === a.jobId);
          return { ...a, job: job ? { ...job, company: comps.find(c => c.id === job.companyId) } : null };
        });
        return toPlain(mapped);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const list = await prisma.application.findMany({ where: { studentId }, include: { job: { include: { company: true } } } });
        return toPlain(list);
      }
      return toPlain(mockDb.applications.filter(a => a.studentId === studentId).map(a => {
        const job = mockDb.jobs.find(j => j.id === a.jobId);
        return { ...a, job: job ? { ...job, company: mockDb.companies.find(c => c.id === job.companyId) } : null };
      }));
    },
    async listByRecruiter(recruiterUserId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const recruiter = await mongo.collection("recruiters").findOne({ userId: recruiterUserId });
        if (!recruiter) return [];
        const jobs = await mongo.collection("jobs").find({ companyId: recruiter.companyId }).toArray();
        const jobIds = jobs.map(j => j.id);
        const apps = await mongo.collection("applications").find({ jobId: { $in: jobIds } }).sort({ appliedAt: -1 }).toArray();
        const students = await mongo.collection("students").find().toArray();
        const companies = await mongo.collection("companies").find().toArray();
        const comp = companies.find(c => c.id === recruiter.companyId);

        const mapped = apps.map(a => {
          const job = jobs.find(j => j.id === a.jobId);
          const student = students.find(s => s.id === a.studentId || s.userId === a.studentId);
          return {
            ...a,
            job: job ? { ...job, company: comp } : null,
            student
          };
        });
        return toPlain(mapped);
      }
      const rec = mockDb.recruiters.find(r => r.userId === recruiterUserId);
      if (!rec) return [];
      const companyJobs = mockDb.jobs.filter(j => j.companyId === rec.companyId);
      const jobIds = companyJobs.map(j => j.id);
      return toPlain(mockDb.applications.filter(a => jobIds.includes(a.jobId)).map(a => ({
        ...a,
        job: companyJobs.find(j => j.id === a.jobId),
        student: mockDb.students.find(s => s.id === a.studentId || s.userId === a.studentId)
      })));
    },
    async listAll() {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const apps = await mongo.collection("applications").find().sort({ appliedAt: -1 }).toArray();
        const jobs = await mongo.collection("jobs").find().toArray();
        const comps = await mongo.collection("companies").find().toArray();
        const students = await mongo.collection("students").find().toArray();

        const mapped = apps.map(a => {
          const job = jobs.find(j => j.id === a.jobId);
          const student = students.find(s => s.id === a.studentId || s.userId === a.studentId);
          return {
            ...a,
            job: job ? { ...job, company: comps.find(c => c.id === job.companyId) } : null,
            student
          };
        });
        return toPlain(mapped);
      }
      return toPlain(mockDb.applications.map(a => {
        const job = mockDb.jobs.find(j => j.id === a.jobId);
        return {
          ...a,
          job: job ? { ...job, company: mockDb.companies.find(c => c.id === job.companyId) } : null,
          student: mockDb.students.find(s => s.id === a.studentId || s.userId === a.studentId)
        };
      }));
    },
    async updateStatus(applicationId, status) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("applications").updateOne({ id: applicationId }, { $set: { status, updatedAt: new Date() } });
        const updated = await mongo.collection("applications").findOne({ id: applicationId });
        return toPlain(updated);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const updated = await prisma.application.update({ where: { id: applicationId }, data: { status } });
        return toPlain(updated);
      }
      const app = mockDb.applications.find(a => a.id === applicationId);
      if (app) {
        app.status = status;
        app.updatedAt = new Date();
        saveMockDbToFile();
      }
      return toPlain(app);
    }
  },

  // Interviews
  interviews: {
    async schedule(data) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const newInt = { id: `interview-${Date.now()}`, status: "SCHEDULED", createdAt: new Date(), updatedAt: new Date(), ...data };
        await mongo.collection("interviews").insertOne(newInt);
        return toPlain(newInt);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const created = await prisma.interview.create({ data });
        return toPlain(created);
      }
      const newInterview = { id: `interview-${Date.now()}`, status: "SCHEDULED", createdAt: new Date(), updatedAt: new Date(), ...data };
      mockDb.interviews.push(newInterview);
      saveMockDbToFile();
      return toPlain(newInterview);
    },
    async listByStudent(studentId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("interviews").find({ studentId }).sort({ dateTime: 1 }).toArray();
        const apps = await mongo.collection("applications").find().toArray();
        const jobs = await mongo.collection("jobs").find().toArray();
        const comps = await mongo.collection("companies").find().toArray();
        const recruiters = await mongo.collection("recruiters").find().toArray();

        const mapped = list.map(i => {
          const app = apps.find(a => a.id === i.applicationId);
          const job = app ? jobs.find(j => j.id === app.jobId) : null;
          const comp = job ? comps.find(c => c.id === job.companyId) : null;
          const rec = recruiters.find(r => r.id === i.recruiterId || r.userId === i.recruiterId);
          return {
            ...i,
            application: app ? { ...app, job: job ? { ...job, company: comp } : null } : null,
            recruiter: rec
          };
        });
        return toPlain(mapped);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const list = await prisma.interview.findMany({ where: { studentId }, include: { application: { include: { job: { include: { company: true } } } }, recruiter: true }, orderBy: { dateTime: "asc" } });
        return toPlain(list);
      }
      return toPlain(mockDb.interviews.filter(i => i.studentId === studentId));
    },
    async listByRecruiter(recruiterUserId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const rec = await mongo.collection("recruiters").findOne({ userId: recruiterUserId });
        const query = rec ? { $or: [{ recruiterId: rec.id }, { recruiterId: recruiterUserId }] } : { recruiterId: recruiterUserId };
        const list = await mongo.collection("interviews").find(query).sort({ dateTime: 1 }).toArray();
        const students = await mongo.collection("students").find().toArray();
        const apps = await mongo.collection("applications").find().toArray();
        const jobs = await mongo.collection("jobs").find().toArray();

        const mapped = list.map(i => {
          const student = students.find(s => s.id === i.studentId || s.userId === i.studentId);
          const app = apps.find(a => a.id === i.applicationId);
          const job = app ? jobs.find(j => j.id === app.jobId) : null;
          return {
            ...i,
            student,
            application: app ? { ...app, job } : null
          };
        });
        return toPlain(mapped);
      }
      const rec = mockDb.recruiters.find(r => r.userId === recruiterUserId);
      const recId = rec?.id || recruiterUserId;
      return toPlain(mockDb.interviews.filter(i => i.recruiterId === recId || i.recruiterId === recruiterUserId).map(i => ({
        ...i,
        student: mockDb.students.find(s => s.id === i.studentId || s.userId === i.studentId)
      })));
    },
    async listAll() {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("interviews").find().sort({ dateTime: 1 }).toArray();
        return toPlain(list);
      }
      return toPlain(mockDb.interviews);
    }
  },

  // Offer Letters
  offerLetters: {
    async create(data) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const newOffer = { id: `offer-${Date.now()}`, status: "OFFERED", createdAt: new Date(), ...data };
        await mongo.collection("offer_letters").insertOne(newOffer);
        return toPlain(newOffer);
      }
      const newOffer = { id: `offer-${Date.now()}`, status: "OFFERED", createdAt: new Date(), ...data };
      if (!Array.isArray(mockDb.offerLetters)) mockDb.offerLetters = [];
      mockDb.offerLetters.push(newOffer);
      saveMockDbToFile();
      return toPlain(newOffer);
    },
    async listByStudent(studentId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const offers = await mongo.collection("offer_letters").find({ studentId }).sort({ createdAt: -1 }).toArray();
        const comps = await mongo.collection("companies").find().toArray();
        const jobs = await mongo.collection("jobs").find().toArray();
        const mapped = offers.map(o => ({
          ...o,
          company: comps.find(c => c.id === o.companyId),
          job: jobs.find(j => j.id === o.jobId)
        }));
        return toPlain(mapped);
      }
      if (!Array.isArray(mockDb.offerLetters)) mockDb.offerLetters = [];
      return toPlain(mockDb.offerLetters.filter(o => o.studentId === studentId).map(o => ({
        ...o,
        company: mockDb.companies.find(c => c.id === o.companyId),
        job: mockDb.jobs.find(j => j.id === o.jobId)
      })));
    },
    async listAll() {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("offer_letters").find().sort({ createdAt: -1 }).toArray();
        return toPlain(list);
      }
      return toPlain(mockDb.offerLetters || []);
    },
    async updateStatus(offerId, status) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("offer_letters").updateOne({ id: offerId }, { $set: { status, updatedAt: new Date() } });
        const updated = await mongo.collection("offer_letters").findOne({ id: offerId });
        return toPlain(updated);
      }
      if (!Array.isArray(mockDb.offerLetters)) mockDb.offerLetters = [];
      const offer = mockDb.offerLetters.find(o => o.id === offerId);
      if (offer) {
        offer.status = status;
        offer.updatedAt = new Date();
        saveMockDbToFile();
      }
      return toPlain(offer);
    }
  },

  // Bookmarks
  bookmarks: {
    async create({ studentId, jobId }) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const id = `bm-${Date.now()}`;
        const newBm = { id, studentId, jobId, createdAt: new Date() };
        await mongo.collection("bookmarks").updateOne({ studentId, jobId }, { $set: newBm }, { upsert: true });
        return toPlain(newBm);
      }
      if (!Array.isArray(mockDb.bookmarks)) mockDb.bookmarks = [];
      const exists = mockDb.bookmarks.find(b => b.studentId === studentId && b.jobId === jobId);
      if (!exists) {
        const newBm = { id: `bm-${Date.now()}`, studentId, jobId, createdAt: new Date() };
        mockDb.bookmarks.push(newBm);
        saveMockDbToFile();
        return toPlain(newBm);
      }
      return toPlain(exists);
    },
    async delete({ studentId, jobId }) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("bookmarks").deleteOne({ studentId, jobId });
        return toPlain({ success: true });
      }
      if (!Array.isArray(mockDb.bookmarks)) mockDb.bookmarks = [];
      mockDb.bookmarks = mockDb.bookmarks.filter(b => !(b.studentId === studentId && b.jobId === jobId));
      saveMockDbToFile();
      return toPlain({ success: true });
    },
    async listByStudent(studentId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("bookmarks").find({ studentId }).toArray();
        const jobs = await mongo.collection("jobs").find().toArray();
        const comps = await mongo.collection("companies").find().toArray();
        const mapped = list.map(b => {
          const job = jobs.find(j => j.id === b.jobId);
          return {
            ...b,
            job: job ? { ...job, company: comps.find(c => c.id === job.companyId) } : null
          };
        });
        return toPlain(mapped);
      }
      if (!Array.isArray(mockDb.bookmarks)) mockDb.bookmarks = [];
      return toPlain(mockDb.bookmarks.filter(b => b.studentId === studentId).map(b => {
        const job = mockDb.jobs.find(j => j.id === b.jobId);
        return {
          ...b,
          job: job ? { ...job, company: mockDb.companies.find(c => c.id === job.companyId) } : null
        };
      }));
    }
  },

  // Notifications
  notifications: {
    async listByUser(userId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("notifications").find({ userId }).sort({ createdAt: -1 }).toArray();
        return toPlain(list);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const list = await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
        return toPlain(list);
      }
      return toPlain(mockDb.notifications.filter(n => n.userId === userId));
    },
    async create({ userId, title, message, type }) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const newNotif = { id: `notif-${Date.now()}`, userId, title, message, read: false, type: type || "INFO", createdAt: new Date() };
        await mongo.collection("notifications").insertOne(newNotif);
        return toPlain(newNotif);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const created = await prisma.notification.create({ data: { userId, title, message, type } });
        return toPlain(created);
      }
      const newNotif = { id: `notif-${Date.now()}`, userId, title, message, read: false, type: type || "INFO", createdAt: new Date() };
      mockDb.notifications.unshift(newNotif);
      saveMockDbToFile();
      return toPlain(newNotif);
    },
    async markAsRead(notificationId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("notifications").updateOne({ id: notificationId }, { $set: { read: true } });
        return toPlain({ success: true });
      }
      const notif = mockDb.notifications.find(n => n.id === notificationId);
      if (notif) {
        notif.read = true;
        saveMockDbToFile();
      }
      return toPlain({ success: true });
    }
  },

  // Activity Logs
  activityLogs: {
    async listByUser(userId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("activity_logs").find({ userId }).sort({ createdAt: -1 }).toArray();
        return toPlain(list);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const list = await prisma.activityLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
        return toPlain(list);
      }
      return toPlain(mockDb.activityLogs.filter(a => a.userId === userId));
    },
    async listAll() {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("activity_logs").find().sort({ createdAt: -1 }).toArray();
        return toPlain(list);
      }
      return toPlain(mockDb.activityLogs || []);
    },
    async create({ userId, action, details }) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const newLog = { id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, userId, action, details, createdAt: new Date() };
        await mongo.collection("activity_logs").insertOne(newLog);
        return toPlain(newLog);
      }
      const isConnected = await checkConnection();
      if (isConnected) {
        const created = await prisma.activityLog.create({ data: { userId, action, details } });
        return toPlain(created);
      }
      const newLog = { id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, userId, action, details, createdAt: new Date() };
      mockDb.activityLogs.unshift(newLog);
      saveMockDbToFile();
      return toPlain(newLog);
    }
  },

  // ----------------------------------------------------
  // Internship Verification & Performance Evaluation Module
  // ----------------------------------------------------
  internships: {
    // Requirements
    requirements: {
      async list() {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const list = await mongo.collection("internship_requirements").find().sort({ createdAt: -1 }).toArray();
          return toPlain(list);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const list = await prisma.internshipRequirement.findMany({ orderBy: { createdAt: "desc" } });
          return toPlain(list);
        }
        return toPlain(mockDb.internshipRequirements);
      },
      async getById(id) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const req = await mongo.collection("internship_requirements").findOne({ id });
          return toPlain(req);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const req = await prisma.internshipRequirement.findUnique({ where: { id } });
          return toPlain(req);
        }
        return toPlain(mockDb.internshipRequirements.find(r => r.id === id) || null);
      },
      async create(data) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const newReq = { id: `req-${Date.now()}`, createdAt: new Date(), ...data };
          await mongo.collection("internship_requirements").insertOne(newReq);
          return toPlain(newReq);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const created = await prisma.internshipRequirement.create({ data });
          return toPlain(created);
        }
        const newReq = { id: `req-${Date.now()}`, createdAt: new Date(), ...data };
        mockDb.internshipRequirements.push(newReq);
        saveMockDbToFile();
        return toPlain(newReq);
      },
      async update(id, data) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          await mongo.collection("internship_requirements").updateOne({ id }, { $set: data });
          const updated = await mongo.collection("internship_requirements").findOne({ id });
          return toPlain(updated);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const updated = await prisma.internshipRequirement.update({ where: { id }, data });
          return toPlain(updated);
        }
        const idx = mockDb.internshipRequirements.findIndex(r => r.id === id);
        if (idx !== -1) {
          mockDb.internshipRequirements[idx] = { ...mockDb.internshipRequirements[idx], ...data };
          saveMockDbToFile();
          return toPlain(mockDb.internshipRequirements[idx]);
        }
        return null;
      },
      async delete(id) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          await mongo.collection("internship_requirements").deleteOne({ id });
          return toPlain({ id });
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const deleted = await prisma.internshipRequirement.delete({ where: { id } });
          return toPlain(deleted);
        }
        mockDb.internshipRequirements = mockDb.internshipRequirements.filter(r => r.id !== id);
        saveMockDbToFile();
        return toPlain({ id });
      }
    },

    // Submissions
    submissions: {
      async list() {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const list = await mongo.collection("internship_submissions").find().sort({ submittedAt: -1 }).toArray();
          const enriched = await Promise.all(list.map(s => enrichSubmission(s, mongo)));
          return toPlain(enriched);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const list = await prisma.internshipSubmission.findMany({
            include: { student: true, requirement: true, documents: true, certificateVerify: true, reportAnalysis: true, companyEvaluation: true, facultyEvaluation: true, auditLogs: { orderBy: { createdAt: "desc" } } },
            orderBy: { submittedAt: "desc" }
          });
          return toPlain(list);
        }
        const enriched = await Promise.all(mockDb.internshipSubmissions.map(s => enrichSubmission(s, null)));
        return toPlain(enriched);
      },
      async listByStudent(studentId) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const list = await mongo.collection("internship_submissions").find({ studentId }).sort({ submittedAt: -1 }).toArray();
          const enriched = await Promise.all(list.map(s => enrichSubmission(s, mongo)));
          return toPlain(enriched);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const list = await prisma.internshipSubmission.findMany({
            where: { studentId },
            include: { student: true, requirement: true, documents: true, certificateVerify: true, reportAnalysis: true, companyEvaluation: true, facultyEvaluation: true, auditLogs: { orderBy: { createdAt: "desc" } } },
            orderBy: { submittedAt: "desc" }
          });
          return toPlain(list);
        }
        const enriched = await Promise.all(mockDb.internshipSubmissions.filter(s => s.studentId === studentId).map(s => enrichSubmission(s, null)));
        return toPlain(enriched);
      },
      async getById(id) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const sub = await mongo.collection("internship_submissions").findOne({ id });
          const enriched = await enrichSubmission(sub, mongo);
          return toPlain(enriched);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const sub = await prisma.internshipSubmission.findUnique({
            where: { id },
            include: { student: true, requirement: true, documents: true, certificateVerify: true, reportAnalysis: true, companyEvaluation: true, facultyEvaluation: true, auditLogs: { orderBy: { createdAt: "desc" } } }
          });
          return toPlain(sub);
        }
        const sub = mockDb.internshipSubmissions.find(s => s.id === id);
        const enriched = await enrichSubmission(sub, null);
        return toPlain(enriched);
      },
      async create(data) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const newSub = { id: `sub-${Date.now()}`, status: "SUBMITTED", submittedAt: new Date(), ...data };
          await mongo.collection("internship_submissions").insertOne(newSub);
          const enriched = await enrichSubmission(newSub, mongo);
          return toPlain(enriched);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const created = await prisma.internshipSubmission.create({ data });
          return toPlain(created);
        }
        const newSub = { id: `sub-${Date.now()}`, status: "SUBMITTED", submittedAt: new Date(), ...data };
        mockDb.internshipSubmissions.unshift(newSub);
        saveMockDbToFile();
        const enriched = await enrichSubmission(newSub, null);
        return toPlain(enriched);
      },
      async update(id, data) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          await mongo.collection("internship_submissions").updateOne({ id }, { $set: data });
          const updated = await mongo.collection("internship_submissions").findOne({ id });
          const enriched = await enrichSubmission(updated, mongo);
          return toPlain(enriched);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const updated = await prisma.internshipSubmission.update({ where: { id }, data });
          return toPlain(updated);
        }
        const idx = mockDb.internshipSubmissions.findIndex(s => s.id === id);
        if (idx !== -1) {
          mockDb.internshipSubmissions[idx] = { ...mockDb.internshipSubmissions[idx], ...data };
          saveMockDbToFile();
          const enriched = await enrichSubmission(mockDb.internshipSubmissions[idx], null);
          return toPlain(enriched);
        }
        return null;
      }
    },

    // Documents
    documents: {
      async create(data) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const newDoc = { id: `doc-${Date.now()}`, uploadedAt: new Date(), ...data };
          await mongo.collection("internship_documents").insertOne(newDoc);
          return toPlain(newDoc);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const created = await prisma.internshipDocument.create({ data });
          return toPlain(created);
        }
        const newDoc = { id: `doc-${Date.now()}`, uploadedAt: new Date(), ...data };
        mockDb.internshipDocuments.push(newDoc);
        saveMockDbToFile();
        return toPlain(newDoc);
      },
      async replace(submissionId, docType, data) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          await mongo.collection("internship_documents").deleteMany({ submissionId, docType });
          const newDoc = { id: `doc-${Date.now()}`, submissionId, docType, uploadedAt: new Date(), ...data };
          await mongo.collection("internship_documents").insertOne(newDoc);
          return toPlain(newDoc);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          await prisma.internshipDocument.deleteMany({ where: { submissionId, docType } }).catch(() => {});
          const created = await prisma.internshipDocument.create({ data: { submissionId, docType, ...data } });
          return toPlain(created);
        }
        mockDb.internshipDocuments = mockDb.internshipDocuments.filter(d => !(d.submissionId === submissionId && d.docType === docType));
        const newDoc = { id: `doc-${Date.now()}`, submissionId, docType, uploadedAt: new Date(), ...data };
        mockDb.internshipDocuments.push(newDoc);
        saveMockDbToFile();
        return toPlain(newDoc);
      },
      async listBySubmission(submissionId) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const docs = await mongo.collection("internship_documents").find({ submissionId }).sort({ uploadedAt: -1 }).toArray();
          return toPlain(docs);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const docs = await prisma.internshipDocument.findMany({ where: { submissionId }, orderBy: { uploadedAt: "desc" } });
          return toPlain(docs);
        }
        return toPlain(mockDb.internshipDocuments.filter(d => d.submissionId === submissionId));
      },
      async delete(id) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          await mongo.collection("internship_documents").deleteOne({ id });
          return true;
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          await prisma.internshipDocument.delete({ where: { id } }).catch(() => {});
          return true;
        }
        mockDb.internshipDocuments = mockDb.internshipDocuments.filter(d => d.id !== id);
        saveMockDbToFile();
        return true;
      }
    },

    // Certificate Verifications
    certificateVerifications: {
      async upsert(submissionId, data) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const existing = await mongo.collection("certificate_verifications").findOne({ submissionId });
          if (existing) {
            await mongo.collection("certificate_verifications").updateOne({ submissionId }, { $set: { ...data, verifiedAt: new Date() } });
            const updated = await mongo.collection("certificate_verifications").findOne({ submissionId });
            return toPlain(updated);
          }
          const newCert = { id: `cert-v-${Date.now()}`, submissionId, verifiedAt: new Date(), ...data };
          await mongo.collection("certificate_verifications").insertOne(newCert);
          return toPlain(newCert);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const upserted = await prisma.certificateVerification.upsert({
            where: { submissionId },
            update: data,
            create: { submissionId, ...data }
          });
          return toPlain(upserted);
        }
        const idx = mockDb.certificateVerifications.findIndex(c => c.submissionId === submissionId);
        if (idx !== -1) {
          mockDb.certificateVerifications[idx] = { ...mockDb.certificateVerifications[idx], ...data, verifiedAt: new Date() };
          saveMockDbToFile();
          return toPlain(mockDb.certificateVerifications[idx]);
        }
        const newCert = { id: `cert-v-${Date.now()}`, submissionId, verifiedAt: new Date(), ...data };
        mockDb.certificateVerifications.push(newCert);
        saveMockDbToFile();
        return toPlain(newCert);
      }
    },

    // Report Analyses
    reportAnalyses: {
      async upsert(submissionId, data) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const existing = await mongo.collection("report_analyses").findOne({ submissionId });
          if (existing) {
            await mongo.collection("report_analyses").updateOne({ submissionId }, { $set: { ...data, analyzedAt: new Date() } });
            const updated = await mongo.collection("report_analyses").findOne({ submissionId });
            return toPlain(updated);
          }
          const newRep = { id: `rep-a-${Date.now()}`, submissionId, analyzedAt: new Date(), ...data };
          await mongo.collection("report_analyses").insertOne(newRep);
          return toPlain(newRep);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const upserted = await prisma.internshipReportAnalysis.upsert({
            where: { submissionId },
            update: data,
            create: { submissionId, ...data }
          });
          return toPlain(upserted);
        }
        const idx = mockDb.reportAnalyses.findIndex(r => r.submissionId === submissionId);
        if (idx !== -1) {
          mockDb.reportAnalyses[idx] = { ...mockDb.reportAnalyses[idx], ...data, analyzedAt: new Date() };
          saveMockDbToFile();
          return toPlain(mockDb.reportAnalyses[idx]);
        }
        const newRep = { id: `rep-a-${Date.now()}`, submissionId, analyzedAt: new Date(), ...data };
        mockDb.reportAnalyses.push(newRep);
        saveMockDbToFile();
        return toPlain(newRep);
      }
    },

    // Company Evaluations
    companyEvaluations: {
      async getByToken(token) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const evalData = await mongo.collection("company_mentor_evaluations").findOne({ accessToken: token });
          if (!evalData) return null;
          const sub = await mongo.collection("internship_submissions").findOne({ id: evalData.submissionId });
          const enrichedSub = await enrichSubmission(sub, mongo);
          return toPlain({ ...evalData, submission: enrichedSub });
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const evalData = await prisma.companyMentorEvaluation.findUnique({
            where: { accessToken: token },
            include: { submission: { include: { student: true, requirement: true } } }
          });
          return toPlain(evalData);
        }
        const evalData = mockDb.companyMentorEvaluations.find(ce => ce.accessToken === token);
        if (!evalData) return null;
        const sub = mockDb.internshipSubmissions.find(s => s.id === evalData.submissionId);
        return toPlain({ ...evalData, submission: await enrichSubmission(sub, null) });
      },
      async upsert(submissionId, data) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const existing = await mongo.collection("company_mentor_evaluations").findOne({ submissionId });
          if (existing) {
            await mongo.collection("company_mentor_evaluations").updateOne({ submissionId }, { $set: data });
            const updated = await mongo.collection("company_mentor_evaluations").findOne({ submissionId });
            return toPlain(updated);
          }
          const newEval = { id: `comp-eval-${Date.now()}`, submissionId, ...data };
          await mongo.collection("company_mentor_evaluations").insertOne(newEval);
          return toPlain(newEval);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const upserted = await prisma.companyMentorEvaluation.upsert({
            where: { submissionId },
            update: data,
            create: { submissionId, ...data }
          });
          return toPlain(upserted);
        }
        const idx = mockDb.companyMentorEvaluations.findIndex(ce => ce.submissionId === submissionId);
        if (idx !== -1) {
          mockDb.companyMentorEvaluations[idx] = { ...mockDb.companyMentorEvaluations[idx], ...data };
          saveMockDbToFile();
          return toPlain(mockDb.companyMentorEvaluations[idx]);
        }
        const newEval = { id: `comp-eval-${Date.now()}`, submissionId, ...data };
        mockDb.companyMentorEvaluations.push(newEval);
        saveMockDbToFile();
        return toPlain(newEval);
      },
      async submit(token, data) {
        const totalScore = (
          (data.technicalKnowledge || 5) +
          (data.qualityOfWork || 5) +
          (data.problemSolving || 5) +
          (data.communication || 5) +
          (data.teamwork || 5) +
          (data.professionalism || 5)
        );

        const mongo = await checkMongoConnection();
        if (mongo) {
          await mongo.collection("company_mentor_evaluations").updateOne(
            { accessToken: token },
            { $set: { ...data, totalScore, isSubmitted: true, submittedAt: new Date() } }
          );
          const updated = await mongo.collection("company_mentor_evaluations").findOne({ accessToken: token });
          return toPlain(updated);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const updated = await prisma.companyMentorEvaluation.update({
            where: { accessToken: token },
            data: { ...data, totalScore, isSubmitted: true, submittedAt: new Date() }
          });
          return toPlain(updated);
        }
        const idx = mockDb.companyMentorEvaluations.findIndex(ce => ce.accessToken === token);
        if (idx !== -1) {
          mockDb.companyMentorEvaluations[idx] = {
            ...mockDb.companyMentorEvaluations[idx],
            ...data,
            totalScore,
            isSubmitted: true,
            submittedAt: new Date()
          };
          saveMockDbToFile();
          return toPlain(mockDb.companyMentorEvaluations[idx]);
        }
        return null;
      }
    },

    // Faculty Evaluations
    facultyEvaluations: {
      async upsert(submissionId, data) {
        const technicalScore = (data.technicalImplementation || 5) + (data.problemSolving || 5) + (data.qualityOfOutput || 5);
        const vivaScore = (data.vivaUnderstanding || 3) + (data.vivaExplanation || 3) + (data.vivaCommunication || 2) + (data.vivaQuestionHandling || 2);
        const attendanceScore = data.attendanceScore !== undefined ? data.attendanceScore : 5;
        const totalFacultyScore = technicalScore + vivaScore + attendanceScore;

        const mongo = await checkMongoConnection();
        if (mongo) {
          const existing = await mongo.collection("faculty_evaluations").findOne({ submissionId });
          if (existing) {
            await mongo.collection("faculty_evaluations").updateOne(
              { submissionId },
              { $set: { ...data, technicalScore, vivaScore, totalFacultyScore, evaluatedAt: new Date() } }
            );
            const updated = await mongo.collection("faculty_evaluations").findOne({ submissionId });
            return toPlain(updated);
          }
          const newFac = { id: `fac-eval-${Date.now()}`, submissionId, technicalScore, vivaScore, totalFacultyScore, evaluatedAt: new Date(), ...data };
          await mongo.collection("faculty_evaluations").insertOne(newFac);
          return toPlain(newFac);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const upserted = await prisma.facultyEvaluation.upsert({
            where: { submissionId },
            update: { ...data, technicalScore, vivaScore, totalFacultyScore, evaluatedAt: new Date() },
            create: { submissionId, ...data, technicalScore, vivaScore, totalFacultyScore, evaluatedAt: new Date() }
          });
          return toPlain(upserted);
        }
        const idx = mockDb.facultyEvaluations.findIndex(fe => fe.submissionId === submissionId);
        if (idx !== -1) {
          mockDb.facultyEvaluations[idx] = {
            ...mockDb.facultyEvaluations[idx],
            ...data,
            technicalScore,
            vivaScore,
            totalFacultyScore,
            evaluatedAt: new Date()
          };
          saveMockDbToFile();
          return toPlain(mockDb.facultyEvaluations[idx]);
        }
        const newFac = {
          id: `fac-eval-${Date.now()}`,
          submissionId,
          technicalScore,
          vivaScore,
          totalFacultyScore,
          evaluatedAt: new Date(),
          ...data
        };
        mockDb.facultyEvaluations.push(newFac);
        saveMockDbToFile();
        return toPlain(newFac);
      }
    },

    // Audit Logs
    auditLogs: {
      async listBySubmission(submissionId) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const list = await mongo.collection("internship_audit_logs").find({ submissionId }).sort({ createdAt: -1 }).toArray();
          return toPlain(list);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const list = await prisma.internshipAuditLog.findMany({
            where: { submissionId },
            orderBy: { createdAt: "desc" }
          });
          return toPlain(list);
        }
        return toPlain(mockDb.internshipAuditLogs.filter(al => al.submissionId === submissionId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      },
      async create(data) {
        const mongo = await checkMongoConnection();
        if (mongo) {
          const newLog = { id: `audit-log-${Date.now()}`, createdAt: new Date(), ...data };
          await mongo.collection("internship_audit_logs").insertOne(newLog);
          return toPlain(newLog);
        }
        const isConnected = await checkConnection();
        if (isConnected) {
          const created = await prisma.internshipAuditLog.create({ data });
          return toPlain(created);
        }
        const newLog = { id: `audit-log-${Date.now()}`, createdAt: new Date(), ...data };
        mockDb.internshipAuditLogs.unshift(newLog);
        saveMockDbToFile();
        return toPlain(newLog);
      }
    }
  },

  // Coding Challenges & OA Sandbox
  codingChallenges: {
    async list(filters = {}) {
      const mongo = await checkMongoConnection();
      let list = [];
      if (mongo) {
        list = await mongo.collection("coding_challenges").find().toArray();
        if (!list || list.length === 0) {
          const initialData = getInitialMockData();
          if (initialData.codingChallenges?.length > 0) {
            await mongo.collection("coding_challenges").insertMany(initialData.codingChallenges);
            list = initialData.codingChallenges;
          }
        }
      } else {
        list = mockDb.codingChallenges || [];
      }

      if (!list || list.length === 0) {
        list = getInitialMockData().codingChallenges || [];
        if (mockDb) mockDb.codingChallenges = list;
      }

      if (filters.difficulty && filters.difficulty !== "ALL") {
        list = list.filter(c => c.difficulty === filters.difficulty);
      }
      if (filters.company && filters.company !== "ALL") {
        list = list.filter(c => c.company.toLowerCase().includes(filters.company.toLowerCase()));
      }
      if (filters.category && filters.category !== "ALL") {
        list = list.filter(c => c.category.toLowerCase().includes(filters.category.toLowerCase()));
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.company.toLowerCase().includes(q));
      }
      return toPlain(list);
    },
    async getById(id) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const challenge = await mongo.collection("coding_challenges").findOne({ id });
        if (challenge) return toPlain(challenge);
      }
      let found = (mockDb.codingChallenges || []).find(c => c.id === id || c.slug === id);
      if (!found) {
        found = (getInitialMockData().codingChallenges || []).find(c => c.id === id || c.slug === id);
      }
      return toPlain(found || null);
    }
  },

  // Student Coding Submissions
  codeSubmissions: {
    async listByStudent(studentId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("code_submissions").find({ studentId }).sort({ createdAt: -1 }).toArray();
        return toPlain(list);
      }
      return toPlain((mockDb.codeSubmissions || []).filter(s => s.studentId === studentId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    },
    async create(data) {
      const submission = {
        id: `sub-${Date.now()}`,
        createdAt: new Date(),
        ...data
      };
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("code_submissions").insertOne(submission);
      } else {
        if (!mockDb.codeSubmissions) mockDb.codeSubmissions = [];
        mockDb.codeSubmissions.unshift(submission);
        saveMockDbToFile();
      }
      return toPlain(submission);
    }
  },

  // Alumni Interview Experiences
  interviewExperiences: {
    async list(filters = {}) {
      const mongo = await checkMongoConnection();
      let list = [];
      if (mongo) {
        list = await mongo.collection("interview_experiences").find().sort({ upvotes: -1, createdAt: -1 }).toArray();
        if (!list || list.length === 0) {
          const initialData = getInitialMockData();
          if (initialData.interviewExperiences?.length > 0) {
            await mongo.collection("interview_experiences").insertMany(initialData.interviewExperiences);
            list = initialData.interviewExperiences;
          }
        }
      } else {
        list = mockDb.interviewExperiences || [];
      }

      if (!list || list.length === 0) {
        list = getInitialMockData().interviewExperiences || [];
        if (mockDb) mockDb.interviewExperiences = list;
      }

      if (filters.company && filters.company !== "ALL") {
        list = list.filter(e => e.company.toLowerCase().includes(filters.company.toLowerCase()));
      }
      if (filters.tier && filters.tier !== "ALL") {
        list = list.filter(e => e.packageTier === filters.tier);
      }
      if (filters.verdict && filters.verdict !== "ALL") {
        list = list.filter(e => e.verdict === filters.verdict);
      }
      if (filters.department && filters.department !== "ALL") {
        list = list.filter(e => e.department === filters.department);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(e => 
          e.company.toLowerCase().includes(q) || 
          e.role.toLowerCase().includes(q) || 
          e.summary.toLowerCase().includes(q)
        );
      }
      return toPlain(list);
    },
    async getById(id) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const item = await mongo.collection("interview_experiences").findOne({ id });
        if (item) return toPlain(item);
      }
      return toPlain((mockDb.interviewExperiences || []).find(e => e.id === id) || null);
    },
    async create(data) {
      const newExp = {
        id: `exp-${Date.now()}`,
        upvotes: 1,
        createdAt: new Date(),
        date: new Date().toISOString().split("T")[0],
        ...data
      };
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("interview_experiences").insertOne(newExp);
      } else {
        if (!mockDb.interviewExperiences) mockDb.interviewExperiences = [];
        mockDb.interviewExperiences.unshift(newExp);
        saveMockDbToFile();
      }
      return toPlain(newExp);
    },
    async upvote(id, userId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("interview_experiences").updateOne({ id }, { $inc: { upvotes: 1 } });
        const updated = await mongo.collection("interview_experiences").findOne({ id });
        return toPlain(updated);
      }
      const exp = (mockDb.interviewExperiences || []).find(e => e.id === id);
      if (exp) {
        exp.upvotes = (exp.upvotes || 0) + 1;
        saveMockDbToFile();
        return toPlain(exp);
      }
      return null;
    }
  },

  // Offer Comparisons
  offerComparisons: {
    async listByStudent(studentId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("offer_comparisons").find({ studentId }).sort({ createdAt: -1 }).toArray();
        return toPlain(list);
      }
      return toPlain((mockDb.offerComparisons || []).filter(c => c.studentId === studentId));
    },
    async save(studentId, data) {
      const record = {
        id: `comp-${Date.now()}`,
        studentId,
        createdAt: new Date(),
        ...data
      };
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("offer_comparisons").insertOne(record);
      } else {
        if (!mockDb.offerComparisons) mockDb.offerComparisons = [];
        mockDb.offerComparisons.unshift(record);
        saveMockDbToFile();
      }
      return toPlain(record);
    }
  },

  // 1. UNSTOP COMPETITIONS & HACKATHONS
  competitions: {
    async list(filters = {}) {
      const mongo = await checkMongoConnection();
      let list = [];
      if (mongo) {
        list = await mongo.collection("competitions").find().toArray();
      } else {
        list = mockDb.competitions || [];
      }
      if (!list || list.length === 0) {
        list = getInitialMockData().competitions || [];
        if (mockDb) {
          mockDb.competitions = list;
          saveMockDbToFile();
        }
      }

      if (filters.category && filters.category !== "ALL") {
        list = list.filter(c => c.category === filters.category);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(c => 
          c.title.toLowerCase().includes(q) || 
          c.organizer.toLowerCase().includes(q) || 
          c.description.toLowerCase().includes(q)
        );
      }
      if (filters.mode && filters.mode !== "ALL") {
        list = list.filter(c => c.mode.toLowerCase().includes(filters.mode.toLowerCase()));
      }
      return toPlain(list);
    },
    async getById(id) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const item = await mongo.collection("competitions").findOne({ $or: [{ id }, { slug: id }] });
        if (item) return toPlain(item);
      }
      let found = (mockDb.competitions || []).find(c => c.id === id || c.slug === id);
      if (!found) {
        found = (getInitialMockData().competitions || []).find(c => c.id === id || c.slug === id);
      }
      return toPlain(found || null);
    },
    async create(data) {
      const newComp = {
        id: `comp-${Date.now()}`,
        slug: data.slug || (data.title || "new-competition").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        impressions: "1.2K",
        registeredCount: 1,
        daysLeft: 14,
        createdAt: new Date(),
        bannerGradient: "from-blue-900 via-indigo-950 to-slate-900",
        stages: data.stages || [
          { roundNumber: 1, title: "Executive Submission", type: "ONLINE_SUBMISSION", duration: "10 Mins", deadline: "In 10 Days", details: "Initial concept presentation." }
        ],
        prizes: data.prizes || [
          { rank: "Winner", prize: data.prizePool || "₹50,000 Cash", perks: "Winner Certificate & Trophy" }
        ],
        tracks: data.tracks || [{ name: "Open Innovation", desc: "Build innovative software or business solution." }],
        ...data
      };
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("competitions").insertOne(newComp);
      } else {
        if (!mockDb.competitions) mockDb.competitions = [];
        mockDb.competitions.unshift(newComp);
        saveMockDbToFile();
      }
      return toPlain(newComp);
    }
  },

  // 2. UNSTOP COMPETITION REGISTRATIONS & SUBMISSIONS
  competitionRegistrations: {
    async listByStudent(studentId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("competition_registrations").find({ studentId }).toArray();
        return toPlain(list);
      }
      return toPlain((mockDb.competitionRegistrations || []).filter(r => r.studentId === studentId));
    },
    async getByCompAndStudent(competitionId, studentId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const item = await mongo.collection("competition_registrations").findOne({ competitionId, studentId });
        if (item) return toPlain(item);
      }
      return toPlain((mockDb.competitionRegistrations || []).find(r => r.competitionId === competitionId && r.studentId === studentId) || null);
    },
    async create(data) {
      const newReg = {
        id: `reg-${Date.now()}`,
        registeredAt: new Date(),
        status: "CONFIRMED",
        ...data
      };
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("competition_registrations").insertOne(newReg);
      } else {
        if (!mockDb.competitionRegistrations) mockDb.competitionRegistrations = [];
        mockDb.competitionRegistrations.unshift(newReg);
        saveMockDbToFile();
      }
      return toPlain(newReg);
    },
    async updateSubmission(id, submissionData) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("competition_registrations").updateOne(
          { id },
          { $set: { submission: { ...submissionData, submittedAt: new Date() } } }
        );
        const item = await mongo.collection("competition_registrations").findOne({ id });
        return toPlain(item);
      }
      const reg = (mockDb.competitionRegistrations || []).find(r => r.id === id);
      if (reg) {
        reg.submission = { ...submissionData, submittedAt: new Date() };
        saveMockDbToFile();
        return toPlain(reg);
      }
      return null;
    }
  },

  // 3. UNSTOP INTERACTIVE QUIZZES & ASSESSMENTS
  quizzes: {
    async list(category = "ALL") {
      const mongo = await checkMongoConnection();
      let list = [];
      if (mongo) {
        list = await mongo.collection("quizzes").find().toArray();
      } else {
        list = mockDb.quizzes || [];
      }
      if (!list || list.length === 0) {
        list = getInitialMockData().quizzes || [];
        if (mockDb) {
          mockDb.quizzes = list;
          saveMockDbToFile();
        }
      }
      if (category && category !== "ALL") {
        list = list.filter(q => q.category.toLowerCase().includes(category.toLowerCase()));
      }
      return toPlain(list);
    },
    async getById(id) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const item = await mongo.collection("quizzes").findOne({ $or: [{ id }, { slug: id }] });
        if (item) return toPlain(item);
      }
      let found = (mockDb.quizzes || []).find(q => q.id === id || q.slug === id);
      if (!found) {
        found = (getInitialMockData().quizzes || []).find(q => q.id === id || q.slug === id);
      }
      return toPlain(found || null);
    }
  },

  // 4. UNSTOP QUIZ ATTEMPTS & CERTIFICATES
  quizAttempts: {
    async listByStudent(studentId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("quiz_attempts").find({ studentId }).sort({ completedAt: -1 }).toArray();
        return toPlain(list);
      }
      return toPlain((mockDb.quizAttempts || []).filter(a => a.studentId === studentId).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)));
    },
    async create(data) {
      const attempt = {
        id: `att-${Date.now()}`,
        certificateId: `VIT-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
        completedAt: new Date(),
        ...data
      };
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("quiz_attempts").insertOne(attempt);
      } else {
        if (!mockDb.quizAttempts) mockDb.quizAttempts = [];
        mockDb.quizAttempts.unshift(attempt);
        saveMockDbToFile();
      }
      return toPlain(attempt);
    }
  },

  // 5. 1-ON-1 MENTORSHIP
  mentors: {
    async list(filters = {}) {
      const mongo = await checkMongoConnection();
      let list = [];
      if (mongo) {
        list = await mongo.collection("mentors").find().toArray();
      } else {
        list = mockDb.mentors || [];
      }
      if (!list || list.length === 0) {
        list = getInitialMockData().mentors || [];
        if (mockDb) {
          mockDb.mentors = list;
          saveMockDbToFile();
        }
      }
      if (filters.company && filters.company !== "ALL") {
        list = list.filter(m => m.company.toLowerCase().includes(filters.company.toLowerCase()));
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(m => 
          m.name.toLowerCase().includes(q) || 
          m.company.toLowerCase().includes(q) || 
          m.skills.some(s => s.toLowerCase().includes(q))
        );
      }
      return toPlain(list);
    },
    async getById(id) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const item = await mongo.collection("mentors").findOne({ id });
        if (item) return toPlain(item);
      }
      let found = (mockDb.mentors || []).find(m => m.id === id);
      if (!found) {
        found = (getInitialMockData().mentors || []).find(m => m.id === id);
      }
      return toPlain(found || null);
    }
  },

  // 6. MENTORSHIP BOOKINGS
  mentorshipBookings: {
    async listByStudent(studentId) {
      const mongo = await checkMongoConnection();
      if (mongo) {
        const list = await mongo.collection("mentorship_bookings").find({ studentId }).sort({ date: -1 }).toArray();
        return toPlain(list);
      }
      return toPlain((mockDb.mentorshipBookings || []).filter(b => b.studentId === studentId));
    },
    async create(data) {
      const booking = {
        id: `bk-${Date.now()}`,
        meetLink: `https://meet.google.com/vit-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`,
        status: "CONFIRMED",
        createdAt: new Date(),
        ...data
      };
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("mentorship_bookings").insertOne(booking);
      } else {
        if (!mockDb.mentorshipBookings) mockDb.mentorshipBookings = [];
        mockDb.mentorshipBookings.unshift(booking);
        saveMockDbToFile();
      }
      return toPlain(booking);
    }
  },

  // 7. UNSTOP TEAMMATE MATCHMAKER
  teammateRequests: {
    async list(filters = {}) {
      const mongo = await checkMongoConnection();
      let list = [];
      if (mongo) {
        list = await mongo.collection("teammate_requests").find().sort({ createdAt: -1 }).toArray();
      } else {
        list = mockDb.teammateRequests || [];
      }
      if (!list || list.length === 0) {
        list = getInitialMockData().teammateRequests || [];
        if (mockDb) {
          mockDb.teammateRequests = list;
          saveMockDbToFile();
        }
      }
      if (filters.competitionId && filters.competitionId !== "ALL") {
        list = list.filter(r => r.competitionId === filters.competitionId);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(r => 
          r.competitionTitle.toLowerCase().includes(q) || 
          r.rolesNeeded.some(role => role.toLowerCase().includes(q)) || 
          r.skillsRequired.some(skill => skill.toLowerCase().includes(q))
        );
      }
      return toPlain(list);
    },
    async create(data) {
      const request = {
        id: `team-req-${Date.now()}`,
        createdAt: new Date(),
        ...data
      };
      const mongo = await checkMongoConnection();
      if (mongo) {
        await mongo.collection("teammate_requests").insertOne(request);
      } else {
        if (!mockDb.teammateRequests) mockDb.teammateRequests = [];
        mockDb.teammateRequests.unshift(request);
        saveMockDbToFile();
      }
      return toPlain(request);
    }
  },

  // 8. UNSTOP LEADERBOARD & REWARDS
  leaderboard: {
    async getTopStudents() {
      const mongo = await checkMongoConnection();
      let list = [];
      if (mongo) {
        list = await mongo.collection("leaderboard_users").find().sort({ points: -1 }).toArray();
      } else {
        list = mockDb.leaderboardUsers || [];
      }
      if (!list || list.length === 0) {
        list = getInitialMockData().leaderboardUsers || [];
        if (mockDb) {
          mockDb.leaderboardUsers = list;
          saveMockDbToFile();
        }
      }
      return toPlain(list);
    },
    async getRewardsStore() {
      const list = mockDb.rewardsStore || getInitialMockData().rewardsStore || [];
      return toPlain(list);
    }
  }
};



