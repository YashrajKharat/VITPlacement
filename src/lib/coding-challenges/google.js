// Google SWE & Campus OA Authentic Coding Challenges (10 Problems)
// Sourced from Google Online Challenge (GOC), LeetCode Google tagged benchmarks, and SWE technical screen archives

export const GOOGLE_CODING_CHALLENGES = [
  {
    id: "algo-goog-1",
    title: "Two Sum Target Indices",
    slug: "two-sum",
    company: "Google",
    companyId: "google",
    companyLogo: "🟢",
    frequencyTag: "⭐ Classic Google Benchmark Problem",
    difficulty: "EASY",
    category: "Arrays & Hash Maps",
    tags: ["Google", "Array", "Hash Table", "Hot"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume each input has exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen: return [seen[target - n], i]
        seen[n] = i
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
    hints: ["Use a Hash Map to store elements and look up complements in O(1) time."]
  },
  {
    id: "algo-goog-2",
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring",
    company: "Google",
    companyId: "google",
    companyLogo: "🟢",
    frequencyTag: "⭐ Google OA Most Frequent String Problem",
    difficulty: "MEDIUM",
    category: "Strings & Sliding Window",
    tags: ["Google", "String", "Sliding Window"],
    description: "Given a string `s`, find the length of the longest substring without duplicate characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: '"abc" has length 3.' },
      { input: 's = "bbbbb"', output: "1" }
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  let maxLen = 0, left = 0;
  const set = new Set();
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    char_set = set()
    left = res = 0
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
    hints: ["Maintain a sliding window with two pointers left and right."]
  },
  {
    id: "algo-goog-3",
    title: "Container With Most Water",
    slug: "container-with-most-water",
    company: "Google",
    companyId: "google",
    companyLogo: "🟢",
    frequencyTag: "⭐ Repeated Google Technical Phone Screen",
    difficulty: "MEDIUM",
    category: "Two Pointers",
    tags: ["Google", "Two Pointers", "Greedy"],
    description: "Given an array `height` of length `n`, find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum area.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" }
    ],
    starterCode: {
      javascript: `function maxArea(height) {
  let left = 0, right = height.length - 1, maxWater = 0;
  while (left < right) {
    const current = Math.min(height[left], height[right]) * (right - left);
    maxWater = Math.max(maxWater, current);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}`,
      python: `def max_area(height: list[int]) -> int:
    l, r, res = 0, len(height) - 1, 0
    while l < r:
        res = max(res, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]: l += 1
        else: r -= 1
    return res`
    },
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, isHidden: false },
      { input: [[1, 1]], expected: 1, isHidden: false },
      { input: [[4, 3, 2, 1, 4]], expected: 16, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Start at both ends and advance the pointer with the smaller height."]
  },
  {
    id: "algo-goog-4",
    title: "Trapping Rain Water",
    slug: "google-trapping-rain-water",
    company: "Google",
    companyId: "google",
    companyLogo: "🟢",
    frequencyTag: "⭐ Google Top 5 Hard Coding Classic",
    difficulty: "HARD",
    category: "Two Pointers & Arrays",
    tags: ["Google", "Two Pointers", "Hard"],
    description: "Given `n` non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining in O(1) space.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" }
    ],
    starterCode: {
      javascript: `function trap(height) {
  let l = 0, r = height.length - 1;
  let lMax = 0, rMax = 0, total = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      if (height[l] >= lMax) lMax = height[l];
      else total += lMax - height[l];
      l++;
    } else {
      if (height[r] >= rMax) rMax = height[r];
      else total += rMax - height[r];
      r--;
    }
  }
  return total;
}`,
      python: `def trap(height: list[int]) -> int:
    if not height: return 0
    l, r = 0, len(height) - 1
    l_max, r_max, total = height[l], height[r], 0
    while l < r:
        if l_max < r_max:
            l += 1
            l_max = max(l_max, height[l])
            total += l_max - height[l]
        else:
            r -= 1
            r_max = max(r_max, height[r])
            total += r_max - height[r]
    return total`
    },
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, isHidden: false },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9, isHidden: false },
      { input: [[3, 0, 2, 0, 4]], expected: 7, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Water above bar is bounded by min(leftMax, rightMax). Optimize with two pointers."]
  },
  {
    id: "algo-goog-5",
    title: "Course Schedule Cycle Detection",
    slug: "google-course-schedule",
    company: "Google",
    companyId: "google",
    companyLogo: "🟢",
    frequencyTag: "⭐ Google Dependency DAG Benchmark",
    difficulty: "MEDIUM",
    category: "Graphs & Topological Sort",
    tags: ["Google", "Graph", "Topological Sort"],
    description: "There are `numCourses` courses you must take, labeled from `0` to `numCourses - 1`. Given an array `prerequisites` where `prerequisites[i] = [a, b]` indicates you must take course `b` before `a`, return `true` if you can finish all courses.",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" }
    ],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    inDegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let count = 0;
  while (queue.length) {
    const curr = queue.shift();
    count++;
    for (const neighbor of adj[curr]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return count === numCourses;
}`,
      python: `def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    import collections
    indegree = [0] * num_courses
    adj = collections.defaultdict(list)
    for c, p in prerequisites:
        adj[p].append(c)
        indegree[c] += 1
    q = collections.deque([i for i in range(num_courses) if indegree[i] == 0])
    count = 0
    while q:
        curr = q.popleft()
        count += 1
        for n in adj[curr]:
            indegree[n] -= 1
            if indegree[n] == 0: q.append(n)
    return count == num_courses`
    },
    testCases: [
      { input: [2, [[1, 0]]], expected: true, isHidden: false },
      { input: [2, [[1, 0], [0, 1]]], expected: false, isHidden: false },
      { input: [3, [[0, 1], [0, 2], [1, 2]]], expected: true, isHidden: true }
    ],
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    hints: ["Use Kahn's algorithm with a Queue to detect cycles in a directed graph."]
  },
  {
    id: "algo-goog-6",
    title: "Longest Increasing Subsequence",
    slug: "google-longest-increasing-subsequence",
    company: "Google",
    companyId: "google",
    companyLogo: "🟢",
    frequencyTag: "⭐ Google Classic LeetCode 300 Repeat",
    difficulty: "MEDIUM",
    category: "Dynamic Programming & Binary Search",
    tags: ["Google", "DP", "Binary Search"],
    description: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence in O(N log N) time.",
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "[2, 3, 7, 101] has length 4." },
      { input: "nums = [0,1,0,3,2,3]", output: "4" }
    ],
    starterCode: {
      javascript: `function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let l = 0, r = tails.length;
    while (l < r) {
      const mid = Math.floor((l + r) / 2);
      if (tails[mid] < x) l = mid + 1;
      else r = mid;
    }
    tails[l] = x;
  }
  return tails.length;
}`,
      python: `def length_of_lis(nums: list[int]) -> int:
    import bisect
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails): tails.append(x)
        else: tails[idx] = x
    return len(tails)`
    },
    testCases: [
      { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, isHidden: false },
      { input: [[0, 1, 0, 3, 2, 3]], expected: 4, isHidden: false },
      { input: [[7, 7, 7, 7]], expected: 1, isHidden: true }
    ],
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(N)",
    hints: ["Use patience sorting with binary search (`tails` array)."]
  },
  {
    id: "algo-goog-7",
    title: "Edit Distance (Levenshtein Distance)",
    slug: "google-edit-distance",
    company: "Google",
    companyId: "google",
    companyLogo: "🟢",
    frequencyTag: "⭐ Google NLP & String DP Benchmark",
    difficulty: "HARD",
    category: "Dynamic Programming",
    tags: ["Google", "DP", "Strings"],
    description: "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2` using insert, delete, or replace character operations.",
    examples: [
      { input: 'word1 = "horse", word2 = "ros"', output: "3" },
      { input: 'word1 = "intention", word2 = "execution"', output: "5" }
    ],
    starterCode: {
      javascript: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}`,
      python: `def min_distance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1]
            else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]`
    },
    testCases: [
      { input: ["horse", "ros"], expected: 3, isHidden: false },
      { input: ["intention", "execution"], expected: 5, isHidden: false },
      { input: ["", "a"], expected: 1, isHidden: true }
    ],
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(M * N)",
    hints: ["Use a 2D DP table where dp[i][j] represents edits between prefixes."]
  },
  {
    id: "algo-goog-8",
    title: "Median of Two Sorted Arrays",
    slug: "google-median-sorted-arrays",
    company: "Google",
    companyId: "google",
    companyLogo: "🟢",
    frequencyTag: "⭐ Google Hard Binary Search Benchmark",
    difficulty: "HARD",
    category: "Binary Search",
    tags: ["Google", "Binary Search", "Hard"],
    description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n`, return the median of the two sorted arrays in O(log(min(m, n))) time.",
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.0" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5" }
    ],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let left = 0, right = m;
  while (left <= right) {
    const p1 = Math.floor((left + right) / 2);
    const p2 = Math.floor((m + n + 1) / 2) - p1;
    const maxLeft1 = p1 === 0 ? -Infinity : nums1[p1 - 1];
    const minRight1 = p1 === m ? Infinity : nums1[p1];
    const maxLeft2 = p2 === 0 ? -Infinity : nums2[p2 - 1];
    const minRight2 = p2 === n ? Infinity : nums2[p2];
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 === 1) return Math.max(maxLeft1, maxLeft2);
      return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
    } else if (maxLeft1 > minRight2) right = p1 - 1;
    else left = p1 + 1;
  }
  return 0.0;
}`,
      python: `def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    if len(nums1) > len(nums2): nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    l, r = 0, m
    while l <= r:
        p1 = (l + r) // 2
        p2 = (m + n + 1) // 2 - p1
        maxL1 = float('-inf') if p1 == 0 else nums1[p1-1]
        minR1 = float('inf') if p1 == m else nums1[p1]
        maxL2 = float('-inf') if p2 == 0 else nums2[p2-1]
        minR2 = float('inf') if p2 == n else nums2[p2]
        if maxL1 <= minR2 and maxL2 <= minR1:
            if (m + n) % 2 == 1: return float(max(maxL1, maxL2))
            return (max(maxL1, maxL2) + min(minR1, minR2)) / 2.0
        elif maxL1 > minR2: r = p1 - 1
        else: l = p1 + 1
    return 0.0`
    },
    testCases: [
      { input: [[1, 3], [2]], expected: 2, isHidden: false },
      { input: [[1, 2], [3, 4]], expected: 2.5, isHidden: false },
      { input: [[0, 0], [0, 0]], expected: 0, isHidden: true }
    ],
    timeComplexity: "O(log(min(M, N)))",
    spaceComplexity: "O(1)",
    hints: ["Binary search for the partition point in the smaller array."]
  },
  {
    id: "algo-goog-9",
    title: "Single Non-Duplicate in Sorted Array",
    slug: "google-single-non-duplicate",
    company: "Google",
    companyId: "google",
    companyLogo: "🟢",
    frequencyTag: "⭐ Google Binary Search Invariant",
    difficulty: "MEDIUM",
    category: "Binary Search",
    tags: ["Google", "Binary Search"],
    description: "Given a sorted array of integers where every element appears exactly twice, except for one element which appears once, find that single element in O(log N) time and O(1) space.",
    examples: [
      { input: "nums = [1,1,2,3,3,4,4,8,8]", output: "2" },
      { input: "nums = [3,3,7,7,10,11,11]", output: "10" }
    ],
    starterCode: {
      javascript: `function singleNonDuplicate(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    if (mid % 2 === 1) mid--;
    if (nums[mid] === nums[mid + 1]) left = mid + 2;
    else right = mid;
  }
  return nums[left];
}`,
      python: `def single_non_duplicate(nums: list[int]) -> int:
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if mid % 2 == 1: mid -= 1
        if nums[mid] == nums[mid + 1]: l = mid + 2
        else: r = mid
    return nums[l]`
    },
    testCases: [
      { input: [[1, 1, 2, 3, 3, 4, 4, 8, 8]], expected: 2, isHidden: false },
      { input: [[3, 3, 7, 7, 10, 11, 11]], expected: 10, isHidden: false },
      { input: [[1]], expected: 1, isHidden: true }
    ],
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    hints: ["Before the single element, pairs begin at even indices. After it, pairs begin at odd indices."]
  },
  {
    id: "algo-goog-10",
    title: "Word Ladder Transformation Sequence",
    slug: "google-word-ladder",
    company: "Google",
    companyId: "google",
    companyLogo: "🟢",
    frequencyTag: "⭐ Google Shortest Path BFS Problem",
    difficulty: "HARD",
    category: "Graphs & BFS",
    tags: ["Google", "BFS", "Graph"],
    description: "Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord` changing only one letter at a time. If no sequence exists, return 0.",
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: "5", explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog".' }
    ],
    starterCode: {
      javascript: `function ladderLength(beginWord, endWord, wordList) {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) return 0;
  const queue = [[beginWord, 1]];
  while (queue.length) {
    const [word, level] = queue.shift();
    if (word === endWord) return level;
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const char = String.fromCharCode(c);
        if (char === word[i]) continue;
        const next = word.slice(0, i) + char + word.slice(i + 1);
        if (dict.has(next)) {
          dict.delete(next);
          queue.push([next, level + 1]);
        }
      }
    }
  }
  return 0;
}`,
      python: `def ladder_length(begin_word: str, end_word: str, word_list: list[str]) -> int:
    import collections
    word_set = set(word_list)
    if end_word not in word_set: return 0
    q = collections.deque([(begin_word, 1)])
    while q:
        w, lvl = q.popleft()
        if w == end_word: return lvl
        for i in range(len(w)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                nxt = w[:i] + c + w[i+1:]
                if nxt in word_set:
                    word_set.remove(nxt)
                    q.append((nxt, lvl + 1))
    return 0`
    },
    testCases: [
      { input: ["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]], expected: 5, isHidden: false },
      { input: ["hit", "cog", ["hot", "dot", "dog", "lot", "log"]], expected: 0, isHidden: false }
    ],
    timeComplexity: "O(M^2 * N)",
    spaceComplexity: "O(M * N)",
    hints: ["Model words as vertices and 1-letter differences as edges. Use BFS for shortest path."]
  }
];
