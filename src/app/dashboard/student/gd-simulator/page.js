"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  getGdTopicsAction, 
  getAgentTurnResponseAction, 
  evaluateGdSessionAction,
  createGdRoomAction,
  getGdRoomAction,
  joinGdRoomAction,
  simulatePeerJoinAction,
  startGdRoomAction,
  addRoomTranscriptMessageAction,
  listActiveGdRoomsAction
} from "@/actions/gdSimulator";
import { 
  Users, Mic, MicOff, Volume2, VolumeX, Sparkles, 
  ArrowLeft, Play, Square, Award, CheckCircle2, 
  Clock, AlertCircle, RefreshCw, Send, ChevronRight, MessageSquare,
  Copy, Check, Share2, Plus, UserPlus, LogIn, ExternalLink, Zap
} from "lucide-react";

// AI Agent baseline pool
const DEFAULT_AGENTS = [
  { id: "arjun", name: "Arjun Verma", role: "Assertive Debater", avatar: "👨‍💻", isAi: true, color: "indigo" },
  { id: "priya", name: "Priya Sharma", role: "Analytical Quant", avatar: "👩‍🔬", isAi: true, color: "emerald" },
  { id: "rohan", name: "Rohan Deshmukh", role: "Diplomatic Moderator", avatar: "🧑‍💼", isAi: true, color: "purple" },
  { id: "ananya", name: "Ananya Iyer", role: "Industry Realist", avatar: "👩‍💼", isAi: true, color: "amber" }
];

function GdSimulatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlRoomCode = searchParams.get("room");

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [userSpeechText, setUserSpeechText] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [scorecard, setScorecard] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [userTotalSeconds, setUserTotalSeconds] = useState(0);

  // --- MULTI-PEER ROOM & INVITE STATES ---
  const [currentRoom, setCurrentRoom] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [guestNameInput, setGuestNameInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);

  // Custom room form
  const [customTopicTitle, setCustomTopicTitle] = useState("");
  const [customCategory, setCustomCategory] = useState("Technology & Placement");
  const [customDuration, setCustomDuration] = useState("3");
  const [customMode, setCustomMode] = useState("HYBRID"); // HYBRID | PEERS_ONLY

  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const aiTurnTimeoutRef = useRef(null);
  const transcriptBottomRef = useRef(null);

  // Load topics & check URL room parameter on mount
  useEffect(() => {
    const init = async () => {
      const data = await getGdTopicsAction();
      setTopics(data || []);
      if (data && data.length > 0) {
        setSelectedTopic(data[0]);
      }

      // If URL has ?room=VIT-GD-XXXX, load that room
      if (urlRoomCode) {
        const roomRes = await getGdRoomAction(urlRoomCode);
        if (roomRes?.success && roomRes.room) {
          setCurrentRoom(roomRes.room);
          setSelectedTopic({
            id: roomRes.room.id,
            title: roomRes.room.topicTitle,
            category: roomRes.room.category,
            difficulty: "CAMPUS LIVE",
            description: "Live interactive discussion hosted by " + roomRes.room.hostName
          });
        }
      }
    };
    init();
  }, [urlRoomCode]);

  // Scroll transcript down automatically
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Session timer countdown
  useEffect(() => {
    if (sessionActive && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            handleEndSession();
            return 0;
          }
          return prev - 1;
        });
        if (isUserSpeaking) {
          setUserTotalSeconds(prev => prev + 1);
        }
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [sessionActive, timerSeconds, isUserSpeaking]);

  // Text to Speech Helper
  const speakText = (text, personaId) => {
    if (!audioEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    if (personaId === "arjun") utterance.pitch = 0.95;
    if (personaId === "priya") utterance.pitch = 1.15;
    if (personaId === "rohan") utterance.pitch = 1.0;
    if (personaId === "ananya") utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech Recognition Setup
  const initSpeechRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;
          setUserSpeechText(prev => `${prev} ${finalTranscript}`.trim());
        } else {
          interim += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = () => {
      setIsUserSpeaking(false);
    };

    recognitionRef.current = recognition;
  };

  // Determine active panel members for the roundtable (5 seats max)
  const getPanelSeats = () => {
    if (!currentRoom) {
      return [
        { id: "YOU", name: "YOU", role: "Candidate", avatar: "🎓", isUser: true },
        ...DEFAULT_AGENTS
      ];
    }

    const participants = currentRoom.participants || [];
    const seats = [];

    // 1. Host or User
    seats.push({ id: "YOU", name: "YOU (Host)", role: "Host Candidate", avatar: "🎓", isUser: true });

    // 2. Add friends who joined
    participants.slice(1).forEach((p, idx) => {
      seats.push({
        id: p.id,
        name: p.name,
        role: p.role || "Peer Candidate",
        avatar: p.avatar || "🧑‍💻",
        isPeer: true
      });
    });

    // 3. Fill remaining seats with AI agents if in HYBRID mode
    if (currentRoom.mode === "HYBRID" || seats.length < 5) {
      let aiIndex = 0;
      while (seats.length < 5 && aiIndex < DEFAULT_AGENTS.length) {
        seats.push(DEFAULT_AGENTS[aiIndex]);
        aiIndex++;
      }
    }

    return seats;
  };

  // Start GD Session
  const handleStartSession = async () => {
    const totalSecs = (currentRoom ? Number(currentRoom.durationMinutes) : 3) * 60;
    setSessionActive(true);
    setTimerSeconds(totalSecs);
    setUserTotalSeconds(0);
    setScorecard(null);
    setTranscript([]);
    initSpeechRecognition();

    if (currentRoom) {
      await startGdRoomAction(currentRoom.code);
    }

    const openingTopic = selectedTopic?.title || "our campus discussion topic";

    // Opening turn
    setTimeout(() => {
      triggerAgentTurn("arjun", `Good morning everyone. To kick off our discussion on "${openingTopic}", I'd like to propose that we first define the core challenges before examining the business and technical implications.`);
    }, 1500);
  };

  // Trigger an AI Agent turn
  const triggerAgentTurn = async (speakerId, customMessage) => {
    if (!sessionActive && transcript.length > 0) return;
    setActiveSpeaker(speakerId);

    let message = customMessage;
    if (!message) {
      const res = await getAgentTurnResponseAction({
        topicId: selectedTopic?.id || "gen-ai-jobs",
        speakerId,
        currentTranscript: transcript
      });
      message = res.message;
    }

    const agent = DEFAULT_AGENTS.find(a => a.id === speakerId);
    speakText(message, speakerId);

    const newEntry = {
      speaker: agent?.name || speakerId,
      speakerId,
      text: message,
      time: new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" })
    };

    setTranscript(prev => [...prev, newEntry]);

    if (currentRoom) {
      await addRoomTranscriptMessageAction({
        roomCode: currentRoom.code,
        speakerName: agent?.name || speakerId,
        speakerId,
        text: message
      });
    }

    // Schedule next turn
    const speakingDuration = Math.min(10000, Math.max(5000, (message.split(" ").length / 2.5) * 1000));
    aiTurnTimeoutRef.current = setTimeout(() => {
      setActiveSpeaker(null);
      if (!isUserSpeaking) {
        scheduleNextAiTurn(speakerId);
      }
    }, speakingDuration);
  };

  const scheduleNextAiTurn = (lastSpeakerId) => {
    const pool = DEFAULT_AGENTS.filter(a => a.id !== lastSpeakerId);
    const nextAgent = pool[Math.floor(Math.random() * pool.length)];
    const delay = Math.floor(Math.random() * 2500) + 1500;
    
    aiTurnTimeoutRef.current = setTimeout(() => {
      if (!isUserSpeaking) {
        triggerAgentTurn(nextAgent.id);
      }
    }, delay);
  };

  // User "Jump In / Speak" Toggle
  const toggleUserMic = () => {
    if (!isUserSpeaking) {
      clearTimeout(aiTurnTimeoutRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setActiveSpeaker("YOU");
      setIsUserSpeaking(true);
      setUserSpeechText("");

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    } else {
      handleUserFinishedTurn();
    }
  };

  // Submit User Speaking Turn
  const handleUserFinishedTurn = async () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsUserSpeaking(false);
    setActiveSpeaker(null);

    const spoken = userSpeechText.trim() || "I agree with the previous points, and I believe we must also evaluate the cost efficiency and real-world deployment trade-offs.";
    
    const newEntry = {
      speaker: "YOU",
      speakerId: "YOU",
      text: spoken,
      time: new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" })
    };

    setTranscript(prev => [...prev, newEntry]);
    setUserSpeechText("");

    if (currentRoom) {
      await addRoomTranscriptMessageAction({
        roomCode: currentRoom.code,
        speakerName: "YOU (Host)",
        speakerId: "YOU",
        text: spoken
      });
    }

    // AI agent responds contextually
    aiTurnTimeoutRef.current = setTimeout(() => {
      triggerAgentTurn("rohan");
    }, 1800);
  };

  // End Session & Trigger AI Evaluation
  const handleEndSession = async () => {
    setSessionActive(false);
    setActiveSpeaker(null);
    setIsUserSpeaking(false);
    clearInterval(timerIntervalRef.current);
    clearTimeout(aiTurnTimeoutRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setEvaluating(true);
    try {
      const evalRes = await evaluateGdSessionAction({
        topicTitle: selectedTopic?.title,
        transcript,
        userSpeakingSeconds: userTotalSeconds || 35,
        totalDurationSeconds: 180 - timerSeconds || 180
      });
      if (evalRes?.success) {
        setScorecard(evalRes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  // Create GD Room Handler
  const handleCreateRoom = async () => {
    setCreatingRoom(true);
    try {
      const topic = customTopicTitle.trim() || selectedTopic?.title || "Autonomous AI Agents in Enterprise Software";
      const res = await createGdRoomAction({
        topicTitle: topic,
        category: customCategory,
        durationMinutes: customDuration,
        mode: customMode
      });
      if (res?.success && res.room) {
        setCurrentRoom(res.room);
        setSelectedTopic({
          id: res.room.id,
          title: res.room.topicTitle,
          category: res.room.category,
          difficulty: "CAMPUS LIVE",
          description: "Live interactive discussion hosted by " + res.room.hostName
        });
        setCreateModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingRoom(false);
    }
  };

  // Join GD Room Handler
  const handleJoinRoom = async () => {
    if (!roomCodeInput.trim()) return;
    setJoiningRoom(true);
    try {
      const res = await joinGdRoomAction({
        roomCode: roomCodeInput,
        participantName: guestNameInput
      });
      if (res?.success && res.room) {
        setCurrentRoom(res.room);
        setSelectedTopic({
          id: res.room.id,
          title: res.room.topicTitle,
          category: res.room.category,
          difficulty: "CAMPUS LIVE",
          description: "Live interactive discussion hosted by " + res.room.hostName
        });
        setJoinModalOpen(false);
        setRoomCodeInput("");
      } else {
        alert(res?.error || "Room not found.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setJoiningRoom(false);
    }
  };

  // Simulate Peer Join for Instant Local Testing
  const handleSimulatePeerJoin = async (peerName, peerRole) => {
    if (!currentRoom) return;
    const res = await simulatePeerJoinAction({
      roomCode: currentRoom.code,
      peerName,
      peerRole
    });
    if (res?.success && res.room) {
      setCurrentRoom(res.room);
    }
  };

  // Copy Helpers
  const handleCopyCode = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInviteLink = () => {
    if (!currentRoom || typeof window === "undefined") return;
    const url = `${window.location.origin}/dashboard/student/gd-simulator?room=${currentRoom.code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const panelSeats = getPanelSeats();

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1C4980] mb-1">
            <Link href="/dashboard/student" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <span>•</span>
            <span className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">
              MULTI-AGENT & PEER GD ARENA
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="h-7 w-7 text-purple-600" />
            AI Group Discussion (GD) Multi-Agent & Peer Voice Arena
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Practice real campus placement GD rounds either solo against 4 autonomous AI candidates or <strong>create a room and invite your friends</strong>.
          </p>
        </div>

        {/* Top Actions: Create Room, Join Room, Voice Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create GD & Invite Friends</span>
          </button>

          <button
            onClick={() => setJoinModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Join Room Code</span>
          </button>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            title={audioEnabled ? "Mute AI Voices" : "Unmute AI Voices"}
          >
            {audioEnabled ? <Volume2 className="h-4 w-4 text-emerald-600" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
            <span className="hidden sm:inline">{audioEnabled ? "Voice ON" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* ACTIVE ROOM INVITE LOBBY (Shown if a room is created/joined and session is not active) */}
      {currentRoom && !sessionActive && !scorecard && (
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2.5 py-0.5 rounded-full uppercase">
                  {currentRoom.status === "WAITING" ? "Lobby Open" : "Active Room"}
                </span>
                <span className="text-xs font-mono text-purple-300">
                  {currentRoom.mode === "HYBRID" ? "Hybrid AI + Friends Mode" : "Peers Only Mode"}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mt-1 text-white">{currentRoom.topicTitle}</h2>
              <p className="text-xs text-purple-200 mt-0.5">
                Host: <strong>{currentRoom.hostName}</strong> • Target Round Duration: <strong>{currentRoom.durationMinutes} Minutes</strong>
              </p>
            </div>

            {/* Room Code Badge & Action */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
                <p className="text-[9px] uppercase font-bold text-purple-200">Room Code</p>
                <p className="text-xl font-mono font-black text-amber-300 tracking-wider">{currentRoom.code}</p>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/20"
              >
                {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
              </button>

              <button
                onClick={handleCopyInviteLink}
                className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-700" /> : <Share2 className="h-4 w-4" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Invite Link"}</span>
              </button>
            </div>
          </div>

          {/* Lobby Participants Roster (5 Max) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-purple-300" />
                <span>Panel Candidates Seated ({currentRoom.participants?.length || 1} / 5)</span>
              </h4>
              <span className="text-[11px] text-purple-300">
                {currentRoom.mode === "HYBRID" ? "Empty seats will be filled by AI debaters (Arjun, Priya, Rohan, Ananya)" : "Waiting for friends to join"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {panelSeats.map((seat, sIdx) => (
                <div key={sIdx} className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-3">
                  <span className="text-2xl">{seat.avatar}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-white truncate">{seat.name}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      seat.isUser ? "bg-amber-400/30 text-amber-300" : seat.isPeer ? "bg-emerald-400/30 text-emerald-300" : "bg-blue-400/30 text-blue-300"
                    }`}>
                      {seat.isUser ? "Host" : seat.isPeer ? "Peer Friend" : "AI Debater"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Local Testing: Simulate Peer Joining */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-purple-300">Test multi-student flow:</span>
              <button
                onClick={() => handleSimulatePeerJoin("Rohan V. (Batch '26)", "CAMPUS_PEER")}
                className="text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-xl transition-all cursor-pointer"
              >
                + Add Rohan
              </button>
              <button
                onClick={() => handleSimulatePeerJoin("Aditi S. (IT Dept)", "CAMPUS_PEER")}
                className="text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-xl transition-all cursor-pointer"
              >
                + Add Aditi
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentRoom(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
              >
                Leave Room
              </button>
              <button
                onClick={handleStartSession}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Play className="h-4 w-4 fill-slate-950" />
                <span>Launch GD Roundtable Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC SELECTION LOBBY (When no custom room is currently opened) */}
      {!currentRoom && !sessionActive && !scorecard && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#1C4980] bg-blue-50 px-2.5 py-0.5 rounded-md">
                  Practice Round Lobby
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Select GD Topic or Create a Custom Room</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Custom Topic & Invite</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {topics.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopic(t)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    selectedTopic?.id === t.id
                      ? "border-[#1C4980] bg-blue-50/40 shadow-md ring-2 ring-[#1C4980]"
                      : "border-slate-200/90 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#1C4980] bg-blue-100/60 px-2 py-0.5 rounded-md">
                        {t.category}
                      </span>
                      <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        {t.difficulty}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{t.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{t.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-semibold flex items-center justify-between">
                    <span>Panel: 5 Candidates</span>
                    <span className="text-[#1C4980]">Duration: 3 Mins</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Meet Your 4 Virtual AI Peers */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Your AI Panel Members</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DEFAULT_AGENTS.map((ag) => (
                  <div key={ag.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                    <span className="text-2xl">{ag.avatar}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-900 truncate">{ag.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{ag.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Want to discuss with college friends instead? Create Room ➔</span>
              </button>

              <button
                onClick={handleStartSession}
                className="px-8 py-3.5 rounded-2xl bg-[#1C4980] hover:bg-[#153862] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#1C4980]/20 cursor-pointer transition-all"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Start Practice GD Roundtable</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE GD SIMULATION VIEW */}
      {sessionActive && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* ROUNDTABLE VIRTUAL ROOM (Left Column) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            {/* Topic Bar & Timer */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-[#1C4980]">Live Group Discussion</span>
                  {currentRoom && (
                    <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Code: {currentRoom.code}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 truncate">{selectedTopic?.title}</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold text-sm flex-shrink-0">
                <Clock className="h-4 w-4 text-rose-500 animate-pulse" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
            </div>

            {/* ROUND TABLE GRAPHIC VISUALIZATION */}
            <div className="relative h-72 w-full bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden">
              {/* Virtual Center Table */}
              <div className="w-48 h-32 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-4 border-white shadow-inner flex flex-col items-center justify-center text-center p-3 z-10">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Panel Floor</span>
                <p className="text-xs font-black text-[#1C4980] mt-0.5">
                  {activeSpeaker === "YOU" ? "YOU ARE SPEAKING" : activeSpeaker ? `${panelSeats.find(a => a.id === activeSpeaker)?.name} Speaking` : "Listening / Floor Open"}
                </p>
                {activeSpeaker && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] text-emerald-700 font-bold">MIC ACTIVE</span>
                  </div>
                )}
              </div>

              {/* Dynamic 5 Seats Around Table */}
              {/* Seat 1 (Top-Left) */}
              <div className={`absolute top-4 left-8 text-center transition-all ${activeSpeaker === panelSeats[1]?.id ? "scale-110 ring-4 ring-indigo-500 rounded-2xl p-1 bg-indigo-50 shadow-md" : ""}`}>
                <span className="text-3xl">{panelSeats[1]?.avatar || "👨‍💻"}</span>
                <p className="text-[11px] font-bold text-slate-800">{panelSeats[1]?.name?.split(" ")[0]}</p>
                <span className="text-[8px] bg-slate-200 text-slate-600 px-1 rounded">{panelSeats[1]?.isPeer ? "Peer" : "AI"}</span>
              </div>

              {/* Seat 2 (Top-Right) */}
              <div className={`absolute top-4 right-8 text-center transition-all ${activeSpeaker === panelSeats[2]?.id ? "scale-110 ring-4 ring-emerald-500 rounded-2xl p-1 bg-emerald-50 shadow-md" : ""}`}>
                <span className="text-3xl">{panelSeats[2]?.avatar || "👩‍🔬"}</span>
                <p className="text-[11px] font-bold text-slate-800">{panelSeats[2]?.name?.split(" ")[0]}</p>
                <span className="text-[8px] bg-slate-200 text-slate-600 px-1 rounded">{panelSeats[2]?.isPeer ? "Peer" : "AI"}</span>
              </div>

              {/* Seat 3 (Bottom-Left) */}
              <div className={`absolute bottom-4 left-8 text-center transition-all ${activeSpeaker === panelSeats[3]?.id ? "scale-110 ring-4 ring-amber-500 rounded-2xl p-1 bg-amber-50 shadow-md" : ""}`}>
                <span className="text-3xl">{panelSeats[3]?.avatar || "👩‍💼"}</span>
                <p className="text-[11px] font-bold text-slate-800">{panelSeats[3]?.name?.split(" ")[0]}</p>
                <span className="text-[8px] bg-slate-200 text-slate-600 px-1 rounded">{panelSeats[3]?.isPeer ? "Peer" : "AI"}</span>
              </div>

              {/* Seat 4 (Bottom-Right) */}
              <div className={`absolute bottom-4 right-8 text-center transition-all ${activeSpeaker === panelSeats[4]?.id ? "scale-110 ring-4 ring-purple-500 rounded-2xl p-1 bg-purple-50 shadow-md" : ""}`}>
                <span className="text-3xl">{panelSeats[4]?.avatar || "🧑‍💼"}</span>
                <p className="text-[11px] font-bold text-slate-800">{panelSeats[4]?.name?.split(" ")[0]}</p>
                <span className="text-[8px] bg-slate-200 text-slate-600 px-1 rounded">{panelSeats[4]?.isPeer ? "Peer" : "AI"}</span>
              </div>

              {/* Seat 5: YOU (Center Bottom) */}
              <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-center transition-all ${activeSpeaker === "YOU" ? "scale-115 ring-4 ring-rose-500 rounded-2xl p-2 bg-rose-50 shadow-lg" : ""}`}>
                <span className="text-3xl">🎓</span>
                <p className="text-xs font-black text-slate-900">YOU</p>
                <span className="text-[9px] bg-[#1C4980] text-white px-2 py-0.5 rounded-full font-bold">Candidate</span>
              </div>
            </div>

            {/* Candidate Speaking Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleUserMic}
                  className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                    isUserSpeaking 
                      ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse" 
                      : "bg-[#1C4980] hover:bg-[#153862] text-white"
                  }`}
                >
                  {isUserSpeaking ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-amber-300" />}
                  <span>{isUserSpeaking ? "Finish My Turn (Release Floor)" : "🎙️ Click to Jump In & Speak (Take Floor)"}</span>
                </button>

                <button
                  onClick={handleEndSession}
                  className="ml-3 px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Square className="h-3.5 w-3.5 text-rose-500" />
                  <span>End GD</span>
                </button>
              </div>

              {/* Text Fallback Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userSpeechText}
                  onChange={(e) => setUserSpeechText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUserFinishedTurn()}
                  placeholder="Or type your point here and press Enter to speak..."
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none"
                />
                <button
                  onClick={handleUserFinishedTurn}
                  disabled={!userSpeechText.trim()}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-black text-white cursor-pointer disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* LIVE ROUND TABLE TRANSCRIPT (Right Column) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col h-[560px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#1C4980]" />
                Live Discussion Transcript
              </span>
              <span className="text-[10px] text-slate-400">{transcript.length} Turns Recorded</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 sidebar-scrollbar">
              {transcript.map((msg, idx) => {
                const isUser = msg.speakerId === "YOU";
                const isSystem = msg.speakerId === "SYSTEM";
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl text-xs space-y-1 ${
                      isSystem
                        ? "bg-amber-50/70 border border-amber-200 text-amber-900 text-center italic"
                        : isUser
                        ? "bg-blue-50/80 border border-blue-200 text-slate-900 ml-4"
                        : "bg-slate-50 border border-slate-200/80 text-slate-800 mr-4"
                    }`}
                  >
                    {!isSystem && (
                      <div className="flex items-center justify-between font-bold text-[10px]">
                        <span className={isUser ? "text-[#1C4980]" : "text-slate-600"}>{msg.speaker}</span>
                        <span className="text-slate-400 font-normal">{msg.time}</span>
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                );
              })}
              <div ref={transcriptBottomRef} />
            </div>
          </div>
        </div>
      )}

      {/* FINAL SCORECARD & EVALUATION VIEW */}
      {scorecard && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-sm animate-in fade-in">
          {/* Top Verdict Banner */}
          <div className={`p-6 rounded-3xl border text-center space-y-2 ${
            scorecard.totalScore >= 70 
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" 
              : "bg-amber-50/70 border-amber-200 text-amber-900"
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white shadow-xs">
              Campus Placement GD Verdict
            </span>
            <h2 className="text-2xl font-display font-extrabold">{scorecard.verdict}</h2>
            <p className="text-xs text-slate-600">
              Overall GD Performance Index: <strong className="text-slate-900">{scorecard.totalScore} / 100 Points</strong>
            </p>
          </div>

          {/* 4 Multi-Dimensional Criteria Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-400">Initiative & Entry</p>
              <p className="text-xl font-black text-[#1C4980]">{scorecard.initiativeScore} / 25</p>
              <p className="text-[11px] text-slate-500">Timing of first entry & floor control.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-400">Content & Logic</p>
              <p className="text-xl font-black text-indigo-600">{scorecard.contentScore} / 25</p>
              <p className="text-[11px] text-slate-500">Quality and depth of arguments presented.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-400">Airtime Balance</p>
              <p className="text-xl font-black text-purple-600">{scorecard.airtimeScore} / 25</p>
              <p className="text-[11px] text-slate-500">{scorecard.speakingRatio}% airtime in panel.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-400">Etiquette & Listening</p>
              <p className="text-xl font-black text-emerald-600">{scorecard.etiquetteScore} / 25</p>
              <p className="text-[11px] text-slate-500">Polite transitions and peer acknowledgement.</p>
            </div>
          </div>

          {/* Strengths & Remedial Recommendations */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Key Demonstrated Strengths
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 leading-relaxed">
                {scorecard.strengths?.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Actionable Remedial Suggestions
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 leading-relaxed">
                {scorecard.areasOfImprovement?.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Retake Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => { setScorecard(null); setSessionActive(false); }}
              className="px-6 py-2.5 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Practice Another GD Round</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE GD ROOM & GENERATE INVITE CODE */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <UserPlus className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Create GD Room & Invite Friends</h3>
              </div>
              <button 
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  GD Topic / Problem Statement
                </label>
                <input
                  type="text"
                  value={customTopicTitle}
                  onChange={(e) => setCustomTopicTitle(e.target.value)}
                  placeholder="e.g. Electric Vehicles vs Hydrogen Fuel in India, Moonlighting in IT..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none"
                  >
                    <option value="Technology & Placement">Technology & Placement</option>
                    <option value="Corporate Ethics">Corporate Ethics</option>
                    <option value="Macroeconomics & FinTech">Macroeconomics & FinTech</option>
                    <option value="Social & Policy Debates">Social & Policy Debates</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Round Duration
                  </label>
                  <select
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none"
                  >
                    <option value="3">3 Minutes (Speed Sprint)</option>
                    <option value="5">5 Minutes (Standard Campus GD)</option>
                    <option value="10">10 Minutes (Full Round)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Panel Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomMode("HYBRID")}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      customMode === "HYBRID" 
                        ? "border-purple-600 bg-purple-50 text-purple-900 font-bold" 
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-xs">Hybrid (Friends + AI)</p>
                    <p className="text-[10px] font-normal text-slate-500 mt-0.5">Remaining seats filled by AI agents</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomMode("PEERS_ONLY")}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      customMode === "PEERS_ONLY" 
                        ? "border-purple-600 bg-purple-50 text-purple-900 font-bold" 
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-xs">Campus Peers Only</p>
                    <p className="text-[10px] font-normal text-slate-500 mt-0.5">Live only with invited friends</p>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={creatingRoom}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {creatingRoom ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-300" />}
                <span>Generate Room Code & Open Lobby</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: JOIN ROOM WITH CODE */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-100 text-[#1C4980] flex items-center justify-center font-bold">
                  <LogIn className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Join a Friend's GD Room</h3>
              </div>
              <button 
                onClick={() => setJoinModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Room Invite Code
                </label>
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. VIT-GD-8492"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1C4980]/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Your Display Name
                </label>
                <input
                  type="text"
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  placeholder="e.g. Yashraj Kharat (Batch '26)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setJoinModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinRoom}
                disabled={joiningRoom || !roomCodeInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#1C4980] hover:bg-[#153862] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {joiningRoom ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                <span>Enter Room Lobby</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GdSimulatorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading GD Arena...</div>}>
      <GdSimulatorContent />
    </Suspense>
  );
}

