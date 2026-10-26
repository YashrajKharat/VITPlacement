// Amazon SDE-1 OA Authentic Coding Challenges (10 Problems)
// Sourced from HackerRank Amazon OA, LeetCode Amazon Top 50 tagged benchmarks, and SDE-1 coding rounds

export const AMAZON_CODING_CHALLENGES = [
  {
    id: "algo-amz-1",
    title: "Top K Frequent Elements",
    slug: "top-k-frequent",
    company: "Amazon",
    companyId: "amazon",
    companyLogo: "📦",
    frequencyTag: "⭐ Repeated 15+ Times in Amazon SDE-1 OA",
    difficulty: "MEDIUM",
    category: "Heaps & Hash Maps",
    tags: ["Amazon", "Heap", "Hash Table", "Bucket Sort"],
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" }
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
    hints: ["Count frequencies with a Hash Map, then maintain a Min-Heap of size K."]
  },
  {
    id: "algo-amz-2",
    title: "Number of Connected Islands",
    slug: "amazon-number-of-islands",
    company: "Amazon",
    companyId: "amazon",
    companyLogo: "📦",
    frequencyTag: "⭐ Amazon OA #1 Most Repeated Grid Problem",
    difficulty: "MEDIUM",
    category: "Graphs & Grid BFS/DFS",
    tags: ["Amazon", "DFS", "BFS", "Matrix"],
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1" },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3" }
    ],
    starterCode: {
      javascript: `function numIslands(grid) {
  if (!grid.length) return 0;
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      python: `def num_islands(grid: list[list[str]]) -> int:
    if not grid: return 0
    count = 0
    def dfs(r, c):
        if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`
    },
    testCases: [
      { input: [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]], expected: 1, isHidden: false },
      { input: [[["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]], expected: 3, isHidden: false }
    ],
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(M * N) call stack",
    hints: ["Whenever you see a '1', increment island count and trigger DFS/BFS to sink all connected '1's to '0'."]
  },
  {
    id: "algo-amz-3",
    title: "Sliding Window Maximum",
    slug: "amazon-sliding-window-max",
    company: "Amazon",
    companyId: "amazon",
    companyLogo: "📦",
    frequencyTag: "⭐ Frequent Amazon SDE OA Hard Problem",
    difficulty: "HARD",
    category: "Sliding Window & Deque",
    tags: ["Amazon", "Deque", "Sliding Window"],
    description: "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left to the very right. Return the max sliding window values in O(N) amortized time.",
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" }
    ],
    starterCode: {
      javascript: `function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}`,
      python: `def max_sliding_window(nums: list[int], k: int) -> list[int]:
    import collections
    q = collections.deque()
    res = []
    for i, n in enumerate(nums):
        while q and q[0] < i - k + 1: q.popleft()
        while q and nums[q[-1]] < n: q.pop()
        q.append(i)
        if i >= k - 1: res.append(nums[q[0]])
    return res`
    },
    testCases: [
      { input: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7], isHidden: false },
      { input: [[1], 1], expected: [1], isHidden: false },
      { input: [[9, 11], 2], expected: [11], isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(K)",
    hints: ["Use a monotonic decreasing deque that stores indices of candidate maximums."]
  },
  {
    id: "algo-amz-4",
    title: "Rotting Oranges Min Time",
    slug: "amazon-rotting-oranges",
    company: "Amazon",
    companyId: "amazon",
    companyLogo: "📦",
    frequencyTag: "⭐ Amazon OA Multi-Source BFS Classic",
    difficulty: "MEDIUM",
    category: "Graphs & Multi-Source BFS",
    tags: ["Amazon", "BFS", "Matrix"],
    description: "Given an `m x n` grid where `0` is empty, `1` is fresh orange, and `2` is rotten orange, return the minimum number of minutes that must elapse until no cell has a fresh orange. If impossible, return `-1`.",
    examples: [
      { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
      { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1" }
    ],
    starterCode: {
      javascript: `function orangesRotting(grid) {
  const R = grid.length, C = grid[0].length;
  const queue = [];
  let fresh = 0;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 2) queue.push([r, c, 0]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  let minutes = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (queue.length) {
    const [r, c, m] = queue.shift();
    minutes = m;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        fresh--;
        queue.push([nr, nc, m + 1]);
      }
    }
  }
  return fresh === 0 ? minutes : -1;
}`,
      python: `def oranges_rotting(grid: list[list[int]]) -> int:
    import collections
    R, C = len(grid), len(grid[0])
    q = collections.deque()
    fresh = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 2: q.append((r, c, 0))
            elif grid[r][c] == 1: fresh += 1
    mins = 0
    while q:
        r, c, m = q.popleft()
        mins = m
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                q.append((nr, nc, m + 1))
    return mins if fresh == 0 else -1`
    },
    testCases: [
      { input: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4, isHidden: false },
      { input: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1, isHidden: false },
      { input: [[[0, 2]]], expected: 0, isHidden: true }
    ],
    timeComplexity: "O(R * C)",
    spaceComplexity: "O(R * C)",
    hints: ["Enqueue all initial rotten oranges simultaneously to run multi-source BFS level by level."]
  },
  {
    id: "algo-amz-5",
    title: "Word Break Segmentation",
    slug: "amazon-word-break",
    company: "Amazon",
    companyId: "amazon",
    companyLogo: "📦",
    frequencyTag: "⭐ Repeated in Amazon SDE-1 OA & Onsite",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    tags: ["Amazon", "DP", "Trie"],
    description: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: "true" },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: "true" },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: "false" }
    ],
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {
  const dict = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && dict.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
      python: `def word_break(s: str, word_dict: list[str]) -> bool:
    d = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in d:
                dp[i] = True
                break
    return dp[len(s)]`
    },
    testCases: [
      { input: ["leetcode", ["leet", "code"]], expected: true, isHidden: false },
      { input: ["catsandog", ["cats", "dog", "sand", "and", "cat"]], expected: false, isHidden: false },
      { input: ["applepenapple", ["apple", "pen"]], expected: true, isHidden: true }
    ],
    timeComplexity: "O(N^2)",
    spaceComplexity: "O(N)",
    hints: ["Use 1D DP where dp[i] is true if s[0...i] can be segmented."]
  },
  {
    id: "algo-amz-6",
    title: "Kth Largest Element in an Array",
    slug: "amazon-kth-largest-element",
    company: "Amazon",
    companyId: "amazon",
    companyLogo: "📦",
    frequencyTag: "⭐ Amazon SDE-1 OA QuickSelect Classic",
    difficulty: "MEDIUM",
    category: "Heaps & QuickSelect",
    tags: ["Amazon", "Heap", "QuickSelect"],
    description: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array in O(N) average time.",
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
      { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" }
    ],
    starterCode: {
      javascript: `function findKthLargest(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
      python: `def find_kth_largest(nums: list[int], k: int) -> int:
    import heapq
    return heapq.nlargest(k, nums)[-1]`
    },
    testCases: [
      { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5, isHidden: false },
      { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4, isHidden: false },
      { input: [[1], 1], expected: 1, isHidden: true }
    ],
    timeComplexity: "O(N log K) or O(N) with QuickSelect",
    spaceComplexity: "O(K)",
    hints: ["Maintain a Min-Heap of size K or use QuickSelect partitioning."]
  },
  {
    id: "algo-amz-7",
    title: "Minimum Window Substring",
    slug: "amazon-min-window-substring",
    company: "Amazon",
    companyId: "amazon",
    companyLogo: "📦",
    frequencyTag: "⭐ Amazon Top 10 Sliding Window Question",
    difficulty: "HARD",
    category: "Strings & Sliding Window",
    tags: ["Amazon", "Sliding Window", "Hard"],
    description: "Given two strings `s` and `t`, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included. If no such substring exists, return `\"\"`.",
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
      { input: 's = "a", t = "a"', output: '"a"' }
    ],
    starterCode: {
      javascript: `function minWindow(s, t) {
  if (!s || !t) return "";
  const need = {};
  for (const c of t) need[c] = (need[c] || 0) + 1;
  let missing = t.length;
  let start = 0, minLen = Infinity, minStart = 0;
  for (let end = 0; end < s.length; end++) {
    if (need[s[end]] !== undefined) {
      if (need[s[end]] > 0) missing--;
      need[s[end]]--;
    }
    while (missing === 0) {
      if (end - start + 1 < minLen) {
        minLen = end - start + 1;
        minStart = start;
      }
      if (need[s[start]] !== undefined) {
        need[s[start]]++;
        if (need[s[start]] > 0) missing++;
      }
      start++;
    }
  }
  return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);
}`,
      python: `def min_window(s: str, t: str) -> str:
    import collections
    need = collections.Counter(t)
    missing = len(t)
    start = min_len = 0
    res = ""
    min_len = float('inf')
    for end, c in enumerate(s):
        if need[c] > 0: missing -= 1
        need[c] -= 1
        while missing == 0:
            if end - start + 1 < min_len:
                min_len = end - start + 1
                res = s[start:end+1]
            need[s[start]] += 1
            if need[s[start]] > 0: missing += 1
            start += 1
    return res`
    },
    testCases: [
      { input: ["ADOBECODEBANC", "ABC"], expected: "BANC", isHidden: false },
      { input: ["a", "a"], expected: "a", isHidden: false },
      { input: ["a", "aa"], expected: "", isHidden: true }
    ],
    timeComplexity: "O(S + T)",
    spaceComplexity: "O(T)",
    hints: ["Use a sliding window: expand right until window is valid, then shrink left to minimize length."]
  },
  {
    id: "algo-amz-8",
    title: "Reorganize String with No Adjacent Identical Characters",
    slug: "amazon-reorganize-string",
    company: "Amazon",
    companyId: "amazon",
    companyLogo: "📦",
    frequencyTag: "⭐ Frequent Amazon OA Greedy Coding Question",
    difficulty: "MEDIUM",
    category: "Greedy & Heaps",
    tags: ["Amazon", "Greedy", "Heap"],
    description: "Given a string `s`, rearrange the characters of `s` so that any two adjacent characters are not the same. Return any possible rearrangement, or return `\"\"` if impossible.",
    examples: [
      { input: 's = "aab"', output: '"aba"' },
      { input: 's = "aaab"', output: '""' }
    ],
    starterCode: {
      javascript: `function reorganizeString(s) {
  const counts = {};
  for (const c of s) counts[c] = (counts[c] || 0) + 1;
  const heap = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (heap[0][1] > Math.floor((s.length + 1) / 2)) return "";
  const res = new Array(s.length);
  let idx = 0;
  for (const [char, count] of heap) {
    for (let i = 0; i < count; i++) {
      if (idx >= s.length) idx = 1;
      res[idx] = char;
      idx += 2;
    }
  }
  return res.join("");
}`,
      python: `def reorganize_string(s: str) -> str:
    import collections, heapq
    counts = collections.Counter(s)
    max_heap = [(-cnt, char) for char, cnt in counts.items()]
    heapq.heapify(max_heap)
    if -max_heap[0][0] > (len(s) + 1) // 2: return ""
    res = []
    prev_cnt, prev_char = 0, ""
    while max_heap:
        cnt, char = heapq.heappop(max_heap)
        res.append(char)
        if prev_cnt < 0: heapq.heappush(max_heap, (prev_cnt, prev_char))
        prev_cnt, prev_char = cnt + 1, char
    return "".join(res)`
    },
    testCases: [
      { input: ["aab"], expected: "aba", isHidden: false },
      { input: ["aaab"], expected: "", isHidden: false }
    ],
    timeComplexity: "O(N log A) where A is alphabet size",
    spaceComplexity: "O(A)",
    hints: ["If any character frequency exceeds (N+1)/2, it is impossible."]
  },
  {
    id: "algo-amz-9",
    title: "Critical Network Connections (Tarjan's Bridges)",
    slug: "amazon-critical-connections",
    company: "Amazon",
    companyId: "amazon",
    companyLogo: "📦",
    frequencyTag: "⭐ Amazon AWS Data Center Network Problem",
    difficulty: "HARD",
    category: "Graphs & Tarjan's Algorithm",
    tags: ["Amazon", "Graph", "Tarjan", "Hard"],
    description: "There are `n` servers numbered `0` to `n - 1` connected by undirected connections. A critical connection is a connection that, if removed, will make some servers unable to communicate. Return all critical connections (bridges).",
    examples: [
      { input: "n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]", output: "[[1,3]]" }
    ],
    starterCode: {
      javascript: `function criticalConnections(n, connections) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const disc = new Array(n).fill(-1);
  const low = new Array(n).fill(-1);
  const bridges = [];
  let time = 0;
  function dfs(u, parent) {
    disc[u] = low[u] = ++time;
    for (const v of adj[u]) {
      if (v === parent) continue;
      if (disc[v] !== -1) {
        low[u] = Math.min(low[u], disc[v]);
      } else {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) bridges.push([u, v]);
      }
    }
  }
  for (let i = 0; i < n; i++) {
    if (disc[i] === -1) dfs(i, -1);
  }
  return bridges;
}`,
      python: `def critical_connections(n: int, connections: list[list[int]]) -> list[list[int]]:
    import collections
    adj = collections.defaultdict(list)
    for u, v in connections:
        adj[u].append(v); adj[v].append(u)
    disc = [-1] * n
    low = [-1] * n
    bridges = []
    time = 0
    def dfs(u, p):
        nonlocal time
        time += 1
        disc[u] = low[u] = time
        for v in adj[u]:
            if v == p: continue
            if disc[v] != -1: low[u] = min(low[u], disc[v])
            else:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]: bridges.append([u, v])
    for i in range(n):
        if disc[i] == -1: dfs(i, -1)
    return bridges`
    },
    testCases: [
      { input: [4, [[0, 1], [1, 2], [2, 0], [1, 3]]], expected: [[1, 3]], isHidden: false },
      { input: [2, [[0, 1]]], expected: [[0, 1]], isHidden: false }
    ],
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    hints: ["Use Tarjan's bridge-finding algorithm tracking discovery time and lowest reachable ancestor."]
  },
  {
    id: "algo-amz-10",
    title: "Best Time to Buy and Sell Stock with Cooldown",
    slug: "amazon-stock-with-cooldown",
    company: "Amazon",
    companyId: "amazon",
    companyLogo: "📦",
    frequencyTag: "⭐ Amazon OA State Machine DP",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    tags: ["Amazon", "DP", "State Machine"],
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You may complete as many transactions as you like with the condition that after you sell your stock, you cannot buy stock on the next day (cooldown 1 day). Return the maximum profit.",
    examples: [
      { input: "prices = [1,2,3,0,2]", output: "3", explanation: "transactions = [buy, sell, cooldown, buy, sell]." },
      { input: "prices = [1]", output: "0" }
    ],
    starterCode: {
      javascript: `function maxProfitWithCooldown(prices) {
  if (prices.length <= 1) return 0;
  let hold = -prices[0], sold = 0, rest = 0;
  for (let i = 1; i < prices.length; i++) {
    const prevSold = sold;
    sold = hold + prices[i];
    hold = Math.max(hold, rest - prices[i]);
    rest = Math.max(rest, prevSold);
  }
  return Math.max(sold, rest);
}`,
      python: `def max_profit_with_cooldown(prices: list[int]) -> int:
    if len(prices) <= 1: return 0
    hold, sold, rest = -prices[0], 0, 0
    for p in prices[1:]:
        prev_sold = sold
        sold = hold + p
        hold = max(hold, rest - p)
        rest = max(rest, prev_sold)
    return max(sold, rest)`
    },
    testCases: [
      { input: [[1, 2, 3, 0, 2]], expected: 3, isHidden: false },
      { input: [[1]], expected: 0, isHidden: false }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Model the problem as a 3-state finite state machine: Hold, Sold, and Rest."]
  }
];
