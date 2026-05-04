"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Code2, Zap, Trophy, ChevronRight, Loader2,
  Target, Cpu, Flame, Terminal, Hexagon, Star,
  Shield, Swords, Clock, Hash
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { sendPrompt } from "@/utils/GeminiAIModel";
import { v4 as uuidv4 } from "uuid";

const PLATFORMS = ["All", "LeetCode", "Codeforces", "CodeChef"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const LANGUAGES = ["All", "C++", "Java", "Python", "SQL"];
const TAGS = ["Arrays", "Strings", "DP", "Graphs", "Trees", "Sorting", "Greedy", "Math"];

const difficultyConfig = {
  Easy:   {
    color: "text-emerald-300",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    glow: "shadow-emerald-500/20",
    bar: "from-emerald-500 to-teal-400",
    icon: Shield,
    label: "EASY",
  },
  Medium: {
    color: "text-amber-300",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    glow: "shadow-amber-500/20",
    bar: "from-amber-500 to-orange-400",
    icon: Swords,
    label: "MEDIUM",
  },
  Hard:   {
    color: "text-rose-300",
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
    glow: "shadow-rose-500/20",
    bar: "from-rose-500 to-pink-400",
    icon: Flame,
    label: "HARD",
  },
};

const platformColors = {
  LeetCode:   { color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
  Codeforces: { color: "text-blue-400",   border: "border-blue-500/30",   bg: "bg-blue-500/10"   },
  CodeChef:   { color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
};

/* ─── Cursor Glow ─────────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 100, damping: 20 });
  const sy = useSpring(y, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `radial-gradient(600px circle at ${sx}px ${sy}px, rgba(99,102,241,0.07), transparent 60%)`,
      }}
    />
  );
}

/* ─── Scanline Overlay ────────────────────────────────────────── */
function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 3px)",
      }}
    />
  );
}

/* ─── Animated Counter ────────────────────────────────────────── */
function Counter({ from = 0, to, duration = 1.2 }) {
  const [val, setVal] = useState(from);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      setVal(Math.floor(from + (to - from) * progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);
  return <span>{val}</span>;
}

/* ─── Stat Card ───────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, animated }) {
  return (
    <div className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border ${color.border} ${color.bg} backdrop-blur-sm`}>
      <Icon size={20} className={color.color} />
      <span className={`text-2xl font-black font-mono ${color.color}`}>
        {animated ? <Counter to={value} /> : value}
      </span>
      <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">{label}</span>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function PracticePage() {
  const [platform,   setPlatform]   = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [language,   setLanguage]   = useState("All");
  const [tag,        setTag]        = useState(null);
  const [questions,  setQuestions]  = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [generated,  setGenerated]  = useState(false);
  const [error,      setError]      = useState(null);
  const [glitch,     setGlitch]     = useState(false);

  const triggerGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 600);
  };

  const generateQuestions = async () => {
    triggerGlitch();
    setLoading(true);
    setError(null);
    try {
      const eff = {
        platform:   platform   === "All" ? "LeetCode, Codeforces, and CodeChef" : platform,
        difficulty: difficulty === "All" ? "mixed Easy, Medium, and Hard"       : difficulty,
        language:   language   === "All" ? "C++, Java, Python, or SQL"          : language,
      };
      const tagHint = tag ? ` focused on ${tag}` : "";
      const prompt = `Generate 6 distinct coding practice problems${tagHint} in the style of ${eff.platform}. 
Difficulty: ${eff.difficulty}. Language hint: ${eff.language}.
Return ONLY a JSON object: { "questions": [ { "id": "uuid", "title": "string", "platform": "LeetCode|Codeforces|CodeChef", "difficulty": "Easy|Medium|Hard", "language": "${eff.language}", "tags": ["tag1","tag2"], "description": "2-3 sentence problem statement", "examples": [{"input":"...","output":"..."}], "constraints": ["..."], "starterCode": { "C++": "...", "Java": "...", "Python": "...", "SQL": "..." }, "solution": { "C++": "...", "Java": "...", "Python": "...", "SQL": "..." }, "testCases": [{"input":"...","expectedOutput":"..."}] } ] }`;

      const raw    = await sendPrompt(prompt);
      const clean  = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQuestions(parsed.questions.map(q => ({ ...q, id: q.id || uuidv4() })));
      setGenerated(true);
    } catch {
      setError("SYSTEM_ERR: Neural link unstable. Retry transmission.");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    easy:   questions.filter(q => q.difficulty === "Easy").length,
    medium: questions.filter(q => q.difficulty === "Medium").length,
    hard:   questions.filter(q => q.difficulty === "Hard").length,
  };

  return (
    <div className="relative min-h-screen bg-[#04040a] text-slate-200 overflow-x-hidden selection:bg-indigo-500/30">
      <CursorGlow />
      <Scanlines />

      {/* Deep background grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-500/8 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-purple-500/8 blur-[140px] rounded-full" />
        <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] bg-violet-500/8 blur-[140px] rounded-full" />
      </div>

      {/* ── HERO HEADER ── */}
      <header className="relative z-10 pt-16 pb-10 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">

          {/* Top label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Neural Link Active
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Terminal size={10} />
              v2.4.1
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            {/* Title block */}
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-3 ${glitch ? "animate-pulse" : ""}`}
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                <span className="text-white">PRACTICE</span>
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa, #ec4899)" }}
                >
                  ARENA
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-slate-500 text-sm font-mono tracking-widest max-w-md"
              >
                AI-GENERATED CODING CHALLENGES · MULTI-PLATFORM · ADAPTIVE DIFFICULTY
              </motion.p>
            </div>

            {/* Right: stats + CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Stats row */}
              {generated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid grid-cols-3 gap-3"
                >
                  <StatCard icon={Shield} label="Easy"   value={stats.easy}   color={difficultyConfig.Easy}   animated />
                  <StatCard icon={Swords} label="Medium" value={stats.medium} color={difficultyConfig.Medium} animated />
                  <StatCard icon={Flame}  label="Hard"   value={stats.hard}   color={difficultyConfig.Hard}   animated />
                </motion.div>
              )}

              {/* Generate button */}
              <motion.button
                onClick={generateQuestions}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative group overflow-hidden px-6 py-3 rounded-2xl font-black uppercase italic tracking-widest text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
                  boxShadow: "0 0 40px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                {/* shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)" }}
                />
                <span className="relative flex items-center gap-3 text-base">
                  {loading
                    ? <><Loader2 size={22} className="animate-spin" /> INITIALIZING...</>
                    : <><Zap size={22} className="fill-current" /> GENERATE CHALLENGES</>
                  }
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">

        {/* ── FILTER PANEL ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-3xl border border-white/8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(99,102,241,0.04) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Top accent bar */}
          <div className="h-[2px] w-full" style={{ backgroundImage: "linear-gradient(90deg, #4f46e5, #7c3aed, #db2777)" }} />

          <div className="p-8 grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-10">
            <div className="space-y-7">
              <FilterRow
                label="PLATFORM"
                options={PLATFORMS}
                value={platform}
                onChange={setPlatform}
              />
              <FilterRow
                label="TIER"
                options={DIFFICULTIES}
                value={difficulty}
                onChange={setDifficulty}
                colorFn={o => o === "Easy" ? "text-emerald-400" : o === "Medium" ? "text-amber-400" : o === "Hard" ? "text-rose-400" : ""}
              />
              <FilterRow
                label="LANG"
                options={LANGUAGES}
                value={language}
                onChange={setLanguage}
              />

              {/* Tags */}
              <div className="flex flex-wrap items-start gap-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1 w-20 shrink-0">FOCUS</span>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(t => (
                    <motion.button
                      key={t}
                      onClick={() => setTag(tag === t ? null : t)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all duration-200 ${
                        tag === t
                          ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/30"
                          : "bg-white/3 border-white/8 text-slate-500 hover:border-indigo-500/40 hover:text-indigo-300"
                      }`}
                    >
                      <Hash size={9} />
                      {t}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Side decoration */}
            <div className="hidden xl:flex flex-col items-center justify-center gap-4 pl-10 border-l border-white/5">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-spin" style={{ animationDuration: "8s" }} />
                <div className="absolute inset-3 rounded-full border border-purple-500/20 animate-spin" style={{ animationDuration: "5s", animationDirection: "reverse" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target size={28} className="text-indigo-400" />
                </div>
              </div>
              <p className="text-[9px] text-slate-600 uppercase tracking-widest text-center max-w-[100px] leading-relaxed">
                Configure<br />parameters<br />& deploy
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── ERROR ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-sm"
            >
              <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── QUESTION GRID ── */}
        <AnimatePresence mode="wait">
          {!generated && !loading ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-40 flex flex-col items-center gap-5 opacity-30"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl border border-white/10 flex items-center justify-center">
                  <Code2 size={40} strokeWidth={1} />
                </div>
                <div className="absolute -inset-3 rounded-[30px] border border-dashed border-white/5" />
              </div>
              <div className="text-center">
                <p className="font-mono text-xs uppercase tracking-[0.3em] mb-1">Awaiting Transmission</p>
                <p className="text-[11px] text-slate-600">Hit generate to spawn challenges</p>
              </div>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} delay={i * 0.08} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {questions.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ─── Filter Row ──────────────────────────────────────────────── */
function FilterRow({ label, options, value, onChange, colorFn }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 w-20 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <motion.button
            key={o}
            onClick={() => onChange(o)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-1.5 rounded-xl text-[11px] font-bold border transition-all duration-200 ${
              value === o
                ? "bg-white text-black border-white shadow-lg shadow-white/10"
                : `bg-transparent border-white/8 hover:border-white/25 ${colorFn ? colorFn(o) || "text-slate-400" : "text-slate-400"} hover:text-white`
            }`}
          >
            {o}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─── Skeleton Card ───────────────────────────────────────────── */
function SkeletonCard({ delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 h-64 space-y-4 overflow-hidden relative"
    >
      <div className="h-4 w-20 bg-white/5 rounded-md animate-pulse" />
      <div className="h-5 w-3/4 bg-white/5 rounded-md animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-white/5 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-5 w-16 bg-white/5 rounded-full animate-pulse" />
        <div className="h-5 w-12 bg-white/5 rounded-full animate-pulse" />
      </div>
      {/* sweep */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)", animationDelay: `${delay}s` }}
      />
    </motion.div>
  );
}

/* ─── Question Card ───────────────────────────────────────────── */
function QuestionCard({ question, index }) {
  const diff     = difficultyConfig[question.difficulty] || difficultyConfig.Medium;
  const platform = platformColors[question.platform]     || platformColors.LeetCode;
  const DiffIcon = diff.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 120, damping: 14 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group"
    >
      <Link href={`/dashboard/practice/${question.id}?data=${encodeURIComponent(JSON.stringify(question))}`}>
        <div
          className={`relative bg-[#0a0a12] border rounded-2xl p-6 h-full transition-all duration-300 overflow-hidden cursor-pointer ${
            hovered ? `border-indigo-500/40 shadow-2xl shadow-indigo-500/10` : "border-white/6"
          }`}
        >
          {/* Card glow on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(600px circle at 50% 0%, rgba(99,102,241,0.08), transparent 70%)" }}
              />
            )}
          </AnimatePresence>

          {/* Difficulty accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${diff.bar} opacity-60 group-hover:opacity-100 transition-opacity`} />

          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${platform.bg} ${platform.border} ${platform.color}`}>
              {question.platform}
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${diff.bg} ${diff.border} ${diff.color}`}>
              <DiffIcon size={9} />
              {diff.label}
            </div>
          </div>

          {/* Index number — editorial flair */}
          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 text-[80px] font-black italic leading-none pointer-events-none select-none"
            style={{ color: "rgba(255,255,255,0.015)", fontFamily: "'Courier New', monospace" }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Title */}
          <h3 className="relative text-base font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            {question.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-3 mb-5 leading-relaxed font-sans">
            {question.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {question.tags?.slice(0, 3).map(t => (
              <span key={t} className="flex items-center gap-1 text-[9px] px-2 py-1 rounded bg-indigo-500/5 text-indigo-400 border border-indigo-500/15 font-bold uppercase">
                <Hash size={7} />
                {t}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              <Terminal size={10} />
              {question.language}
            </div>
            <motion.div
              animate={{ x: hovered ? 3 : 0 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                hovered ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-500"
              }`}
            >
              <ChevronRight size={14} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}