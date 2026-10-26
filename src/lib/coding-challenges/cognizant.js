// Cognizant GenC, GenC Elevate & GenC Next Coding Challenges (10 Problems)
// Sourced from Cognizant AMCAT Automata & GenC Next Hackathons

export const COGNIZANT_CODING_CHALLENGES = [
  {
    id: "algo-cog-1",
    title: "Jump Game Reachability",
    slug: "cognizant-jump-game",
    company: "Cognizant",
    companyId: "cognizant",
    companyLogo: "⚡",
    frequencyTag: "⭐ Cognizant GenC Next Top Repeated",
    difficulty: "MEDIUM",
    category: "Greedy & Arrays",
    tags: ["Cognizant", "Greedy", "Dynamic Programming", "Medium"],
    description: "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true" },
      { input: "nums = [3,2,1,0,4]", output: "false" }
    ],
    starterCode: {
      javascript: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  return true;
}`,
      python: `def can_jump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
        if max_reach >= len(nums) - 1:
            return True
    return True`
    },
    testCases: [
      { input: [[2, 3, 1, 1, 4]], expected: true, isHidden: false },
      { input: [[3, 2, 1, 0, 4]], expected: false, isHidden: false },
      { input: [[0]], expected: true, isHidden: true },
      { input: [[2, 0, 0]], expected: true, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Keep track of the furthest reachable index at any step. If your current position exceeds maxReach, return false."]
  },
  {
    id: "algo-cog-2",
    title: "House Robber Maximum Loot",
    slug: "cognizant-house-robber",
    company: "Cognizant",
    companyId: "cognizant",
    companyLogo: "⚡",
    frequencyTag: "⭐ Cognizant GenC Elevate DP Standard",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    tags: ["Cognizant", "Dynamic Programming", "Array", "Medium"],
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected and will automatically contact the police if two adjacent houses were broken into on the same night. Return the maximum amount of money you can rob tonight without alerting the police.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "4" },
      { input: "nums = [2,7,9,3,1]", output: "12" }
    ],
    starterCode: {
      javascript: `function rob(nums) {
  if (!nums.length) return 0;
  if (nums.length === 1) return nums[0];
  let prev2 = 0;
  let prev1 = 0;
  for (const num of nums) {
    const current = Math.max(prev1, prev2 + num);
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
      python: `def rob(nums: list[int]) -> int:
    prev2, prev1 = 0, 0
    for num in nums:
        cur = max(prev1, prev2 + num)
        prev2, prev1 = prev1, cur
    return prev1`
    },
    testCases: [
      { input: [[1, 2, 3, 1]], expected: 4, isHidden: false },
      { input: [[2, 7, 9, 3, 1]], expected: 12, isHidden: false },
      { input: [[2, 1, 1, 2]], expected: 4, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["For each house i, the max profit is max(rob(i-1), rob(i-2) + nums[i])."]
  },
  {
    id: "algo-cog-3",
    title: "Longest Consecutive Sequence",
    slug: "cognizant-longest-consecutive-sequence",
    company: "Cognizant",
    companyId: "cognizant",
    companyLogo: "⚡",
    frequencyTag: "⭐ Cognizant GenC Next Coding Round",
    difficulty: "MEDIUM",
    category: "Hash Table & Arrays",
    tags: ["Cognizant", "Hash Table", "Array", "Medium"],
    description: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4" },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" }
    ],
    starterCode: {
      javascript: `function longestConsecutive(nums) {
  if (!nums.length) return 0;
  const numSet = new Set(nums);
  let longest = 0;
  for (const num of numSet) {
    // Only check if num is the start of a streak
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;
      while (numSet.has(currentNum + 1)) {
        currentNum += 1;
        currentStreak += 1;
      }
      longest = Math.max(longest, currentStreak);
    }
  }
  return longest;
}`,
      python: `def longest_consecutive(nums: list[int]) -> int:
    num_set = set(nums)
    longest = 0
    for num in num_set:
        if num - 1 not in num_set:
            cur = num
            streak = 1
            while cur + 1 in num_set:
                cur += 1
                streak += 1
            longest = max(longest, streak)
    return longest`
    },
    testCases: [
      { input: [[100, 4, 200, 1, 3, 2]], expected: 4, isHidden: false },
      { input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9, isHidden: false },
      { input: [[]], expected: 0, isHidden: true },
      { input: [[1, 2, 0, 1]], expected: 3, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    hints: ["Store numbers in a Set. Only initiate streak counting from elements where num - 1 is absent from the Set."]
  },
  {
    id: "algo-cog-4",
    title: "Valid Palindrome II (At Most One Deletion)",
    slug: "cognizant-valid-palindrome-ii",
    company: "Cognizant",
    companyId: "cognizant",
    companyLogo: "⚡",
    frequencyTag: "⭐ Cognizant AMCAT Automata Repeated",
    difficulty: "EASY",
    category: "Two Pointers & Strings",
    tags: ["Cognizant", "Two Pointers", "String", "Easy"],
    description: "Given a string `s`, return `true` if the `s` can be palindrome after deleting at most one character from it.",
    examples: [
      { input: 's = "aba"', output: "true" },
      { input: 's = "abca"', output: "true" },
      { input: 's = "abc"', output: "false" }
    ],
    starterCode: {
      javascript: `function validPalindrome(s) {
  function isPal(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) {
      return isPal(l + 1, r) || isPal(l, r - 1);
    }
    l++;
    r--;
  }
  return true;
}`,
      python: `def valid_palindrome(s: str) -> bool:
    def is_pal(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return is_pal(l + 1, r) or is_pal(l, r - 1)
        l += 1
        r -= 1
    return True`
    },
    testCases: [
      { input: ["aba"], expected: true, isHidden: false },
      { input: ["abca"], expected: true, isHidden: false },
      { input: ["abc"], expected: false, isHidden: false },
      { input: ["deeee"], expected: true, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Use two pointers moving inward. When characters mismatch, check if skipping either the left or right character creates a valid palindrome."]
  },
  {
    id: "algo-cog-5",
    title: "Word Search in 2D Character Grid",
    slug: "cognizant-word-search",
    company: "Cognizant",
    companyId: "cognizant",
    companyLogo: "⚡",
    frequencyTag: "⭐ Cognizant GenC Next Backtracking",
    difficulty: "MEDIUM",
    category: "Backtracking & Matrix",
    tags: ["Cognizant", "Backtracking", "Matrix", "DFS", "Medium"],
    description: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: "true" },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: "true" },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: "false" }
    ],
    starterCode: {
      javascript: `function exist(board, word) {
  const m = board.length, n = board[0].length;
  function dfs(r, c, idx) {
    if (idx === word.length) return true;
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;
    const temp = board[r][c];
    board[r][c] = '#'; // mark visited
    const found = dfs(r + 1, c, idx + 1) ||
                  dfs(r - 1, c, idx + 1) ||
                  dfs(r, c + 1, idx + 1) ||
                  dfs(r, c - 1, idx + 1);
    board[r][c] = temp; // backtrack
    return found;
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
      python: `def exist(board: list[list[str]], word: str) -> bool:
    m, n = len(board), len(board[0])
    def dfs(r, c, idx):
        if idx == len(word):
            return True
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != word[idx]:
            return False
        temp = board[r][c]
        board[r][c] = '#'
        found = (dfs(r + 1, c, idx + 1) or
                 dfs(r - 1, c, idx + 1) or
                 dfs(r, c + 1, idx + 1) or
                 dfs(r, c - 1, idx + 1))
        board[r][c] = temp
        return found
    for r in range(m):
        for c in range(n):
            if dfs(r, c, 0):
                return True
    return False`
    },
    testCases: [
      { input: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"], expected: true, isHidden: false },
      { input: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE"], expected: true, isHidden: false },
      { input: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"], expected: false, isHidden: true }
    ],
    timeComplexity: "O(M * N * 4^L)",
    spaceComplexity: "O(L)",
    hints: ["Use depth-first search with backtracking. Mark visited cells temporarily and restore them when returning."]
  },
  {
    id: "algo-cog-6",
    title: "Letter Combinations of a Phone Number",
    slug: "cognizant-letter-combinations-phone",
    company: "Cognizant",
    companyId: "cognizant",
    companyLogo: "⚡",
    frequencyTag: "⭐ Cognizant GenC Elevate Backtracking",
    difficulty: "MEDIUM",
    category: "Backtracking & Recursion",
    tags: ["Cognizant", "Backtracking", "String", "Medium"],
    description: "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. The mapping is traditional telephone keypad digits (2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz').",
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: 'digits = ""', output: "[]" }
    ],
    starterCode: {
      javascript: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const map = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
  };
  const res = [];
  function backtrack(index, cur) {
    if (index === digits.length) {
      res.push(cur);
      return;
    }
    const letters = map[digits[index]];
    for (const char of letters) {
      backtrack(index + 1, cur + char);
    }
  }
  backtrack(0, "");
  return res;
}`,
      python: `def letter_combinations(digits: str) -> list[str]:
    if not digits:
        return []
    mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    res = []
    def backtrack(idx, cur):
        if idx == len(digits):
            res.append(cur)
            return
        for char in mapping[digits[idx]]:
            backtrack(idx + 1, cur + char)
    backtrack(0, "")
    return res`
    },
    testCases: [
      { input: ["23"], expected: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"], isHidden: false },
      { input: [""], expected: [], isHidden: false },
      { input: ["2"], expected: ["a", "b", "c"], isHidden: true }
    ],
    timeComplexity: "O(4^N)",
    spaceComplexity: "O(N)",
    hints: ["Use recursion with an index tracking which digit is currently being expanded."]
  },
  {
    id: "algo-cog-7",
    title: "Coin Change Minimum Coins",
    slug: "cognizant-coin-change",
    company: "Cognizant",
    companyId: "cognizant",
    companyLogo: "⚡",
    frequencyTag: "⭐ Cognizant GenC Next Core DP",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    tags: ["Cognizant", "DP", "Greedy vs DP", "Medium"],
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3" },
      { input: "coins = [2], amount = 3", output: "-1" },
      { input: "coins = [1], amount = 0", output: "0" }
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
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
    timeComplexity: "O(amount * coins.length)",
    spaceComplexity: "O(amount)",
    hints: ["Build a dp array where dp[i] is the minimum coins needed for amount i."]
  },
  {
    id: "algo-cog-8",
    title: "Group Anagrams by Signature",
    slug: "cognizant-group-anagrams",
    company: "Cognizant",
    companyId: "cognizant",
    companyLogo: "⚡",
    frequencyTag: "⭐ Cognizant GenC Elevate String Question",
    difficulty: "MEDIUM",
    category: "Hash Table & Strings",
    tags: ["Cognizant", "Hash Table", "String", "Medium"],
    description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' }
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(s);
  }
  return Array.from(map.values());
}`,
      python: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strs:
        key = "".join(sorted(s))
        groups[key].append(s)
    return list(groups.values())`
    },
    testCases: [
      { input: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]], isHidden: false },
      { input: [[""]], expected: [[""]], isHidden: false },
      { input: [["a"]], expected: [["a"]], isHidden: true }
    ],
    timeComplexity: "O(N * K log K)",
    spaceComplexity: "O(N * K)",
    hints: ["Use the sorted version of each string as the key in a hash map."]
  },
  {
    id: "algo-cog-9",
    title: "Maximum Product Subarray",
    slug: "cognizant-max-product-subarray",
    company: "Cognizant",
    companyId: "cognizant",
    companyLogo: "⚡",
    frequencyTag: "⭐ Cognizant GenC Next Math / DP",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    tags: ["Cognizant", "Array", "Dynamic Programming", "Medium"],
    description: "Given an integer array `nums`, find a subarray that has the largest product, and return the product.",
    examples: [
      { input: "nums = [2,3,-2,4]", output: "6" },
      { input: "nums = [-2,0,-1]", output: "0" }
    ],
    starterCode: {
      javascript: `function maxProduct(nums) {
  if (!nums.length) return 0;
  let maxProd = nums[0];
  let minProd = nums[0];
  let result = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    if (num < 0) {
      const temp = maxProd;
      maxProd = minProd;
      minProd = temp;
    }
    maxProd = Math.max(num, maxProd * num);
    minProd = Math.min(num, minProd * num);
    result = Math.max(result, maxProd);
  }
  return result;
}`,
      python: `def max_product(nums: list[int]) -> int:
    if not nums:
        return 0
    max_p = min_p = res = nums[0]
    for num in nums[1:]:
        if num < 0:
            max_p, min_p = min_p, max_p
        max_p = max(num, max_p * num)
        min_p = min(num, min_p * num)
        res = max(res, max_p)
    return res`
    },
    testCases: [
      { input: [[2, 3, -2, 4]], expected: 6, isHidden: false },
      { input: [[-2, 0, -1]], expected: 0, isHidden: false },
      { input: [[-2, 3, -4]], expected: 24, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["A negative number can flip the minimum product into the maximum product. Track both min and max products."]
  },
  {
    id: "algo-cog-10",
    title: "Spiral Matrix Traversal Order",
    slug: "cognizant-spiral-matrix",
    company: "Cognizant",
    companyId: "cognizant",
    companyLogo: "⚡",
    frequencyTag: "⭐ Cognizant AMCAT Automata Matrix PYQ",
    difficulty: "MEDIUM",
    category: "Matrix & Simulation",
    tags: ["Cognizant", "Matrix", "Simulation", "Medium"],
    description: "Given an `m x n` matrix, return all elements of the matrix in spiral order.",
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" },
      { input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", output: "[1,2,3,4,8,12,11,10,9,5,6,7]" }
    ],
    starterCode: {
      javascript: `function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const res = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    // Traverse right
    for (let c = left; c <= right; c++) res.push(matrix[top][c]);
    top++;
    // Traverse down
    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      // Traverse left
      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      // Traverse up
      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);
      left++;
    }
  }
  return res;
}`,
      python: `def spiral_order(matrix: list[list[int]]) -> list[int]:
    if not matrix:
        return []
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            res.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            res.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                res.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                res.append(matrix[r][left])
            left += 1
    return res`
    },
    testCases: [
      { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5], isHidden: false },
      { input: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7], isHidden: false },
      { input: [[[1]]], expected: [1], isHidden: true }
    ],
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(1) extra space excluding result",
    hints: ["Keep 4 boundary pointers (top, bottom, left, right) and shrink them inward after each direction traversal."]
  }
];
