// Cognizant GenC Next & Elevate Authentic Placement PYQ Bank (15 Questions)
// Sourced from AMCAT Cognizant GenC Next, Automata, and HackerEarth examination archives

export const COGNIZANT_QUIZ = {
  id: "quiz-cognizant-genc",
  companyId: "cognizant",
  company: "Cognizant",
  companyLogo: "💼",
  title: "Cognizant GenC Next Placement Sprint",
  slug: "cognizant-genc-next",
  category: "IT Services & Consulting",
  placementRound: "Round 1 & 2: GenC Next Advanced Technical Drive",
  frequencyInfo: "⭐ High-Yield PYQs from Cognizant GenC Next & Elevate Drives",
  difficulty: "MEDIUM",
  durationMinutes: 15,
  totalQuestions: 15,
  points: 300,
  unstopCoinsReward: 60,
  description: "Curated 15-question sprint directly from Cognizant GenC Next archives covering Java 8 default methods, Trie lookup efficiency, SQL Outer Joins, overflow-safe Binary Search, Java 8 Streams, and Banker's Algorithm.",
  badge: "Cognizant Verified",
  questions: [
    {
      id: "cog-q1",
      question: "In Java 8, which keyword was introduced to allow interfaces to define method implementations with concrete bodies without breaking existing implementing classes?",
      frequencyTag: "⭐ Repeated Cognizant Java 8 Technical Question",
      topic: "Java 8 • Interface Default Methods",
      options: ["abstract", "default", "virtual", "concrete"],
      correctAnswer: 1,
      explanation: "The `default` keyword enables interface evolution by providing a fallback method implementation, preserving binary backward compatibility.",
      whyCompanyAsks: "Cognizant GenC Next emphasizes modern Java 8+ functional and interface enhancements."
    },
    {
      id: "cog-q2",
      question: "What is the worst-case lookup time complexity to search for a word of length L in a Trie data structure containing N total dictionary words?",
      frequencyTag: "⭐ Cognizant Advanced DSA Screening",
      topic: "Advanced Data Structures • Trie (Prefix Tree)",
      options: ["O(N * L)", "O(log N)", "O(L) (strictly dependent on word length)", "O(N)"],
      correctAnswer: 2,
      explanation: "In a Trie, search visits one node per character of the query string. Hence, search runs in O(L) time regardless of how many millions of words N are stored.",
      whyCompanyAsks: "Prefix trees are a favorite Cognizant GenC Next topic for autocomplete and dictionary retrieval problems."
    },
    {
      id: "cog-q3",
      question: "Which SQL Join operation returns all records from the left table and matched records from the right table, populating unmatched right columns with `NULL`?",
      frequencyTag: "⭐ Cognizant SQL Technical Interview Favorite",
      topic: "DBMS • SQL Joins",
      options: ["INNER JOIN", "LEFT OUTER JOIN", "CROSS JOIN", "RIGHT OUTER JOIN"],
      correctAnswer: 1,
      explanation: "LEFT OUTER JOIN preserves all rows from the primary left table. Where no corresponding match exists in the right table, columns are filled with NULLs.",
      whyCompanyAsks: "Cognizant assesses candidates' mastery of relational data integrity and non-loss join mechanics."
    },
    {
      id: "cog-q4",
      question: "In binary search implementation, why is the midpoint index conventionally calculated as `low + (high - low) / 2` rather than `(low + high) / 2`?",
      frequencyTag: "⭐ Classic Cognizant Algorithm Bug Trap",
      topic: "Algorithms • Binary Search Overflow",
      options: [
        "It executes faster on the CPU",
        "It avoids 32-bit signed integer arithmetic overflow when `low + high` exceeds 2,147,483,647",
        "It works on linked lists directly",
        "It rounds towards high index"
      ],
      correctAnswer: 1,
      explanation: "If `low` and `high` are large, `(low + high)` can exceed the maximum 32-bit signed integer value (`2^31 - 1`), wrapping around to negative and throwing an array bounds exception.",
      whyCompanyAsks: "Cognizant tests attention to production edge cases and memory bounds."
    },
    {
      id: "cog-q5",
      question: "Which resource is shared among all threads executing within the same process in an operating system?",
      frequencyTag: "⭐ Cognizant OS Concurrency Question",
      topic: "Operating Systems • Processes & Threads",
      options: ["Call Stack", "Program Counter (PC)", "Heap memory & Global Variables", "Register Set"],
      correctAnswer: 2,
      explanation: "Threads share the process's Heap, global data, and code segment, while maintaining private Stacks, Registers, and Program Counters.",
      whyCompanyAsks: "Thread vs process memory isolation is an essential prerequisite for multi-threaded backend engineering."
    },
    {
      id: "cog-q6",
      question: "What is the primary purpose of CORS (Cross-Origin Resource Sharing) in modern web browser security?",
      frequencyTag: "⭐ Cognizant Web Technologies & Full-Stack Question",
      topic: "Web Security • CORS Architecture",
      options: [
        "To speed up CSS rendering",
        "To enforce Same-Origin Policy and selectively authorize browser requests across differing origins via HTTP headers",
        "To replace HTTPS encryption",
        "To minify JavaScript bundles"
      ],
      correctAnswer: 1,
      explanation: "CORS is an HTTP-header based mechanism that allows servers to declare which origins are permitted to access their resources from within a browser.",
      whyCompanyAsks: "Modern full-stack developers at Cognizant must understand browser security and REST API integration."
    },
    {
      id: "cog-q7",
      question: "In Java 8 Streams API, what is the fundamental difference between `map()` and `forEach()`?",
      frequencyTag: "⭐ Cognizant Java 8 Functional Programming",
      topic: "Java 8 • Stream Intermediate vs Terminal",
      options: [
        "`map()` is terminal; `forEach()` is intermediate",
        "`map()` is an intermediate lazy transformation operation returning a new Stream; `forEach()` is a terminal consuming operation producing side-effects",
        "Both produce a List",
        "`forEach()` is synchronous, `map()` is multithreaded"
      ],
      correctAnswer: 1,
      explanation: "Intermediate operations in Java Streams are lazy and transform elements. Terminal operations trigger pipeline evaluation and close the stream.",
      whyCompanyAsks: "Stream pipeline lifecycle is heavily tested for Cognizant GenC Next backend developers."
    },
    {
      id: "cog-q8",
      question: "What is the worst-case time complexity of QuickSort, and under what condition does it occur when using the first element as pivot?",
      frequencyTag: "⭐ Cognizant Sorting Algorithm Analysis",
      topic: "Algorithms • QuickSort Worst-Case",
      options: [
        "O(N log N) in all cases",
        "O(N^2), occurring when the input array is already sorted in ascending or descending order",
        "O(N)",
        "O(N^3)"
      ],
      correctAnswer: 1,
      explanation: "When already sorted, picking the first element creates unbalanced partitions of size 0 and N - 1 at each step, yielding $O(N^2)$ recursive calls.",
      whyCompanyAsks: "Cognizant interviewers test whether candidates understand randomized pivot selection (QuickSelect)."
    },
    {
      id: "cog-q9",
      question: "In relational database indexing, what is a Clustered Index?",
      frequencyTag: "⭐ Cognizant Database Architecture",
      topic: "DBMS • Clustered vs Non-Clustered Indexes",
      options: [
        "An index created in a cache cluster",
        "An index that defines the physical storage order of rows on disk; hence a table can have at most ONE clustered index",
        "An index that stores duplicate keys only",
        "A secondary index with pointers"
      ],
      correctAnswer: 1,
      explanation: "Because physical table rows can only be ordered on disk in one physical sequence, only one Clustered Index is permitted per table (typically the primary key).",
      whyCompanyAsks: "Database storage layout and index seek performance are core evaluation criteria."
    },
    {
      id: "cog-q10",
      question: "In the Java Virtual Machine (JVM), when does an allocated object become eligible for Garbage Collection?",
      frequencyTag: "⭐ Cognizant JVM Internals",
      topic: "Java • Garbage Collection Roots",
      options: [
        "Immediately after its method finishes",
        "When it is no longer reachable from any live Garbage Collection (GC) root thread/reference",
        "When `System.gc()` is called",
        "When RAM is 100% full"
      ],
      correctAnswer: 1,
      explanation: "An object is eligible for garbage collection when the GC mark-and-sweep algorithm cannot reach it via any reference chain starting from GC roots.",
      whyCompanyAsks: "Memory leak prevention and JVM heap management are vital for enterprise Java projects."
    },
    {
      id: "cog-q11",
      question: "In browser web storage, how does `sessionStorage` differ from `localStorage`?",
      frequencyTag: "⭐ Cognizant Web Development MCQ",
      topic: "Web Technologies • Client Storage",
      options: [
        "`localStorage` stores passwords only",
        "`sessionStorage` persists only for the lifetime of the browser tab; `localStorage` persists across sessions until explicitly deleted",
        "`sessionStorage` is transmitted with every HTTP request",
        "`localStorage` is limited to 4KB"
      ],
      correctAnswer: 1,
      explanation: "sessionStorage data is destroyed when the user closes the browser tab. localStorage has no expiration time and survives browser restarts.",
      whyCompanyAsks: "Frontend state management standards are tested for Cognizant digital engineers."
    },
    {
      id: "cog-q12",
      question: "In operating systems, which algorithm is utilized for Deadlock Avoidance by calculating safe execution sequences using Max, Allocation, and Available resource vectors?",
      frequencyTag: "⭐ Cognizant OS Theory",
      topic: "Operating Systems • Banker's Algorithm",
      options: ["Round Robin", "Banker's Algorithm", "Dijkstra's Shortest Path", "SSTF Disk Scheduling"],
      correctAnswer: 1,
      explanation: "Dijkstra's Banker's Algorithm simulates resource allocation to ensure the system never enters an unsafe state that could precipitate deadlock.",
      whyCompanyAsks: "Banker's algorithm safe sequence calculations appear regularly in AMCAT aptitude and OS rounds."
    },
    {
      id: "cog-q13",
      question: "In a Min-Heap implemented as a 0-indexed array, where is the parent of the node at index `i` located?",
      frequencyTag: "⭐ Cognizant Heap Array Math",
      topic: "Data Structures • Binary Heap Indexing",
      options: ["2 * i", "floor((i - 1) / 2)", "2 * i + 1", "i / 2"],
      correctAnswer: 1,
      explanation: "In a 0-indexed array: Parent = `floor((i - 1) / 2)`, Left Child = `2 * i + 1`, Right Child = `2 * i + 2`.",
      whyCompanyAsks: "Array representation of binary trees is a classic data structures interview question."
    },
    {
      id: "cog-q14",
      question: "Why are RESTful APIs designed to be 'Stateless' in modern microservice architectures?",
      frequencyTag: "⭐ Cognizant Software Architecture",
      topic: "System Design • Stateless REST",
      options: [
        "To save hard drive space",
        "Statelessness ensures each request contains all information needed to process it, enabling requests to be routed to ANY server node without sticky sessions",
        "Because stateful servers are illegal",
        "To disable caching"
      ],
      correctAnswer: 1,
      explanation: "Statelessness is what allows cloud services to scale horizontally behind load balancers with zero server-side session affinity locks.",
      whyCompanyAsks: "Microservice scalability design is a core requirement for Cognizant cloud consultants."
    },
    {
      id: "cog-q15",
      question: "How many distinct ways can the letters of the word 'LEADER' be arranged?",
      frequencyTag: "⭐ Cognizant Quantitative Permutations",
      topic: "Quantitative • Permutations with Duplicates",
      options: ["720", "360", "120", "64"],
      correctAnswer: 1,
      explanation: "Total letters = 6. Letter 'E' repeats twice. Distinct permutations = 6! / 2! = 720 / 2 = 360.",
      whyCompanyAsks: "Permutations of words with repeating characters are standard in Cognizant cognitive assessments."
    }
  ]
};
