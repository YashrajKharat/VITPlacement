// TCS NQT & Digital Authentic Coding Challenges (10 Problems)
// Sourced from TCS National Qualifier Test (NQT) and TCS Digital coding section archives

export const TCS_CODING_CHALLENGES = [
  {
    id: "algo-tcs-1",
    title: "Valid Anagram String Check",
    slug: "tcs-valid-anagram",
    company: "TCS",
    companyId: "tcs",
    companyLogo: "🏢",
    frequencyTag: "⭐ Repeated 9+ Times in TCS Ninja & Digital Coding",
    difficulty: "EASY",
    category: "Strings & Hash Maps",
    tags: ["TCS", "String", "Hash Table", "Easy"],
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word formed by rearranging the letters of another word, using all original letters exactly once.",
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
      { input: ["listen", "silent"], expected: true, isHidden: true },
      { input: ["aacc", "ccac"], expected: false, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1) (26 characters)",
    hints: [
      "Can two strings be anagrams if their lengths are different?",
      "Use an integer frequency array of size 26 or a hash map."
    ]
  },
  {
    id: "algo-tcs-2",
    title: "Rotate Array by K Positions",
    slug: "tcs-rotate-array",
    company: "TCS",
    companyId: "tcs",
    companyLogo: "🏢",
    frequencyTag: "⭐ Repeated in TCS Digital & Prime Coding Drives",
    difficulty: "MEDIUM",
    category: "Arrays & Two Pointers",
    tags: ["TCS", "Array", "Reversal Algorithm"],
    description: "Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.\n\nReturn the rotated array.",
    examples: [
      { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]", explanation: "Rotate 3 steps right." },
      { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]", explanation: "Rotate 2 steps right." }
    ],
    starterCode: {
      javascript: `function rotateArray(nums, k) {
  k = k % nums.length;
  function reverse(arr, start, end) {
    while (start < end) {
      const temp = arr[start];
      arr[start] = arr[end];
      arr[end] = temp;
      start++;
      end--;
    }
  }
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
  return nums;
}`,
      python: `def rotate_array(nums: list[int], k: int) -> list[int]:
    k = k % len(nums)
    nums[:] = nums[-k:] + nums[:-k]
    return nums`
    },
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4], isHidden: false },
      { input: [[-1, -100, 3, 99], 2], expected: [3, 99, -1, -100], isHidden: false },
      { input: [[1, 2], 3], expected: [2, 1], isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1) in-place",
    hints: [
      "What happens if k is greater than nums.length?",
      "Can you use the 3-step reversal algorithm to achieve O(1) extra space?"
    ]
  },
  {
    id: "algo-tcs-3",
    title: "Subarray with Given Target Sum",
    slug: "tcs-subarray-target-sum",
    company: "TCS",
    companyId: "tcs",
    companyLogo: "🏢",
    frequencyTag: "⭐ Frequent TCS NQT Advanced Coding Problem",
    difficulty: "MEDIUM",
    category: "Sliding Window & Hash Maps",
    tags: ["TCS", "Array", "Prefix Sum"],
    description: "Given an unsorted array of non-negative integers `nums` and an integer `target`, find a continuous subarray which adds to `target`. Return the 1-based start and end indices `[start, end]`. If not found, return `[-1]`.",
    examples: [
      { input: "nums = [1,2,3,7,5], target = 12", output: "[2,4]", explanation: "The sum of elements from 2nd position to 4th position is 2 + 3 + 7 = 12." }
    ],
    starterCode: {
      javascript: `function subarraySum(nums, target) {
  let left = 0, currentSum = 0;
  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    while (currentSum > target && left < right) {
      currentSum -= nums[left];
      left++;
    }
    if (currentSum === target) {
      return [left + 1, right + 1];
    }
  }
  return [-1];
}`,
      python: `def subarray_sum(nums: list[int], target: int) -> list[int]:
    left, curr = 0, 0
    for right in range(len(nums)):
        curr += nums[right]
        while curr > target and left < right:
            curr -= nums[left]
            left += 1
        if curr == target:
            return [left + 1, right + 1]
    return [-1]`
    },
    testCases: [
      { input: [[1, 2, 3, 7, 5], 12], expected: [2, 4], isHidden: false },
      { input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 15], expected: [1, 5], isHidden: false },
      { input: [[5, 6, 7], 20], expected: [-1], isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: [
      "Since all numbers are non-negative, can you use two pointers as a sliding window?",
      "Remember to return 1-based indexing."
    ]
  },
  {
    id: "algo-tcs-4",
    title: "Merge Two Sorted Arrays",
    slug: "tcs-merge-sorted-arrays",
    company: "TCS",
    companyId: "tcs",
    companyLogo: "🏢",
    frequencyTag: "⭐ TCS Ninja Standard Coding Question",
    difficulty: "EASY",
    category: "Two Pointers",
    tags: ["TCS", "Array", "Sorting"],
    description: "Given two sorted arrays `nums1` and `nums2`, merge them into a single sorted array and return it.",
    examples: [
      { input: "nums1 = [1,3,5], nums2 = [2,4,6]", output: "[1,2,3,4,5,6]" }
    ],
    starterCode: {
      javascript: `function mergeSorted(nums1, nums2) {
  const result = [];
  let i = 0, j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      result.push(nums1[i]);
      i++;
    } else {
      result.push(nums2[j]);
      j++;
    }
  }
  while (i < nums1.length) result.push(nums1[i++]);
  while (j < nums2.length) result.push(nums2[j++]);
  return result;
}`,
      python: `def merge_sorted(nums1: list[int], nums2: list[int]) -> list[int]:
    return sorted(nums1 + nums2)`
    },
    testCases: [
      { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6], isHidden: false },
      { input: [[], [1]], expected: [1], isHidden: false },
      { input: [[10, 20], [5, 15, 25]], expected: [5, 10, 15, 20, 25], isHidden: true }
    ],
    timeComplexity: "O(N + M)",
    spaceComplexity: "O(N + M)",
    hints: ["Use two pointers starting at index 0 of both arrays."]
  },
  {
    id: "algo-tcs-5",
    title: "Count Prime Numbers Less Than N",
    slug: "tcs-count-primes",
    company: "TCS",
    companyId: "tcs",
    companyLogo: "🏢",
    frequencyTag: "⭐ TCS NQT Prime Sieve Coding Problem",
    difficulty: "MEDIUM",
    category: "Math & Number Theory",
    tags: ["TCS", "Math", "Sieve of Eratosthenes"],
    description: "Given an integer `n`, return the number of prime numbers that are strictly less than `n`.",
    examples: [
      { input: "n = 10", output: "4", explanation: "There are 4 prime numbers less than 10: 2, 3, 5, 7." },
      { input: "n = 0", output: "0" }
    ],
    starterCode: {
      javascript: `function countPrimes(n) {
  if (n <= 2) return 0;
  const isPrime = new Uint8Array(n);
  isPrime.fill(1);
  isPrime[0] = isPrime[1] = 0;
  for (let i = 2; i * i < n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j < n; j += i) {
        isPrime[j] = 0;
      }
    }
  }
  let count = 0;
  for (let i = 2; i < n; i++) if (isPrime[i]) count++;
  return count;
}`,
      python: `def count_primes(n: int) -> int:
    if n <= 2: return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n, i):
                is_prime[j] = False
    return sum(is_prime)`
    },
    testCases: [
      { input: [10], expected: 4, isHidden: false },
      { input: [0], expected: 0, isHidden: false },
      { input: [1], expected: 0, isHidden: false },
      { input: [20], expected: 8, isHidden: true }
    ],
    timeComplexity: "O(N log log N)",
    spaceComplexity: "O(N)",
    hints: ["Use Sieve of Eratosthenes to eliminate multiples in O(N log log N)."]
  },
  {
    id: "algo-tcs-6",
    title: "Spiral Matrix Traversal",
    slug: "tcs-spiral-matrix",
    company: "TCS",
    companyId: "tcs",
    companyLogo: "🏢",
    frequencyTag: "⭐ TCS Digital 2D Array Benchmark",
    difficulty: "MEDIUM",
    category: "2D Matrix & Simulation",
    tags: ["TCS", "Matrix", "Simulation"],
    description: "Given an `m x n` matrix, return all elements of the matrix in spiral order (clockwise).",
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" }
    ],
    starterCode: {
      javascript: `function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const res = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) res.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);
      left++;
    }
  }
  return res;
}`,
      python: `def spiral_order(matrix: list[list[int]]) -> list[int]:
    res = []
    while matrix:
        res += matrix.pop(0)
        matrix = list(zip(*matrix))[::-1]
    return res`
    },
    testCases: [
      { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5], isHidden: false },
      { input: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7], isHidden: false },
      { input: [[[1]]], expected: [1], isHidden: true }
    ],
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(1) auxiliary",
    hints: ["Maintain 4 boundary pointers: top, bottom, left, right."]
  },
  {
    id: "algo-tcs-7",
    title: "Longest Common Prefix",
    slug: "tcs-longest-common-prefix",
    company: "TCS",
    companyId: "tcs",
    companyLogo: "🏢",
    frequencyTag: "⭐ TCS Ninja Common String Problem",
    difficulty: "EASY",
    category: "Strings",
    tags: ["TCS", "String", "Easy"],
    description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string `\"\"`.",
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
      { input: 'strs = ["dog","racecar","car"]', output: '""' }
    ],
    starterCode: {
      javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (!prefix) return "";
    }
  }
  return prefix;
}`,
      python: `def longest_common_prefix(strs: list[str]) -> str:
    if not strs: return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix: return ""
    return prefix`
    },
    testCases: [
      { input: [["flower", "flow", "flight"]], expected: "fl", isHidden: false },
      { input: [["dog", "racecar", "car"]], expected: "", isHidden: false },
      { input: [["campus", "camp", "camper"]], expected: "camp", isHidden: true }
    ],
    timeComplexity: "O(S) where S is sum of characters",
    spaceComplexity: "O(1)",
    hints: ["Horizontal scanning: compare prefix with each string successively."]
  },
  {
    id: "algo-tcs-8",
    title: "Move All Zeroes to End",
    slug: "tcs-move-zeroes",
    company: "TCS",
    companyId: "tcs",
    companyLogo: "🏢",
    frequencyTag: "⭐ TCS Foundation Coding Favorite",
    difficulty: "EASY",
    category: "Arrays & Two Pointers",
    tags: ["TCS", "Array", "In-Place"],
    description: "Given an integer array `nums`, move all `0`s to the end of it while maintaining the relative order of the non-zero elements in-place.",
    examples: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" }
    ],
    starterCode: {
      javascript: `function moveZeroes(nums) {
  let insertPos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[insertPos] = nums[i];
      insertPos++;
    }
  }
  while (insertPos < nums.length) {
    nums[insertPos++] = 0;
  }
  return nums;
}`,
      python: `def move_zeroes(nums: list[int]) -> list[int]:
    insert_pos = 0
    for num in nums:
        if num != 0:
            nums[insert_pos] = num
            insert_pos += 1
    for i in range(insert_pos, len(nums)):
        nums[i] = 0
    return nums`
    },
    testCases: [
      { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0], isHidden: false },
      { input: [[0]], expected: [0], isHidden: false },
      { input: [[1, 0, 2, 0, 3]], expected: [1, 2, 3, 0, 0], isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Keep track of the last non-zero index found."]
  },
  {
    id: "algo-tcs-9",
    title: "Find First and Last Position in Sorted Array",
    slug: "tcs-search-range",
    company: "TCS",
    companyId: "tcs",
    companyLogo: "🏢",
    frequencyTag: "⭐ TCS Digital Binary Search Assessment",
    difficulty: "MEDIUM",
    category: "Binary Search",
    tags: ["TCS", "Binary Search"],
    description: "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value in O(log N) time. If `target` is not found, return `[-1, -1]`.",
    examples: [
      { input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]" },
      { input: "nums = [5,7,7,8,8,10], target = 6", output: "[-1,-1]" }
    ],
    starterCode: {
      javascript: `function searchRange(nums, target) {
  function findBound(isFirst) {
    let left = 0, right = nums.length - 1, bound = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] === target) {
        bound = mid;
        if (isFirst) right = mid - 1;
        else left = mid + 1;
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return bound;
  }
  return [findBound(true), findBound(false)];
}`,
      python: `def search_range(nums: list[int], target: int) -> list[int]:
    def find_bound(is_first):
        l, r, bound = 0, len(nums) - 1, -1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] == target:
                bound = mid
                if is_first: r = mid - 1
                else: l = mid + 1
            elif nums[mid] < target: l = mid + 1
            else: r = mid - 1
        return bound
    return [find_bound(True), find_bound(False)]`
    },
    testCases: [
      { input: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4], isHidden: false },
      { input: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1], isHidden: false },
      { input: [[], 0], expected: [-1, -1], isHidden: true }
    ],
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    hints: ["Run two separate binary searches: one for the first position, one for the last."]
  },
  {
    id: "algo-tcs-10",
    title: "Check Power of Four",
    slug: "tcs-power-of-four",
    company: "TCS",
    companyId: "tcs",
    companyLogo: "🏢",
    frequencyTag: "⭐ TCS Bitwise Logic Classic",
    difficulty: "EASY",
    category: "Bit Manipulation",
    tags: ["TCS", "Bitwise", "Math"],
    description: "Given an integer `n`, return `true` if it is a power of four. Otherwise, return `false`.",
    examples: [
      { input: "n = 16", output: "true" },
      { input: "n = 5", output: "false" },
      { input: "n = 1", output: "true" }
    ],
    starterCode: {
      javascript: `function isPowerOfFour(n) {
  return n > 0 && (n & (n - 1)) === 0 && (n & 0x55555555) !== 0;
}`,
      python: `def is_power_of_four(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0 and (n & 0x55555555) != 0`
    },
    testCases: [
      { input: [16], expected: true, isHidden: false },
      { input: [5], expected: false, isHidden: false },
      { input: [1], expected: true, isHidden: false },
      { input: [8], expected: false, isHidden: true }
    ],
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["Check if power of two first using (n & (n-1)) == 0, then ensure the bit is at an odd position."]
  }
];
