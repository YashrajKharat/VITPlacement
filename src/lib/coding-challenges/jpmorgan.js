// J.P. Morgan Code For Good (CFG) & Software Engineer Coding Challenges (10 Problems)
// Sourced from J.P. Morgan HackerRank OA & Superday Technical Interview Archives

export const JPMORGAN_CODING_CHALLENGES = [
  {
    id: "algo-jpm-1",
    title: "Best Time to Buy and Sell Stock I",
    slug: "jpmorgan-buy-sell-stock-1",
    company: "J.P. Morgan",
    companyId: "jpmorgan",
    companyLogo: "🏦",
    frequencyTag: "⭐ J.P. Morgan CFG & OA #1 Question",
    difficulty: "EASY",
    category: "Arrays & Dynamic Programming",
    tags: ["J.P. Morgan", "Finance", "Array", "Greedy", "Easy"],
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5" },
      { input: "prices = [7,6,4,3,1]", output: "0" }
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfitVal = 0;
  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfitVal) {
      maxProfitVal = price - minPrice;
    }
  }
  return maxProfitVal;
}`,
      python: `def max_profit(prices: list[int]) -> int:
    min_price = float('inf')
    max_p = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_p:
            max_p = price - min_price
    return max_p`
    },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5, isHidden: false },
      { input: [[7, 6, 4, 3, 1]], expected: 0, isHidden: false },
      { input: [[2, 4, 1]], expected: 2, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Keep track of the minimum price encountered so far and compute profit if sold today."]
  },
  {
    id: "algo-jpm-2",
    title: "Best Time to Buy and Sell Stock II (Multiple Trades)",
    slug: "jpmorgan-buy-sell-stock-2",
    company: "J.P. Morgan",
    companyId: "jpmorgan",
    companyLogo: "🏦",
    frequencyTag: "⭐ J.P. Morgan Quantitative Trading PYQ",
    difficulty: "MEDIUM",
    category: "Greedy & Arrays",
    tags: ["J.P. Morgan", "Finance", "Greedy", "Array", "Medium"],
    description: "You are given an integer array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can buy it then immediately sell the same day. Find and return the maximum profit you can achieve.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "7" },
      { input: "prices = [1,2,3,4,5]", output: "4" },
      { input: "prices = [7,6,4,3,1]", output: "0" }
    ],
    starterCode: {
      javascript: `function maxProfitMultiple(prices) {
  let totalProfit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      totalProfit += prices[i] - prices[i - 1];
    }
  }
  return totalProfit;
}`,
      python: `def max_profit_multiple(prices: list[int]) -> int:
    total_profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            total_profit += prices[i] - prices[i - 1]
    return total_profit`
    },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 7, isHidden: false },
      { input: [[1, 2, 3, 4, 5]], expected: 4, isHidden: false },
      { input: [[7, 6, 4, 3, 1]], expected: 0, isHidden: false },
      { input: [[2, 1, 2, 0, 1]], expected: 2, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Whenever prices[i] > prices[i-1], accumulate the positive delta immediately."]
  },
  {
    id: "algo-jpm-3",
    title: "Subarray Sum Equals K",
    slug: "jpmorgan-subarray-sum-equals-k",
    company: "J.P. Morgan",
    companyId: "jpmorgan",
    companyLogo: "🏦",
    frequencyTag: "⭐ J.P. Morgan HackerRank OA Classic",
    difficulty: "MEDIUM",
    category: "Prefix Sum & Hash Map",
    tags: ["J.P. Morgan", "Prefix Sum", "Hash Table", "Medium"],
    description: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
    examples: [
      { input: "nums = [1,1,1], k = 2", output: "2" },
      { input: "nums = [1,2,3], k = 3", output: "2" }
    ],
    starterCode: {
      javascript: `function subarraySumEqualsK(nums, k) {
  const prefixMap = new Map();
  prefixMap.set(0, 1);
  let sum = 0;
  let count = 0;
  for (const num of nums) {
    sum += num;
    if (prefixMap.has(sum - k)) {
      count += prefixMap.get(sum - k);
    }
    prefixMap.set(sum, (prefixMap.get(sum) || 0) + 1);
  }
  return count;
}`,
      python: `def subarray_sum_equals_k(nums: list[int], k: int) -> int:
    prefix_map = {0: 1}
    cur_sum = 0
    count = 0
    for num in nums:
        cur_sum += num
        count += prefix_map.get(cur_sum - k, 0)
        prefix_map[cur_sum] = prefix_map.get(cur_sum, 0) + 1
    return count`
    },
    testCases: [
      { input: [[1, 1, 1], 2], expected: 2, isHidden: false },
      { input: [[1, 2, 3], 3], expected: 2, isHidden: false },
      { input: [[1, -1, 0], 0], expected: 3, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    hints: ["Use a hash map to store counts of prefix sums. If (currentSum - k) was observed before, add its frequency."]
  },
  {
    id: "algo-jpm-4",
    title: "Gas Station Circular Tour",
    slug: "jpmorgan-gas-station",
    company: "J.P. Morgan",
    companyId: "jpmorgan",
    companyLogo: "🏦",
    frequencyTag: "⭐ J.P. Morgan Technical Interview High-Frequency",
    difficulty: "MEDIUM",
    category: "Greedy & Arrays",
    tags: ["J.P. Morgan", "Greedy", "Array", "Medium"],
    description: "There are `n` gas stations along a circular route, where the amount of gas at the `i-th` station is `gas[i]`. You have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i-th` station to its next `(i + 1)-th` station. Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return `-1`. If there exists a solution, it is guaranteed to be unique.",
    examples: [
      { input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", output: "3" },
      { input: "gas = [2,3,4], cost = [3,4,3]", output: "-1" }
    ],
    starterCode: {
      javascript: `function canCompleteCircuit(gas, cost) {
  let totalGas = 0, totalCost = 0;
  let currentTank = 0;
  let startIndex = 0;
  for (let i = 0; i < gas.length; i++) {
    totalGas += gas[i];
    totalCost += cost[i];
    currentTank += gas[i] - cost[i];
    if (currentTank < 0) {
      startIndex = i + 1;
      currentTank = 0;
    }
  }
  return totalGas >= totalCost ? startIndex : -1;
}`,
      python: `def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    if sum(gas) < sum(cost):
        return -1
    tank = 0
    start = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start`
    },
    testCases: [
      { input: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expected: 3, isHidden: false },
      { input: [[2, 3, 4], [3, 4, 3]], expected: -1, isHidden: false },
      { input: [[5, 1, 2, 3, 4], [4, 4, 1, 5, 1]], expected: 4, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["If total gas < total cost, it's impossible. Otherwise, whenever current tank drops below 0, reset start to next station."]
  },
  {
    id: "algo-jpm-5",
    title: "Decode Ways Financial Message",
    slug: "jpmorgan-decode-ways",
    company: "J.P. Morgan",
    companyId: "jpmorgan",
    companyLogo: "🏦",
    frequencyTag: "⭐ J.P. Morgan HackerRank OA Core DP",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    tags: ["J.P. Morgan", "Dynamic Programming", "String", "Medium"],
    description: "A message containing letters from A-Z can be encoded into numbers using mapping: 'A' -> '1', 'B' -> '2', ... 'Z' -> '26'. Given a string `s` containing only digits, return the number of ways to decode it.",
    examples: [
      { input: 's = "12"', output: "2" },
      { input: 's = "226"', output: "3" },
      { input: 's = "06"', output: "0" }
    ],
    starterCode: {
      javascript: `function numDecodings(s) {
  if (!s || s[0] === '0') return 0;
  const n = s.length;
  let prev2 = 1;
  let prev1 = 1;
  for (let i = 1; i < n; i++) {
    let current = 0;
    const oneDigit = parseInt(s[i], 10);
    const twoDigits = parseInt(s.slice(i - 1, i + 1), 10);
    if (oneDigit >= 1) current += prev1;
    if (twoDigits >= 10 && twoDigits <= 26) current += prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
      python: `def num_decodings(s: str) -> int:
    if not s or s[0] == '0':
        return 0
    prev2, prev1 = 1, 1
    for i in range(1, len(s)):
        cur = 0
        one = int(s[i])
        two = int(s[i-1:i+1])
        if one >= 1:
            cur += prev1
        if 10 <= two <= 26:
            cur += prev2
        prev2, prev1 = prev1, cur
    return prev1`
    },
    testCases: [
      { input: ["12"], expected: 2, isHidden: false },
      { input: ["226"], expected: 3, isHidden: false },
      { input: ["06"], expected: 0, isHidden: false },
      { input: ["10"], expected: 1, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Check valid single-digit decodings (1-9) and double-digit decodings (10-26). Transition like Fibonacci."]
  },
  {
    id: "algo-jpm-6",
    title: "Maximal Square in Binary Matrix",
    slug: "jpmorgan-maximal-square",
    company: "J.P. Morgan",
    companyId: "jpmorgan",
    companyLogo: "🏦",
    frequencyTag: "⭐ J.P. Morgan Superday Technical Round",
    difficulty: "MEDIUM",
    category: "Dynamic Programming & Matrix",
    tags: ["J.P. Morgan", "DP", "Matrix", "Medium"],
    description: "Given an `m x n` binary matrix filled with `0`s and `1`s, find the largest square containing only `1`s and return its area.",
    examples: [
      { input: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', output: "4" },
      { input: 'matrix = [["0","1"],["1","0"]]', output: "1" }
    ],
    starterCode: {
      javascript: `function maximalSquare(matrix) {
  if (!matrix.length || !matrix[0].length) return 0;
  const m = matrix.length, n = matrix[0].length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  let maxSide = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === '1' || matrix[r][c] === 1) {
        dp[r + 1][c + 1] = Math.min(dp[r][c + 1], dp[r + 1][c], dp[r][c]) + 1;
        maxSide = Math.max(maxSide, dp[r + 1][c + 1]);
      }
    }
  }
  return maxSide * maxSide;
}`,
      python: `def maximal_square(matrix: list[list[str]]) -> int:
    if not matrix or not matrix[0]:
        return 0
    m, n = len(matrix), len(matrix[0])
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    max_side = 0
    for r in range(m):
        for c in range(n):
            if str(matrix[r][c]) == '1':
                dp[r+1][c+1] = min(dp[r][c+1], dp[r+1][c], dp[r][c]) + 1
                max_side = max(max_side, dp[r+1][c+1])
    return max_side * max_side`
    },
    testCases: [
      { input: [[["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]]], expected: 4, isHidden: false },
      { input: [[["0", "1"], ["1", "0"]]], expected: 1, isHidden: false },
      { input: [[["0"]]], expected: 0, isHidden: true }
    ],
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(M * N)",
    hints: ["dp[i][j] represents side length of maximum square with bottom-right corner at (i-1, j-1). dp[i][j] = min(top, left, diagonal) + 1."]
  },
  {
    id: "algo-jpm-7",
    title: "Minimum Path Sum in Grid",
    slug: "jpmorgan-minimum-path-sum",
    company: "J.P. Morgan",
    companyId: "jpmorgan",
    companyLogo: "🏦",
    frequencyTag: "⭐ J.P. Morgan HackerRank OA Classic",
    difficulty: "MEDIUM",
    category: "Dynamic Programming & Grid",
    tags: ["J.P. Morgan", "DP", "Matrix", "Medium"],
    description: "Given a `m x n` grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.",
    examples: [
      { input: "grid = [[1,3,1],[1,5,1],[4,2,1]]", output: "7" },
      { input: "grid = [[1,2,3],[4,5,6]]", output: "12" }
    ],
    starterCode: {
      javascript: `function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = grid[0][0];
  for (let c = 1; c < n; c++) dp[0][c] = dp[0][c - 1] + grid[0][c];
  for (let r = 1; r < m; r++) dp[r][0] = dp[r - 1][0] + grid[r][0];
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[r][c] = Math.min(dp[r - 1][c], dp[r][c - 1]) + grid[r][c];
    }
  }
  return dp[m - 1][n - 1];
}`,
      python: `def min_path_sum(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    for c in range(1, n): dp[0][c] = dp[0][c-1] + grid[0][c]
    for r in range(1, m): dp[r][0] = dp[r-1][0] + grid[r][0]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = min(dp[r-1][c], dp[r][c-1]) + grid[r][c]
    return dp[m-1][n-1]`
    },
    testCases: [
      { input: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], expected: 7, isHidden: false },
      { input: [[[1, 2, 3], [4, 5, 6]]], expected: 12, isHidden: false },
      { input: [[[5]]], expected: 5, isHidden: true }
    ],
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(M * N)",
    hints: ["Initialize first row and first column. For cell (r, c), path sum is grid[r][c] + min(dp[r-1][c], dp[r][c-1])."]
  },
  {
    id: "algo-jpm-8",
    title: "Next Greater Element I",
    slug: "jpmorgan-next-greater-element",
    company: "J.P. Morgan",
    companyId: "jpmorgan",
    companyLogo: "🏦",
    frequencyTag: "⭐ J.P. Morgan OA Monotonic Stack",
    difficulty: "EASY",
    category: "Stack & Monotonic",
    tags: ["J.P. Morgan", "Stack", "Monotonic Stack", "Easy"],
    description: "The next greater element of some element `x` in an array is the first greater element that is to the right of `x` in the same array. You are given two 0-indexed integer arrays `nums1` and `nums2` where `nums1` is a subset of `nums2`. For each `0 <= i < nums1.length`, find the index `j` such that `nums1[i] == nums2[j]` and determine the next greater element of `nums2[j]` in `nums2`. If there is no next greater element, then the answer for this query is `-1`. Return an array `ans` of length `nums1.length`.",
    examples: [
      { input: "nums1 = [4,1,2], nums2 = [1,3,4,2]", output: "[-1,3,-1]" },
      { input: "nums1 = [2,4], nums2 = [1,2,3,4]", output: "[3,-1]" }
    ],
    starterCode: {
      javascript: `function nextGreaterElement(nums1, nums2) {
  const map = new Map();
  const stack = [];
  for (const num of nums2) {
    while (stack.length && stack[stack.length - 1] < num) {
      map.set(stack.pop(), num);
    }
    stack.push(num);
  }
  return nums1.map(x => map.has(x) ? map.get(x) : -1);
}`,
      python: `def next_greater_element(nums1: list[int], nums2: list[int]) -> list[int]:
    mapping = {}
    stack = []
    for num in nums2:
        while stack and stack[-1] < num:
            mapping[stack.pop()] = num
        stack.append(num)
    return [mapping.get(x, -1) for x in nums1]`
    },
    testCases: [
      { input: [[4, 1, 2], [1, 3, 4, 2]], expected: [-1, 3, -1], isHidden: false },
      { input: [[2, 4], [1, 2, 3, 4]], expected: [3, -1], isHidden: false },
      { input: [[1, 3, 5, 2, 4], [6, 5, 4, 3, 2, 1, 7]], expected: [7, 7, 7, 7, 7], isHidden: true }
    ],
    timeComplexity: "O(nums1.length + nums2.length)",
    spaceComplexity: "O(nums2.length)",
    hints: ["Use a monotonic decreasing stack over nums2 and store next greater element in a map."]
  },
  {
    id: "algo-jpm-9",
    title: "Network Latency Delay Time (Dijkstra)",
    slug: "jpmorgan-network-delay-time",
    company: "J.P. Morgan",
    companyId: "jpmorgan",
    companyLogo: "🏦",
    frequencyTag: "⭐ J.P. Morgan High-Frequency Graph Problem",
    difficulty: "MEDIUM",
    category: "Graph & Shortest Path",
    tags: ["J.P. Morgan", "Graph", "Dijkstra", "Shortest Path", "Medium"],
    description: "You are given a network of `n` nodes, labeled from `1` to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = (u_i, v_i, w_i)`, where `u_i` is the source node, `v_i` is the target node, and `w_i` is the time it takes for a signal to travel from source to target. We will send a signal from a given node `k`. Return the minimum time it takes for all the `n` nodes to receive the signal. If it is impossible for all the `n` nodes to receive the signal, return `-1`.",
    examples: [
      { input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", output: "2" },
      { input: "times = [[1,2,1]], n = 2, k = 1", output: "1" },
      { input: "times = [[1,2,1]], n = 2, k = 2", output: "-1" }
    ],
    starterCode: {
      javascript: `function networkDelayTime(times, n, k) {
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  // Bellman-Ford / Relaxation approach for simplicity
  for (let i = 1; i < n; i++) {
    for (const [u, v, w] of times) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  let maxTime = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    maxTime = Math.max(maxTime, dist[i]);
  }
  return maxTime;
}`,
      python: `def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    for _ in range(n - 1):
        for u, v, w in times:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    ans = max(dist[1:])
    return ans if ans != float('inf') else -1`
    },
    testCases: [
      { input: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2, isHidden: false },
      { input: [[[1, 2, 1]], 2, 1], expected: 1, isHidden: false },
      { input: [[[1, 2, 1]], 2, 2], expected: -1, isHidden: false }
    ],
    timeComplexity: "O(N * E)",
    spaceComplexity: "O(N)",
    hints: ["Find shortest paths from source k to all nodes using Dijkstra or Bellman-Ford relaxation. Return max distance."]
  },
  {
    id: "algo-jpm-10",
    title: "Coin Change II (Combinations Count)",
    slug: "jpmorgan-coin-change-2",
    company: "J.P. Morgan",
    companyId: "jpmorgan",
    companyLogo: "🏦",
    frequencyTag: "⭐ J.P. Morgan OA Unbounded Knapsack",
    difficulty: "MEDIUM",
    category: "Dynamic Programming",
    tags: ["J.P. Morgan", "Dynamic Programming", "Knapsack", "Medium"],
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return 0. You may assume that you have an infinite number of each kind of coin.",
    examples: [
      { input: "amount = 5, coins = [1,2,5]", output: "4" },
      { input: "amount = 3, coins = [2]", output: "0" },
      { input: "amount = 10, coins = [10]", output: "1" }
    ],
    starterCode: {
      javascript: `function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] += dp[i - coin];
    }
  }
  return dp[amount];
}`,
      python: `def change(amount: int, coins: list[int]) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    return dp[amount]`
    },
    testCases: [
      { input: [5, [1, 2, 5]], expected: 4, isHidden: false },
      { input: [3, [2]], expected: 0, isHidden: false },
      { input: [10, [10]], expected: 1, isHidden: true }
    ],
    timeComplexity: "O(amount * coins.length)",
    spaceComplexity: "O(amount)",
    hints: ["Iterate through each coin first, then update amounts from coin to amount. This avoids counting permutations."]
  }
];
