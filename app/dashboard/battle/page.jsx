"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import dynamic from "next/dynamic";
import {
  Play,
  Bot,
  Loader2,
  RefreshCcw,
  Swords,
  Terminal,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Trophy,
  Cpu,
  User,
  ChevronRight,
  Circle,
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

/* ─── Cursor Glow ─────────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 100, damping: 20 });
  const sy = useSpring(y, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `radial-gradient(600px circle at ${sx}px ${sy}px, rgba(239,68,68,0.05), transparent 60%)`,
      }}
    />
  );
}

/* ─── Scanlines ───────────────────────────────────────────────── */
function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 3px)",
      }}
    />
  );
}

/* ─── Questions ───────────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    difficultyColor: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    description:
      "Given an array of integers and a target, return indices of the two numbers that add up to the target.",
    constraints: ["2 ≤ nums.length ≤ 10⁴", "Only one valid answer exists"],
    solution: `int twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> mp;
    for(int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if(mp.count(diff))
            return {mp[diff], i};
        mp[nums[i]] = i;
    }
    return {};
}`,
  },
  {
    id: 2,
    title: "Palindrome Check",
    difficulty: "Easy",
    difficultyColor: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    description:
      "Check if a string is a palindrome, considering only alphanumeric characters and ignoring cases.",
    constraints: [
      "1 ≤ s.length ≤ 2×10⁵",
      "s consists of printable ASCII chars",
    ],
    solution: `bool isPalindrome(string s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        if (s[l] != s[r]) return false;
        l++;
        r--;
    }
    return true;
}`,
  },
  {
    id: 3,
    title: "Max Subarray",
    difficulty: "Medium",
    difficultyColor: {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    description:
      "Given an integer array, find the subarray which has the largest sum and return its sum.",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    solution: `int maxSubArray(vector<int>& nums) {
    int sum = nums[0], maxSum = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        sum = max(nums[i], sum + nums[i]);
        maxSum = max(maxSum, sum);
    }
    return maxSum;
}`,
  },
  {
    id: 4,
    title: "Valid Parentheses",
    difficulty: "Medium",
    difficultyColor: {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    description:
      "Given a string containing just brackets, determine if the input string is valid.",
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of '()[]{}'"],
    solution: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{')
            st.push(c);
        else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{'))
                return false;
        }
    }
    return st.empty();
}`,
  },
];

/* ─── Typewriter line ─────────────────────────────────────────── */
function TypewriterText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else clearInterval(interval);
      }, 18);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return <span>{displayed}</span>;
}

/* ─── Blinking cursor ─────────────────────────────────────────── */
function BlinkCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="text-rose-400"
    >
      _
    </motion.span>
  );
}

/* ─── VS Divider ──────────────────────────────────────────────── */
function VsDivider({ battling }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-2">
      <div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <motion.div
        animate={battling ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="relative"
      >
        <div className="w-10 h-10 rounded-full border border-rose-500/40 bg-rose-500/10 flex items-center justify-center">
          <Swords size={16} className="text-rose-400" />
        </div>
        {battling && (
          <motion.div
            className="absolute inset-0 rounded-full border border-rose-500/30"
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        )}
      </motion.div>
      <div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>
  );
}

/* ─── Result Banner ───────────────────────────────────────────── */
function ResultBanner({ result }) {
  const configs = {
    win: {
      label: "VICTORY",
      sub: "You crushed the AI",
      icon: Trophy,
      color: "text-amber-300",
      border: "border-amber-500/30",
      bg: "bg-amber-500/8",
      dot: "#fcd34d",
    },
    lose: {
      label: "DEFEATED",
      sub: "AI outpaced you this time",
      icon: Cpu,
      color: "text-rose-300",
      border: "border-rose-500/30",
      bg: "bg-rose-500/8",
      dot: "#fda4af",
    },
    draw: {
      label: "DRAW",
      sub: "An even battle",
      icon: Swords,
      color: "text-indigo-300",
      border: "border-indigo-500/30",
      bg: "bg-indigo-500/8",
      dot: "#818cf8",
    },
  };
  const c = configs[result];
  if (!c) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`relative overflow-hidden mt-6 p-6 rounded-2xl border ${c.border} ${c.bg}`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent, ${c.dot}, transparent)`,
        }}
      />
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-white/5 border border-white/8`}>
          <c.icon size={24} className={c.color} />
        </div>
        <div>
          <p className={`text-2xl font-black italic ${c.color}`}>{c.label}</p>
          <p className="text-white text-xs  mt-0.5">{c.sub}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Stats Row ───────────────────────────────────────────────── */
function StatPill({ icon: Icon, label, value, accent = "text-indigo-400" }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/4 border border-white/6">
      <Icon size={11} className={accent} />
      <span className="text-[10px] text-white uppercase font-bold tracking-widest">
        {label}
      </span>
      <span className={`text-[11px] font-black  ${accent}`}>{value}</span>
    </div>
  );
}

/* ─── Editor Panel ────────────────────────────────────────────── */
function EditorPanel({
  label,
  icon: Icon,
  color,
  code,
  onChange,
  readOnly = false,
  isTyping = false,
}) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-[#0a0a12]">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 bg-[#07070f]">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg bg-white/5 border border-white/8`}>
            <Icon size={12} className={color} />
          </div>
          <span
            className={`text-xs font-black uppercase tracking-widest ${color}`}
          >
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isTyping && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20"
            >
              <Zap size={8} className="text-rose-400" />
              <span className="text-[9px] text-rose-400 font-bold uppercase">
                Typing
              </span>
            </motion.div>
          )}
          <div className="flex gap-1">
            {["bg-rose-500/60", "bg-amber-500/60", "bg-emerald-500/60"].map(
              (c, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${c}`} />
              ),
            )}
          </div>
        </div>
      </div>
      {/* Monaco */}
      <div className="h-[380px]">
        <MonacoEditor
          height="100%"
          language="cpp"
          theme="vs-dark"
          value={code}
          onChange={onChange}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'Courier New', Courier, monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: readOnly ? "none" : "line",
            cursorBlinking: "smooth",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function BattlePage() {
  const [question, setQuestion] = useState(QUESTIONS[0]);
  const [code, setCode] = useState("// Write your C++ solution here...\n\n");
  const [aiCode, setAiCode] = useState("");
  const [battling, setBattling] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [result, setResult] = useState(null); // "win" | "lose" | "draw"
  const [elapsed, setElapsed] = useState(0);
  const [round, setRound] = useState(1);

  /* Timer */
  useEffect(() => {
    if (!battling) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [battling]);

  const getRandomQuestion = () => {
    const pool = QUESTIONS.filter((q) => q.id !== question.id);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setQuestion(next);
    setCode("// Write your C++ solution here...\n\n");
    setAiCode("");
    setResult(null);
    setElapsed(0);
  };

  const simulateAI = async (solution) => {
    setAiTyping(true);
    setAiCode("");
    for (let i = 0; i < solution.length; i++) {
      const char = solution[i];
      const delay = char === "\n" ? 400 : Math.random() * 150 + 60;
      await new Promise((r) => setTimeout(r, delay));
      setAiCode((prev) => prev + char);
      if (Math.random() < 0.08) await new Promise((r) => setTimeout(r, 600));
    }
    setAiTyping(false);
  };

  const runBattle = async () => {
    if (battling) return;
    setBattling(true);
    setResult(null);
    setElapsed(0);
    setAiCode("");

    simulateAI(question.solution);

    const aiFinishMs = question.solution.length * 45 + 1500;
    await new Promise((r) => setTimeout(r, aiFinishMs));

    const userHasContent = code.trim().length > 40 && code.includes("return");
    const aiAlwaysFinishes = true;

    let outcome;
    if (userHasContent && aiAlwaysFinishes) outcome = "draw";
    else if (userHasContent) outcome = "win";
    else outcome = "lose";

    setResult(outcome);
    setBattling(false);
    setRound((r) => r + 1);
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="relative min-h-screen bg-[#04040a] text-white overflow-x-hidden selection:bg-rose-500/20">
      <CursorGlow />
      <Scanlines />

      {/* Grid bg */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239,68,68,0.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.7) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-rose-500/6 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-indigo-500/6 blur-[140px] rounded-full" />
        <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] bg-violet-500/6 blur-[140px] rounded-full" />
      </div>

      {/* ── HERO HEADER ── */}
      <header className="relative z-10 pt-16 pb-10 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
              Arena Live
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
              <Terminal size={10} />
              Round {round}
            </div>
            {battling && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 uppercase tracking-widest"
              >
                <Clock size={10} />
                {formatTime(elapsed)}
              </motion.div>
            )}
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl font-black uppercase  italic tracking-tighter leading-none mb-3"
              >
                <span className="text-white">BATTLE</span>
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f43f5e, #a855f7, #6366f1)",
                  }}
                >
                  ROYALE
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-white text-sm  tracking-widest max-w-md"
              >
                CODE FAST · THINK FASTER · BEAT THE MACHINE
              </motion.p>
            </div>

            {/* Stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              <StatPill
                icon={User}
                label="You"
                value="Human"
                accent="text-sky-400"
              />
              <StatPill
                icon={Cpu}
                label="Opponent"
                value="AI"
                accent="text-rose-400"
              />
              <StatPill
                icon={Swords}
                label="Mode"
                value="1v1"
                accent="text-amber-400"
              />
            </motion.div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
        {/* ── QUESTION CARD ── */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[#0a0a12] border border-white/6 rounded-2xl overflow-hidden"
        >
          {/* Top bar */}
          <div
            className="h-[2px] w-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent, #f43f5e, #a855f7, transparent)",
            }}
          />
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    Problem #{question.id}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${question.difficultyColor.text} ${question.difficultyColor.bg} ${question.difficultyColor.border}`}
                  >
                    {question.difficulty}
                  </span>
                </div>
                <h2 className="text-white text-2xl md:text-3xl font-black mb-3">
                  {question.title}
                </h2>
                <p className="text-white text-sm leading-relaxed font-sans max-w-2xl">
                  {question.description}
                </p>
              </div>

              {/* Constraints */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6 shrink-0 min-w-[180px]">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white font-bold mb-3">
                  Constraints
                </p>
                <ul className="space-y-2">
                  {question.constraints.map((c, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[11px]  text-white"
                    >
                      <ChevronRight
                        size={10}
                        className="text-rose-500 mt-0.5 shrink-0"
                      />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── EDITORS ── */}
        <div className="grid md:grid-cols-[1fr_44px_1fr] gap-0 items-stretch">
          {/* User editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <EditorPanel
              label="Your Code"
              icon={User}
              color="text-sky-400"
              code={code}
              onChange={(v) => setCode(v || "")}
            />
          </motion.div>

          {/* VS divider */}
          <div className="flex items-center justify-center">
            <VsDivider battling={battling} />
          </div>

          {/* AI editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EditorPanel
              label="AI Opponent"
              icon={Cpu}
              color="text-rose-400"
              code={
                aiCode ||
                (battling
                  ? ""
                  : "// AI is waiting for the battle to start...\n")
              }
              readOnly
              isTyping={aiTyping}
            />
          </motion.div>
        </div>

        {/* ── ACTION ROW ── */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Start Battle */}
          <motion.button
            onClick={runBattle}
            disabled={battling}
            whileHover={battling ? {} : { scale: 1.02 }}
            whileTap={battling ? {} : { scale: 0.97 }}
            className="relative group flex items-center gap-3 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Courier New', monospace",
              background: battling
                ? "rgba(239,68,68,0.1)"
                : "linear-gradient(135deg, #f43f5e, #a855f7)",
              border: battling ? "1px solid rgba(239,68,68,0.2)" : "none",
            }}
          >
            {!battling && (
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(135deg, #e11d48, #9333ea)",
                }}
                transition={{ duration: 0.2 }}
              />
            )}
            <span className="relative flex items-center gap-2.5">
              {battling ? (
                <>
                  <Loader2 size={15} className="animate-spin text-rose-400" />
                  <span className="text-rose-300">Battle in Progress...</span>
                </>
              ) : (
                <>
                  <Swords size={15} />
                  Start Battle
                </>
              )}
            </span>
          </motion.button>

          {/* New Question */}
          <motion.button
            onClick={getRandomQuestion}
            disabled={battling}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-white/4 border border-white/8 text-white hover:text-white hover:border-white/16 transition-colors text-xs font-bold uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCcw size={13} />
            New Question
          </motion.button>

          {/* Live indicator */}
          {battling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/8 border border-amber-500/20"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-2 bg-amber-400 rounded-full"
              />
              <span className="text-[11px] text-amber-400  font-bold uppercase tracking-widest">
                {formatTime(elapsed)}
              </span>
            </motion.div>
          )}
        </div>

        {/* ── RESULT ── */}
        <AnimatePresence>
          {result && <ResultBanner result={result} />}
        </AnimatePresence>

        {/* ── TIPS FOOTER ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-3 gap-4 mt-4"
        >
          {[
            {
              icon: Zap,
              label: "Speed matters",
              tip: "AI types at ~45ms/char. Race to finish first.",
            },
            {
              icon: Trophy,
              label: "Win condition",
              tip: "Submit a working solution before AI completes.",
            },
            {
              icon: Bot,
              label: "AI behavior",
              tip: "AI occasionally pauses to 'think'. Use it.",
            },
          ].map(({ icon: Icon, label, tip }) => (
            <div
              key={label}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3"
            >
              <Icon size={14} className="text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">
                  {label}
                </p>
                <p className="text-[11px] text-white font-sans leading-relaxed">
                  {tip}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
