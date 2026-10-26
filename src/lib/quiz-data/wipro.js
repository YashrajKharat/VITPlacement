// Wipro Elite National Talent Hunt (NTH) Authentic Placement PYQ Bank (15 Questions)
// Sourced from AMCAT Wipro NTH, Automata Fix, and Wipro Turbo examination archives

export const WIPRO_QUIZ = {
  id: "quiz-wipro-nth",
  companyId: "wipro",
  company: "Wipro",
  companyLogo: "🌐",
  title: "Wipro Elite NTH Coding & Automata Sprint",
  slug: "wipro-elite-nth",
  category: "Mass IT & Engineering",
  placementRound: "Round 1: Wipro National Talent Hunt (NTH)",
  frequencyInfo: "⭐ Repeated in Wipro Elite National Talent Hunt (NTH) & Turbo",
  difficulty: "EASY",
  durationMinutes: 15,
  totalQuestions: 15,
  points: 300,
  unstopCoinsReward: 60,
  description: "Curated 15-question sprint directly from Wipro Elite NTH and AMCAT archives covering Automata Fix debugging, sorting stability, TCP 3-way handshakes, Convoy Effect, dangling pointers, and Profit-Loss math.",
  badge: "Wipro NTH Certified",
  questions: [
    {
      id: "wip-q1",
      question: "In C: `int *ptr = (int*)malloc(sizeof(int)); if(val < 0) return -1; free(ptr);`. What critical defect does this code contain?",
      frequencyTag: "⭐ Classic Wipro Automata Fix Debugging Problem",
      topic: "C Programming • Memory Management",
      options: ["Null Pointer Dereference", "Memory Leak on early return", "Dangling Pointer", "Array Index Out of Bounds"],
      correctAnswer: 1,
      explanation: "If `val < 0`, the function returns early without invoking `free(ptr)`, leaving dynamically allocated heap memory leaked and unrecoverable.",
      whyCompanyAsks: "Wipro's Automata Fix section requires identifying subtle edge-case bugs in short C/Java snippets."
    },
    {
      id: "wip-q2",
      question: "Which sorting algorithm is guaranteed to be stable and maintains an absolute worst-case time complexity of O(N log N)?",
      frequencyTag: "⭐ Wipro Technical MCQ Standard",
      topic: "Algorithms • Sorting Stability",
      options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
      correctAnswer: 2,
      explanation: "Merge Sort strictly divides and merges in O(N log N) in all cases (best, average, and worst) and preserves relative order of identical keys (stable).",
      whyCompanyAsks: "Sorting algorithm trade-offs (stability vs in-place space) are frequently asked in Wipro interviews."
    },
    {
      id: "wip-q3",
      question: "How many packets are exchanged between client and server to establish a standard TCP connection before data transfer begins?",
      frequencyTag: "⭐ Wipro Networking Assessment Question",
      topic: "Computer Networks • TCP Handshake",
      options: ["2 (SYN, ACK)", "3 (SYN, SYN-ACK, ACK)", "4 (SYN, ACK, DATA, ACK)", "1 (CONNECT)"],
      correctAnswer: 1,
      explanation: "The 3-way handshake requires: 1) Client sends SYN, 2) Server responds with SYN-ACK, 3) Client acknowledges with ACK.",
      whyCompanyAsks: "TCP connection lifecycle questions appear in nearly all Wipro preliminary screening rounds."
    },
    {
      id: "wip-q4",
      question: "Which CPU scheduling algorithm can cause the 'Convoy Effect', where short burst processes are severely delayed waiting behind one long CPU-bound process?",
      frequencyTag: "⭐ Wipro Operating Systems Repeat",
      topic: "Operating Systems • CPU Scheduling",
      options: ["Round Robin (RR)", "Shortest Job First (SJF)", "First-Come, First-Served (FCFS)", "Multilevel Feedback Queue"],
      correctAnswer: 2,
      explanation: "In FCFS, non-preemptive ordering means a long compute process holds the CPU, forcing I/O-bound and short processes to idle in the ready queue.",
      whyCompanyAsks: "Wipro tests fundamental OS scheduling pitfalls and the benefits of preemption."
    },
    {
      id: "wip-q5",
      question: "What does `sizeof(\"Campus\")` return on a standard 64-bit C compiler?",
      frequencyTag: "⭐ Wipro C-Basics Tricky Output Question",
      topic: "C Basics • String Literals & Sizeof",
      options: ["5 bytes", "6 bytes", "7 bytes (includes null terminator '\\0')", "8 bytes"],
      correctAnswer: 2,
      explanation: "The string literal \"Campus\" has 6 characters plus 1 invisible trailing null terminator `\\0`, totaling 7 bytes.",
      whyCompanyAsks: "Wipro frequently tests whether candidates remember the null terminator in C string literals."
    },
    {
      id: "wip-q6",
      question: "What will `SELECT COUNT(*)` return when executed on a database table containing 5 rows where all column values are `NULL`?",
      frequencyTag: "⭐ Wipro SQL Query Output Repeat",
      topic: "DBMS • SQL Aggregate Functions",
      options: ["0", "NULL", "5", "Error"],
      correctAnswer: 2,
      explanation: "`COUNT(*)` counts the total number of rows regardless of NULL values, returning 5. In contrast, `COUNT(column_name)` would return 0.",
      whyCompanyAsks: "The contrast between COUNT(*) and COUNT(column) is a classic campus placement interview trap."
    },
    {
      id: "wip-q7",
      question: "In C, what is an 'Off-by-one' error in a loop iterating over an array of size N declared as `int arr[N];`?",
      frequencyTag: "⭐ Wipro Automata Fix Classic",
      topic: "Debugging • Array Bounds",
      options: [
        "Iterating `for (int i = 0; i < N; i++)`",
        "Iterating `for (int i = 0; i <= N; i++)` which accesses `arr[N]` (out of bounds)",
        "Iterating backwards",
        "Skipping elements"
      ],
      correctAnswer: 1,
      explanation: "In 0-indexed arrays of size N, valid indices are 0 to N-1. Accessing index N causes buffer overrun or segmentation faults.",
      whyCompanyAsks: "Off-by-one bounds errors are the most common bug candidates must fix in Wipro's Automata module."
    },
    {
      id: "wip-q8",
      question: "Which layer of the OSI 7-Layer model is responsible for packet forwarding and path determination (routing) across different networks?",
      frequencyTag: "⭐ Wipro Computer Networks Fundamentals",
      topic: "OSI Model • Network Layer",
      options: ["Data Link Layer (Layer 2)", "Network Layer (Layer 3)", "Transport Layer (Layer 4)", "Session Layer (Layer 5)"],
      correctAnswer: 1,
      explanation: "The Network Layer (Layer 3, e.g. IP protocol) handles logical addressing and packet routing across intermediate routers.",
      whyCompanyAsks: "OSI layer mapping is asked in almost every AMCAT screening test for Wipro."
    },
    {
      id: "wip-q9",
      question: "What happens when a C function returns the memory address of a local automatic variable `int x = 10; return &x;`?",
      frequencyTag: "⭐ Wipro Pointer Concepts",
      topic: "C Memory • Dangling Pointers",
      options: [
        "The caller safely accesses 10",
        "A Dangling Pointer is created because the stack frame of the function is deallocated upon return",
        "Compiler generates syntax error",
        "Memory leak occurs"
      ],
      correctAnswer: 1,
      explanation: "Local variables live on the function call stack. Once the function returns, that stack memory is reclaimed, leaving the pointer pointing to invalid memory.",
      whyCompanyAsks: "Stack vs heap lifetimes are fundamental concepts tested in Wipro technical interviews."
    },
    {
      id: "wip-q10",
      question: "If an item is sold for ₹960 at a 20% profit margin, what was the original cost price (CP)?",
      frequencyTag: "⭐ Wipro Quantitative Aptitude Repeat",
      topic: "Aptitude • Profit and Loss",
      options: ["₹768", "₹800", "₹820", "₹840"],
      correctAnswer: 1,
      explanation: "Selling Price = CP * (1 + Profit%). 960 = CP * 1.20 => CP = 960 / 1.20 = ₹800.",
      whyCompanyAsks: "Standard commercial arithmetic problems feature heavily in Wipro's preliminary cognitive assessment."
    },
    {
      id: "wip-q11",
      question: "What is the difference between Internal and External memory fragmentation in Operating Systems?",
      frequencyTag: "⭐ Wipro Operating Systems MCQ",
      topic: "Operating Systems • Memory Fragmentation",
      options: [
        "Internal is in RAM, external is on disk",
        "Internal fragmentation occurs when allocated partition space is larger than needed; External fragmentation occurs when total free memory exists but is broken into non-contiguous blocks",
        "Both mean the same thing",
        "External fragmentation occurs in paging"
      ],
      correctAnswer: 1,
      explanation: "Internal fragmentation is wasted space inside an allocated block (common in fixed partitioning/paging). External fragmentation is scattered free memory between allocated blocks.",
      whyCompanyAsks: "Memory allocation trade-offs are a core topic in Wipro technical rounds."
    },
    {
      id: "wip-q12",
      question: "What is the minimum possible height of a binary tree containing N nodes?",
      frequencyTag: "⭐ Wipro Data Structures Theory",
      topic: "Trees • Tree Height Bounds",
      options: ["N", "N / 2", "ceil(log2(N + 1)) - 1", "N^2"],
      correctAnswer: 2,
      explanation: "A completely full binary tree achieves the minimum height, bounded logarithmically by $\\lceil \\log_2(N + 1) \\rceil - 1$ (or $O(\\log N)$).",
      whyCompanyAsks: "Wipro checks if candidates understand theoretical tree height bounds."
    },
    {
      id: "wip-q13",
      question: "In C, what is the lifetime and default initial value of a `static` local variable inside a function?",
      frequencyTag: "⭐ Wipro C Storage Classes",
      topic: "C Basics • Static Storage Class",
      options: [
        "Destroyed on function exit, initialized to garbage",
        "Persists across multiple function calls for the entire duration of the program, default initialized to 0",
        "Allocated in the CPU registers",
        "Stored on the stack"
      ],
      correctAnswer: 1,
      explanation: "Static variables are stored in the data segment (BSS). They are zero-initialized by default and retain their value across calls.",
      whyCompanyAsks: "Storage classes (auto, static, extern, register) are standard Wipro technical MCQ questions."
    },
    {
      id: "wip-q14",
      question: "How many bits are in a standard Media Access Control (MAC) physical hardware address?",
      frequencyTag: "⭐ Wipro Networking Hardware MCQ",
      topic: "Computer Networks • MAC Addressing",
      options: ["32 bits", "48 bits (6 octets)", "64 bits", "128 bits"],
      correctAnswer: 1,
      explanation: "MAC addresses are 48 bits long, usually displayed as 12 hexadecimal digits grouped into 6 pairs (e.g. `00:1A:2B:3C:4D:5E`).",
      whyCompanyAsks: "Physical vs logical addressing distinction is tested across IT recruitment panels."
    },
    {
      id: "wip-q15",
      question: "Which SQL wildcard pattern matches any string that begins with the letter 'A' and ends with the letter 'e'?",
      frequencyTag: "⭐ Wipro SQL Pattern Matching",
      topic: "DBMS • SQL LIKE Wildcards",
      options: ["LIKE 'A_e'", "LIKE 'A%e'", "LIKE '%Ae%'", "LIKE 'A*e'"],
      correctAnswer: 1,
      explanation: "The `%` wildcard matches zero or more characters. Thus `'A%e'` matches any string starting with A and ending with e.",
      whyCompanyAsks: "Pattern matching wildcards are standard in database query testing."
    }
  ]
};
