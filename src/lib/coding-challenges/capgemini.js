// Capgemini Exceller & Senior Analyst Coding Challenges (10 Problems)
// Sourced from Capgemini CoCubes & Aon-CoCubes coding rounds, Capgemini Exceller track

export const CAPGEMINI_CODING_CHALLENGES = [
  {
    id: "algo-cap-1",
    title: "Merge Overlapping Intervals",
    slug: "capgemini-merge-intervals",
    company: "Capgemini",
    companyId: "capgemini",
    companyLogo: "🔷",
    frequencyTag: "⭐ Capgemini Exceller High-Frequency",
    difficulty: "MEDIUM",
    category: "Arrays & Sorting",
    tags: ["Capgemini", "Intervals", "Sorting", "Medium"],
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" }
    ],
    starterCode: {
      javascript: `function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`,
      python: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for cur in intervals[1:]:
        if cur[0] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], cur[1])
        else:
            merged.append(cur)
    return merged`
    },
    testCases: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], isHidden: false },
      { input: [[[1, 4], [4, 5]]], expected: [[1, 5]], isHidden: false },
      { input: [[[1, 4], [0, 4]]], expected: [[0, 4]], isHidden: true },
      { input: [[[1, 4], [2, 3]]], expected: [[1, 4]], isHidden: true }
    ],
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(N)",
    hints: ["Sort intervals by their start time first, then iterate and compare adjacent intervals."]
  },
  {
    id: "algo-cap-2",
    title: "Product of Array Except Self",
    slug: "capgemini-product-except-self",
    company: "Capgemini",
    companyId: "capgemini",
    companyLogo: "🔷",
    frequencyTag: "⭐ Capgemini Exceller Repeated PYQ",
    difficulty: "MEDIUM",
    category: "Arrays & Prefix Sum",
    tags: ["Capgemini", "Array", "Prefix Sum", "Medium"],
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. Solve it without division in O(N) time.",
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
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}`,
      python: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= suffix
        suffix *= nums[i]
    return res`
    },
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], isHidden: false },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], isHidden: false },
      { input: [[2, 3, 5, 0]], expected: [0, 0, 0, 30], isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1) extra space excluding output",
    hints: ["Calculate the prefix products in one forward pass and accumulate suffix products in a backward pass."]
  },
  {
    id: "algo-cap-3",
    title: "3Sum Triplet Target Zero",
    slug: "capgemini-three-sum",
    company: "Capgemini",
    companyId: "capgemini",
    companyLogo: "🔷",
    frequencyTag: "⭐ Capgemini CoCubes Coding Classic",
    difficulty: "MEDIUM",
    category: "Two Pointers & Sorting",
    tags: ["Capgemini", "Two Pointers", "Sorting", "Medium"],
    description: "Given an integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" }
    ],
    starterCode: {
      javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++;
        r--;
      } else if (sum < 0) {
        l++;
      } else {
        r--;
      }
    }
  }
  return res;
}`,
      python: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]: l += 1
                while l < r and nums[r] == nums[r - 1]: r -= 1
                l += 1; r -= 1
            elif s < 0:
                l += 1
            else:
                r -= 1
    return res`
    },
    testCases: [
      { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]], isHidden: false },
      { input: [[0, 1, 1]], expected: [], isHidden: false },
      { input: [[0, 0, 0]], expected: [[0, 0, 0]], isHidden: true }
    ],
    timeComplexity: "O(N^2)",
    spaceComplexity: "O(1) extra space",
    hints: ["Sort the array first. Fix one element and use the two-pointer technique on the rest of the array."]
  },
  {
    id: "algo-cap-4",
    title: "Next Permutation",
    slug: "capgemini-next-permutation",
    company: "Capgemini",
    companyId: "capgemini",
    companyLogo: "🔷",
    frequencyTag: "⭐ Capgemini Exceller Interview Problem",
    difficulty: "MEDIUM",
    category: "Arrays & Math",
    tags: ["Capgemini", "Array", "Permutation", "Medium"],
    description: "A permutation of an array of integers is an arrangement of its members into a sequence or linear order. Find the next lexicographically greater permutation in-place. If no greater permutation exists, rearrange it as the lowest possible order (sorted in ascending order).",
    examples: [
      { input: "nums = [1,2,3]", output: "[1,3,2]" },
      { input: "nums = [3,2,1]", output: "[1,2,3]" }
    ],
    starterCode: {
      javascript: `function nextPermutation(nums) {
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let l = i + 1, r = nums.length - 1;
  while (l < r) {
    [nums[l], nums[r]] = [nums[r], nums[l]];
    l++;
    r--;
  }
  return nums;
}`,
      python: `def next_permutation(nums: list[int]) -> list[int]:
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    nums[i + 1:] = reversed(nums[i + 1:])
    return nums`
    },
    testCases: [
      { input: [[1, 2, 3]], expected: [1, 3, 2], isHidden: false },
      { input: [[3, 2, 1]], expected: [1, 2, 3], isHidden: false },
      { input: [[1, 1, 5]], expected: [1, 5, 1], isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Find the first decreasing element from the right, swap it with the smallest element larger than it to its right, then reverse the remaining elements."]
  },
  {
    id: "algo-cap-5",
    title: "Rotate Matrix 90 Degrees Clockwise",
    slug: "capgemini-rotate-image",
    company: "Capgemini",
    companyId: "capgemini",
    companyLogo: "🔷",
    frequencyTag: "⭐ Capgemini Assessment Matrix Question",
    difficulty: "MEDIUM",
    category: "Matrix & Math",
    tags: ["Capgemini", "Matrix", "In-Place", "Medium"],
    description: "You are given an `n x n` 2D matrix representing an image, rotate the image by 90 degrees (clockwise) in-place without allocating another matrix.",
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" },
      { input: "matrix = [[5,1],[9,4]]", output: "[[9,5],[4,1]]" }
    ],
    starterCode: {
      javascript: `function rotateMatrix(matrix) {
  const n = matrix.length;
  // Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
  // Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
  return matrix;
}`,
      python: `def rotate_matrix(matrix: list[list[int]]) -> list[list[int]]:
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()
    return matrix`
    },
    testCases: [
      { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]], isHidden: false },
      { input: [[[5, 1], [9, 4]]], expected: [[9, 5], [4, 1]], isHidden: false },
      { input: [[[1]]], expected: [[1]], isHidden: true }
    ],
    timeComplexity: "O(N^2)",
    spaceComplexity: "O(1)",
    hints: ["Transpose the matrix along the main diagonal, then reverse each individual row."]
  },
  {
    id: "algo-cap-6",
    title: "Generate Valid Parentheses",
    slug: "capgemini-generate-parentheses",
    company: "Capgemini",
    companyId: "capgemini",
    companyLogo: "🔷",
    frequencyTag: "⭐ Capgemini Exceller Backtracking",
    difficulty: "MEDIUM",
    category: "Backtracking & Recursion",
    tags: ["Capgemini", "Backtracking", "Recursion", "Medium"],
    description: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    examples: [
      { input: "n = 3", output: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: "n = 1", output: '["()"]' }
    ],
    starterCode: {
      javascript: `function generateParenthesis(n) {
  const result = [];
  function backtrack(cur, open, close) {
    if (cur.length === 2 * n) {
      result.push(cur);
      return;
    }
    if (open < n) backtrack(cur + "(", open + 1, close);
    if (close < open) backtrack(cur + ")", open, close + 1);
  }
  backtrack("", 0, 0);
  return result;
}`,
      python: `def generate_parenthesis(n: int) -> list[str]:
    res = []
    def backtrack(cur, open_cnt, close_cnt):
        if len(cur) == 2 * n:
            res.append(cur)
            return
        if open_cnt < n:
            backtrack(cur + "(", open_cnt + 1, close_cnt)
        if close_cnt < open_cnt:
            backtrack(cur + ")", open_cnt, close_cnt + 1)
    backtrack("", 0, 0)
    return res`
    },
    testCases: [
      { input: [3], expected: ["((()))", "(()())", "(())()", "()(())", "()()()"], isHidden: false },
      { input: [1], expected: ["()"], isHidden: false },
      { input: [2], expected: ["(())", "()()"], isHidden: true }
    ],
    timeComplexity: "O(4^N / sqrt(N))",
    spaceComplexity: "O(N)",
    hints: ["Only add an opening bracket if open < n, and only add a closing bracket if close < open."]
  },
  {
    id: "algo-cap-7",
    title: "Find Minimum in Rotated Sorted Array",
    slug: "capgemini-find-min-rotated-sorted",
    company: "Capgemini",
    companyId: "capgemini",
    companyLogo: "🔷",
    frequencyTag: "⭐ Capgemini CoCubes Binary Search",
    difficulty: "MEDIUM",
    category: "Binary Search",
    tags: ["Capgemini", "Binary Search", "Array", "Medium"],
    description: "Suppose an array of length `n` sorted in ascending order is rotated between 1 and `n` times. Given the sorted rotated array `nums` of unique elements, return the minimum element in O(log n) runtime.",
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" }
    ],
    starterCode: {
      javascript: `function findMin(nums) {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] > nums[r]) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }
  return nums[l];
}`,
      python: `def find_min(nums: list[int]) -> int:
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if nums[mid] > nums[r]:
            l = mid + 1
        else:
            r = mid
    return nums[l]`
    },
    testCases: [
      { input: [[3, 4, 5, 1, 2]], expected: 1, isHidden: false },
      { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0, isHidden: false },
      { input: [[11, 13, 15, 17]], expected: 11, isHidden: true }
    ],
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    hints: ["Compare the middle element with the rightmost element. If mid > right, the min is in the right half."]
  },
  {
    id: "algo-cap-8",
    title: "Daily Temperatures Monotonic Stack",
    slug: "capgemini-daily-temperatures",
    company: "Capgemini",
    companyId: "capgemini",
    companyLogo: "🔷",
    frequencyTag: "⭐ Capgemini Exceller Stack PYQ",
    difficulty: "MEDIUM",
    category: "Stack & Monotonic",
    tags: ["Capgemini", "Stack", "Monotonic Stack", "Medium"],
    description: "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0`.",
    examples: [
      { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" },
      { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" }
    ],
    starterCode: {
      javascript: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const res = new Array(n).fill(0);
  const stack = []; // indices
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop();
      res[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }
  return res;
}`,
      python: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    res = [0] * n
    stack = []
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            prev = stack.pop()
            res[prev] = i - prev
        stack.append(i)
    return res`
    },
    testCases: [
      { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0], isHidden: false },
      { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0], isHidden: false },
      { input: [[30, 60, 90]], expected: [1, 1, 0], isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    hints: ["Maintain a monotonically decreasing stack of daily temperature indices."]
  },
  {
    id: "algo-cap-9",
    title: "Implement Queue using Two Stacks",
    slug: "capgemini-queue-using-stacks",
    company: "Capgemini",
    companyId: "capgemini",
    companyLogo: "🔷",
    frequencyTag: "⭐ Capgemini CoCubes System Design Basic",
    difficulty: "EASY",
    category: "Stack & Queue",
    tags: ["Capgemini", "Stack", "Queue", "Easy"],
    description: "Implement a FIFO queue using only two standard stacks. Provide simulation methods for a series of commands `['push', 'pop', 'peek', 'empty']` and return an array of outputs.",
    examples: [
      { input: 'operations = [["push", 1], ["push", 2], ["peek"], ["pop"], ["empty"]]', output: "[null, null, 1, 1, false]" }
    ],
    starterCode: {
      javascript: `function simulateQueueOps(operations) {
  const inStack = [];
  const outStack = [];
  const results = [];
  function push(x) { inStack.push(x); }
  function pop() {
    if (!outStack.length) while (inStack.length) outStack.push(inStack.pop());
    return outStack.pop();
  }
  function peek() {
    if (!outStack.length) while (inStack.length) outStack.push(inStack.pop());
    return outStack[outStack.length - 1];
  }
  function empty() {
    return inStack.length === 0 && outStack.length === 0;
  }
  for (const op of operations) {
    if (op[0] === 'push') { push(op[1]); results.push(null); }
    else if (op[0] === 'pop') results.push(pop());
    else if (op[0] === 'peek') results.push(peek());
    else if (op[0] === 'empty') results.push(empty());
  }
  return results;
}`,
      python: `def simulate_queue_ops(operations: list[list]) -> list:
    in_stk, out_stk, res = [], [], []
    for op in operations:
        name = op[0]
        if name == 'push':
            in_stk.append(op[1])
            res.append(None)
        elif name == 'pop':
            if not out_stk:
                while in_stk: out_stk.append(in_stk.pop())
            res.append(out_stk.pop())
        elif name == 'peek':
            if not out_stk:
                while in_stk: out_stk.append(in_stk.pop())
            res.append(out_stk[-1])
        elif name == 'empty':
            res.append(len(in_stk) == 0 and len(out_stk) == 0)
    return res`
    },
    testCases: [
      { input: [[["push", 1], ["push", 2], ["peek"], ["pop"], ["empty"]]], expected: [null, null, 1, 1, false], isHidden: false },
      { input: [[["push", 5], ["pop"], ["empty"]]], expected: [null, 5, true], isHidden: false },
      { input: [[["push", 10], ["push", 20], ["push", 30], ["pop"], ["peek"]]], expected: [null, null, null, 10, 20], isHidden: true }
    ],
    timeComplexity: "Amortized O(1) per operation",
    spaceComplexity: "O(N)",
    hints: ["Elements are pushed to inStack; on pop/peek, transfer from inStack to outStack if outStack is empty."]
  },
  {
    id: "algo-cap-10",
    title: "Subarray Sums Divisible by K",
    slug: "capgemini-subarray-sums-divisible-k",
    company: "Capgemini",
    companyId: "capgemini",
    companyLogo: "🔷",
    frequencyTag: "⭐ Capgemini Exceller Advanced Hash Table",
    difficulty: "MEDIUM",
    category: "Hash Table & Math",
    tags: ["Capgemini", "Prefix Sum", "Hash Table", "Medium"],
    description: "Given an integer array `nums` and an integer `k`, return the number of non-empty subarrays that have a sum divisible by `k`.",
    examples: [
      { input: "nums = [4,5,0,-2,-3,1], k = 5", output: "7" },
      { input: "nums = [5], k = 9", output: "0" }
    ],
    starterCode: {
      javascript: `function subarraysDivByK(nums, k) {
  const remainderCount = new Map();
  remainderCount.set(0, 1);
  let prefixSum = 0;
  let count = 0;
  for (const num of nums) {
    prefixSum += num;
    let rem = ((prefixSum % k) + k) % k;
    if (remainderCount.has(rem)) {
      count += remainderCount.get(rem);
    }
    remainderCount.set(rem, (remainderCount.get(rem) || 0) + 1);
  }
  return count;
}`,
      python: `def subarrays_div_by_k(nums: list[int], k: int) -> int:
    rem_count = {0: 1}
    prefix = 0
    count = 0
    for num in nums:
        prefix += num
        rem = prefix % k
        count += rem_count.get(rem, 0)
        rem_count[rem] = rem_count.get(rem, 0) + 1
    return count`
    },
    testCases: [
      { input: [[4, 5, 0, -2, -3, 1], 5], expected: 7, isHidden: false },
      { input: [[5], 9], expected: 0, isHidden: false },
      { input: [[-1, 2, 9], 2], expected: 2, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(K)",
    hints: ["Use prefix sums modulo k. Handle negative remainders by adding k before taking modulo."]
  }
];
