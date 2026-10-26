// J.P. Morgan Code For Good (CFG) & Software Analyst Authentic Placement PYQ Bank (15 Questions)
// Sourced from HackerRank J.P. Morgan OA, CFG Hackathons, and Superday Technical Interviews

export const JPMORGAN_QUIZ = {
  id: "quiz-jpmorgan-cfg",
  companyId: "jpmorgan",
  company: "J.P. Morgan",
  companyLogo: "🏦",
  title: "J.P. Morgan Software Analyst Placement Sprint",
  slug: "jpmorgan-software-analyst",
  category: "FinTech & Banking",
  placementRound: "Round 1: Code For Good (CFG) & Tech Assessment",
  frequencyInfo: "⭐ Repeated in J.P. Morgan Code For Good (CFG) & Tech Analyst Drives",
  difficulty: "HARD",
  durationMinutes: 20,
  totalQuestions: 15,
  points: 350,
  unstopCoinsReward: 80,
  description: "Curated 15-question sprint directly from J.P. Morgan CFG & campus recruitment archives covering Bayes' Theorem anomaly math, Java ConcurrentHashMap, ACID transaction isolation, Floyd-Warshall, Kafka message brokers, and CAP Theorem.",
  badge: "J.P. Morgan Verified",
  questions: [
    {
      id: "jpm-q1",
      question: "A fraud detection model has 99% accuracy and a 1% false positive rate. If only 0.1% (1 in 1000) of financial transactions are fraudulent, what is the approximate probability that a flagged transaction is actually fraudulent (Bayes' Theorem)?",
      frequencyTag: "⭐ J.P. Morgan Quantitative Finance & Probabilistic Reasoning",
      topic: "Probability • Bayes' Theorem & Base Rate Fallacy",
      options: ["99%", "~50%", "~9%", "1%"],
      correctAnswer: 2,
      explanation: "In 100,000 transactions: 100 are real fraud (99 caught). 99,900 are genuine (1% false positives = 999 flagged). Total flagged = 99 + 999 = 1,098. Real fraud among flagged = 99 / 1,098 ≈ 9.0%.",
      whyCompanyAsks: "J.P. Morgan heavily tests Bayes' theorem and quantitative base-rate intuition in quantitative and technology rounds."
    },
    {
      id: "jpm-q2",
      question: "In high-throughput financial trading systems in Java, why is `ConcurrentHashMap` strongly preferred over `Collections.synchronizedMap`?",
      frequencyTag: "⭐ J.P. Morgan Java Concurrency Favorite",
      topic: "Java Concurrency • Concurrent Collections",
      options: [
        "`ConcurrentHashMap` stores data in disk rather than RAM",
        "`ConcurrentHashMap` uses segment/bucket-level locking, allowing concurrent reads and non-conflicting writes without locking the entire table",
        "`ConcurrentHashMap` is non-blocking and single-threaded",
        "`Collections.synchronizedMap` is deprecated"
      ],
      correctAnswer: 1,
      explanation: "`synchronizedMap` locks the entire collection on every operation. `ConcurrentHashMap` uses bucket-level locks and lock-free volatile reads, scaling seamlessly under high concurrency.",
      whyCompanyAsks: "Concurrency and lock contention avoidance are mission-critical for J.P. Morgan's high-frequency trading platforms."
    },
    {
      id: "jpm-q3",
      question: "Which ACID property ensures that concurrent financial transactions do not read intermediate, uncommitted states from one another (preventing Dirty Reads and Race Conditions)?",
      frequencyTag: "⭐ J.P. Morgan Banking Transaction Integrity Question",
      topic: "DBMS • ACID Isolation",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correctAnswer: 2,
      explanation: "Isolation guarantees that concurrently running transactions execute as if they were serial, preventing race conditions and intermediate dirty reads.",
      whyCompanyAsks: "Database transaction isolation levels (Read Committed, Repeatable Read, Serializable) are paramount in banking software."
    },
    {
      id: "jpm-q4",
      question: "In the classic stock trading problem (LeetCode 121: Best Time to Buy and Sell Stock), what is the optimal one-pass time and space complexity to find the maximum profit from one transaction?",
      frequencyTag: "⭐ J.P. Morgan Campus OA Coding Problem",
      topic: "Algorithms • One-Pass Dynamic Optimization",
      options: ["O(N^2) time, O(1) space", "O(N log N) time, O(N) space", "O(N) time, O(1) space", "O(1) time, O(N) space"],
      correctAnswer: 2,
      explanation: "By tracking the minimum buying price seen so far in a single pass, maximum profit at each day is `price[i] - min_price`. This requires O(N) time and O(1) space.",
      whyCompanyAsks: "Stock profit optimization problems are culturally synonymous with Wall Street FinTech recruitment."
    },
    {
      id: "jpm-q5",
      question: "According to the HTTP/1.1 (RFC 7231) specification, which of the following HTTP methods is NOT defined as idempotent?",
      frequencyTag: "⭐ J.P. Morgan Enterprise Microservices Assessment",
      topic: "Web Architecture • HTTP Idempotency",
      options: ["GET", "PUT", "DELETE", "POST"],
      correctAnswer: 3,
      explanation: "An idempotent HTTP method produces the identical side-effect regardless of whether it is called once or ten times. PUT, DELETE, and GET are idempotent; POST creates a new resource on each call and is non-idempotent.",
      whyCompanyAsks: "Idempotency prevents duplicate payments and transactions when network retries occur in financial APIs."
    },
    {
      id: "jpm-q6",
      question: "Which algorithm computes all-pairs shortest paths in a directed weighted graph (with positive or negative edge weights, but no negative cycles) in O(V^3) time?",
      frequencyTag: "⭐ J.P. Morgan Graph Algorithms Problem",
      topic: "Graph Theory • Dynamic Programming",
      options: ["Dijkstra's Algorithm", "Floyd-Warshall Algorithm", "Prim's Algorithm", "Kruskal's Algorithm"],
      correctAnswer: 1,
      explanation: "The Floyd-Warshall algorithm uses dynamic programming with 3 nested loops over intermediate vertices `k`, running in O(V^3) time and O(V^2) space.",
      whyCompanyAsks: "Multi-node routing and dynamic programming graph matrix algorithms are frequently tested in J.P. Morgan technical interviews."
    },
    {
      id: "jpm-q7",
      question: "In Java memory architecture, what is the effect of declaring a variable as `volatile`?",
      frequencyTag: "⭐ J.P. Morgan Java Thread Safety",
      topic: "Java Concurrency • volatile Keyword",
      options: [
        "It locks the object across all threads",
        "It guarantees that reads and writes are made directly to Main Memory (RAM), ensuring immediate cross-thread visibility and prohibiting compiler instruction reordering",
        "It makes the object immutable",
        "It saves the object to disk"
      ],
      correctAnswer: 1,
      explanation: "The `volatile` modifier establishes a happens-before memory barrier, ensuring all threads observe the latest written value without CPU L1/L2 cache staleness.",
      whyCompanyAsks: "Memory visibility and thread-safety invariants are strictly required in real-time order books."
    },
    {
      id: "jpm-q8",
      question: "In financial distributed systems, what is the difference between Optimistic Locking and Pessimistic Locking?",
      frequencyTag: "⭐ J.P. Morgan Core Banking Architecture",
      topic: "DBMS • Concurrency Control & Locks",
      options: [
        "Optimistic is only for NoSQL; Pessimistic is for SQL",
        "Optimistic Locking checks a `version` number at commit time and rolls back on conflicts; Pessimistic Locking acquires physical database locks (`SELECT FOR UPDATE`) on read to prevent any concurrent write",
        "Pessimistic Locking is always faster",
        "Both allow dirty writes"
      ],
      correctAnswer: 1,
      explanation: "Optimistic locking is ideal for low-conflict scenarios (high throughput). Pessimistic locking is preferred for high-contention bank balance debits where collision risk is catastrophic.",
      whyCompanyAsks: "Banking applications balance optimistic vs pessimistic concurrency control at every layer."
    },
    {
      id: "jpm-q9",
      question: "In modern banking microservices, why are distributed message queues like Apache Kafka or RabbitMQ utilized for payment transaction pipelines?",
      frequencyTag: "⭐ J.P. Morgan Event-Driven Architecture",
      topic: "Distributed Systems • Message Brokers",
      options: [
        "To replace the need for databases completely",
        "To decouple payment producers from downstream consumers, buffer spikes in transaction volume, and guarantee asynchronous durability",
        "To speed up CSS delivery",
        "To generate cryptographic keys"
      ],
      correctAnswer: 1,
      explanation: "Message brokers provide asynchronous decoupling, event persistence, and rate-leveling (backpressure buffer) when order volume surges during trading peaks.",
      whyCompanyAsks: "Event streaming with Apache Kafka is standard across J.P. Morgan Chase's global payments infrastructure."
    },
    {
      id: "jpm-q10",
      question: "According to the CAP Theorem in distributed databases, what must a distributed system sacrifice during a Network Partition (P)?",
      frequencyTag: "⭐ J.P. Morgan Distributed Systems Standard",
      topic: "Distributed Systems • CAP Theorem",
      options: [
        "It must choose between Consistency (C) or Availability (A)",
        "It must sacrifice Partition Tolerance",
        "It can retain all three simultaneously",
        "It must reboot the entire network"
      ],
      correctAnswer: 0,
      explanation: "Network partitions are inevitable in real-world networks. When a partition occurs, a distributed system MUST choose between returning consistent data (CP) or remaining available with stale data (AP).",
      whyCompanyAsks: "Financial systems almost universally choose Consistency (CP) because stale bank balances are unacceptable."
    },
    {
      id: "jpm-q11",
      question: "In the Coin Change Problem (minimum coins needed to make amount X using coin denominations), which algorithmic pattern is optimal?",
      frequencyTag: "⭐ J.P. Morgan OA Dynamic Programming",
      topic: "Dynamic Programming • Unbounded Knapsack",
      options: ["Greedy (always pick largest coin)", "Dynamic Programming (Bottom-Up 1D DP table)", "Divide & Conquer", "Randomized Search"],
      correctAnswer: 1,
      explanation: "Greedy choice fails for arbitrary coin denominations (e.g. coins [1, 3, 4], amount 6: greedy picks 4+1+1=3 coins; optimal DP is 3+3=2 coins).",
      whyCompanyAsks: "Recognizing when greedy heuristics fail in currency math is a classic test case."
    },
    {
      id: "jpm-q12",
      question: "In SQL, what is the difference between `RANK()` and `DENSE_RANK()` window functions when computing top employee salaries with ties?",
      frequencyTag: "⭐ J.P. Morgan Advanced SQL Window Functions",
      topic: "DBMS • SQL Analytic Functions",
      options: [
        "`RANK()` does not support ordering",
        "`RANK()` leaves gaps in ranking numbers after a tie (e.g., 1, 2, 2, 4); `DENSE_RANK()` assigns consecutive numbers without gaps (e.g., 1, 2, 2, 3)",
        "Both functions produce identical output always",
        "`DENSE_RANK()` only works on integer columns"
      ],
      correctAnswer: 1,
      explanation: "`DENSE_RANK()` increments rank strictly by 1 for the next distinct value, ensuring no numbers in the sequence are skipped.",
      whyCompanyAsks: "Financial analysts and reporting engineers must master SQL ranking and analytical partitioning."
    },
    {
      id: "jpm-q13",
      question: "In the Spring Framework, what is the primary benefit of Dependency Injection (Inversion of Control)?",
      frequencyTag: "⭐ J.P. Morgan Spring Boot Technical Round",
      topic: "Spring Framework • Inversion of Control (IoC)",
      options: [
        "It compiles Java code to machine code",
        "It decouples object creation from object usage, enabling loose coupling, easier unit testing with mock objects, and declarative configuration",
        "It speeds up network requests",
        "It replaces the JVM"
      ],
      correctAnswer: 1,
      explanation: "IoC delegates bean lifecycle and dependency management to the Spring container, making code modular and testable.",
      whyCompanyAsks: "Enterprise Java microservices at J.P. Morgan rely heavily on Spring Boot."
    },
    {
      id: "jpm-q14",
      question: "What is the optimal time complexity to find the Next Greater Element for all elements in an array using a Monotonic Decreasing Stack?",
      frequencyTag: "⭐ J.P. Morgan OA Coding Classic",
      topic: "Data Structures • Monotonic Stack",
      options: ["O(N^2)", "O(N log N)", "O(N) linear time", "O(1)"],
      correctAnswer: 2,
      explanation: "Each element is pushed onto and popped from the monotonic stack at most once across the entire traversal, resulting in O(N) amortized linear time.",
      whyCompanyAsks: "Monotonic stacks are repeatedly tested in financial time-series and histogram questions."
    },
    {
      id: "jpm-q15",
      question: "What is the expected value of a game where you win ₹100 with probability 0.4, win ₹50 with probability 0.3, and lose ₹200 with probability 0.3?",
      frequencyTag: "⭐ J.P. Morgan Quantitative Risk & Probability",
      topic: "Probability • Expected Value in Trading",
      options: ["-₹5", "0", "+₹10", "+₹25"],
      correctAnswer: 0,
      explanation: "E(X) = (100 * 0.4) + (50 * 0.3) + (-200 * 0.3) = 40 + 15 - 60 = -₹5. The expected return is negative.",
      whyCompanyAsks: "Expected value calculations form the foundational basis for quantitative risk analysis in investment banking."
    }
  ]
};
