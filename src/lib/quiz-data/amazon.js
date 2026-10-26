// Amazon SDE-1 OA & Technical Screen Authentic Placement PYQ Bank (15 Questions)
// Sourced from HackerRank Amazon Campus OA, Work Simulation, and SDE-1 Technical Round archives

export const AMAZON_QUIZ = {
  id: "quiz-amazon-sde",
  companyId: "amazon",
  company: "Amazon",
  companyLogo: "📦",
  title: "Amazon SDE-1 OA Repeated Questions",
  slug: "amazon-sde-oa-sprint",
  category: "Product & Cloud",
  placementRound: "Round 1: Online Assessment (OA Part 1 & 2)",
  frequencyInfo: "⭐ Repeated in 90%+ of Amazon SDE-1 Campus Online Assessments",
  difficulty: "HARD",
  durationMinutes: 20,
  totalQuestions: 15,
  points: 350,
  unstopCoinsReward: 80,
  description: "Curated 15-question sprint directly from verified Amazon SDE-1 OA rounds covering LRU Cache internals, Two Pointers, Top K Heaps, Monotonic Queues, Multi-Source BFS, and Amazon Leadership Principles.",
  badge: "Amazon OA Verified",
  questions: [
    {
      id: "amz-q1",
      question: "To implement an LRU (Least Recently Used) Cache with O(1) average time complexity for both `get` and `put` operations, which combination of data structures is optimal?",
      frequencyTag: "⭐ Asked in 90%+ of Amazon SDE-1 Technical Rounds",
      topic: "System Design & DSA • LRU Cache",
      options: ["HashMap + Singly Linked List", "HashMap + Doubly Linked List", "Binary Heap + Array", "Balanced BST + Queue"],
      correctAnswer: 1,
      explanation: "The HashMap provides O(1) key-to-node lookup, while the Doubly Linked List enables O(1) node removal and re-insertion at the head for recency tracking.",
      whyCompanyAsks: "LRU Cache is the single most iconic Amazon interview question worldwide, testing practical data structure synthesis."
    },
    {
      id: "amz-q2",
      question: "Given a sorted array of N numbers, what is the optimal time and auxiliary space complexity to determine if any two numbers sum to target X using the Two-Pointer approach?",
      frequencyTag: "⭐ Repeated Amazon OA Classic (Two Pointers)",
      topic: "Algorithms • Two Pointers",
      options: ["O(N^2) time, O(1) space", "O(N log N) time, O(N) space", "O(N) time, O(1) space", "O(1) time, O(N) space"],
      correctAnswer: 2,
      explanation: "By placing pointers at the start and end and incrementing/decrementing based on current sum vs target, we inspect each element at most once: O(N) time and O(1) auxiliary space.",
      whyCompanyAsks: "Amazon heavily emphasizes space-efficient two-pointer patterns over allocating extra hash tables."
    },
    {
      id: "amz-q3",
      question: "Which data structure is optimal to continuously find the 'Top K Frequent Elements' from a stream of N elements in O(N log K) time?",
      frequencyTag: "⭐ Repeated Amazon Campus OA Problem",
      topic: "Heaps • Top K Pattern",
      options: ["Max-Heap of size N", "Min-Heap of size K", "QuickSort on entire array", "Stack of size K"],
      correctAnswer: 1,
      explanation: "Maintaining a Min-Heap of size K evicts the minimum element whenever size exceeds K. Inserting N elements takes O(N log K), saving both time and heap memory.",
      whyCompanyAsks: "Top K patterns directly mirror Amazon's real-world product recommendation and trending search architectures."
    },
    {
      id: "amz-q4",
      question: "According to Amazon's Leadership Principles, if a critical software flaw is identified hours before a major product launch, which principle dictates delaying launch to resolve it?",
      frequencyTag: "⭐ Amazon OA Part 2: Work Simulation & LP Round",
      topic: "Leadership Principles • Customer Obsession",
      options: ["Bias for Action", "Customer Obsession & Insist on the Highest Standards", "Frugality", "Deliver Results at all costs"],
      correctAnswer: 1,
      explanation: "While 'Bias for Action' values calculated risk, 'Customer Obsession' and 'Insist on Highest Standards' strictly prohibit releasing broken software that damages customer trust.",
      whyCompanyAsks: "Amazon's OA Part 2 evaluates cultural fit using situational behavioral scenarios mapped directly to their 16 LPs."
    },
    {
      id: "amz-q5",
      question: "What is the optimal amortized time complexity to find the maximum element in every sliding window of size K across an array of length N?",
      frequencyTag: "⭐ Frequent Amazon SDE OA Coding Challenge",
      topic: "Monotonic Queue • Sliding Window",
      options: ["O(N * K)", "O(N log K)", "O(N) amortized using a Monotonic Deque", "O(N^2)"],
      correctAnswer: 2,
      explanation: "A monotonic decreasing deque stores candidate indices. Each element is pushed and popped at most once across the entire traversal, yielding O(N) amortized time.",
      whyCompanyAsks: "Sliding window optimization is a staple of Amazon's OA coding rounds."
    },
    {
      id: "amz-q6",
      question: "In Object-Oriented Design for an Amazon Locker / Parking Lot system, which creational pattern is ideal for instantiating different locker/ticket types (Small, Medium, XL) based on package size?",
      frequencyTag: "⭐ Standard Amazon LLD (Low Level Design) Question",
      topic: "Design Patterns • Factory Method",
      options: ["Singleton Pattern", "Factory Pattern", "Observer Pattern", "Decorator Pattern"],
      correctAnswer: 1,
      explanation: "The Factory Pattern encapsulates the creation logic and decouples the client from knowing the exact concrete class instantiated.",
      whyCompanyAsks: "Amazon Low-Level Design rounds evaluate modularity and adherence to SOLID design principles."
    },
    {
      id: "amz-q7",
      question: "In the 'Rotting Oranges' problem on an R x C grid, which algorithm is used to find the minimum time until all fresh oranges rot?",
      frequencyTag: "⭐ Amazon OA #1 Most Repeated BFS Problem",
      topic: "Graphs / Grids • Multi-Source BFS",
      options: ["Depth-First Search (DFS)", "Multi-Source Breadth-First Search (BFS)", "Dijkstra's Algorithm", "Binary Search on time"],
      correctAnswer: 1,
      explanation: "All initially rotten oranges are enqueued into a Queue simultaneously. Multi-source BFS processes grid expansion minute-by-minute in O(R * C) time.",
      whyCompanyAsks: "Multi-source BFS is a hallmark of Amazon OA grid simulation questions."
    },
    {
      id: "amz-q8",
      question: "In the 'Trapping Rain Water' problem, how can maximum water trapped between elevation bars be computed in O(1) auxiliary space?",
      frequencyTag: "⭐ Amazon Top 10 Hard OA Repeat",
      topic: "Two Pointers • Space Optimization",
      options: [
        "By allocating two arrays `leftMax` and `rightMax` of size N",
        "By using two pointers `left` and `right` with maintained `left_max` and `right_max` variables",
        "By building a segment tree",
        "By sorting the heights"
      ],
      correctAnswer: 1,
      explanation: "Since trapped water at any bar is bounded by the smaller of `left_max` and `right_max`, the two-pointer technique solves it in O(N) time and strictly O(1) auxiliary space.",
      whyCompanyAsks: "Amazon interviewers consistently challenge candidates to eliminate O(N) auxiliary space arrays."
    },
    {
      id: "amz-q9",
      question: "How can you validate whether a Binary Tree is a valid Binary Search Tree (BST) without allowing duplicate violations?",
      frequencyTag: "⭐ Amazon Technical Interview Classic",
      topic: "Trees • BST Validation",
      options: [
        "Check only that `root.val > root.left.val` and `root.val < root.right.val` locally",
        "Pass recursive valid ranges `(min_val, max_val)` down the tree or perform an Inorder traversal to verify strictly increasing order",
        "Check if left and right heights are equal",
        "Perform a level order traversal"
      ],
      correctAnswer: 1,
      explanation: "A valid BST requires ALL nodes in the left subtree to be strictly less than the root, not just the immediate child. Passing `(min, max)` boundaries guarantees this.",
      whyCompanyAsks: "Testing local child vs global subtree properties is a common trap in Amazon technical interviews."
    },
    {
      id: "amz-q10",
      question: "Under Amazon's Leadership Principle 'Have Backbone; Disagree and Commit', what should an engineer do after passionately debating against a design that the team ultimately votes to adopt?",
      frequencyTag: "⭐ Amazon Behavioral LP Scenario",
      topic: "Leadership Principles • Disagree and Commit",
      options: [
        "Refuse to work on the module",
        "Escalate repeatedly until leadership agrees with you",
        "Commit entirely to the chosen decision and work diligently toward its success without cynicism",
        "Work in secret on your own alternate design"
      ],
      correctAnswer: 2,
      explanation: "'Disagree and Commit' requires vigorously debating during the decision phase, but once a decision is made, committing 100% to its execution.",
      whyCompanyAsks: "Team cohesion and professional execution are critical behavioral benchmarks at Amazon."
    },
    {
      id: "amz-q11",
      question: "What is the optimal time complexity to merge K sorted linked lists containing a total of N nodes?",
      frequencyTag: "⭐ Amazon SDE OA Classic",
      topic: "Heaps • PriorityQueue K-Way Merge",
      options: ["O(N * K)", "O(N log K)", "O(N^2)", "O(K log N)"],
      correctAnswer: 1,
      explanation: "Using a Min-Heap of size K containing the current head of each list, extracting min and advancing takes O(log K) per node, totaling O(N log K) time.",
      whyCompanyAsks: "K-way merge is repeatedly tested in Amazon log aggregation and search indexing problems."
    },
    {
      id: "amz-q12",
      question: "In the 'Course Schedule' problem (LeetCode 207), how do you determine if a student can finish all courses given prerequisite dependencies?",
      frequencyTag: "⭐ Amazon Campus OA Problem",
      topic: "Graphs • Topological Sort Cycle Check",
      options: [
        "Calculate the shortest path between course 0 and N",
        "Check if the directed prerequisite graph contains a cycle (using Kahn's algorithm or DFS)",
        "Check if the graph is bipartite",
        "Find the minimum spanning tree"
      ],
      correctAnswer: 1,
      explanation: "If a cycle exists among course dependencies, courses cannot be completed. Detecting cycles via Kahn's BFS or DFS confirms feasibility.",
      whyCompanyAsks: "Dependency resolution is directly applicable to AWS package managers and deployment pipelines."
    },
    {
      id: "amz-q13",
      question: "Which design pattern is best suited for an Amazon Order Processing system where placing an order must automatically notify the SMS Service, Email Service, and Inventory Service?",
      frequencyTag: "⭐ Amazon System Architecture & LLD",
      topic: "Design Patterns • Observer Pattern",
      options: ["Singleton Pattern", "Observer Pattern (Publish-Subscribe)", "Adapter Pattern", "Composite Pattern"],
      correctAnswer: 1,
      explanation: "The Observer pattern defines a one-to-many dependency so that when one subject changes state, all its registered dependents are notified and updated automatically.",
      whyCompanyAsks: "Event-driven architectures using Amazon SNS/SQS directly employ the Observer/Pub-Sub paradigm."
    },
    {
      id: "amz-q14",
      question: "Under Amazon's LP 'Ownership', how should an SDE-1 respond when a bug in a legacy service impacts their feature, but the legacy team is busy?",
      frequencyTag: "⭐ Amazon Leadership Principles",
      topic: "Leadership Principles • Ownership",
      options: [
        "Say 'that is not my job' and wait indefinitely",
        "Investigate the legacy codebase, propose a fix or workaround, and take accountability for unblocking the customer experience",
        "Delete the feature",
        "File a complaint with HR"
      ],
      correctAnswer: 1,
      explanation: "Leaders are owners. They think long term and don’t sacrifice long-term value for short-term results. They never say 'that’s not my job.'",
      whyCompanyAsks: "Amazon prioritizes candidates who show initiative and break down silos."
    },
    {
      id: "amz-q15",
      question: "To reorganize a string such that no two adjacent characters are identical, which greedy data structure approach is optimal?",
      frequencyTag: "⭐ Amazon OA Frequent String Problem",
      topic: "Greedy Algorithms • Max-Heap with Cooldown",
      options: [
        "Sort string alphabetically",
        "Use a Max-Heap based on character frequencies and greedily place the most frequent character with a 1-step cooldown",
        "Use a FIFO Queue",
        "Compute all permutations"
      ],
      correctAnswer: 1,
      explanation: "A Max-Heap prioritizes placing the highest frequency character while holding the previously placed character in a temporary variable until the next step.",
      whyCompanyAsks: "Frequency-based greedy placement with constraints is a staple of Amazon coding tests."
    }
  ]
};
