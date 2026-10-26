// Microsoft University Hiring & Technical OA Authentic Placement PYQ Bank (15 Questions)
// Sourced from Codility Microsoft OA, Microsoft Technical Interviews, and Core CS archives

export const MICROSOFT_QUIZ = {
  id: "quiz-microsoft-swe",
  companyId: "microsoft",
  company: "Microsoft",
  companyLogo: "🔷",
  title: "Microsoft On-Campus Repeated Technical Round",
  slug: "microsoft-swe-round",
  category: "Product & Systems",
  placementRound: "Round 1 & 2: Technical Assessment & Systems Screen",
  frequencyInfo: "⭐ Frequently Tested in Microsoft Campus Technical Rounds & OA",
  difficulty: "HARD",
  durationMinutes: 20,
  totalQuestions: 15,
  points: 350,
  unstopCoinsReward: 80,
  description: "Curated 15-question sprint directly from Microsoft university hiring archives covering Floyd's cycle detection, Coffman Deadlock conditions, B+ Tree disk indexing, reverse linked lists, Peterson's algorithm, and virtual destructors.",
  badge: "Microsoft OA Verified",
  questions: [
    {
      id: "ms-q1",
      question: "What is the name and complexity of the algorithm that uses slow and fast pointers to detect a loop in a singly linked list in O(N) time and O(1) space?",
      frequencyTag: "⭐ Asked in 80%+ of Microsoft Linked List Interviews",
      topic: "Linked Lists • Cycle Detection",
      options: ["Dijkstra's Algorithm", "Floyd's Tortoise and Hare Algorithm", "Kruskal's Algorithm", "Kadane's Algorithm"],
      correctAnswer: 1,
      explanation: "Floyd's Cycle-Finding Algorithm advances the slow pointer by 1 step and fast pointer by 2 steps. If a loop exists, they must collide within O(N) steps without allocating extra memory.",
      whyCompanyAsks: "Microsoft interviewers routinely test linked list manipulation and in-place pointer math."
    },
    {
      id: "ms-q2",
      question: "Which four conditions (known as the Coffman conditions) must simultaneously hold for an Operating System deadlock to occur?",
      frequencyTag: "⭐ Microsoft Core OS Fundamentals Favorite",
      topic: "Operating Systems • Deadlocks",
      options: [
        "Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait",
        "Paging, Segmentation, Thrashing, Swapping",
        "FCFS, Round Robin, SJF, Priority Scheduling",
        "Atomicity, Consistency, Isolation, Durability"
      ],
      correctAnswer: 0,
      explanation: "Deadlock strictly requires: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption, and 4) Circular Wait. Breaking any one condition prevents deadlocks.",
      whyCompanyAsks: "Microsoft has deep OS roots (Windows/Azure) and fiercely probes OS synchronization and concurrency."
    },
    {
      id: "ms-q3",
      question: "Why do relational database engines (like SQL Server / PostgreSQL) use B+ Trees instead of standard Binary Search Trees for disk-based indexing?",
      frequencyTag: "⭐ Repeated Microsoft Database Systems Interview Question",
      topic: "DBMS • Index Data Structures",
      options: [
        "B+ Trees use less RAM than BSTs",
        "B+ Trees have a high branching factor (fan-out) that drastically minimizes disk I/O reads",
        "BSTs cannot store string keys",
        "B+ Trees do not require sorting"
      ],
      correctAnswer: 1,
      explanation: "Disk reads are thousands of times slower than RAM. B+ Trees have huge node capacity (fan-out of 100+), keeping tree height at 3-4 levels and minimizing disk seek operations.",
      whyCompanyAsks: "Microsoft tests real-world systems architecture and the physical constraints of storage hardware."
    },
    {
      id: "ms-q4",
      question: "What is the optimal time complexity to compute the diameter (longest path between any two nodes) of a binary tree in a single bottom-up postorder traversal?",
      frequencyTag: "⭐ Microsoft Campus OA Problem",
      topic: "Binary Trees • Tree Diameter",
      options: ["O(N^2)", "O(N log N)", "O(N)", "O(log N)"],
      correctAnswer: 2,
      explanation: "By computing subtree heights bottom-up, each node calculates `leftHeight + rightHeight` and returns `1 + max(leftHeight, rightHeight)` to its parent in O(N) single-pass time.",
      whyCompanyAsks: "Postorder bottom-up recursion is a fundamental pattern for Microsoft tree coding assessments."
    },
    {
      id: "ms-q5",
      question: "In Brian Kernighan's algorithm, what does the operation `n = n & (n - 1)` repeatedly accomplish until `n == 0`?",
      frequencyTag: "⭐ Microsoft Bitwise Coding Challenge",
      topic: "Bit Manipulation • Set Bit Counting",
      options: ["Inverts all bits of n", "Counts the total number of set bits (1s)", "Reverses the bits of n", "Checks if n is negative"],
      correctAnswer: 1,
      explanation: "Each iteration of `n & (n - 1)` clears the lowest set bit. The number of iterations equals the exact count of set bits (Hamming Weight).",
      whyCompanyAsks: "Microsoft values elegant, minimal bit-level operations over looping through all 32 bits."
    },
    {
      id: "ms-q6",
      question: "In Virtual Memory management, what phenomenon occurs when the system spends more time swapping pages between RAM and disk than executing user instructions?",
      frequencyTag: "⭐ Microsoft OS Assessment Question",
      topic: "Operating Systems • Virtual Memory",
      options: ["Paging Fragmentation", "Thrashing", "Starvation", "Context Inversion"],
      correctAnswer: 1,
      explanation: "Thrashing occurs when the working set of active processes exceeds physical RAM capacity, causing a high frequency of page faults and total CPU throughput collapse.",
      whyCompanyAsks: "Understanding memory pressure and thrashing is vital for candidates entering cloud infrastructure roles at Azure."
    },
    {
      id: "ms-q7",
      question: "How can a singly linked list be reversed in-place in O(N) time and O(1) space?",
      frequencyTag: "⭐ Microsoft Most Frequently Asked Coding Question",
      topic: "Linked Lists • In-Place Reversal",
      options: [
        "Store elements in an array and reassign",
        "Use 3 pointers `prev = NULL`, `curr = head`, and `next = NULL` to reverse link pointers iteratively",
        "Use recursion with an auxiliary stack",
        "Sort the linked list by address"
      ],
      correctAnswer: 1,
      explanation: "Iteratively updating `next = curr->next; curr->next = prev; prev = curr; curr = next;` reverses all node pointers in O(N) time and strictly O(1) space.",
      whyCompanyAsks: "Pointer safety and in-place mutation are mandatory skills for Windows Kernel and Azure systems engineering."
    },
    {
      id: "ms-q8",
      question: "In concurrent programming, what is the purpose of Peterson's Algorithm in Operating Systems?",
      frequencyTag: "⭐ Microsoft Core OS Synchronization",
      topic: "Operating Systems • Critical Section Problem",
      options: [
        "To allocate disk blocks",
        "To provide a software-based solution to the Critical Section problem for 2 processes with mutual exclusion, progress, and bounded waiting",
        "To compress files",
        "To encrypt network traffic"
      ],
      correctAnswer: 1,
      explanation: "Peterson's algorithm uses shared `turn` and `flag[2]` variables to guarantee mutual exclusion and prevent deadlocks/starvation for two processes.",
      whyCompanyAsks: "Microsoft tests theoretical understanding of race conditions and atomic hardware instructions (CAS)."
    },
    {
      id: "ms-q9",
      question: "In database systems, why is the Write-Ahead Logging (WAL) protocol essential for transaction recovery?",
      frequencyTag: "⭐ Microsoft SQL Server Architecture",
      topic: "DBMS • Write-Ahead Logging (WAL)",
      options: [
        "It eliminates the need for primary keys",
        "It guarantees that modifications are written to non-volatile log storage BEFORE the actual data pages are flushed to disk, ensuring Durability and Atomicity during crashes",
        "It compresses SQL queries",
        "It encrypts user passwords"
      ],
      correctAnswer: 1,
      explanation: "WAL ensures that if a system crashes during a transaction, the engine can redo committed transactions and undo uncommitted ones from log records.",
      whyCompanyAsks: "WAL is the bedrock of database resilience in SQL Server and Azure Cosmos DB."
    },
    {
      id: "ms-q10",
      question: "In C++, why MUST a base class destructor be declared as `virtual` when deleting an object of a derived class through a base class pointer?",
      frequencyTag: "⭐ Microsoft C++ Technical Interview Favorite",
      topic: "C++ OOPs • Virtual Destructors & Memory Leaks",
      options: [
        "To make the class abstract",
        "To ensure the derived class destructor is invoked first, preventing memory leaks and undefined behavior",
        "To speed up compiler optimization",
        "To allow multiple inheritance"
      ],
      correctAnswer: 1,
      explanation: "Without a virtual destructor, `delete basePtr` only invokes the Base destructor, causing a resource leak if the Derived class allocated heap memory.",
      whyCompanyAsks: "Microsoft's major systems are written in modern C++, making memory management correctness paramount."
    },
    {
      id: "ms-q11",
      question: "What is the time complexity to search for a target value in a sorted array that has been rotated at an unknown pivot point (LeetCode 33)?",
      frequencyTag: "⭐ Microsoft Campus OA Classic",
      topic: "Binary Search • Rotated Sorted Array",
      options: ["O(N)", "O(log N)", "O(N log N)", "O(1)"],
      correctAnswer: 1,
      explanation: "In modified binary search, at least one half of the array (left or right) is guaranteed to be strictly sorted, allowing narrowing down the search in O(log N) time.",
      whyCompanyAsks: "Binary search under modified invariants tests problem-solving under non-standard conditions."
    },
    {
      id: "ms-q12",
      question: "In IPv4 networking with CIDR notation `/26`, how many usable host IP addresses are available in the subnet?",
      frequencyTag: "⭐ Microsoft Azure Networking Fundamentals",
      topic: "Computer Networks • Subnetting",
      options: ["64", "62", "30", "126"],
      correctAnswer: 1,
      explanation: "Host bits = 32 - 26 = 6 bits. Total addresses = 2^6 = 64. Usable hosts = Total - 2 (subtracting Network ID and Broadcast address) = 62 hosts.",
      whyCompanyAsks: "Subnetting and IP addressing are essential for Azure Cloud network configuration."
    },
    {
      id: "ms-q13",
      question: "What is the optimal space complexity to find the Longest Palindromic Substring of length N using the Expand Around Center technique?",
      frequencyTag: "⭐ Microsoft Coding Interview Standard",
      topic: "Strings • Palindrome Expansion",
      options: ["O(N^2)", "O(N)", "O(1) auxiliary space", "O(log N)"],
      correctAnswer: 2,
      explanation: "Expanding around 2N - 1 possible centers computes the longest palindrome in O(N^2) time and strictly O(1) auxiliary space, avoiding O(N^2) DP tables.",
      whyCompanyAsks: "Microsoft prioritizes space-efficient algorithms over heavy dynamic programming tables."
    },
    {
      id: "ms-q14",
      question: "In cloud software design, what is the primary architectural purpose of a Content Delivery Network (CDN)?",
      frequencyTag: "⭐ Microsoft Systems & Azure Architecture",
      topic: "System Design • CDN Caching",
      options: [
        "To compile JavaScript code on the client machine",
        "To cache static media and data at geographically distributed edge servers near users, reducing latency and origin server load",
        "To act as a relational database",
        "To replace TCP with UDP"
      ],
      correctAnswer: 1,
      explanation: "CDNs replicate static assets across global Points of Presence (PoPs) to minimize round-trip network latency for end-users.",
      whyCompanyAsks: "Global scale latency reduction is a primary focus for Azure Front Door and Teams video infrastructure."
    },
    {
      id: "ms-q15",
      question: "What is the fundamental difference between a Mutex and a Counting Semaphore in OS process synchronization?",
      frequencyTag: "⭐ Microsoft Operating Systems Interview",
      topic: "Operating Systems • Mutex vs Semaphore",
      options: [
        "A Semaphore can only be used by 1 thread",
        "A Mutex has an ownership concept (only the thread that locked it can unlock it); a Semaphore is a signaling mechanism that can be incremented/decremented by any thread",
        "They are completely identical",
        "A Mutex is hardware-only"
      ],
      correctAnswer: 1,
      explanation: "A Mutex is a locking mechanism with strict thread ownership, whereas a Semaphore is a signaling integer counter that coordinates multiple access permits.",
      whyCompanyAsks: "Microsoft fiercely tests concurrency primitives to ensure candidates do not cause deadlocks or priority inversions."
    }
  ]
};
