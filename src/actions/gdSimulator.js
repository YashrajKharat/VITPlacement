"use server";

import { auth } from "@/lib/auth";
import { db, toPlain } from "@/lib/db";

// 1. Get GD Topics & Personas
export async function getGdTopicsAction() {
  return [
    {
      id: "gen-ai-jobs",
      title: "Generative AI vs Software Engineering: Will AI Replace Entry-Level Developers by 2028?",
      category: "Technology & Careers",
      difficulty: "HOT TOPIC",
      description: "Discuss whether large language models and coding agents like Cursor and Devin will shrink campus hiring or elevate developers to higher-level architects.",
      openingPoints: [
        "Productivity gains of 40-55% reported by GitHub Copilot studies.",
        "Need for algorithmic problem solvers, prompt engineers, and systems architects.",
        "Historical parallels: Compilers and 4GLs didn't kill programming, they expanded it."
      ]
    },
    {
      id: "remote-vs-office",
      title: "Mandatory Return-to-Office vs Full Remote Work: What is Best for Junior Engineers?",
      category: "Corporate Culture",
      difficulty: "POPULAR",
      description: "Debate the trade-offs between physical office mentorship and the flexibility and global talent pool enabled by remote work.",
      openingPoints: [
        "Osmotic learning and hallway conversations accelerate junior onboarding.",
        "Remote work expands opportunities for tier-2/3 college graduates across India.",
        "Hybrid 3-2 models balancing focus days with collaborative sprints."
      ]
    },
    {
      id: "ai-ethics-regulation",
      title: "Data Privacy vs Innovation: Should Governments Regulate Big Tech's AI Models?",
      category: "Policy & Ethics",
      difficulty: "ADVANCED",
      description: "Examine whether aggressive EU AI Act-style regulations stifle innovation or protect societal democratic structures and employment.",
      openingPoints: [
        "Deepfakes, copyright infringement, and biased training data risks.",
        "Over-regulation could push talent and startups to less restrictive jurisdictions.",
        "Open-source AI democratization vs closed proprietary monopolies."
      ]
    }
  ];
}

// 2. Autonomous Agent Responses based on Turn and Topic
export async function getAgentTurnResponseAction({ topicId, speakerId, currentTranscript }) {
  const responsesByTopic = {
    "gen-ai-jobs": {
      arjun: [
        "I strongly believe AI won't replace engineers, but engineers who use AI will completely replace those who don't. At the end of the day, someone has to understand the business requirements and architecture.",
        "Looking at the ground reality, Devin and Claude can generate code, but who debugs production incidents at 3 AM? Critical human oversight is irreplaceable."
      ],
      priya: [
        "To look at the numbers, Gartner projects that by 2027, 80% of engineering teams will use coding copilots. But historical data shows when software development becomes cheaper, total demand for software actually increases exponentially.",
        "Let's look at the statistics: code generation accuracy drops significantly when enterprise codebases exceed 500,000 lines. The real bottleneck is system integration, not syntax."
      ],
      rohan: [
        "I think Arjun and Priya make valid points. What if we view AI as an abstraction layer? Just like high-level languages replaced assembly, AI is simply elevating junior engineers to design thinking earlier in their careers.",
        "Let's also give our peer an opportunity to share their thoughts—how do you see the entry-level hiring landscape evolving in Indian service and product companies?"
      ],
      ananya: [
        "From an industry perspective, companies like Tata, Infosys, and Google aren't stopping hiring; they're fundamentally shifting their interview criteria towards system design and problem framing rather than boilerplate coding.",
        "In our college curriculum at VIT Wadala, we are already seeing students build full-stack apps in weeks instead of months. The focus must be on building genuine real-world value."
      ]
    },
    "remote-vs-office": {
      arjun: [
        "Let's be candid: junior engineers need in-person mentorship. Sitting next to a Senior SDE and observing how they trace logs and debug outages in real time cannot be replaced by Slack messages.",
        "Culture and camaraderie build loyalty. Complete remote work turns engineering into transactional gig work."
      ],
      priya: [
        "However, empirical studies from Stanford show a 13% performance boost in remote engineering teams due to fewer interruptions and zero commute fatigue in cities like Mumbai and Bangalore.",
        "Furthermore, remote hiring allows tier-2 and tier-3 colleges to compete directly for international USD remote salaries."
      ],
      rohan: [
        "Both viewpoints hold merit. Perhaps the sustainable compromise is a flexible 3-day hybrid framework that preserves team whiteboarding without forcing 3 hours of Mumbai local train commute.",
        "What does our fellow team member think about the balance between mentorship and autonomy?"
      ],
      ananya: [
        "Look at Atlassian and GitLab—they operate entirely remote with multi-billion-dollar enterprise delivery. But Indian corporate culture still heavily values face-to-face trust building."
      ]
    }
  };

  const topicResponses = responsesByTopic[topicId] || responsesByTopic["gen-ai-jobs"];
  const agentPool = topicResponses[speakerId] || [
    "I agree with the points raised, but we must also examine the long-term scalability and business impact."
  ];

  // Pick response based on turn count or random
  const chosenText = agentPool[Math.floor(Math.random() * agentPool.length)];

  return {
    success: true,
    speakerId,
    message: chosenText
  };
}

// 3. Evaluate Entire GD Session and Generate Detailed Placement Scorecard
export async function evaluateGdSessionAction({ topicTitle, transcript, userSpeakingSeconds, totalDurationSeconds }) {
  try {
    const session = await auth();

    const userTurns = transcript.filter(t => t.speaker === "YOU");
    const totalWords = userTurns.reduce((acc, t) => acc + (t.text ? t.text.split(" ").length : 0), 0);

    // Calculate metrics
    const speakingRatio = totalDurationSeconds > 0 
      ? Math.round((userSpeakingSeconds / totalDurationSeconds) * 100) 
      : 20;

    // 1. Initiative Score (Did they enter early?)
    const firstTurnIndex = transcript.findIndex(t => t.speaker === "YOU");
    let initiativeScore = 22;
    if (firstTurnIndex >= 0 && firstTurnIndex <= 2) {
      initiativeScore = 24; // Great early entry
    } else if (firstTurnIndex > 5) {
      initiativeScore = 17; // Late entry
    }

    // 2. Articulation & Content Depth
    let contentScore = Math.min(25, Math.max(16, Math.round(totalWords / 4.5)));

    // 3. Airtime Balance (Optimal GD speaking time is 18% - 32% in a 5-person panel)
    let airtimeScore = 20;
    if (speakingRatio >= 18 && speakingRatio <= 32) {
      airtimeScore = 24; // Perfect balance
    } else if (speakingRatio > 45) {
      airtimeScore = 16; // Monopolized conversation
    } else if (speakingRatio < 12) {
      airtimeScore = 15; // Too passive
    }

    // 4. Etiquette & Listening
    const etiquetteScore = 23;

    const totalScore = initiativeScore + contentScore + airtimeScore + etiquetteScore;

    let verdict = "RECOMMENDED FOR INTERVIEW (CLEARED)";
    let verdictColor = "emerald";
    if (totalScore < 70) {
      verdict = "BORDERLINE — REQUIRES MORE ASSERTIVE CONTRIBUTION";
      verdictColor = "amber";
    }

    return toPlain({
      success: true,
      totalScore,
      initiativeScore,
      contentScore,
      airtimeScore,
      etiquetteScore,
      userTurnsCount: userTurns.length,
      speakingRatio,
      totalWordsSpoken: totalWords,
      verdict,
      verdictColor,
      strengths: [
        `Maintained an active speaking share of ${speakingRatio}% within the target 5-candidate panel range.`,
        `Engaged directly with peers' arguments rather than presenting isolated monologue points.`,
        `Demonstrated professional business etiquette without interrupting speakers aggressively.`
      ],
      areasOfImprovement: [
        `Anchor your arguments with more quantifiable industry metrics or named corporate examples (e.g. "Gartner survey", "GitHub Copilot metrics").`,
        `Summarize and synthesize the group's emerging consensus towards the final 60 seconds to claim the leadership moderator spotlight.`
      ]
    });
  } catch (err) {
    return { error: err.message || "Failed to evaluate GD session." };
  }
}

// ==========================================
// 4. MULTI-PEER GD ROOM & INVITE SYSTEM
// ==========================================
import fs from "fs";
import path from "path";

const MOCK_STORAGE = path.join(process.cwd(), ".mockdb.json");

function getStoredRooms() {
  try {
    if (fs.existsSync(MOCK_STORAGE)) {
      const parsed = JSON.parse(fs.readFileSync(MOCK_STORAGE, "utf-8"));
      return parsed.gdRooms || [];
    }
  } catch (e) {
    console.error("Error reading stored GD rooms:", e);
  }
  return [];
}

function saveStoredRooms(rooms) {
  try {
    if (fs.existsSync(MOCK_STORAGE)) {
      const parsed = JSON.parse(fs.readFileSync(MOCK_STORAGE, "utf-8"));
      parsed.gdRooms = rooms;
      fs.writeFileSync(MOCK_STORAGE, JSON.stringify(parsed, null, 2), "utf-8");
    }
  } catch (e) {
    console.error("Error saving stored GD rooms:", e);
  }
}

// Create a new GD Room with unique invite code
export async function createGdRoomAction({ topicTitle, category, durationMinutes, mode }) {
  try {
    const session = await auth();
    const hostName = session?.user?.name || "Student Candidate";
    const hostId = session?.user?.id || `user-${Date.now()}`;

    // Unique Room Code: VIT-GD-XXXX
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const roomCode = `VIT-GD-${randomCode}`;

    const newRoom = {
      id: `gd-room-${Date.now()}`,
      code: roomCode,
      topicTitle: topicTitle || "Generative AI vs Software Engineering Careers",
      category: category || "Technology & Placement",
      durationMinutes: Number(durationMinutes) || 3,
      mode: mode || "HYBRID", // "HYBRID" (friends + AI fillers) | "PEERS_ONLY"
      hostId,
      hostName,
      status: "WAITING", // "WAITING" | "ACTIVE" | "COMPLETED"
      participants: [
        {
          id: hostId,
          name: hostName,
          role: "HOST",
          avatar: "🎓",
          isAi: false,
          joinedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ],
      transcript: [
        {
          speaker: "System",
          speakerId: "SYSTEM",
          text: `GD Room created by ${hostName}. Share Code ${roomCode} with friends to join the roundtable!`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ],
      createdAt: new Date().toISOString()
    };

    const rooms = getStoredRooms();
    rooms.unshift(newRoom);
    saveStoredRooms(rooms);

    return toPlain({
      success: true,
      room: newRoom,
      inviteUrl: `/dashboard/student/gd-simulator?room=${roomCode}`
    });
  } catch (err) {
    return { error: err.message || "Failed to create GD room." };
  }
}

// Fetch a room by Room Code
export async function getGdRoomAction(roomCode) {
  try {
    if (!roomCode) return { error: "Room code required." };
    const normalizedCode = roomCode.trim().toUpperCase();
    const rooms = getStoredRooms();
    const found = rooms.find(r => r.code === normalizedCode || r.id === roomCode);
    if (!found) return { error: `GD Room with code "${normalizedCode}" not found.` };
    return toPlain({ success: true, room: found });
  } catch (err) {
    return { error: err.message || "Failed to load GD room." };
  }
}

// Join an existing GD Room
export async function joinGdRoomAction({ roomCode, participantName }) {
  try {
    const session = await auth();
    const name = participantName?.trim() || session?.user?.name || "Peer Candidate";
    const userId = session?.user?.id || `peer-${Date.now()}`;
    const normalizedCode = (roomCode || "").trim().toUpperCase();

    const rooms = getStoredRooms();
    const roomIndex = rooms.findIndex(r => r.code === normalizedCode);
    if (roomIndex === -1) {
      return { error: `Room "${normalizedCode}" not found.` };
    }

    const room = rooms[roomIndex];

    // Check if already in participants
    const alreadyJoined = room.participants.some(p => p.id === userId || p.name.toLowerCase() === name.toLowerCase());
    if (!alreadyJoined) {
      if (room.participants.length >= 5) {
        return { error: "Room is already full (Maximum 5 candidates allowed in a GD panel)." };
      }

      const avatars = ["👨‍🎓", "👩‍💻", "🧑‍🔬", "👨‍💼", "👩‍🎓"];
      const avatar = avatars[room.participants.length % avatars.length];

      room.participants.push({
        id: userId,
        name,
        role: "PEER",
        avatar,
        isAi: false,
        joinedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });

      room.transcript.push({
        speaker: "System",
        speakerId: "SYSTEM",
        text: `${name} joined the discussion panel.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });

      saveStoredRooms(rooms);
    }

    return toPlain({
      success: true,
      room,
      message: `Joined room ${normalizedCode} successfully!`
    });
  } catch (err) {
    return { error: err.message || "Failed to join GD room." };
  }
}

// Quick Test Action: Simulate a peer joining the room on localhost
export async function simulatePeerJoinAction({ roomCode, peerName, peerRole }) {
  try {
    const normalizedCode = (roomCode || "").trim().toUpperCase();
    const rooms = getStoredRooms();
    const room = rooms.find(r => r.code === normalizedCode);
    if (!room) return { error: "Room not found." };

    if (room.participants.length >= 5) {
      return { error: "Panel is already at max capacity (5 seats)." };
    }

    const name = peerName || "Rohan V. (Batch '26)";
    const role = peerRole || "CAMPUS_PEER";
    const avatars = ["🧑‍💻", "👩‍🎓", "👨‍💼", "👩‍🔬"];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    room.participants.push({
      id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      role,
      avatar,
      isAi: false,
      isSimulated: true,
      joinedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    room.transcript.push({
      speaker: "System",
      speakerId: "SYSTEM",
      text: `${name} joined the GD panel.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    saveStoredRooms(rooms);
    return toPlain({ success: true, room });
  } catch (err) {
    return { error: err.message || "Failed to simulate peer join." };
  }
}

// Start Room (Host starts discussion)
export async function startGdRoomAction(roomCode) {
  try {
    const normalizedCode = (roomCode || "").trim().toUpperCase();
    const rooms = getStoredRooms();
    const room = rooms.find(r => r.code === normalizedCode);
    if (!room) return { error: "Room not found." };

    room.status = "ACTIVE";
    room.transcript.push({
      speaker: "Moderator",
      speakerId: "SYSTEM",
      text: "The discussion floor is officially open! Good luck candidates.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    saveStoredRooms(rooms);
    return toPlain({ success: true, room });
  } catch (err) {
    return { error: err.message || "Failed to start room." };
  }
}

// Post turn message to Room transcript
export async function addRoomTranscriptMessageAction({ roomCode, speakerName, speakerId, text }) {
  try {
    const normalizedCode = (roomCode || "").trim().toUpperCase();
    const rooms = getStoredRooms();
    const room = rooms.find(r => r.code === normalizedCode);
    if (!room) return { error: "Room not found." };

    const entry = {
      speaker: speakerName || "Candidate",
      speakerId: speakerId || "YOU",
      text: text?.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    room.transcript.push(entry);
    saveStoredRooms(rooms);

    return toPlain({ success: true, entry, room });
  } catch (err) {
    return { error: err.message || "Failed to add message to transcript." };
  }
}

// List recent active campus GD rooms
export async function listActiveGdRoomsAction() {
  try {
    const rooms = getStoredRooms();
    const activeOrWaiting = rooms.filter(r => r.status === "WAITING" || r.status === "ACTIVE").slice(0, 6);
    return toPlain({ success: true, rooms: activeOrWaiting });
  } catch (err) {
    return { error: "Failed to list rooms." };
  }
}
