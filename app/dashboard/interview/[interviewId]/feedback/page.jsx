"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  ChevronDown,
  Home,
  Star,
  MessageSquare,
  CheckCircle,
  Lightbulb,
  Terminal,
  Award,
} from "lucide-react";
import Link from "next/link";

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

/* ─── Score Ring ──────────────────────────────────────────────── */
function ScoreRing({ score, max = 10 }) {
  const [animated, setAnimated] = useState(false);
  const circumference = 2 * Math.PI * 36; // r=36
  const pct = Math.min(parseFloat(score) / max, 1);
  const offset = animated ? circumference - circumference * pct : circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  const getColor = (s) => {
    if (s >= 8) return { label: "Strong", cls: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" };
    if (s >= 6) return { label: "Average", cls: "bg-amber-500/10 border-amber-500/25 text-amber-400" };
    return { label: "Needs Work", cls: "bg-rose-500/10 border-rose-500/25 text-rose-400" };
  };

  const meta = getColor(parseFloat(score));

  return (
    <div className="flex items-center gap-5">
      {/* Ring */}
      <div className="relative w-24 h-24 shrink-0">
        <svg className="-rotate-90" width="96" height="96" viewBox="0 0 96 96">
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle cx="48" cy="48" r="36" fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="7" />
          <circle
            cx="48" cy="48" r="36" fill="none"
            stroke="url(#ring-grad)" strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-2xl font-black leading-none">{score}</span>
          <span className="text-indigo-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">/10</span>
        </div>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1">Overall Rating</h3>
        <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
          {parseFloat(score) >= 8
            ? "Excellent performance — strong technical depth across all areas."
            : parseFloat(score) >= 6
            ? "Good effort — solid fundamentals with room to sharpen."
            : "Keep practising — focus on the feedback below to improve."}
        </p>
        <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${meta.cls}`}>
          <Award size={10} />
          {meta.label}
        </div>
      </div>
    </div>
  );
}

/* ─── Rating helpers ──────────────────────────────────────────── */
function getRatingStyle(rating) {
  const n = parseFloat(rating);
  if (n >= 8) return { pill: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400", bar: "bg-emerald-500" };
  if (n >= 6) return { pill: "bg-amber-500/10 border-amber-500/25 text-amber-400", bar: "bg-amber-500" };
  return { pill: "bg-rose-500/10 border-rose-500/25 text-rose-400", bar: "bg-rose-400" };
}

/* ─── Collapsible Q&A Card ────────────────────────────────────── */
function QACard({ item, index }) {
  const [open, setOpen] = useState(false);
  const rs = getRatingStyle(item.rating);
  const pct = Math.round((parseFloat(item.rating) / 10) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.08, type: "spring", stiffness: 120, damping: 16 }}
      className="bg-[#0a0a12] border border-white/6 rounded-2xl overflow-hidden hover:border-indigo-500/20 transition-colors duration-300"
    >
      {/* Top accent bar */}
      <div
        className="h-[2px] w-full"
        style={{ backgroundImage: "linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)" }}
      />

      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-3 p-5 text-left hover:bg-indigo-500/[0.03] transition-colors cursor-pointer"
      >
        {/* Number badge */}
        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-[10px] font-black text-indigo-400 shrink-0 mt-0.5">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Question */}
        <p className="flex-1 text-white/90 text-sm font-semibold leading-relaxed">{item.question}</p>

        {/* Rating pill */}
        <div className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-black ${rs.pill}`}>
          <Star size={8} />
          {item.rating}/10
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors ${open ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-500"}`}
        >
          <ChevronDown size={13} />
        </motion.div>
      </button>

      {/* Rating bar */}
      <div className="h-[3px] mx-5 mb-1 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${rs.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.3 + index * 0.08, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 pt-3">
              {/* Your Answer */}
              <div className="rounded-xl p-4 bg-rose-500/[0.06] border border-rose-500/15">
                <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-rose-400 mb-2">
                  <MessageSquare size={9} /> Your Answer
                </p>
                <p className="text-rose-200/80 text-xs leading-relaxed">{item.userAns}</p>
              </div>

              {/* Correct Answer */}
              <div className="rounded-xl p-4 bg-emerald-500/[0.06] border border-emerald-500/15">
                <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-400 mb-2">
                  <CheckCircle size={9} /> Ideal Answer
                </p>
                <p className="text-emerald-200/80 text-xs leading-relaxed">{item.correctAns}</p>
              </div>

              {/* Feedback */}
              <div className="rounded-xl p-4 bg-indigo-500/[0.06] border border-indigo-500/15">
                <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-indigo-400 mb-2">
                  <Lightbulb size={9} /> Feedback
                </p>
                <p className="text-indigo-200/80 text-xs leading-relaxed">{item.feedback}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
const Feedback = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);
    setFeedbackList(result);
  };

  const averageRating =
    feedbackList.length
      ? (
          feedbackList.reduce((sum, item) => sum + parseFloat(item.rating || 0), 0) /
          feedbackList.length
        ).toFixed(1)
      : "0";

  return (
    <div className="relative min-h-screen bg-[#04040a] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <CursorGlow />
      <Scanlines />

      {/* Grid background */}
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
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-violet-500/8 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-500/8 blur-[140px] rounded-full" />
        <div className="absolute -bottom-20 right-1/3 w-[400px] h-[400px] bg-purple-500/8 blur-[140px] rounded-full" />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-10 pt-16 pb-10 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Interview Complete
            </div>
            {feedbackList.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                <Terminal size={10} />
                {feedbackList.length} Questions
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-3"
          >
            <span className="text-white">YOUR</span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa, #ec4899)" }}
            >
              FEEDBACK
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-white/40 text-sm tracking-widest max-w-md"
          >
            PERFORMANCE REPORT · QUESTION BREAKDOWN · IMPROVEMENT TIPS
          </motion.p>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-10 space-y-8">

        {feedbackList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 flex flex-col items-center gap-5 opacity-30"
          >
            <div className="w-20 h-20 rounded-3xl border border-white/10 flex items-center justify-center">
              <MessageSquare size={36} strokeWidth={1} />
            </div>
            <p className="text-xs uppercase tracking-[0.3em]">No Feedback Record Found</p>
          </motion.div>
        ) : (
          <>
            {/* Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative bg-[#0a0a12] border border-white/6 rounded-2xl p-6 overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundImage: "linear-gradient(90deg, #4f46e5, #7c3aed, #db2777)" }}
              />
              <ScoreRing score={averageRating} />
            </motion.div>

            {/* Section label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 pt-2"
            >
              Question Breakdown
            </motion.p>

            {/* Q&A Cards */}
            <div className="space-y-4">
              {feedbackList.map((item, index) => (
                <QACard key={item.id} item={item} index={index} />
              ))}
            </div>

            {/* Home Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + feedbackList.length * 0.08 }}
            >
              <Link href="/dashboard">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-indigo-400 text-xs font-black uppercase tracking-widest hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer">
                  <Home size={13} />
                  Go Home
                </button>
              </Link>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};

export default Feedback;