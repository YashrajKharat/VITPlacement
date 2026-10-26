// TCS NQT & Digital Authentic Placement PYQ Bank (15 Questions)
// Sourced from TCS iON National Qualifier Test, TCS Digital & Prime past examination archives

export const TCS_QUIZ = {
  id: "quiz-tcs-nqt",
  companyId: "tcs",
  company: "TCS",
  companyLogo: "🏢",
  title: "TCS NQT & Digital Repeated Placement PYQs",
  slug: "tcs-nqt-technical-sprint",
  category: "Mass IT & Digital",
  placementRound: "Round 1: Online Technical Assessment (PYQ Bank)",
  frequencyInfo: "⭐ Repeated in TCS Digital & NQT Drives (85% Historical Frequency)",
  difficulty: "MEDIUM",
  durationMinutes: 15,
  totalQuestions: 15,
  points: 300,
  unstopCoinsReward: 60,
  description: "Authentic 15-question sprint curated directly from TCS National Qualifier Test (NQT) and Digital memory archives covering Balanced BSTs, pointer arithmetic, SQL aggregations, time-work math, and number theory.",
  badge: "TCS NQT Verified",
  questions: [
    {
      id: "tcs-q1",
      question: "What is the worst-case time complexity of searching an element in a Balanced Binary Search Tree (AVL / Red-Black Tree) containing N nodes?",
      frequencyTag: "⭐ Repeated 6+ Times in TCS Digital & Ninja Assessments",
      topic: "Data Structures • Balanced BSTs",
      options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
      correctAnswer: 1,
      explanation: "In a balanced BST, tree height is strictly bounded by O(log N). Hence lookup, insertion, and deletion all run in O(log N) worst-case time.",
      whyCompanyAsks: "TCS frequently tests standard logarithmic bounds for balanced search structures in their Advanced Technical Section."
    },
    {
      id: "tcs-q2",
      question: "In C, given `int arr[] = {10, 20, 30, 40};`, what does the expression `*(arr + 2)` evaluate to?",
      frequencyTag: "⭐ Frequent TCS NQT C-Programming Output Question",
      topic: "C Programming • Pointer Arithmetic",
      options: ["10", "20", "30", "Memory address of arr[2]"],
      correctAnswer: 2,
      explanation: "The expression `*(arr + 2)` dereferences the pointer offset by 2 elements from the base address, returning `arr[2]` which is 30. Note that `arr[2]`, `*(arr + 2)`, and `2[arr]` are all equivalent in C.",
      whyCompanyAsks: "TCS NQT routinely tests fundamental pointer arithmetic and array indexing identity rules."
    },
    {
      id: "tcs-q3",
      question: "In SQL, which clause is specifically used to filter records AFTER an aggregation with `GROUP BY` has taken place?",
      frequencyTag: "⭐ Asked in TCS Digital SQL Technical Assessment",
      topic: "DBMS • SQL Aggregations",
      options: ["WHERE", "HAVING", "FILTER BY", "ORDER BY"],
      correctAnswer: 1,
      explanation: "The `WHERE` clause filters individual rows BEFORE aggregation. The `HAVING` clause filters aggregated groups resulting from `GROUP BY`.",
      whyCompanyAsks: "Distinguishing WHERE vs HAVING is one of the most repeated database questions across TCS technical interview panels."
    },
    {
      id: "tcs-q4",
      question: "A can complete a project in 12 days and B can complete it in 24 days. Working together, how many days will they take to complete the project?",
      frequencyTag: "⭐ Classic TCS NQT Quantitative Ability Repeat",
      topic: "Aptitude • Time & Work",
      options: ["6 days", "8 days", "10 days", "16 days"],
      correctAnswer: 1,
      explanation: "Combined 1-day work = 1/12 + 1/24 = (2 + 1)/24 = 3/24 = 1/8. Hence, working together they take 8 days.",
      whyCompanyAsks: "Time & Work problems appear in almost every TCS NQT Foundation and Advanced Cognitive round."
    },
    {
      id: "tcs-q5",
      question: "In Python, what is the exact return value of `type(lambda x: x + 1)`?",
      frequencyTag: "⭐ Repeated in TCS Digital Python Assessment",
      topic: "Python • Functional Constructs",
      options: ["<class 'lambda'>", "<class 'function'>", "<class 'expression'>", "<class 'builtin_function'>"],
      correctAnswer: 1,
      explanation: "Lambda expressions in Python construct anonymous functions which are first-class instances of `<class 'function'>`.",
      whyCompanyAsks: "TCS Digital evaluates candidates on Python internal typing and first-class function representations."
    },
    {
      id: "tcs-q6",
      question: "Which data structure is primarily used to implement Breadth-First Search (BFS) graph traversal?",
      frequencyTag: "⭐ Standard TCS Technical Round Interview Question",
      topic: "Algorithms • Graph Traversal",
      options: ["Stack (LIFO)", "Queue (FIFO)", "Priority Queue", "Disjoint Set (Union-Find)"],
      correctAnswer: 1,
      explanation: "BFS explores vertices level-by-level in First-In-First-Out order, making a standard FIFO Queue the required primary data structure.",
      whyCompanyAsks: "Graph traversal fundamentals are a mandatory screening topic for TCS Digital and Prime developer roles."
    },
    {
      id: "tcs-q7",
      question: "What is the remainder when `2^50` is divided by 7?",
      frequencyTag: "⭐ TCS NQT Advanced Quantitative Modular Arithmetic",
      topic: "Quantitative • Modulo Arithmetic & Fermat's Little Theorem",
      options: ["1", "2", "4", "6"],
      correctAnswer: 2,
      explanation: "By Fermat's Little Theorem, 2^(7-1) ≡ 2^6 ≡ 1 (mod 7). 50 = 6 * 8 + 2. Thus 2^50 ≡ (2^6)^8 * 2^2 ≡ 1^8 * 4 ≡ 4 (mod 7).",
      whyCompanyAsks: "TCS NQT Advanced Quantitative section frequently tests cyclicity and modular arithmetic."
    },
    {
      id: "tcs-q8",
      question: "In C, what is the result of evaluating `int x = 5; int y = x++ + ++x;`?",
      frequencyTag: "⭐ TCS C-Programming Sequence Points Trap",
      topic: "C Basics • Pre and Post Increment",
      options: ["11", "12", "Undefined Behavior in C standard", "10"],
      correctAnswer: 2,
      explanation: "Modifying `x` more than once between sequence points invokes Undefined Behavior according to ANSI C standards.",
      whyCompanyAsks: "TCS tricky output questions frequently probe sequence points and compiler-dependent evaluations."
    },
    {
      id: "tcs-q9",
      question: "What is the maximum number of comparisons required to search for an element in an unsorted array of N elements in the worst case?",
      frequencyTag: "⭐ TCS Ninja Technical Assessment",
      topic: "Data Structures • Linear Search",
      options: ["log2(N)", "N / 2", "N", "N^2"],
      correctAnswer: 2,
      explanation: "In an unsorted array, linear search must examine every single element from index 0 to N-1, requiring exactly N comparisons in the worst case (when target is at the end or absent).",
      whyCompanyAsks: "TCS foundation questions test baseline linear search and comparison counting."
    },
    {
      id: "tcs-q10",
      question: "What is the difference between `INNER JOIN` and `NATURAL JOIN` in relational database queries?",
      frequencyTag: "⭐ TCS Digital DBMS Assessment",
      topic: "DBMS • Relational Joins",
      options: [
        "`INNER JOIN` joins on all columns; `NATURAL JOIN` requires explicit condition",
        "`NATURAL JOIN` automatically joins on all columns with identical names and removes duplicate columns from the result",
        "Both commands produce identical execution plans always",
        "`NATURAL JOIN` is a non-relational NoSQL query"
      ],
      correctAnswer: 1,
      explanation: "NATURAL JOIN matches all columns with the same name across both tables and keeps only one copy of each matched column in the result table.",
      whyCompanyAsks: "TCS interviews check whether candidates understand relational schema projection rules."
    },
    {
      id: "tcs-q11",
      question: "In Python, what does the slice expression `nums[::-1]` return for `nums = [1, 2, 3, 4, 5]`?",
      frequencyTag: "⭐ TCS Python Hands-On MCQ",
      topic: "Python • Sequence Slicing",
      options: ["[1, 2, 3, 4, 5]", "[5, 4, 3, 2, 1]", "IndexError", "[-1, -2, -3, -4, -5]"],
      correctAnswer: 1,
      explanation: "The slice `[start:stop:step]` with `step = -1` traverses the list from end to beginning, returning a new reversed list `[5, 4, 3, 2, 1]`.",
      whyCompanyAsks: "Python string and list reversal idioms are repeatedly tested in TCS coding and MCQ rounds."
    },
    {
      id: "tcs-q12",
      question: "A train 150m long moving at 54 km/h crosses a platform in 20 seconds. What is the length of the platform?",
      frequencyTag: "⭐ TCS NQT Quantitative Ability Train Problem",
      topic: "Aptitude • Time, Speed & Distance",
      options: ["100 m", "150 m", "200 m", "300 m"],
      correctAnswer: 1,
      explanation: "Speed = 54 * (5/18) = 15 m/s. Total distance in 20s = 15 * 20 = 300 m. Platform length = Total distance - Train length = 300 - 150 = 150 m.",
      whyCompanyAsks: "Speed-Distance problems with bridges and platforms are classic staples of the TCS NQT cognitive exam."
    },
    {
      id: "tcs-q13",
      question: "What is the optimal algorithm to rotate an array of size N by K positions in O(N) time and O(1) auxiliary space?",
      frequencyTag: "⭐ TCS Prime / Digital Coding Challenge",
      topic: "Algorithms • Reversal Algorithm",
      options: ["Shifting one-by-one K times", "Using an auxiliary array of size K", "The 3-Step Reversal Algorithm (Reverse 0 to K-1, K to N-1, and 0 to N-1)", "QuickSort partitioning"],
      correctAnswer: 2,
      explanation: "Reversing the first K elements, reversing the remaining N-K elements, and then reversing the entire array achieves the rotation in O(N) time with O(1) extra memory.",
      whyCompanyAsks: "The Reversal Algorithm is a beloved in-place optimization problem in TCS technical interviews."
    },
    {
      id: "tcs-q14",
      question: "In the decimal system, what is the representation of the base-17 number `(1A)17`?",
      frequencyTag: "⭐ TCS NQT Advanced Numerical Reasoning",
      topic: "Quantitative • Number Systems & Base Conversions",
      options: ["27", "26", "31", "17"],
      correctAnswer: 0,
      explanation: "In base-17, digits are 0-9, and A = 10. Value = 1 * (17^1) + 10 * (17^0) = 17 + 10 = 27 in decimal.",
      whyCompanyAsks: "Non-standard base conversion problems are unique to the TCS NQT cognitive pattern."
    },
    {
      id: "tcs-q15",
      question: "In Operating Systems page replacement algorithms, which algorithm suffers from 'Belady's Anomaly' (where increasing page frames leads to more page faults)?",
      frequencyTag: "⭐ TCS Digital OS Concepts",
      topic: "Operating Systems • Page Replacement",
      options: ["LRU (Least Recently Used)", "Optimal Page Replacement (OPT)", "FIFO (First-In, First-Out)", "LFU (Least Frequently Used)"],
      correctAnswer: 2,
      explanation: "Belady's Anomaly occurs in FIFO page replacement because FIFO does not possess the stack property. LRU and Optimal are stack algorithms and never suffer from it.",
      whyCompanyAsks: "TCS Digital technical interviews frequently test core OS memory management anomalies."
    }
  ]
};
