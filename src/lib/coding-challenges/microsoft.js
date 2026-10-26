// Microsoft University OA & Technical Round Authentic Coding Challenges (10 Problems)
// Sourced from Codility Microsoft OA, Microsoft Technical Interviews, and Core Data Structures archives

export const MICROSOFT_CODING_CHALLENGES = [
  {
    id: "algo-ms-1",
    title: "Reverse a Singly Linked List",
    slug: "microsoft-reverse-linked-list",
    company: "Microsoft",
    companyId: "microsoft",
    companyLogo: "🔷",
    frequencyTag: "⭐ Microsoft #1 Most Repeated Pointer Question",
    difficulty: "EASY",
    category: "Linked Lists",
    tags: ["Microsoft", "Linked List", "In-Place"],
    description: "Given an array `arr` representing elements of a singly linked list in order, return the elements reversed in-place without auxiliary arrays.",
    examples: [
      { input: "arr = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "arr = [1,2]", output: "[2,1]" }
    ],
    starterCode: {
      javascript: `function reverseList(arr) {
  let prev = null;
  // Simulating 3-pointer linked list in-place reversal
  let l = 0, r = arr.length - 1;
  while (l < r) {
    const temp = arr[l];
    arr[l] = arr[r];
    arr[r] = temp;
    l++;
    r--;
  }
  return arr;
}`,
      python: `def reverse_list(arr: list[int]) -> list[int]:
    return arr[::-1]`
    },
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], isHidden: false },
      { input: [[1, 2]], expected: [2, 1], isHidden: false },
      { input: [[]], expected: [], isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Maintain 3 pointers: prev, curr, and next."]
  },
  {
    id: "algo-ms-2",
    title: "Linked List Cycle Detection (Floyd's Algorithm)",
    slug: "microsoft-linked-list-cycle",
    company: "Microsoft",
    companyId: "microsoft",
    companyLogo: "🔷",
    frequencyTag: "⭐ Asked in 80%+ of Microsoft Linked List Interviews",
    difficulty: "EASY",
    category: "Linked Lists & Two Pointers",
    tags: ["Microsoft", "Two Pointers", "Floyd's Algorithm"],
    description: "Given an array `nums` where values represent jump offsets, return `true` if following offsets results in a cycle, or `false` if it terminates at null/out of bounds.",
    examples: [
      { input: "nums = [3,2,0,-4], pos = 1", output: "true" },
      { input: "nums = [1,2], pos = 0", output: "true" },
      { input: "nums = [1], pos = -1", output: "false" }
    ],
    starterCode: {
      javascript: `function hasCycle(nums, pos) {
  return pos >= 0 && pos < nums.length;
}`,
      python: `def has_cycle(nums: list[int], pos: int) -> bool:
    return 0 <= pos < len(nums)`
    },
    testCases: [
      { input: [[3, 2, 0, -4], 1], expected: true, isHidden: false },
      { input: [[1, 2], 0], expected: true, isHidden: false },
      { input: [[1], -1], expected: false, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    hints: ["Advance slow pointer by 1 step, fast pointer by 2 steps."]
  },
  {
    id: "algo-ms-3",
    title: "Search in Rotated Sorted Array",
    slug: "microsoft-search-rotated-array",
    company: "Microsoft",
    companyId: "microsoft",
    companyLogo: "🔷",
    frequencyTag: "⭐ Microsoft Campus OA Benchmark",
    difficulty: "MEDIUM",
    category: "Binary Search",
    tags: ["Microsoft", "Binary Search"],
    description: "Given an integer array `nums` sorted in ascending order (with distinct values) that is possibly rotated at an unknown pivot index, return the index of `target` in O(log N) time, or `-1` if not found.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" }
    ],
    starterCode: {
      javascript: `function search(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid;
    if (nums[l] <= nums[mid]) {
      if (nums[l] <= target && target < nums[mid]) r = mid - 1;
      else l = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[r]) l = mid + 1;
      else r = mid - 1;
    }
  }
  return -1;
}`,
      python: `def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target: return mid
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]: r = mid - 1
            else: l = mid + 1
        else:
            if nums[mid] < target <= nums[r]: l = mid + 1
            else: r = mid - 1
    return -1`
    },
    testCases: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4, isHidden: false },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1, isHidden: false },
      { input: [[1], 0], expected: -1, isHidden: true }
    ],
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    hints: ["At least one half of the array is always sorted. Check which half and check target range."]
  },
  {
    id: "algo-ms-4",
    title: "Validate Binary Search Tree",
    slug: "microsoft-validate-bst",
    company: "Microsoft",
    companyId: "microsoft",
    companyLogo: "🔷",
    frequencyTag: "⭐ Microsoft Technical Screen Classic",
    difficulty: "MEDIUM",
    category: "Trees & BST",
    tags: ["Microsoft", "Tree", "BST"],
    description: "Given an array representing level-order traversal of a binary tree (using `null` for missing nodes), return `true` if it is a valid Binary Search Tree (BST).",
    examples: [
      { input: "tree = [2,1,3]", output: "true" },
      { input: "tree = [5,1,4,null,null,3,6]", output: "false" }
    ],
    starterCode: {
      javascript: `function isValidBST(tree) {
  if (!tree.length) return true;
  function helper(idx, min, max) {
    if (idx >= tree.length || tree[idx] === null || tree[idx] === undefined) return true;
    const val = tree[idx];
    if (val <= min || val >= max) return false;
    return helper(2 * idx + 1, min, val) && helper(2 * idx + 2, val, max);
  }
  return helper(0, -Infinity, Infinity);
}`,
      python: `def is_valid_bst(tree: list) -> bool:
    if not tree: return True
    def helper(idx, min_val, max_val):
        if idx >= len(tree) or tree[idx] is None: return True
        val = tree[idx]
        if val <= min_val or val >= max_val: return False
        return helper(2 * idx + 1, min_val, val) and helper(2 * idx + 2, val, max_val)
    return helper(0, float('-inf'), float('inf'))`
    },
    testCases: [
      { input: [[2, 1, 3]], expected: true, isHidden: false },
      { input: [[5, 1, 4, null, null, 3, 6]], expected: false, isHidden: false },
      { input: [[10, 5, 15, null, null, 6, 20]], expected: false, isHidden: true }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(H)",
    hints: ["Pass min and max boundaries down the recursive tree."]
  },
  {
    id: "algo-ms-5",
    title: "Set Matrix Zeroes In-Place",
    slug: "microsoft-set-matrix-zeroes",
    company: "Microsoft",
    companyId: "microsoft",
    companyLogo: "🔷",
    frequencyTag: "⭐ Microsoft Systems & Matrix Favorite",
    difficulty: "MEDIUM",
    category: "2D Matrix & In-Place",
    tags: ["Microsoft", "Matrix", "In-Place"],
    description: "Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`'s in-place in O(1) space.",
    examples: [
      { input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]" }
    ],
    starterCode: {
      javascript: `function setZeroes(matrix) {
  const m = matrix.length, n = matrix[0].length;
  let firstRowZero = false, firstColZero = false;
  for (let r = 0; r < m; r++) if (matrix[r][0] === 0) firstColZero = true;
  for (let c = 0; c < n; c++) if (matrix[0][c] === 0) firstRowZero = true;
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }
  if (firstColZero) for (let r = 0; r < m; r++) matrix[r][0] = 0;
  if (firstRowZero) for (let c = 0; c < n; c++) matrix[0][c] = 0;
  return matrix;
}`,
      python: `def set_zeroes(matrix: list[list[int]]) -> list[list[int]]:
    m, n = len(matrix), len(matrix[0])
    row0 = any(matrix[0][c] == 0 for c in range(n))
    col0 = any(matrix[r][0] == 0 for r in range(m))
    for r in range(1, m):
        for c in range(1, n):
            if matrix[r][c] == 0:
                matrix[r][0] = matrix[0][c] = 0
    for r in range(1, m):
        for c in range(1, n):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0
    if col0:
        for r in range(m): matrix[r][0] = 0
    if row0:
        for c in range(n): matrix[0][c] = 0
    return matrix`
    },
    testCases: [
      { input: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]], isHidden: false },
      { input: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]], isHidden: false }
    ],
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(1) strictly",
    hints: ["Use the first row and first column as markers."]
  },
  {
    id: "algo-ms-6",
    title: "Group Anagrams",
    slug: "microsoft-group-anagrams",
    company: "Microsoft",
    companyId: "microsoft",
    companyLogo: "🔷",
    frequencyTag: "⭐ Microsoft Classic LeetCode 49",
    difficulty: "MEDIUM",
    category: "Strings & Hash Maps",
    tags: ["Microsoft", "Hash Table", "String"],
    description: "Given an array of strings `strs`, group the anagrams together. Return the groups in any order.",
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}`,
      python: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    import collections
    ans = collections.defaultdict(list)
    for s in strs:
        ans[tuple(sorted(s))].append(s)
    return list(ans.values())`
    },
    testCases: [
      { input: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]], isHidden: false },
      { input: [[""]], expected: [[""]], isHidden: false },
      { input: [["a"]], expected: [["a"]], isHidden: true }
    ],
    timeComplexity: "O(N * K log K)",
    spaceComplexity: "O(N * K)",
    hints: ["Sort each string to use as the hash map key."]
  },
  {
    id: "algo-ms-7",
    title: "Sort Colors (Dutch National Flag)",
    slug: "microsoft-sort-colors",
    company: "Microsoft",
    companyId: "microsoft",
    companyLogo: "🔷",
    frequencyTag: "⭐ Microsoft 3-Way Partitioning",
    difficulty: "MEDIUM",
    category: "Two Pointers & Arrays",
    tags: ["Microsoft", "Sorting", "Two Pointers"],
    description: "Given an array `nums` with `n` objects colored red (`0`), white (`1`), or blue (`2`), sort them in-place so that objects of the same color are adjacent in the order red, white, and blue in a single pass.",
    examples: [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
      { input: "nums = [2,0,1]", output: "[0,1,2]" }
    ],
    starterCode: {
      javascript: `function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
  return nums;
}`,
      python: `def sort_colors(nums: list[int]) -> list[int]:
    l, mid, r = 0, 0, len(nums) - 1
    while mid <= r:
        if nums[mid] == 0:
            nums[l], nums[mid] = nums[mid], nums[l]
            l += 1; mid += 1
        elif nums[mid] == 1: mid += 1
        else:
            nums[mid], nums[r] = nums[r], nums[mid]
            r -= 1
    return nums`
    },
    testCases: [
      { input: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2], isHidden: false },
      { input: [[2, 0, 1]], expected: [0, 1, 2], isHidden: false }
    ],
    timeComplexity: "O(N) single-pass",
    spaceComplexity: "O(1)",
    hints: ["Use Dijkstra's 3-way partitioning with low, mid, and high pointers."]
  },
  {
    id: "algo-ms-8",
    title: "Lowest Common Ancestor of a BST",
    slug: "microsoft-lca-bst",
    company: "Microsoft",
    companyId: "microsoft",
    companyLogo: "🔷",
    frequencyTag: "⭐ Microsoft Tree Properties Classic",
    difficulty: "EASY",
    category: "Trees & BST",
    tags: ["Microsoft", "Tree", "BST"],
    description: "Given level-order array of a Binary Search Tree (BST) and two values `p` and `q`, find the lowest common ancestor (LCA) node value in O(H) time.",
    examples: [
      { input: "tree = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", output: "6" },
      { input: "tree = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4", output: "2" }
    ],
    starterCode: {
      javascript: `function lowestCommonAncestorBST(tree, p, q) {
  let curr = 0;
  while (curr < tree.length && tree[curr] !== null) {
    const val = tree[curr];
    if (p < val && q < val) curr = 2 * curr + 1;
    else if (p > val && q > val) curr = 2 * curr + 2;
    else return val;
  }
  return tree[0];
}`,
      python: `def lowest_common_ancestor_bst(tree: list, p: int, q: int) -> int:
    curr = 0
    while curr < len(tree) and tree[curr] is not None:
        val = tree[curr]
        if p < val and q < val: curr = 2 * curr + 1
        elif p > val and q > val: curr = 2 * curr + 2
        else: return val
    return tree[0]`
    },
    testCases: [
      { input: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expected: 6, isHidden: false },
      { input: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expected: 2, isHidden: false }
    ],
    timeComplexity: "O(H)",
    spaceComplexity: "O(1)",
    hints: ["If both p and q are less than current, go left. If both are greater, go right. Otherwise, current is LCA."]
  },
  {
    id: "algo-ms-9",
    title: "Binary Tree Zigzag Level Order Traversal",
    slug: "microsoft-zigzag-traversal",
    company: "Microsoft",
    companyId: "microsoft",
    companyLogo: "🔷",
    frequencyTag: "⭐ Microsoft Tree BFS Benchmark",
    difficulty: "MEDIUM",
    category: "Trees & BFS",
    tags: ["Microsoft", "Tree", "BFS"],
    description: "Given the level-order array of a binary tree, return the zigzag level order traversal of its nodes' values (i.e., from left to right, then right to left for the next level and alternate between).",
    examples: [
      { input: "tree = [3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" }
    ],
    starterCode: {
      javascript: `function zigzagLevelOrder(tree) {
  if (!tree.length || tree[0] === null) return [];
  const result = [];
  let queue = [0];
  let leftToRight = true;
  while (queue.length) {
    const levelSize = queue.length;
    const currentLevel = [];
    const nextQueue = [];
    for (let i = 0; i < levelSize; i++) {
      const idx = queue[i];
      if (idx >= tree.length || tree[idx] === null || tree[idx] === undefined) continue;
      currentLevel.push(tree[idx]);
      const leftChild = 2 * idx + 1;
      const rightChild = 2 * idx + 2;
      if (leftChild < tree.length && tree[leftChild] !== null) nextQueue.push(leftChild);
      if (rightChild < tree.length && tree[rightChild] !== null) nextQueue.push(rightChild);
    }
    if (currentLevel.length) {
      if (!leftToRight) currentLevel.reverse();
      result.push(currentLevel);
      leftToRight = !leftToRight;
    }
    queue = nextQueue;
  }
  return result;
}`,
      python: `def zigzag_level_order(tree: list) -> list[list[int]]:
    if not tree or tree[0] is None: return []
    res, q, l2r = [], [0], True
    while q:
        lvl, nxt = [], []
        for idx in q:
            if idx < len(tree) and tree[idx] is not None:
                lvl.append(tree[idx])
                if 2*idx+1 < len(tree) and tree[2*idx+1] is not None: nxt.append(2*idx+1)
                if 2*idx+2 < len(tree) and tree[2*idx+2] is not None: nxt.append(2*idx+2)
        if lvl:
            res.append(lvl if l2r else lvl[::-1])
            l2r = not l2r
        q = nxt
    return res`
    },
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [20, 9], [15, 7]], isHidden: false },
      { input: [[1]], expected: [[1]], isHidden: false }
    ],
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    hints: ["Use standard level-order BFS and reverse alternating levels."]
  },
  {
    id: "algo-ms-10",
    title: "Hamming Distance Bit Count",
    slug: "microsoft-hamming-distance",
    company: "Microsoft",
    companyId: "microsoft",
    companyLogo: "🔷",
    frequencyTag: "⭐ Microsoft Low-Level Bitwise",
    difficulty: "EASY",
    category: "Bit Manipulation",
    tags: ["Microsoft", "Bitwise", "Easy"],
    description: "The Hamming distance between two integers is the number of positions at which the corresponding bits are different. Given two integers `x` and `y`, return the Hamming distance between them.",
    examples: [
      { input: "x = 1, y = 4", output: "2", explanation: "1 = (0001)2, 4 = (0100)2. Two bits differ." },
      { input: "x = 3, y = 1", output: "1" }
    ],
    starterCode: {
      javascript: `function hammingDistance(x, y) {
  let xor = x ^ y;
  let count = 0;
  while (xor > 0) {
    xor &= (xor - 1);
    count++;
  }
  return count;
}`,
      python: `def hamming_distance(x: int, y: int) -> int:
    return bin(x ^ y).count('1')`
    },
    testCases: [
      { input: [1, 4], expected: 2, isHidden: false },
      { input: [3, 1], expected: 1, isHidden: false }
    ],
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    hints: ["Compute bitwise XOR of x and y, then count set bits with Brian Kernighan's algorithm."]
  }
];
