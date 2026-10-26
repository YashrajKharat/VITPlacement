// Accenture Advanced Technical Authentic Coding Challenges (10 Problems)
// Sourced from CoCubes, Wheebox, and Accenture Technical Assessment archives

export const ACCENTURE_CODING_CHALLENGES = [
  {
    id: "algo-acc-1",
    title: "Single Number (XOR Bitwise Elimination)",
    slug: "accenture-single-number",
    company: "Accenture",
    companyId: "accenture",
    companyLogo: "⚡",
    frequencyTag: "⭐ Repeated 12+ Times in Accenture Coding Tests",
    difficulty: "EASY",
    category: "Bit Manipulation",
    tags: ["Accenture", "Bitwise", "Easy"],
    description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one in O(N) linear runtime and O(1) space.",
    examples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" }
    ],
    starterCode: {
      javascript: `function singleNumber(nums) {
  let ans = 0;
  for (const n of nums) ans ^= n;
  return ans;
}`,
      python: `def single_number(nums: list[int]) -> int:
    ans = 0
    for n in nums: ans ^= n
    return ans`
    },
    testCases: [
      { input: [[2, 2, 1]], expected: 1, isHidden: false },
      { input: [[4, 1, 2, 1, 2]], expected: 4, isHidden: false },
      { input: [[1]], expected: 1, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Bitwise XORing a number with itself cancels it to 0 (`a ^ a = 0`)."]
  },
  {
    id: "algo-acc-2",
    title: "Palindrome Number (Without String Conversion)",
    slug: "accenture-palindrome-number",
    company: "Accenture",
    companyId: "accenture",
    companyLogo: "⚡",
    frequencyTag: "⭐ Classic Accenture Technical Screening MCQ/Code",
    difficulty: "EASY",
    category: "Math",
    tags: ["Accenture", "Math", "Easy"],
    description: "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise without converting the integer to a string.",
    examples: [
      { input: "x = 121", output: "true" },
      { input: "x = -121", output: "false" }
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let reverted = 0;
  while (x > reverted) {
    reverted = reverted * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === reverted || x === Math.floor(reverted / 10);
}`,
      python: `def is_palindrome(x: int) -> bool:
    if x < 0 or (x % 10 == 0 and x != 0): return False
    rev = 0
    while x > rev:
        rev = rev * 10 + x % 10
        x //= 10
    return x == rev or x == rev // 10`
    },
    testCases: [
      { input: [121], expected: true, isHidden: false },
      { input: [-121], expected: false, isHidden: false },
      { input: [10], expected: false, isHidden: true }
    ],
    timeComplexity: "O(log10(X))",
    spaceComplexity: "O(1)",
    hints: ["Reverse the second half of the number and compare with the first half."]
  },
  {
    id: "algo-acc-3",
    title: "First Unique Character in a String",
    slug: "accenture-first-unique-char",
    company: "Accenture",
    companyId: "accenture",
    companyLogo: "⚡",
    frequencyTag: "⭐ Accenture String Coding Standard",
    difficulty: "EASY",
    category: "Strings & Hash Maps",
    tags: ["Accenture", "String", "Hash Table"],
    description: "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.",
    examples: [
      { input: 's = "leetcode"', output: "0" },
      { input: 's = "loveleetcode"', output: "2" },
      { input: 's = "aabb"', output: "-1" }
    ],
    starterCode: {
      javascript: `function firstUniqChar(s) {
  const counts = {};
  for (const c of s) counts[c] = (counts[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (counts[s[i]] === 1) return i;
  }
  return -1;
}`,
      python: `def first_uniq_char(s: str) -> int:
    import collections
    count = collections.Counter(s)
    for i, c in enumerate(s):
        if count[c] == 1: return i
    return -1`
    },
    testCases: [
      { input: ["leetcode"], expected: 0, isHidden: false },
      { input: ["loveleetcode"], expected: 2, isHidden: false },
      { input: ["aabb"], expected: -1, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1) (26 letters)",
    hints: ["Two-pass approach: count frequencies first, then scan from index 0 for frequency 1."]
  },
  {
    id: "algo-acc-4",
    title: "Majority Element (Boyer-Moore Voting)",
    slug: "accenture-majority-element",
    company: "Accenture",
    companyId: "accenture",
    companyLogo: "⚡",
    frequencyTag: "⭐ Accenture OA Boyer-Moore Classic",
    difficulty: "EASY",
    category: "Arrays & Boyer-Moore",
    tags: ["Accenture", "Array", "Boyer-Moore"],
    description: "Given an array `nums` of size `n`, return the majority element that appears more than `⌊n / 2⌋` times in O(N) time and O(1) space.",
    examples: [
      { input: "nums = [3,2,3]", output: "3" },
      { input: "nums = [2,2,1,1,1,2,2]", output: "2" }
    ],
    starterCode: {
      javascript: `function majorityElement(nums) {
  let candidate = nums[0], count = 0;
  for (const n of nums) {
    if (count === 0) candidate = n;
    count += (n === candidate) ? 1 : -1;
  }
  return candidate;
}`,
      python: `def majority_element(nums: list[int]) -> int:
    cand, count = nums[0], 0
    for n in nums:
        if count == 0: cand = n
        count += 1 if n == cand else -1
    return cand`
    },
    testCases: [
      { input: [[3, 2, 3]], expected: 3, isHidden: false },
      { input: [[2, 2, 1, 1, 1, 2, 2]], expected: 2, isHidden: false }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Use the Boyer-Moore Voting Algorithm tracking a candidate and a counter."]
  },
  {
    id: "algo-acc-5",
    title: "Remove Duplicates from Sorted Array",
    slug: "accenture-remove-duplicates",
    company: "Accenture",
    companyId: "accenture",
    companyLogo: "⚡",
    frequencyTag: "⭐ Accenture In-Place Array Problem",
    difficulty: "EASY",
    category: "Two Pointers",
    tags: ["Accenture", "Two Pointers", "Array"],
    description: "Given an integer array `nums` sorted in non-decreasing order, remove duplicates in-place such that each unique element appears only once. Return the number of unique elements `k`.",
    examples: [
      { input: "nums = [1,1,2]", output: "2" },
      { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5" }
    ],
    starterCode: {
      javascript: `function removeDuplicates(nums) {
  if (!nums.length) return 0;
  let insert = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[insert] = nums[i];
      insert++;
    }
  }
  return insert;
}`,
      python: `def remove_duplicates(nums: list[int]) -> int:
    if not nums: return 0
    insert = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[i - 1]:
            nums[insert] = nums[i]
            insert += 1
    return insert`
    },
    testCases: [
      { input: [[1, 1, 2]], expected: 2, isHidden: false },
      { input: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5, isHidden: false }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Maintain a pointer for where the next unique element should be written."]
  },
  {
    id: "algo-acc-6",
    title: "Binary Search Standard",
    slug: "accenture-binary-search",
    company: "Accenture",
    companyId: "accenture",
    companyLogo: "⚡",
    frequencyTag: "⭐ Core Accenture Assessment Standard",
    difficulty: "EASY",
    category: "Binary Search",
    tags: ["Accenture", "Binary Search", "Easy"],
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, search `target` in `nums`. If `target` exists, return its index. Otherwise, return `-1` in O(log N) time.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }
    ],
    starterCode: {
      javascript: `function binarySearch(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor(l + (r - l) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}`,
      python: `def binary_search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = l + (r - l) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: l = mid + 1
        else: r = mid - 1
    return -1`
    },
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, isHidden: false },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, isHidden: false }
    ],
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    hints: ["Calculate mid as l + (r - l) / 2 to avoid overflow."]
  },
  {
    id: "algo-acc-7",
    title: "Missing Number in Array Range [0, n]",
    slug: "accenture-missing-number",
    company: "Accenture",
    companyId: "accenture",
    companyLogo: "⚡",
    frequencyTag: "⭐ Frequent Accenture Cognitive/Coding Problem",
    difficulty: "EASY",
    category: "Math & Bit Manipulation",
    tags: ["Accenture", "Math", "Bitwise"],
    description: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
    examples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" }
    ],
    starterCode: {
      javascript: `function missingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}`,
      python: `def missing_number(nums: list[int]) -> int:
    n = len(nums)
    return (n * (n + 1)) // 2 - sum(nums)`
    },
    testCases: [
      { input: [[3, 0, 1]], expected: 2, isHidden: false },
      { input: [[0, 1]], expected: 2, isHidden: false },
      { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Use Gauss' formula n * (n + 1) / 2 or XOR arithmetic."]
  },
  {
    id: "algo-acc-8",
    title: "Excel Sheet Column Number",
    slug: "accenture-excel-column-number",
    company: "Accenture",
    companyId: "accenture",
    companyLogo: "⚡",
    frequencyTag: "⭐ Accenture Base-26 Conversion Problem",
    difficulty: "EASY",
    category: "Math & Strings",
    tags: ["Accenture", "Math", "String"],
    description: "Given a string `columnTitle` that represents the column title as appears under an Excel sheet, return its corresponding column number (e.g. \"A\" -> 1, \"AB\" -> 28, \"ZY\" -> 701).",
    examples: [
      { input: 'columnTitle = "A"', output: "1" },
      { input: 'columnTitle = "AB"', output: "28" },
      { input: 'columnTitle = "ZY"', output: "701" }
    ],
    starterCode: {
      javascript: `function titleToNumber(columnTitle) {
  let ans = 0;
  for (let i = 0; i < columnTitle.length; i++) {
    ans = ans * 26 + (columnTitle.charCodeAt(i) - 64);
  }
  return ans;
}`,
      python: `def title_to_number(columnTitle: str) -> int:
    ans = 0
    for c in columnTitle:
        ans = ans * 26 + (ord(c) - 64)
    return ans`
    },
    testCases: [
      { input: ["A"], expected: 1, isHidden: false },
      { input: ["AB"], expected: 28, isHidden: false },
      { input: ["ZY"], expected: 701, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["This is a positional base-26 numeral system where 'A' is 1 and 'Z' is 26."]
  },
  {
    id: "algo-acc-9",
    title: "Maximum Depth of Binary Tree",
    slug: "accenture-max-depth-binary-tree",
    company: "Accenture",
    companyId: "accenture",
    companyLogo: "⚡",
    frequencyTag: "⭐ Accenture Tree Recursion Basic",
    difficulty: "EASY",
    category: "Trees",
    tags: ["Accenture", "Tree", "Recursion"],
    description: "Given a level-order array of a binary tree, return its maximum depth (the number of nodes along the longest path from the root node down to the farthest leaf node).",
    examples: [
      { input: "tree = [3,9,20,null,null,15,7]", output: "3" },
      { input: "tree = [1,null,2]", output: "2" }
    ],
    starterCode: {
      javascript: `function maxDepth(tree) {
  if (!tree.length || tree[0] === null) return 0;
  function dfs(idx) {
    if (idx >= tree.length || tree[idx] === null || tree[idx] === undefined) return 0;
    return 1 + Math.max(dfs(2 * idx + 1), dfs(2 * idx + 2));
  }
  return dfs(0);
}`,
      python: `def max_depth(tree: list) -> int:
    if not tree or tree[0] is None: return 0
    def dfs(idx):
        if idx >= len(tree) or tree[idx] is None: return 0
        return 1 + max(dfs(2 * idx + 1), dfs(2 * idx + 2))
    return dfs(0)`
    },
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: 3, isHidden: false },
      { input: [[1, null, 2]], expected: 2, isHidden: false },
      { input: [[]], expected: 0, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(H)",
    hints: ["Maximum depth is 1 + max(leftDepth, rightDepth)."]
  },
  {
    id: "algo-acc-10",
    title: "Valid Perfect Square Check",
    slug: "accenture-valid-perfect-square",
    company: "Accenture",
    companyId: "accenture",
    companyLogo: "⚡",
    frequencyTag: "⭐ Accenture Numerical Binary Search",
    difficulty: "EASY",
    category: "Binary Search",
    tags: ["Accenture", "Math", "Binary Search"],
    description: "Given a positive integer `num`, return `true` if `num` is a perfect square or `false` otherwise without using any built-in library functions like `Math.sqrt`.",
    examples: [
      { input: "num = 16", output: "true" },
      { input: "num = 14", output: "false" }
    ],
    starterCode: {
      javascript: `function isPerfectSquare(num) {
  if (num < 1) return false;
  let l = 1, r = num;
  while (l <= r) {
    const mid = Math.floor(l + (r - l) / 2);
    const sq = mid * mid;
    if (sq === num) return true;
    if (sq < num) l = mid + 1;
    else r = mid - 1;
  }
  return false;
}`,
      python: `def is_perfect_square(num: int) -> bool:
    if num < 1: return False
    l, r = 1, num
    while l <= r:
        mid = l + (r - l) // 2
        sq = mid * mid
        if sq == num: return True
        elif sq < num: l = mid + 1
        else: r = mid - 1
    return False`
    },
    testCases: [
      { input: [16], expected: true, isHidden: false },
      { input: [14], expected: false, isHidden: false },
      { input: [1], expected: true, isHidden: true }
    ],
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    hints: ["Binary search in the range [1, num] checking if mid * mid == num."]
  }
];
