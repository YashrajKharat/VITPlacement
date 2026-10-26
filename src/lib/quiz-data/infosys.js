// Infosys SP / DSE & InfyTQ Authentic Placement PYQ Bank (15 Questions)
// Sourced from HackWithInfy, Infosys Specialist Programmer (9.5 LPA), and InfyTQ Certification archives

export const INFOSYS_QUIZ = {
  id: "quiz-infosys-sp",
  companyId: "infosys",
  company: "Infosys",
  companyLogo: "🔷",
  title: "Infosys SP / DSE Pseudocode & DSA Bank",
  slug: "infosys-sp-dse-bank",
  category: "Mass IT & High-Package",
  placementRound: "Round 1: HackWithInfy & SP Technical Assessment",
  frequencyInfo: "⭐ Tested in Infosys Specialist Programmer (SP) & InfyTQ",
  difficulty: "MEDIUM",
  durationMinutes: 15,
  totalQuestions: 15,
  points: 300,
  unstopCoinsReward: 60,
  description: "Curated 15-question sprint directly from Infosys SP (Specialist Programmer) and DSE recruitment archives covering tricky pseudocode, matrix searching, Java OOPs, Kadane's algorithm, 3NF, and String Constant Pool.",
  badge: "Infosys SP Verified",
  questions: [
    {
      id: "infy-q1",
      question: "What is the return value of `fun(4, 3)` given the recursive pseudocode:\n`Integer fun(Integer a, Integer b)\n  If(b == 0) Return 0\n  Return a + fun(a, b - 1)`?",
      frequencyTag: "⭐ Repeated in Infosys SP / DSE Pseudocode Round",
      topic: "Pseudocode • Recursion",
      options: ["7", "12", "64", "0"],
      correctAnswer: 1,
      explanation: "The function recursively adds `a` exactly `b` times: 4 + 4 + 4 + 0 = 12. This is recursive multiplication.",
      whyCompanyAsks: "Infosys pseudocode sections test rapid recursion tracing under tight time constraints."
    },
    {
      id: "infy-q2",
      question: "What is the time complexity of searching a target value in an N x M matrix where both rows and columns are independently sorted in ascending order (Staircase Search)?",
      frequencyTag: "⭐ Infosys HackWithInfy Favorite Problem",
      topic: "Matrix Algorithms • Staircase Search",
      options: ["O(N * M)", "O(N log M)", "O(N + M)", "O(log(N * M))"],
      correctAnswer: 2,
      explanation: "Starting at the top-right corner, if target is smaller we move left (column--); if target is larger we move down (row++). At most N + M steps are executed.",
      whyCompanyAsks: "Infosys tests candidates' ability to avoid naive O(N*M) scans on partially ordered structures."
    },
    {
      id: "infy-q3",
      question: "In Java, what occurs when a subclass defines a `static` method with the exact same name and signature as a `static` method in the parent class?",
      frequencyTag: "⭐ Repeated Infosys Java Technical MCQ",
      topic: "Java OOPs • Method Hiding",
      options: ["Method Overriding with Dynamic Dispatch", "Method Hiding (Resolved at Compile Time)", "Compilation Error", "Runtime Exception"],
      correctAnswer: 1,
      explanation: "Static methods cannot be overridden dynamically because they are bound at compile time to the reference class, not the runtime object. This is known as Method Hiding.",
      whyCompanyAsks: "Infosys technical rounds heavily stress Java language edge cases and OOP fundamentals."
    },
    {
      id: "infy-q4",
      question: "What is the worst-case time complexity of the Knuth-Morris-Pratt (KMP) string pattern matching algorithm for text of length N and pattern of length M?",
      frequencyTag: "⭐ Infosys Specialist Programmer Coding Concept",
      topic: "Strings • KMP Pattern Matching",
      options: ["O(N * M)", "O(N + M)", "O(N log M)", "O(M^2)"],
      correctAnswer: 1,
      explanation: "The KMP algorithm constructs the LPS (Longest Prefix Suffix) array in O(M) time and scans the text in O(N) time without backtracking, yielding O(N + M) total worst-case time.",
      whyCompanyAsks: "String pattern searching is frequently tested in high-package Infosys SP coding challenges."
    },
    {
      id: "infy-q5",
      question: "Which block in Java exception handling will execute regardless of whether an exception is thrown or caught, unless `System.exit(0)` is invoked?",
      frequencyTag: "⭐ Standard Infosys Technical Interview Question",
      topic: "Java • Exception Handling",
      options: ["catch block", "finally block", "throws clause", "finalizer"],
      correctAnswer: 1,
      explanation: "The `finally` block is guaranteed to execute for resource cleanup, irrespective of normal termination or uncaught exceptions.",
      whyCompanyAsks: "Resource safety and robust exception handling are core requirements for enterprise software roles at Infosys."
    },
    {
      id: "infy-q6",
      question: "What is the optimal time complexity to find the maximum contiguous subarray sum using Kadane's algorithm?",
      frequencyTag: "⭐ High-Frequency Infosys Coding Problem",
      topic: "Dynamic Programming • Kadane's Algorithm",
      options: ["O(N^2)", "O(N log N)", "O(N)", "O(1)"],
      correctAnswer: 2,
      explanation: "Kadane's algorithm iterates through the array once maintaining `max_ending_here = max(x, max_ending_here + x)` in linear O(N) time and O(1) space.",
      whyCompanyAsks: "Kadane's algorithm is one of the most repeatedly asked dynamic programming problems in campus recruitment."
    },
    {
      id: "infy-q7",
      question: "In Java, what is the key difference in memory allocation between `ArrayList` and `LinkedList`?",
      frequencyTag: "⭐ Infosys Core Java Collections",
      topic: "Java Collections • Memory Locality",
      options: [
        "`LinkedList` uses contiguous memory blocks; `ArrayList` uses node pointers",
        "`ArrayList` stores elements in a contiguous dynamic array offering CPU cache locality; `LinkedList` allocates non-contiguous doubly linked node objects with pointer overhead",
        "Both use contiguous array storage",
        "`ArrayList` does not support indexing"
      ],
      correctAnswer: 1,
      explanation: "ArrayList uses a contiguous backing array with high CPU cache spatial locality, while LinkedList incurs 24+ bytes of pointer overhead per element and causes cache misses.",
      whyCompanyAsks: "Infosys evaluates memory efficiency and data structure selection in enterprise architectures."
    },
    {
      id: "infy-q8",
      question: "What is the standard algorithm to rotate an N x N 2D matrix 90 degrees clockwise in-place in O(1) extra space?",
      frequencyTag: "⭐ Infosys SP / DSE 2D Matrix Problem",
      topic: "Matrix Algorithms • In-Place Rotation",
      options: [
        "Sort each row then each column",
        "Transpose the matrix, then reverse each row",
        "Reverse each row, then transpose the matrix",
        "Allocate a new matrix and copy elements"
      ],
      correctAnswer: 1,
      explanation: "Transposing the matrix (swapping `matrix[i][j]` with `matrix[j][i]`) followed by reversing each individual row rotates the matrix 90 degrees clockwise in-place.",
      whyCompanyAsks: "In-place matrix rotation is a classic HackWithInfy problem testing index manipulation."
    },
    {
      id: "infy-q9",
      question: "In Java, how does the String Constant Pool (SCP) treat `String s1 = \"Hello\";` versus `String s2 = new String(\"Hello\");`?",
      frequencyTag: "⭐ Infosys Java Memory Model Favorite",
      topic: "Java • String Pool & Heap Memory",
      options: [
        "Both create objects exclusively in SCP",
        "`s1` refers directly to the literal pooled in SCP; `s2` forces creation of a separate new String object in normal Heap memory",
        "Both are stored in the Call Stack",
        "`s2` is garbage collected immediately"
      ],
      correctAnswer: 1,
      explanation: "String literals are internalized in the String Constant Pool to save memory. `new String()` always allocates a new object in the general heap.",
      whyCompanyAsks: "String immutability and pool caching are tested in every Infosys technical interview."
    },
    {
      id: "infy-q10",
      question: "In relational database design, what dependency does the Third Normal Form (3NF) strictly eliminate?",
      frequencyTag: "⭐ Infosys Database Normalization",
      topic: "DBMS • Normalization",
      options: ["Partial Dependencies", "Transitive Dependencies", "Multi-valued Dependencies", "Join Dependencies"],
      correctAnswer: 1,
      explanation: "2NF eliminates Partial Functional Dependencies (dependencies on part of a composite primary key). 3NF eliminates Transitive Dependencies ($X \\rightarrow Y$ and $Y \\rightarrow Z$).",
      whyCompanyAsks: "Infosys enterprise clients demand rigorous database normalization design principles."
    },
    {
      id: "infy-q11",
      question: "In a tree containing V vertices, what is the exact number of edges present?",
      frequencyTag: "⭐ Infosys Graph Theory MCQ",
      topic: "Discrete Mathematics • Tree Properties",
      options: ["V", "V - 1", "V + 1", "2V - 1"],
      correctAnswer: 1,
      explanation: "By graph theory theorem, every connected acyclic graph (tree) with V vertices contains exactly V - 1 edges.",
      whyCompanyAsks: "Tree mathematical identities are frequently asked in preliminary screening MCQs."
    },
    {
      id: "infy-q12",
      question: "In Java Multithreading, why is implementing `Runnable` generally preferred over extending the `Thread` class?",
      frequencyTag: "⭐ Infosys Multithreading MCQ",
      topic: "Java Concurrency • Runnable vs Thread",
      options: [
        "`Runnable` executes faster on the CPU",
        "Java does not support multiple class inheritance; implementing `Runnable` preserves the ability to extend another class",
        "`Thread` cannot start a background task",
        "`Runnable` is automatically synchronized"
      ],
      correctAnswer: 1,
      explanation: "Since Java supports single inheritance of classes but multiple inheritance of interfaces, implementing `Runnable` keeps your class flexible for inheritance hierarchies.",
      whyCompanyAsks: "Core Java concurrency design decisions are routinely examined at Infosys."
    },
    {
      id: "infy-q13",
      question: "In the greedy Activity Selection problem with start and finish times, how should activities be sorted to maximize the total number of non-overlapping activities?",
      frequencyTag: "⭐ Infosys Greedy Algorithms",
      topic: "Greedy Algorithms • Activity Selection",
      options: [
        "In ascending order of Start Time",
        "In ascending order of Finish Time",
        "In descending order of Duration",
        "In ascending order of Activity ID"
      ],
      correctAnswer: 1,
      explanation: "Greedily picking the activity that finishes earliest leaves the maximum remaining time available for subsequent activities.",
      whyCompanyAsks: "Activity selection is a standard greedy interval scheduling question in Infosys coding tests."
    },
    {
      id: "infy-q14",
      question: "What is the time complexity of the naive recursive Fibonacci algorithm `fib(n) = fib(n-1) + fib(n-2)` without memoization?",
      frequencyTag: "⭐ Infosys Pseudocode Complexity",
      topic: "Algorithms • Recursion Tree Analysis",
      options: ["O(N)", "O(N^2)", "O(2^N) exponential", "O(log N)"],
      correctAnswer: 2,
      explanation: "Without dynamic programming, the recursion tree branches twice at each level, leading to $O(2^N)$ (specifically $O(1.618^N)$) exponential complexity.",
      whyCompanyAsks: "Recognizing exponential call stack explosions is essential for candidate evaluations."
    },
    {
      id: "infy-q15",
      question: "In Java, what is the output of `System.out.println(10 + 20 + \"Infosys\" + 10 + 20);`?",
      frequencyTag: "⭐ Classic Infosys String Concatenation Trap",
      topic: "Java Basics • Operator Precedence",
      options: ["30Infosys30", "30Infosys1020", "1020Infosys1020", "1020Infosys30"],
      correctAnswer: 1,
      explanation: "`10 + 20` evaluates first as integer addition (30). Then `30 + \"Infosys\"` yields `\"30Infosys\"`. Thereafter, all further `+` operations become string concatenations: `\"30Infosys1020\"`.",
      whyCompanyAsks: "Left-to-right evaluation and string coercion traps appear frequently in Infosys Java screening."
    }
  ]
};
