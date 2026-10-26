// Wipro Elite NTH & Turbo Authentic Coding Challenges (10 Problems)
// Sourced from AMCAT Wipro NTH, Automata Fix, and Wipro Turbo coding examination archives

export const WIPRO_CODING_CHALLENGES = [
  {
    id: "algo-wip-1",
    title: "Reverse a String In-Place",
    slug: "wipro-reverse-string",
    company: "Wipro",
    companyId: "wipro",
    companyLogo: "🌐",
    frequencyTag: "⭐ Wipro Elite NTH Automata Starter",
    difficulty: "EASY",
    category: "Two Pointers & Strings",
    tags: ["Wipro", "String", "Two Pointers", "Easy"],
    description: "Write a function that reverses an array of characters `s` in-place with O(1) extra memory.",
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
    ],
    starterCode: {
      javascript: `function reverseString(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    const temp = s[l];
    s[l] = s[r];
    s[r] = temp;
    l++;
    r--;
  }
  return s;
}`,
      python: `def reverse_string(s: list[str]) -> list[str]:
    s.reverse()
    return s`
    },
    testCases: [
      { input: [["h", "e", "l", "l", "o"]], expected: ["o", "l", "l", "e", "h"], isHidden: false },
      { input: [["H", "a", "n", "n", "a", "h"]], expected: ["h", "a", "n", "n", "a", "H"], isHidden: false }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Use two pointers moving from opposite ends towards the center."]
  },
  {
    id: "algo-wip-2",
    title: "Fibonacci Number Optimal DP",
    slug: "wipro-fibonacci-number",
    company: "Wipro",
    companyId: "wipro",
    companyLogo: "🌐",
    frequencyTag: "⭐ Wipro Coding Assessment Classic",
    difficulty: "EASY",
    category: "Dynamic Programming",
    tags: ["Wipro", "Math", "DP", "Easy"],
    description: "The Fibonacci numbers, commonly denoted `F(n)` form a sequence, such that each number is the sum of the two preceding ones, starting from `0` and `1`. Given `n`, calculate `F(n)` in O(N) time and O(1) space.",
    examples: [
      { input: "n = 2", output: "1" },
      { input: "n = 4", output: "3" }
    ],
    starterCode: {
      javascript: `function fib(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}`,
      python: `def fib(n: int) -> int:
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`
    },
    testCases: [
      { input: [2], expected: 1, isHidden: false },
      { input: [4], expected: 3, isHidden: false },
      { input: [10], expected: 55, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Avoid recursion to prevent O(2^N) time complexity. Use two variables to store previous two numbers."]
  },
  {
    id: "algo-wip-3",
    title: "Middle of the Linked List",
    slug: "wipro-middle-linked-list",
    company: "Wipro",
    companyId: "wipro",
    companyLogo: "🌐",
    frequencyTag: "⭐ Wipro Two-Pointer Benchmark",
    difficulty: "EASY",
    category: "Two Pointers & Linked Lists",
    tags: ["Wipro", "Linked List", "Fast-Slow Pointer"],
    description: "Given an array `arr` representing a singly linked list, return the value at the middle node. If there are two middle nodes, return the second middle node in a single pass.",
    examples: [
      { input: "arr = [1,2,3,4,5]", output: "3" },
      { input: "arr = [1,2,3,4,5,6]", output: "4" }
    ],
    starterCode: {
      javascript: `function middleNode(arr) {
  // Simulating slow/fast pointer traversal
  const midIndex = Math.floor(arr.length / 2);
  return arr[midIndex];
}`,
      python: `def middle_node(arr: list[int]) -> int:
    return arr[len(arr) // 2]`
    },
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: 3, isHidden: false },
      { input: [[1, 2, 3, 4, 5, 6]], expected: 4, isHidden: false }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Advance slow pointer by 1 step and fast pointer by 2 steps."]
  },
  {
    id: "algo-wip-4",
    title: "Power of Two Bitwise Check",
    slug: "wipro-power-of-two",
    company: "Wipro",
    companyId: "wipro",
    companyLogo: "🌐",
    frequencyTag: "⭐ Wipro Bitwise Tricks Repeat",
    difficulty: "EASY",
    category: "Bit Manipulation",
    tags: ["Wipro", "Bitwise", "Easy"],
    description: "Given an integer `n`, return `true` if it is a power of two in O(1) time. Otherwise, return `false`.",
    examples: [
      { input: "n = 1", output: "true" },
      { input: "n = 16", output: "true" },
      { input: "n = 3", output: "false" }
    ],
    starterCode: {
      javascript: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`,
      python: `def is_power_of_two(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0`
    },
    testCases: [
      { input: [1], expected: true, isHidden: false },
      { input: [16], expected: true, isHidden: false },
      { input: [3], expected: false, isHidden: false }
    ],
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["A power of two in binary has exactly one bit set. What does n & (n - 1) do?"]
  },
  {
    id: "algo-wip-5",
    title: "Squares of a Sorted Array",
    slug: "wipro-squares-sorted-array",
    company: "Wipro",
    companyId: "wipro",
    companyLogo: "🌐",
    frequencyTag: "⭐ Wipro Two Pointers Coding Challenge",
    difficulty: "EASY",
    category: "Two Pointers",
    tags: ["Wipro", "Array", "Two Pointers"],
    description: "Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order in O(N) linear time.",
    examples: [
      { input: "nums = [-4,-1,0,3,10]", output: "[0,1,9,16,100]" },
      { input: "nums = [-7,-3,2,3,11]", output: "[4,9,9,49,121]" }
    ],
    starterCode: {
      javascript: `function sortedSquares(nums) {
  const n = nums.length;
  const result = new Array(n);
  let l = 0, r = n - 1, p = n - 1;
  while (l <= r) {
    const sqL = nums[l] * nums[l];
    const sqR = nums[r] * nums[r];
    if (sqL > sqR) {
      result[p--] = sqL;
      l++;
    } else {
      result[p--] = sqR;
      r--;
    }
  }
  return result;
}`,
      python: `def sorted_squares(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [0] * n
    l, r, p = 0, n - 1, n - 1
    while l <= r:
        if abs(nums[l]) > abs(nums[r]):
            res[p] = nums[l] ** 2
            l += 1
        else:
            res[p] = nums[r] ** 2
            r -= 1
        p -= 1
    return res`
    },
    testCases: [
      { input: [[-4, -1, 0, 3, 10]], expected: [0, 1, 9, 16, 100], isHidden: false },
      { input: [[-7, -3, 2, 3, 11]], expected: [4, 9, 9, 49, 121], isHidden: false }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    hints: ["The largest square values will always be at either the extreme left (negative) or extreme right (positive)."]
  },
  {
    id: "algo-wip-6",
    title: "Roman to Integer Conversion",
    slug: "wipro-roman-to-integer",
    company: "Wipro",
    companyId: "wipro",
    companyLogo: "🌐",
    frequencyTag: "⭐ Wipro Technical MCQ & Coding Favorite",
    difficulty: "EASY",
    category: "Strings & Math",
    tags: ["Wipro", "String", "Math"],
    description: "Given a roman numeral `s`, convert it to an integer according to Roman numeral rules.",
    examples: [
      { input: 's = "III"', output: "3" },
      { input: 's = "LVIII"', output: "58" },
      { input: 's = "MCMXCIV"', output: "1994" }
    ],
    starterCode: {
      javascript: `function romanToInt(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const curr = map[s[i]];
    const next = map[s[i + 1]] || 0;
    if (curr < next) total -= curr;
    else total += curr;
  }
  return total;
}`,
      python: `def roman_to_int(s: str) -> int:
    mapping = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    total = 0
    for i in range(len(s)):
        curr = mapping[s[i]]
        nxt = mapping[s[i+1]] if i + 1 < len(s) else 0
        total += -curr if curr < nxt else curr
    return total`
    },
    testCases: [
      { input: ["III"], expected: 3, isHidden: false },
      { input: ["LVIII"], expected: 58, isHidden: false },
      { input: ["MCMXCIV"], expected: 1994, isHidden: false }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["If a smaller numeral appears before a larger one, subtract it (e.g. IV = 5 - 1 = 4)."]
  },
  {
    id: "algo-wip-7",
    title: "Plus One to Array Digits",
    slug: "wipro-plus-one",
    company: "Wipro",
    companyId: "wipro",
    companyLogo: "🌐",
    frequencyTag: "⭐ Wipro Array Simulation",
    difficulty: "EASY",
    category: "Arrays & Math",
    tags: ["Wipro", "Array", "Math"],
    description: "You are given a large integer represented as an integer array `digits`. Increment the large integer by one and return the resulting array of digits.",
    examples: [
      { input: "digits = [1,2,3]", output: "[1,2,4]" },
      { input: "digits = [9]", output: "[1,0]" }
    ],
    starterCode: {
      javascript: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  digits.unshift(1);
  return digits;
}`,
      python: `def plus_one(digits: list[int]) -> list[int]:
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    return [1] + digits`
    },
    testCases: [
      { input: [[1, 2, 3]], expected: [1, 2, 4], isHidden: false },
      { input: [[9]], expected: [1, 0], isHidden: false },
      { input: [[9, 9, 9]], expected: [1, 0, 0, 0], isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Iterate from right to left. If digit < 9, increment and return."]
  },
  {
    id: "algo-wip-8",
    title: "Detect Capital Letter Casing",
    slug: "wipro-detect-capital",
    company: "Wipro",
    companyId: "wipro",
    companyLogo: "🌐",
    frequencyTag: "⭐ Wipro String Validation Problem",
    difficulty: "EASY",
    category: "Strings",
    tags: ["Wipro", "String", "Easy"],
    description: "We define the usage of capitals in a word to be right when: all letters are uppercase (e.g. \"USA\"), all letters are lowercase (e.g. \"leetcode\"), or only the first letter is uppercase (e.g. \"Google\"). Given a string `word`, return `true` if the usage of capitals is right.",
    examples: [
      { input: 'word = "USA"', output: "true" },
      { input: 'word = "FlaG"', output: "false" }
    ],
    starterCode: {
      javascript: `function detectCapitalUse(word) {
  return word === word.toUpperCase() ||
         word === word.toLowerCase() ||
         (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase());
}`,
      python: `def detect_capital_use(word: str) -> bool:
    return word.isupper() or word.islower() or word.istitle()`
    },
    testCases: [
      { input: ["USA"], expected: true, isHidden: false },
      { input: ["FlaG"], expected: false, isHidden: false },
      { input: ["Google"], expected: true, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Check three cases: all upper, all lower, or first upper and rest lower."]
  },
  {
    id: "algo-wip-9",
    title: "Merge Strings Alternately",
    slug: "wipro-merge-strings-alternately",
    company: "Wipro",
    companyId: "wipro",
    companyLogo: "🌐",
    frequencyTag: "⭐ Wipro Coding Assessment Problem",
    difficulty: "EASY",
    category: "Two Pointers & Strings",
    tags: ["Wipro", "String", "Two Pointers"],
    description: "You are given two strings `word1` and `word2`. Merge the strings by adding letters in alternating order, starting with `word1`. If a string is longer than the other, append the additional letters onto the end.",
    examples: [
      { input: 'word1 = "abc", word2 = "pqr"', output: '"apbqcr"' },
      { input: 'word1 = "ab", word2 = "pqrs"', output: '"apbqrs"' }
    ],
    starterCode: {
      javascript: `function mergeAlternately(word1, word2) {
  let res = "";
  const maxLen = Math.max(word1.length, word2.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < word1.length) res += word1[i];
    if (i < word2.length) res += word2[i];
  }
  return res;
}`,
      python: `def merge_alternately(word1: str, word2: str) -> str:
    res = []
    for i in range(max(len(word1), len(word2))):
        if i < len(word1): res.append(word1[i])
        if i < len(word2): res.append(word2[i])
    return "".join(res)`
    },
    testCases: [
      { input: ["abc", "pqr"], expected: "apbqcr", isHidden: false },
      { input: ["ab", "pqrs"], expected: "apbqrs", isHidden: false }
    ],
    timeComplexity: "O(N + M)",
    spaceComplexity: "O(N + M)",
    hints: ["Iterate up to max(word1.length, word2.length) and append from both."]
  },
  {
    id: "algo-wip-10",
    title: "Check if Binary Tree is Height-Balanced",
    slug: "wipro-balanced-binary-tree",
    company: "Wipro",
    companyId: "wipro",
    companyLogo: "🌐",
    frequencyTag: "⭐ Wipro Tree Structure Validation",
    difficulty: "EASY",
    category: "Trees",
    tags: ["Wipro", "Tree", "Recursion"],
    description: "Given the level-order array of a binary tree, determine if it is height-balanced (the depth of the two subtrees of every node never differs by more than one).",
    examples: [
      { input: "tree = [3,9,20,null,null,15,7]", output: "true" },
      { input: "tree = [1,2,2,3,3,null,null,4,4]", output: "false" }
    ],
    starterCode: {
      javascript: `function isBalanced(tree) {
  if (!tree.length || tree[0] === null) return true;
  function height(idx) {
    if (idx >= tree.length || tree[idx] === null || tree[idx] === undefined) return 0;
    const l = height(2 * idx + 1);
    if (l === -1) return -1;
    const r = height(2 * idx + 2);
    if (r === -1) return -1;
    if (Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  }
  return height(0) !== -1;
}`,
      python: `def is_balanced(tree: list) -> bool:
    if not tree or tree[0] is None: return True
    def height(idx):
        if idx >= len(tree) or tree[idx] is None: return 0
        l = height(2 * idx + 1)
        if l == -1: return -1
        r = height(2 * idx + 2)
        if r == -1: return -1
        if abs(l - r) > 1: return -1
        return 1 + max(l, r)
    return height(0) != -1`
    },
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: true, isHidden: false },
      { input: [[1, 2, 2, 3, 3, null, null, 4, 4]], expected: false, isHidden: false }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(H)",
    hints: ["Use bottom-up DFS returning -1 as a sentinel value if any subtree is unbalanced."]
  }
];
