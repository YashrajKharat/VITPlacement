// Google SWE & Campus OA Authentic Placement PYQ Bank (15 Questions)
// Sourced from Google Online Challenge (GOC), Google Kickstart & Technical Screen archives

export const GOOGLE_QUIZ = {
  id: "quiz-google-dsa",
  companyId: "google",
  company: "Google",
  companyLogo: "🟢",
  title: "Google SWE Algorithmic High-Yield PYQs",
  slug: "google-dsa-speed-sprint",
  category: "Product & Algorithmic",
  placementRound: "Round 1: Online Challenge & Coding Screen",
  frequencyInfo: "⭐ High-Frequency in Google Campus OA & Onsite Sprints",
  difficulty: "HARD",
  durationMinutes: 20,
  totalQuestions: 15,
  points: 350,
  unstopCoinsReward: 80,
  description: "Curated 15-question algorithmic sprint directly from Google SWE campus hiring archives covering Bitwise tricks, amortized arrays, Dijkstra, DP, topological sorting, Consistent Hashing, and LCA.",
  badge: "Google SWE Verified",
  questions: [
    {
      id: "goog-q1",
      question: "What is the result of evaluating `(n & (n - 1)) == 0` for any positive integer `n > 0`?",
      frequencyTag: "⭐ Repeated in Google Campus OA & Technical Phone Screen",
      topic: "Bit Manipulation • Power of 2",
      options: ["Checks if n is odd", "Checks if n is a power of 2", "Checks if n is prime", "Checks if n is divisible by 4"],
      correctAnswer: 1,
      explanation: "Subtracting 1 flips all bits after the lowest set bit. Bitwise ANDing `n & (n - 1)` clears the lowest set bit. If the result is 0, exactly one bit was set, confirming `n` is a power of 2.",
      whyCompanyAsks: "Google tests bitwise optimizations to gauge a candidate's low-level algorithmic mastery."
    },
    {
      id: "goog-q2",
      question: "What is the amortized time complexity of inserting N elements into a dynamic array (like C++ `std::vector` or Java `ArrayList`) that doubles capacity upon filling?",
      frequencyTag: "⭐ Classic Google Algorithmic Complexity Benchmark",
      topic: "Algorithm Analysis • Amortized Complexity",
      options: ["O(N^2)", "O(N log N)", "O(1) amortized per insert, O(N) total", "O(N) per insert"],
      correctAnswer: 2,
      explanation: "Although resizing takes O(K) copy time, geometric capacity doubling distributes the copy cost across past insertions, resulting in O(1) amortized time per insertion.",
      whyCompanyAsks: "Google interviewers frequently probe beyond worst-case to check understanding of amortized costs."
    },
    {
      id: "goog-q3",
      question: "In Dijkstra's Shortest Path Algorithm with a Min-Heap (Binary Heap), what is the overall time complexity for a graph with V vertices and E edges?",
      frequencyTag: "⭐ High-Yield Google Graph Theory Question",
      topic: "Graph Algorithms • Shortest Path",
      options: ["O(V + E)", "O((V + E) log V)", "O(V^2)", "O(V * E)"],
      correctAnswer: 1,
      explanation: "Using a binary min-heap, extracting min takes O(V log V) and decreasing keys / pushing edges takes O(E log V), yielding O((V + E) log V).",
      whyCompanyAsks: "Standard graph algorithms with optimal heap data structures are heavily tested at Google."
    },
    {
      id: "goog-q4",
      question: "Which algorithmic paradigm does the '0/1 Knapsack' problem solve using?",
      frequencyTag: "⭐ Tested in Google Dynamic Programming Assessments",
      topic: "Dynamic Programming • Optimization",
      options: ["Greedy Algorithm", "Dynamic Programming", "Divide & Conquer", "Randomized Sampling"],
      correctAnswer: 1,
      explanation: "0/1 Knapsack exhibits overlapping subproblems and optimal substructure where items cannot be broken, requiring 2D/1D Dynamic Programming.",
      whyCompanyAsks: "Google evaluates whether candidates recognize when a greedy strategy fails and dynamic programming is mandatory."
    },
    {
      id: "goog-q5",
      question: "In an array where every integer appears twice except for one unique integer, how can you find the unique element in O(N) time and O(1) auxiliary space?",
      frequencyTag: "⭐ Repeated Google Technical Phone Screen Problem",
      topic: "Bit Manipulation • XOR Identity",
      options: ["Sort the array first", "Compute bitwise XOR of all array elements", "Use a Frequency Hash Table", "Build a Binary Search Tree"],
      correctAnswer: 1,
      explanation: "Since `x ^ x = 0` and `x ^ 0 = x`, XORing all elements cancels out every paired duplicate, leaving strictly the unique single number in O(N) time and O(1) space.",
      whyCompanyAsks: "Bitwise XOR problem solving is a hallmark of Google technical interview questions."
    },
    {
      id: "goog-q6",
      question: "How is a cycle detected in a directed graph using Depth-First Search (DFS)?",
      frequencyTag: "⭐ Google Graph Traversal Interview Question",
      topic: "Graphs • Cycle Detection via 3-Coloring",
      options: [
        "By checking if number of edges equals vertices",
        "By using 3-color states (White = unvisited, Gray = visiting, Black = visited) and detecting a back-edge to a Gray node",
        "By running Dijkstra's algorithm",
        "By computing connected components using Union-Find"
      ],
      correctAnswer: 1,
      explanation: "A back-edge pointing to an ancestor currently on the active recursion stack (Gray state) confirms a cycle in a directed graph.",
      whyCompanyAsks: "Google tests formal cycle detection in directed dependency graphs and deadlocks."
    },
    {
      id: "goog-q7",
      question: "What is the optimal time complexity to solve the Longest Increasing Subsequence (LIS) problem using Patience Sorting and Binary Search?",
      frequencyTag: "⭐ Google Classic LeetCode 300 Repeat",
      topic: "Dynamic Programming & Binary Search • LIS",
      options: ["O(N^2)", "O(N log N)", "O(2^N)", "O(N)"],
      correctAnswer: 1,
      explanation: "Maintaining the tails array and inserting elements via binary search (C++ `std::lower_bound`) solves LIS in O(N log N) time.",
      whyCompanyAsks: "Google looks for candidates who optimize O(N^2) dynamic programming to O(N log N) via binary search."
    },
    {
      id: "goog-q8",
      question: "Which algorithm computes the Topological Ordering of a Directed Acyclic Graph (DAG) using in-degrees and a Queue in O(V + E) time?",
      frequencyTag: "⭐ Google Course Schedule / Build Order Problem",
      topic: "Graphs • Kahn's Algorithm",
      options: ["Prim's Algorithm", "Kahn's Algorithm (BFS-based Topological Sort)", "Bellman-Ford Algorithm", "Kosaraju's Algorithm"],
      correctAnswer: 1,
      explanation: "Kahn's algorithm pushes all nodes with in-degree 0 into a Queue and continuously decrements neighbor in-degrees, producing a valid linear order in O(V + E) time.",
      whyCompanyAsks: "Kahn's algorithm is tested in almost every Google build dependency and scheduling problem."
    },
    {
      id: "goog-q9",
      question: "What is the optimal time complexity to find the 'Longest Substring Without Repeating Characters' using the Sliding Window and Hash Map approach?",
      frequencyTag: "⭐ Google OA Most Frequent String Problem",
      topic: "Sliding Window • Hash Tables",
      options: ["O(N^2)", "O(N log N)", "O(N)", "O(2^N)"],
      correctAnswer: 2,
      explanation: "A sliding window expands right and contracts left whenever a duplicate is found, visiting each character at most twice, resulting in O(N) time.",
      whyCompanyAsks: "Sliding window optimization is a foundational benchmark for all Google SWE candidates."
    },
    {
      id: "goog-q10",
      question: "In Kruskal's Minimum Spanning Tree (MST) algorithm, which data structure is used to prevent cycles while adding edges in greedy weight order?",
      frequencyTag: "⭐ Google MST & Disjoint Sets",
      topic: "Data Structures • Disjoint Set Union (Union-Find)",
      options: ["Stack", "Disjoint Set Union (DSU) with Path Compression and Union by Rank", "Binary Search Tree", "Trie"],
      correctAnswer: 1,
      explanation: "DSU checks if two endpoints are already in the same connected component in nearly O(1) time using path compression and union by rank.",
      whyCompanyAsks: "Google emphasizes Disjoint Set Union for network clustering and connectivity problems."
    },
    {
      id: "goog-q11",
      question: "In a standard Trie (Prefix Tree) storing lowercase English words, what is the maximum number of child pointers each node must maintain?",
      frequencyTag: "⭐ Google Autocomplete & Trie Question",
      topic: "Data Structures • Trie Node Fan-out",
      options: ["2", "10", "26", "256"],
      correctAnswer: 2,
      explanation: "Since lowercase English consists of letters 'a' through 'z', each Trie node maintains an array of 26 pointers `TrieNode* children[26]`.",
      whyCompanyAsks: "Trie architecture directly powers Google's core search autocomplete infrastructure."
    },
    {
      id: "goog-q12",
      question: "What is the time complexity to find the Lowest Common Ancestor (LCA) of two nodes in a general Binary Tree using single-pass bottom-up recursion?",
      frequencyTag: "⭐ High-Frequency Google Binary Tree Question",
      topic: "Trees • Lowest Common Ancestor (LCA)",
      options: ["O(N^2)", "O(N)", "O(log N) always", "O(N log N)"],
      correctAnswer: 1,
      explanation: "Bottom-up recursion visits each node of the binary tree at most once, evaluating left and right subtree returns in O(N) time.",
      whyCompanyAsks: "LCA is one of the most repeatedly asked tree problems in Google coding interviews."
    },
    {
      id: "goog-q13",
      question: "Which randomized algorithm allows selecting K items uniformly at random from a stream of unknown or infinite length N in a single pass?",
      frequencyTag: "⭐ Google Data Streaming & Probability Assessment",
      topic: "Randomized Algorithms • Reservoir Sampling",
      options: ["Fisher-Yates Shuffle", "Reservoir Sampling", "Monte Carlo Sampling", "Bloom Filtering"],
      correctAnswer: 1,
      explanation: "Reservoir Sampling keeps a reservoir of K elements. For each subsequent i-th element, it replaces a random reservoir element with probability K/i.",
      whyCompanyAsks: "Handling big data streams without loading the entire dataset into RAM is fundamental at Google scale."
    },
    {
      id: "goog-q14",
      question: "In distributed caching systems, what technique uses a hash ring and virtual nodes to ensure that adding or removing a cache server only remaps `K / N` keys?",
      frequencyTag: "⭐ Google Distributed Systems Benchmark",
      topic: "Distributed Systems • Consistent Hashing",
      options: ["Round Robin DNS", "Consistent Hashing", "Modulo Hashing", "Two-Phase Commit"],
      correctAnswer: 1,
      explanation: "Consistent Hashing maps both keys and servers onto a circular 360-degree ring, minimizing key migration during cluster scale up/down.",
      whyCompanyAsks: "Consistent Hashing is the core of distributed cache routing (Memcached, Bigtable, Google Cloud)."
    },
    {
      id: "goog-q15",
      question: "In the Edit Distance (Levenshtein Distance) problem between strings of length M and N, which three operations define the recursive transitions?",
      frequencyTag: "⭐ Google Dynamic Programming Classic",
      topic: "Dynamic Programming • String Alignment",
      options: [
        "Push, Pop, Peek",
        "Insert, Delete, Replace",
        "Split, Merge, Sort",
        "Encode, Decode, Compress"
      ],
      correctAnswer: 1,
      explanation: "Transforming word1 to word2 uses `1 + min(insert(i, j-1), delete(i-1, j), replace(i-1, j-1))` with base cases in O(M * N) dynamic programming.",
      whyCompanyAsks: "Edit distance powers spellcheck and DNA sequence alignment, heavily evaluated at Google."
    }
  ]
};
