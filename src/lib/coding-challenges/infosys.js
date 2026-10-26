// Infosys SP (9.5 LPA) & DSE Authentic Coding Challenges (10 Problems)
// Sourced from HackWithInfy, Infosys Specialist Programmer, and InfyTQ coding test archives

export const INFOSYS_CODING_CHALLENGES = [
  {
    id: "algo-infy-1",
    title: "Maximum Subarray (Kadane's Algorithm)",
    slug: "infosys-kadanes-algorithm",
    company: "Infosys",
    companyId: "infosys",
    companyLogo: "🔷",
    frequencyTag: "⭐ Infosys #1 Most Repeated Coding Problem",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    tags: ["Infosys", "DP", "Kadane's"],
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum in O(N) time and O(1) space.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1" }
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currentMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}`,
      python: `def max_sub_array(nums: list[int]) -> int:
    curr = max_so_far = nums[0]
    for x in nums[1:]:
        curr = max(x, curr + x)
        max_so_far = max(max_so_far, curr)
    return max_so_far`
    },
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, isHidden: false },
      { input: [[1]], expected: 1, isHidden: false },
      { input: [[5, 4, -1, 7, 8]], expected: 23, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["At each element, decide whether to start a new subarray or extend the existing one."]
  },
  {
    id: "algo-infy-2",
    title: "Search in 2D Matrix II (Staircase Search)",
    slug: "infosys-search-matrix-ii",
    company: "Infosys",
    companyId: "infosys",
    companyLogo: "🔷",
    frequencyTag: "⭐ Infosys HackWithInfy Favorite Problem",
    difficulty: "MEDIUM",
    category: "Matrix & Two Pointers",
    tags: ["Infosys", "Matrix", "Two Pointers"],
    description: "Write an efficient algorithm that searches for a value `target` in an `m x n` integer matrix where integers in each row are sorted left to right, and integers in each column are sorted top to bottom in O(M + N) time.",
    examples: [
      { input: "matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5", output: "true" },
      { input: "matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20", output: "false" }
    ],
    starterCode: {
      javascript: `function searchMatrix(matrix, target) {
  if (!matrix.length || !matrix[0].length) return false;
  let r = 0, c = matrix[0].length - 1;
  while (r < matrix.length && c >= 0) {
    if (matrix[r][c] === target) return true;
    if (matrix[r][c] > target) c--;
    else r++;
  }
  return false;
}`,
      python: `def search_matrix(matrix: list[list[int]], target: int) -> bool:
    if not matrix or not matrix[0]: return False
    r, c = 0, len(matrix[0]) - 1
    while r < len(matrix) and c >= 0:
        if matrix[r][c] == target: return True
        if matrix[r][c] > target: c -= 1
        else: r += 1
    return False`
    },
    testCases: [
      { input: [[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 5], expected: true, isHidden: false },
      { input: [[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 20], expected: false, isHidden: false }
    ],
    timeComplexity: "O(M + N)",
    spaceComplexity: "O(1)",
    hints: ["Start at the top-right corner where elements to the left are smaller and elements below are larger."]
  },
  {
    id: "algo-infy-3",
    title: "Longest Palindromic Substring",
    slug: "infosys-longest-palindromic-substring",
    company: "Infosys",
    companyId: "infosys",
    companyLogo: "🔷",
    frequencyTag: "⭐ Infosys SP / DSE Advanced String Problem",
    difficulty: "MEDIUM",
    category: "Strings & Two Pointers",
    tags: ["Infosys", "String", "Palindrome"],
    description: "Given a string `s`, return the longest palindromic substring in `s` in O(1) extra space.",
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also valid.' },
      { input: 's = "cbbd"', output: '"bb"' }
    ],
    starterCode: {
      javascript: `function longestPalindrome(s) {
  if (s.length < 2) return s;
  let start = 0, maxLength = 1;
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > maxLength) {
        start = l;
        maxLength = r - l + 1;
      }
      l--;
      r++;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.substring(start, start + maxLength);
}`,
      python: `def longest_palindrome(s: str) -> str:
    if len(s) < 2: return s
    res = ""
    for i in range(len(s)):
        # Odd length
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > len(res): res = s[l:r+1]
            l -= 1; r += 1
        # Even length
        l, r = i, i + 1
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > len(res): res = s[l:r+1]
            l -= 1; r += 1
    return res`
    },
    testCases: [
      { input: ["babad"], expected: "bab", isHidden: false },
      { input: ["cbbd"], expected: "bb", isHidden: false },
      { input: ["a"], expected: "a", isHidden: true }
    ],
    timeComplexity: "O(N^2)",
    spaceComplexity: "O(1)",
    hints: ["Expand around center for both odd-length (i, i) and even-length (i, i+1) centers."]
  },
  {
    id: "algo-infy-4",
    title: "Coin Change Minimum Coins",
    slug: "infosys-coin-change",
    company: "Infosys",
    companyId: "infosys",
    companyLogo: "🔷",
    frequencyTag: "⭐ Infosys DP Coding Classic",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    tags: ["Infosys", "DP", "Knapsack"],
    description: "Given an integer array `coins` representing coins of different denominations and an integer `amount`, return the fewest number of coins needed to make up that amount. If impossible, return `-1`.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1." },
      { input: "coins = [2], amount = 3", output: "-1" }
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0) {
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`
    },
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3, isHidden: false },
      { input: [[2], 3], expected: -1, isHidden: false },
      { input: [[1], 0], expected: 0, isHidden: true }
    ],
    timeComplexity: "O(amount * len(coins))",
    spaceComplexity: "O(amount)",
    hints: ["Build bottom-up DP table where dp[i] is the minimum coins for amount i."]
  },
  {
    id: "algo-infy-5",
    title: "Climbing Stairs Combinations",
    slug: "infosys-climbing-stairs",
    company: "Infosys",
    companyId: "infosys",
    companyLogo: "🔷",
    frequencyTag: "⭐ Infosys Entry DP Question",
    difficulty: "EASY",
    category: "Dynamic Programming",
    tags: ["Infosys", "DP", "Fibonacci"],
    description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" }
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}`,
      python: `def climb_stairs(n: int) -> int:
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`
    },
    testCases: [
      { input: [2], expected: 2, isHidden: false },
      { input: [3], expected: 3, isHidden: false },
      { input: [5], expected: 8, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Notice that ways(n) = ways(n-1) + ways(n-2), exactly like the Fibonacci sequence."]
  },
  {
    id: "algo-infy-6",
    title: "Generate Subsets / Power Set",
    slug: "infosys-subsets",
    company: "Infosys",
    companyId: "infosys",
    companyLogo: "🔷",
    frequencyTag: "⭐ Infosys SP Backtracking Assessment",
    difficulty: "MEDIUM",
    category: "Backtracking & Recursion",
    tags: ["Infosys", "Backtracking", "Subsets"],
    description: "Given an integer array `nums` of unique elements, return all possible subsets (the power set) without duplicate subsets.",
    examples: [
      { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }
    ],
    starterCode: {
      javascript: `function subsets(nums) {
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
      python: `def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    def backtrack(start, curr):
        res.append(list(curr))
        for i in range(start, len(nums)):
            curr.append(nums[i])
            backtrack(i + 1, curr)
            curr.pop()
    backtrack(0, [])
    return res`
    },
    testCases: [
      { input: [[1, 2, 3]], expected: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]], isHidden: false },
      { input: [[0]], expected: [[], [0]], isHidden: false }
    ],
    timeComplexity: "O(N * 2^N)",
    spaceComplexity: "O(N)",
    hints: ["At each element, either include it in the current subset or exclude it."]
  },
  {
    id: "algo-infy-7",
    title: "Valid Parentheses Matching",
    slug: "infosys-valid-parentheses",
    company: "Infosys",
    companyId: "infosys",
    companyLogo: "🔷",
    frequencyTag: "⭐ Infosys Stack Standard Question",
    difficulty: "EASY",
    category: "Stacks",
    tags: ["Infosys", "Stack", "Easy"],
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ],
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if (c === '(' || c === '{' || c === '[') {
      stack.push(c);
    } else {
      if (stack.pop() !== map[c]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in '({[': stack.append(c)
        elif not stack or stack.pop() != mapping[c]: return False
    return not stack`
    },
    testCases: [
      { input: ["()"], expected: true, isHidden: false },
      { input: ["()[]{}"], expected: true, isHidden: false },
      { input: ["(]"], expected: false, isHidden: false },
      { input: ["([)]"], expected: false, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    hints: ["Push opening brackets on a Stack, pop and match when encountering closing brackets."]
  },
  {
    id: "algo-infy-8",
    title: "Find Peak Element in Array",
    slug: "infosys-find-peak-element",
    company: "Infosys",
    companyId: "infosys",
    companyLogo: "🔷",
    frequencyTag: "⭐ Infosys SP Binary Search Question",
    difficulty: "MEDIUM",
    category: "Binary Search",
    tags: ["Infosys", "Binary Search"],
    description: "A peak element is an element that is strictly greater than its neighbors. Given an integer array `nums`, find a peak element, and return its index in O(log N) time.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "2", explanation: "Index 2 has value 3 which is a peak." },
      { input: "nums = [1,2,1,3,5,6,4]", output: "5", explanation: "Index 5 has value 6 which is a peak." }
    ],
    starterCode: {
      javascript: `function findPeakElement(nums) {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] > nums[mid + 1]) r = mid;
    else l = mid + 1;
  }
  return l;
}`,
      python: `def find_peak_element(nums: list[int]) -> int:
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if nums[mid] > nums[mid + 1]: r = mid
        else: l = mid + 1
    return l`
    },
    testCases: [
      { input: [[1, 2, 3, 1]], expected: 2, isHidden: false },
      { input: [[1, 2, 1, 3, 5, 6, 4]], expected: 5, isHidden: false }
    ],
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    hints: ["If nums[mid] < nums[mid + 1], a peak must lie to the right."]
  },
  {
    id: "algo-infy-9",
    title: "Unique Paths in 2D Grid",
    slug: "infosys-unique-paths",
    company: "Infosys",
    companyId: "infosys",
    companyLogo: "🔷",
    frequencyTag: "⭐ Infosys DSE Grid DP",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    tags: ["Infosys", "DP", "Grid"],
    description: "There is a robot on an `m x n` grid. The robot can only move either down or right at any point in time. Return the number of possible unique paths to reach the bottom-right corner.",
    examples: [
      { input: "m = 3, n = 7", output: "28" },
      { input: "m = 3, n = 2", output: "3" }
    ],
    starterCode: {
      javascript: `function uniquePaths(m, n) {
  const row = new Array(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      row[c] += row[c - 1];
    }
  }
  return row[n - 1];
}`,
      python: `def unique_paths(m: int, n: int) -> int:
    row = [1] * n
    for r in range(1, m):
        for c in range(1, n):
            row[c] += row[c - 1]
    return row[-1]`
    },
    testCases: [
      { input: [3, 7], expected: 28, isHidden: false },
      { input: [3, 2], expected: 3, isHidden: false }
    ],
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(N)",
    hints: ["paths(r, c) = paths(r-1, c) + paths(r, c-1)."]
  },
  {
    id: "algo-infy-10",
    title: "Product of Array Except Self",
    slug: "infosys-product-except-self",
    company: "Infosys",
    companyId: "infosys",
    companyLogo: "🔷",
    frequencyTag: "⭐ Infosys SP Prefix Array Question",
    difficulty: "MEDIUM",
    category: "Arrays & Prefix Products",
    tags: ["Infosys", "Array", "Prefix Product"],
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all elements of `nums` except `nums[i]`, without using the division operator and in O(N) time.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" }
    ],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
  const n = nums.length;
  const res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let postfix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= postfix;
    postfix *= nums[i];
  }
  return res;
}`,
      python: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n
    pref = 1
    for i in range(n):
        res[i] = pref
        pref *= nums[i]
    post = 1
    for i in range(n - 1, -1, -1):
        res[i] *= post
        post *= nums[i]
    return res`
    },
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], isHidden: false },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], isHidden: false }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1) auxiliary",
    hints: ["Accumulate prefix products from the left, then multiply by postfix products from the right."]
  }
];
