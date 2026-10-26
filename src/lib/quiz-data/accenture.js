// Accenture Advanced Technical & Cognitive Authentic Placement PYQ Bank (15 Questions)
// Sourced from CoCubes, Wheebox, and Accenture Technical Assessment archives

export const ACCENTURE_QUIZ = {
  id: "quiz-accenture-tech",
  companyId: "accenture",
  company: "Accenture",
  companyLogo: "⚡",
  title: "Accenture Advanced Technical Assessment PYQs",
  slug: "accenture-advanced-tech",
  category: "Consulting & Tech",
  placementRound: "Round 1: Cognitive & Technical Assessment",
  frequencyInfo: "⭐ Repeated in Accenture Advanced Technical & Cognitive Assessment",
  difficulty: "MEDIUM",
  durationMinutes: 15,
  totalQuestions: 15,
  points: 300,
  unstopCoinsReward: 60,
  description: "Curated 15-question sprint directly from Accenture recruitment archives testing pseudocode bitwise logic, cloud service models (IaaS/PaaS/SaaS), TLS network security, Venn logic, Boundary Value Analysis, and Circular Queues.",
  badge: "Accenture Certified",
  questions: [
    {
      id: "acc-q1",
      question: "In a pseudocode loop: `ans = 0; for each x in [2, 3, 2, 4, 3]: ans = ans ^ x`. What is the final value of `ans`?",
      frequencyTag: "⭐ Repeated Accenture Pseudocode Question",
      topic: "Pseudocode • Bitwise Logic",
      options: ["0", "2", "3", "4"],
      correctAnswer: 3,
      explanation: "Bitwise XOR is commutative and associative. `(2 ^ 2) ^ (3 ^ 3) ^ 4 = 0 ^ 0 ^ 4 = 4`. Paired duplicates eliminate each other.",
      whyCompanyAsks: "Accenture pseudocode rounds heavily feature bitwise arithmetic and variable scope tracking."
    },
    {
      id: "acc-q2",
      question: "Which cloud computing deployment model provides dedicated infrastructure exclusively for a single organization, operated internally or by a third-party?",
      frequencyTag: "⭐ Accenture Cloud & Security Fundamentals",
      topic: "Cloud Computing • Deployment Models",
      options: ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Community Cloud"],
      correctAnswer: 1,
      explanation: "A Private Cloud delivers infrastructure exclusively dedicated to a single client organization, ensuring maximum data isolation and compliance control.",
      whyCompanyAsks: "Accenture is a major global cloud migration partner, requiring every graduate to grasp cloud deployment models."
    },
    {
      id: "acc-q3",
      question: "Which cryptographic protocol operates at the Transport Layer to provide end-to-end encryption, authentication, and integrity for HTTPS web traffic?",
      frequencyTag: "⭐ Accenture Network Security MCQ",
      topic: "Computer Networks • TLS/SSL",
      options: ["IPsec", "TLS (Transport Layer Security)", "SSH", "SNMP"],
      correctAnswer: 1,
      explanation: "TLS (and its predecessor SSL) resides between the Application and Transport layers (operating over TCP) to secure web traffic.",
      whyCompanyAsks: "Network security and cryptographic handshakes are core requirements in Accenture's technical assessment."
    },
    {
      id: "acc-q4",
      question: "In an engineering batch of 100 students, 60 know C++, 45 know Python, and 20 know both languages. How many students know NEITHER C++ nor Python?",
      frequencyTag: "⭐ Repeated Accenture Abstract & Logical Reasoning",
      topic: "Logical Reasoning • Set Theory & Venn Diagrams",
      options: ["10", "15", "20", "25"],
      correctAnswer: 1,
      explanation: "Total knowing at least one = `n(C++) + n(Py) - n(Both)` = 60 + 45 - 20 = 85. Students knowing neither = 100 - 85 = 15.",
      whyCompanyAsks: "Set theory Venn logic questions are a staple of Accenture's Cognitive Reasoning section."
    },
    {
      id: "acc-q5",
      question: "Which data structure is primarily used by compilers to convert an arithmetic expression from Infix notation to Postfix notation?",
      frequencyTag: "⭐ Accenture Data Structures Favorite",
      topic: "Data Structures • Stack Applications",
      options: ["Queue", "Stack", "Binary Search Tree", "Linked List"],
      correctAnswer: 1,
      explanation: "The Shunting-Yard algorithm uses an Operator Stack to manage precedence and associativity when transforming Infix to Postfix (RPN).",
      whyCompanyAsks: "Stack applications in expression parsing are repeatedly tested across Accenture technical rounds."
    },
    {
      id: "acc-q6",
      question: "In the Agile Scrum framework, which time-boxed meeting occurs at the end of every sprint to evaluate team performance and agree on actionable improvements?",
      frequencyTag: "⭐ Accenture Software Engineering & Agile Round",
      topic: "Software Engineering • Scrum Practices",
      options: ["Sprint Planning", "Daily Standup", "Sprint Review", "Sprint Retrospective"],
      correctAnswer: 3,
      explanation: "The Sprint Retrospective focuses on team process inspection and continuous improvement ('what went well, what can be improved').",
      whyCompanyAsks: "Accenture delivers client projects using Agile/Scrum, making software process knowledge essential."
    },
    {
      id: "acc-q7",
      question: "What is the cloud service model classification for: 1) AWS EC2, 2) Google App Engine, and 3) Salesforce CRM?",
      frequencyTag: "⭐ Accenture Cloud Computing Essentials",
      topic: "Cloud Architecture • IaaS vs PaaS vs SaaS",
      options: [
        "1) SaaS, 2) PaaS, 3) IaaS",
        "1) IaaS, 2) PaaS, 3) SaaS",
        "1) PaaS, 2) IaaS, 3) SaaS",
        "All three are IaaS"
      ],
      correctAnswer: 1,
      explanation: "EC2 provides raw virtual machines (Infrastructure as a Service), App Engine provides managed application runtime (Platform as a Service), and Salesforce is ready-to-use business software (Software as a Service).",
      whyCompanyAsks: "Accenture's massive enterprise cloud practice requires clear taxonomy understanding."
    },
    {
      id: "acc-q8",
      question: "In Software Testing, what is Boundary Value Analysis (BVA)?",
      frequencyTag: "⭐ Accenture Quality Assurance & Testing",
      topic: "Software Engineering • Black-Box Testing",
      options: [
        "Testing randomly chosen inputs",
        "A black-box test design technique that tests values at and around the boundaries of input partitions (e.g., min-1, min, max, max+1)",
        "Reading the source code line by line",
        "Performance load testing"
      ],
      correctAnswer: 1,
      explanation: "Defects cluster heavily at input boundaries (off-by-one errors). BVA rigorously targets minimum and maximum edge values.",
      whyCompanyAsks: "Quality assurance and testing fundamentals are heavily tested for Accenture Associate Software Engineer roles."
    },
    {
      id: "acc-q9",
      question: "In an array-based Circular Queue of capacity N, what condition indicates that the queue is completely full?",
      frequencyTag: "⭐ Accenture Data Structures MCQ",
      topic: "Data Structures • Circular Queue",
      options: [
        "front == rear",
        "(rear + 1) % N == front",
        "rear == N - 1",
        "front == 0"
      ],
      correctAnswer: 1,
      explanation: "In a circular queue with one slot reserved to distinguish full from empty, the queue is full when advancing rear by 1 matches front: `(rear + 1) % N == front`.",
      whyCompanyAsks: "Circular buffer mechanics are a staple of Accenture technical screening."
    },
    {
      id: "acc-q10",
      question: "Which default network port and transport layer protocol does the Domain Name System (DNS) use for standard domain name resolution queries?",
      frequencyTag: "⭐ Accenture Networking MCQ",
      topic: "Computer Networks • DNS Protocol",
      options: ["Port 80 over TCP", "Port 53 over UDP", "Port 443 over TCP", "Port 21 over FTP"],
      correctAnswer: 1,
      explanation: "Standard DNS client queries use UDP Port 53 for speed and minimal overhead. (Zone transfers between servers use TCP Port 53).",
      whyCompanyAsks: "Core networking port standards are frequently checked in Accenture assessments."
    },
    {
      id: "acc-q11",
      question: "In a relational database, what type of constraint enforces Referential Integrity between two tables?",
      frequencyTag: "⭐ Accenture Database Concepts",
      topic: "DBMS • Referential Integrity",
      options: ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "CHECK"],
      correctAnswer: 1,
      explanation: "A FOREIGN KEY references a PRIMARY or UNIQUE key in a parent table, ensuring child records cannot reference non-existent parent records.",
      whyCompanyAsks: "Data consistency and relational keys appear across all Accenture DB tests."
    },
    {
      id: "acc-q12",
      question: "What is the output of the pseudocode snippet:\n`Integer a = 12, b = 25\na = a ^ b\nb = a ^ b\na = a ^ b\nPrint a, b`?",
      frequencyTag: "⭐ Classic Accenture Pseudocode Value Swap",
      topic: "Pseudocode • Variable Swap via XOR",
      options: ["12, 25", "25, 12", "0, 0", "37, 37"],
      correctAnswer: 1,
      explanation: "XOR-based swapping exchanges the values of two variables without requiring any third temporary variable: `a` becomes 25, `b` becomes 12.",
      whyCompanyAsks: "Accenture pseudocode tests variable tracing and arithmetic bitwise identities."
    },
    {
      id: "acc-q13",
      question: "In an array of length N, if we want to shift every element K positions to the right cyclically, what is the new index of an element originally at index `i`?",
      frequencyTag: "⭐ Accenture Coding Logic",
      topic: "Array Manipulation • Modulo Arithmetic",
      options: ["i + K", "(i + K) % N", "(i - K) % N", "i * K % N"],
      correctAnswer: 1,
      explanation: "Modulo arithmetic wraps indices around the array boundaries, placing element `i` at `(i + K) % N`.",
      whyCompanyAsks: "Index mapping with modulo arithmetic is standard in Accenture's hands-on coding tests."
    },
    {
      id: "acc-q14",
      question: "Which cyber security attack involves an adversary secretly intercepting and relaying communications between two parties who believe they are communicating directly?",
      frequencyTag: "⭐ Accenture Information Security",
      topic: "Cyber Security • Attack Vectors",
      options: ["Denial of Service (DoS)", "Man-in-the-Middle (MitM) Attack", "SQL Injection", "Cross-Site Scripting (XSS)"],
      correctAnswer: 1,
      explanation: "In a Man-in-the-Middle attack, the attacker intercepts communications (e.g., via ARP spoofing or rogue Wi-Fi) to eavesdrop or tamper with data.",
      whyCompanyAsks: "Enterprise client data protection is a primary operational standard for Accenture."
    },
    {
      id: "acc-q15",
      question: "What is the cyclomatic complexity of a simple sequential program containing no decision branches (if/while/for statements)?",
      frequencyTag: "⭐ Accenture Software Engineering Metrics",
      topic: "Software Metrics • Cyclomatic Complexity",
      options: ["0", "1", "2", "Undefined"],
      correctAnswer: 1,
      explanation: "McCabe's Cyclomatic Complexity formula is `M = E - N + 2P` or `Number of decision points + 1`. With 0 decision branches, complexity is exactly 1.",
      whyCompanyAsks: "Code testability metrics are evaluated in Accenture's advanced engineering section."
    }
  ]
};
