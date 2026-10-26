// Capgemini Exceller Authentic Placement PYQ Bank (15 Questions)
// Sourced from Aon / CoCubes Capgemini Exceller, Technical MCQ, and Game-Based Aptitude archives

export const CAPGEMINI_QUIZ = {
  id: "quiz-capgemini-tech",
  companyId: "capgemini",
  company: "Capgemini",
  companyLogo: "🔶",
  title: "Capgemini Tech Excellence Placement PYQs",
  slug: "capgemini-tech-excellence",
  category: "Consulting & Engineering",
  placementRound: "Round 1: Technical MCQ & Pseudocode Sprint",
  frequencyInfo: "⭐ Repeated in Capgemini Exceller On-Campus Recruitment Drives",
  difficulty: "MEDIUM",
  durationMinutes: 15,
  totalQuestions: 15,
  points: 300,
  unstopCoinsReward: 60,
  description: "Curated 15-question sprint directly from Capgemini Exceller campus archives covering C sequence points, TRUNCATE vs DELETE, BST inorder recovery, queue via stacks, pointer precedence `*p++`, and Verification vs Validation.",
  badge: "Capgemini Certified",
  questions: [
    {
      id: "cap-q1",
      question: "In C, why is the statement `printf(\"%d %d\", a++, ++a);` considered dangerous and invalid code?",
      frequencyTag: "⭐ Repeated Capgemini Pseudocode Output Trap",
      topic: "C Programming • Sequence Points",
      options: [
        "It causes a compilation syntax error",
        "It results in Undefined Behavior because `a` is modified multiple times without an intervening sequence point",
        "It always evaluates left-to-right",
        "It causes a stack overflow"
      ],
      correctAnswer: 1,
      explanation: "Modifying the same scalar variable twice between sequence points leads to Undefined Behavior in the C standard, causing compiler-dependent results.",
      whyCompanyAsks: "Capgemini tests deep knowledge of C sequence points and why side-effect order cannot be assumed."
    },
    {
      id: "cap-q2",
      question: "What is the primary architectural difference between SQL `TRUNCATE` and `DELETE` commands?",
      frequencyTag: "⭐ Capgemini Technical Interview Classic",
      topic: "DBMS • DDL vs DML",
      options: [
        "TRUNCATE is DML and slower; DELETE is DDL and faster",
        "TRUNCATE is DDL, deallocates entire data pages, and resets identity; DELETE is DML, removes rows one-by-one with transaction logging",
        "Both commands do the exact same thing",
        "DELETE cannot use a WHERE clause"
      ],
      correctAnswer: 1,
      explanation: "TRUNCATE is a DDL operation that deallocates storage pages quickly, while DELETE is a row-by-row DML operation that records each deleted row in transaction logs.",
      whyCompanyAsks: "TRUNCATE vs DELETE is among the top 3 most frequently asked database questions across Capgemini interview panels."
    },
    {
      id: "cap-q3",
      question: "If the preorder traversal of a Binary Search Tree (BST) is `[40, 20, 10, 30, 60, 50, 70]`, what will its inorder traversal be?",
      frequencyTag: "⭐ Capgemini Data Structures Favorite",
      topic: "Trees • BST Inorder Property",
      options: [
        "[70, 60, 50, 40, 30, 20, 10]",
        "[10, 20, 30, 40, 50, 60, 70] (strictly ascending sorted order)",
        "[40, 20, 10, 30, 60, 50, 70]",
        "[10, 30, 20, 50, 70, 60, 40]"
      ],
      correctAnswer: 1,
      explanation: "By mathematical definition, the Inorder traversal of ANY valid Binary Search Tree is always in strictly ascending sorted order.",
      whyCompanyAsks: "Capgemini checks whether candidates recognize BST properties instantly without wasting time drawing the full tree."
    },
    {
      id: "cap-q4",
      question: "What is the minimum number of standard LIFO Stacks required to implement a FIFO Queue?",
      frequencyTag: "⭐ Capgemini Core Data Structures Repeat",
      topic: "Data Structures • Stacks & Queues",
      options: ["1 Stack", "2 Stacks", "3 Stacks", "Cannot be implemented"],
      correctAnswer: 1,
      explanation: "Two stacks are required: an input stack for enqueue and an output stack for dequeue. Reversing elements through the second stack restores FIFO order.",
      whyCompanyAsks: "Queue-using-stacks is a staple interview question testing data structure inversion mechanics."
    },
    {
      id: "cap-q5",
      question: "A watch gains 5 seconds every 3 minutes. How many minutes will it gain over a continuous duration of 6 hours?",
      frequencyTag: "⭐ Capgemini Game-Based Aptitude & Speed Math",
      topic: "Aptitude • Clocks & Ratios",
      options: ["6 minutes", "8 minutes", "10 minutes", "12 minutes"],
      correctAnswer: 2,
      explanation: "6 hours = 360 minutes. Number of 3-minute intervals = 360 / 3 = 120. Total seconds gained = 120 * 5s = 600 seconds = 10 minutes.",
      whyCompanyAsks: "Capgemini's game-based and cognitive aptitude test emphasizes fast mental ratio conversions."
    },
    {
      id: "cap-q6",
      question: "Which Software Development Life Cycle (SDLC) model is best suited when client requirements are uncertain, evolving, and working increments are required every 2-3 weeks?",
      frequencyTag: "⭐ Capgemini Software Engineering Fundamentals",
      topic: "Software Engineering • Agile Methodologies",
      options: ["Waterfall Model", "V-Shaped Model", "Agile / Scrum Model", "Big Bang Model"],
      correctAnswer: 2,
      explanation: "Agile prioritizes customer collaboration, iterative releases, and rapid response to change over rigid sequential plans.",
      whyCompanyAsks: "Capgemini consults for Fortune 500 enterprises that operate strictly on Agile and DevOps delivery frameworks."
    },
    {
      id: "cap-q7",
      question: "In C, what is the meaning of the expression `*p++` given pointer `int *p`?",
      frequencyTag: "⭐ Capgemini C Operator Precedence",
      topic: "C Pointers • Precedence of * and ++",
      options: [
        "Increments the value pointed to by p, then dereferences",
        "Dereferences the current value pointed to by p, then increments the pointer address p",
        "Syntax error",
        "Decrements p"
      ],
      correctAnswer: 1,
      explanation: "Postfix `++` has higher precedence than unary dereference `*`. However, postfix evaluates to the current address first, dereferencing the old location before advancing `p`.",
      whyCompanyAsks: "Pointer arithmetic precedence is tested across all Capgemini technical assessments."
    },
    {
      id: "cap-q8",
      question: "What is the key difference between a PRIMARY KEY constraint and a UNIQUE constraint in SQL databases?",
      frequencyTag: "⭐ Capgemini Database Integrity",
      topic: "DBMS • Primary vs Unique Constraints",
      options: [
        "They are 100% identical in all SQL engines",
        "A table can have only one PRIMARY KEY which strictly disallows NULLs; a table can have multiple UNIQUE constraints and UNIQUE permits NULL values",
        "UNIQUE does not enforce uniqueness",
        "PRIMARY KEY cannot be an integer"
      ],
      correctAnswer: 1,
      explanation: "A table has at most one PRIMARY KEY (no NULLs allowed). UNIQUE constraints can be applied to multiple columns and allow one or more NULLs depending on SQL dialect.",
      whyCompanyAsks: "Data constraint taxonomy is a primary screening topic at Capgemini."
    },
    {
      id: "cap-q9",
      question: "Which data structure is optimal to verify if an expression has balanced parentheses (e.g., `{[()]}`)?",
      frequencyTag: "⭐ Capgemini Data Structures Classic",
      topic: "Data Structures • Stack Applications",
      options: ["Queue", "Stack", "Binary Search Tree", "Linked List"],
      correctAnswer: 1,
      explanation: "Pushing opening brackets onto a Stack and popping upon encountering a matching closing bracket verifies balanced nesting in O(N) time.",
      whyCompanyAsks: "Parentheses validation is a classic interview question testing LIFO mechanics."
    },
    {
      id: "cap-q10",
      question: "In Object-Oriented Programming, what is the difference between Method Overloading and Method Overriding?",
      frequencyTag: "⭐ Capgemini OOPs Concept",
      topic: "OOPs • Compile-time vs Runtime Polymorphism",
      options: [
        "Overloading is runtime, Overriding is compile-time",
        "Overloading occurs within the same class with different parameters (compile-time polymorphism); Overriding occurs in a subclass redefining a parent method with identical signature (runtime polymorphism)",
        "Both require the `override` keyword",
        "Overloading is only supported in Python"
      ],
      correctAnswer: 1,
      explanation: "Method Overloading resolved at compile time based on parameter types; Method Overriding resolved dynamically at runtime via virtual method tables.",
      whyCompanyAsks: "Core OOPs principles are mandatory for all consulting engineering positions at Capgemini."
    },
    {
      id: "cap-q11",
      question: "What is the meaning of the HTTP status code range 4xx versus 5xx in web systems?",
      frequencyTag: "⭐ Capgemini Web Architectures",
      topic: "Computer Networks • HTTP Status Codes",
      options: [
        "4xx indicates server failure; 5xx indicates client error",
        "4xx indicates Client-side error (e.g. 404 Not Found, 401 Unauthorized); 5xx indicates Server-side error (e.g. 500 Internal Server Error, 503 Unavailable)",
        "Both mean success",
        "4xx is informational"
      ],
      correctAnswer: 1,
      explanation: "RFC HTTP standards designate 4xx for client errors (bad request/invalid credentials) and 5xx for server execution crashes.",
      whyCompanyAsks: "REST API error handling is tested in full-stack recruitment rounds."
    },
    {
      id: "cap-q12",
      question: "In C, what does `strcmp(str1, str2)` return when both strings are identical in content?",
      frequencyTag: "⭐ Capgemini String Functions",
      topic: "C Library Functions • strcmp",
      options: ["1", "-1", "0", "true"],
      correctAnswer: 2,
      explanation: "`strcmp` computes the difference between ASCII characters. When strings match completely, the difference is 0.",
      whyCompanyAsks: "Novice candidates frequently mistake return value 0 as 'false' or failure."
    },
    {
      id: "cap-q13",
      question: "In Software Quality Engineering, what is the fundamental difference between 'Verification' and 'Validation'?",
      frequencyTag: "⭐ Capgemini Software Engineering Process",
      topic: "Software Engineering • V&V",
      options: [
        "Verification is done by clients; Validation by developers",
        "Verification asks 'Are we building the product right?' (static checking/reviews); Validation asks 'Are we building the right product?' (dynamic testing against user requirements)",
        "Both terms mean executing automated test scripts",
        "Validation is only done in Waterfall"
      ],
      correctAnswer: 1,
      explanation: "Boehm's famous definition: Verification checks conformance to specification (static); Validation ensures the software meets client business needs (dynamic).",
      whyCompanyAsks: "Capgemini delivers mission-critical enterprise systems where verification and validation are contractual obligations."
    },
    {
      id: "cap-q14",
      question: "A, B, and C can do a piece of work in 20, 30, and 60 days respectively. If they all work together and receive a total payment of ₹3,000, what is A's share?",
      frequencyTag: "⭐ Capgemini Work & Wages Aptitude",
      topic: "Aptitude • Time, Work & Wages",
      options: ["₹1,000", "₹1,500", "₹1,200", "₹800"],
      correctAnswer: 1,
      explanation: "Daily efficiencies: A = 1/20, B = 1/30, C = 1/60. Ratio of work = 3 : 2 : 1. Total parts = 6. A's share = (3/6) * 3000 = ₹1,500.",
      whyCompanyAsks: "Proportional work and wage division questions appear consistently in Capgemini aptitude rounds."
    },
    {
      id: "cap-q15",
      question: "In a relational database, what is a 'Synthetic / Surrogate Key'?",
      frequencyTag: "⭐ Capgemini DBMS Design",
      topic: "DBMS • Surrogate vs Natural Keys",
      options: [
        "A foreign key from an external database",
        "An artificially created unique identifier (like an auto-incrementing integer or UUID) with no business meaning, used solely as a primary key",
        "A password hash",
        "A composite key with 5 columns"
      ],
      correctAnswer: 1,
      explanation: "Surrogate keys (e.g. `user_id` INT AUTO_INCREMENT) decouple database primary keys from changing real-world business attributes (like email or social security number).",
      whyCompanyAsks: "Database schema normalization and surrogate key design are heavily discussed in Capgemini technical rounds."
    }
  ]
};
