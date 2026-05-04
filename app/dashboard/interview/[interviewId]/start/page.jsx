"use client";

import { db } from "@/utils/db";
import { mockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useState, useEffect } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Terminal,
  Zap,
  Loader2,
  AlertTriangle,
} from "lucide-react";

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

/* ─── Loading State ───────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div className="relative min-h-screen bg-[#04040a] flex items-center justify-center">
      <CursorGlow />
      <Scanlines />
      <AmbientBlobs />
      <GridBg />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center gap-5"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center">
            <Loader2 size={28} className="text-indigo-400 animate-spin" />
          </div>
          <div className="absolute -inset-3 rounded-[24px] border border-dashed border-indigo-500/15 animate-spin" style={{ animationDuration: "8s" }} />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 animate-pulse">
          Loading Interview...
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Error State ─────────────────────────────────────────────── */
function ErrorScreen({ message }) {
  return (
    <div className="relative min-h-screen bg-[#04040a] flex items-center justify-center">
      <CursorGlow />
      <Scanlines />
      <AmbientBlobs />
      <GridBg />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center gap-4 p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 max-w-sm text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
          <AlertTriangle size={22} className="text-rose-400" />
        </div>
        <p className="text-rose-300 font-bold text-sm">{message}</p>
      </motion.div>
    </div>
  );
}

/* ─── Ambient Blobs ───────────────────────────────────────────── */
function AmbientBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-violet-500/8 blur-[140px] rounded-full" />
      <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-500/8 blur-[140px] rounded-full" />
      <div className="absolute -bottom-20 right-1/3 w-[400px] h-[400px] bg-purple-500/6 blur-[140px] rounded-full" />
    </div>
  );
}

/* ─── Grid BG ─────────────────────────────────────────────────── */
function GridBg() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

/* ─── Question Dot Indicator ──────────────────────────────────── */
function QuestionDot({ idx, activeQuestionIndex, totalQuestions, onClick }) {
  const isActive = idx === activeQuestionIndex;
  const isDone = idx < activeQuestionIndex;

  return (
    <motion.button
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onClick(idx)}
      className="relative flex items-center justify-center"
      title={`Question ${idx + 1}`}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="ring"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-indigo-400/60 scale-150"
          />
        )}
      </AnimatePresence>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300 ${
          isActive
            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
            : isDone
            ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
            : "bg-white/4 text-white/25 border border-white/8"
        }`}
      >
        {isDone ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          idx + 1
        )}
      </div>
    </motion.button>
  );
}

/* ─── Progress Bar ────────────────────────────────────────────── */
function ProgressHeader({ activeQuestionIndex, totalQuestions, jobPosition, onDotClick }) {
  const pct = totalQuestions > 0 ? ((activeQuestionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 mb-10"
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-5">
        {/* Left: badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Interview Active
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            <Terminal size={10} />
            {jobPosition || "AI Mock"}
          </div>
        </div>

        {/* Right: question counter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Q</span>
          <motion.span
            key={activeQuestionIndex}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-black text-white tabular-nums"
          >
            {String(activeQuestionIndex + 1).padStart(2, "0")}
          </motion.span>
          <span className="text-white/20 font-bold">/</span>
          <span className="text-sm font-bold text-white/30 tabular-nums">
            {String(totalQuestions).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Progress bar track */}
      <div className="relative w-full h-[3px] bg-white/5 rounded-full overflow-hidden mb-4">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundImage: "linear-gradient(90deg, #4f46e5, #7c3aed, #db2777)" }}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
        {/* Glow on progress tip */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-violet-400 blur-sm"
          animate={{ left: `calc(${pct}% - 6px)` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
      </div>

      {/* Dot row */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: totalQuestions }).map((_, idx) => (
          <QuestionDot
            key={idx}
            idx={idx}
            activeQuestionIndex={activeQuestionIndex}
            totalQuestions={totalQuestions}
            onClick={onDotClick}
          />
        ))}
      </div>
    </motion.header>
  );
}

/* ─── Nav Buttons ─────────────────────────────────────────────── */
function NavButton({ onClick, disabled, direction, children, className = "" }) {
  if (disabled) return <div className="w-36" />;
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-bold text-sm uppercase tracking-widest transition-all duration-200 ${className}`}
    >
      {direction === "prev" && <ChevronLeft size={16} />}
      {children}
      {direction === "next" && <ChevronRight size={16} />}
    </motion.button>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
const StartInterview = ({ params }) => {
  const { interviewId } = params;

  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(mockInterview)
        .where(eq(mockInterview.mockId, interviewId));

      if (!result || result.length === 0) {
        setError("Interview not found.");
        return;
      }

      const parsed = JSON.parse(result[0].jsonMockResp);
      const normalized = Array.isArray(parsed)
        ? { questions: parsed }
        : parsed?.questions
        ? parsed
        : { questions: [] };

      setMockInterviewQuestions(normalized);
      setInterviewData(result[0]);
    } catch (err) {
      console.error("Failed to load interview:", err);
      setError("Failed to load interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  const totalQuestions = mockInterviewQuestions?.questions?.length ?? 0;
  const isFirst = activeQuestionIndex === 0;
  const isLast = activeQuestionIndex === totalQuestions - 1;

  return (
    <div className="relative min-h-screen bg-[#04040a] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <CursorGlow />
      <Scanlines />
      <AmbientBlobs />
      <GridBg />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">

        {/* Progress Header */}
        {totalQuestions > 0 && (
          <ProgressHeader
            activeQuestionIndex={activeQuestionIndex}
            totalQuestions={totalQuestions}
            jobPosition={interviewData?.jobPosition}
            onDotClick={setActiveQuestionIndex}
          />
        )}

        {/* Main panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuestionIndex}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Questions panel wrapper */}
            <div className="relative bg-[#0a0a12] border border-white/6 rounded-3xl overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundImage: "linear-gradient(90deg, transparent, #818cf8, transparent)" }}
              />
              <div className="p-6">
                <QuestionsSection
                  mockInterviewQuestions={mockInterviewQuestions}
                  activeQuestionIndex={activeQuestionIndex}
                />
              </div>
            </div>

            {/* Record panel wrapper */}
            <div className="relative bg-[#0a0a12] border border-white/6 rounded-3xl overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundImage: "linear-gradient(90deg, transparent, #a78bfa, #ec4899, transparent)" }}
              />
              <div className="p-6">
                <RecordAnswerSection
                  mockInterviewQuestions={mockInterviewQuestions}
                  activeQuestionIndex={activeQuestionIndex}
                  interviewData={interviewData}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {totalQuestions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between items-center mt-8"
          >
            {/* Previous */}
            <NavButton
              direction="prev"
              disabled={isFirst}
              onClick={() => setActiveQuestionIndex((i) => i - 1)}
              className="bg-white/4 border-white/8 text-white/50 hover:bg-white/8 hover:text-white hover:border-white/15"
            >
              Previous
            </NavButton>

            {/* Center hint */}
            <div className="hidden sm:flex flex-col items-center gap-1">
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalQuestions, 7) }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === activeQuestionIndex % 7
                        ? "w-5 bg-indigo-400"
                        : i < activeQuestionIndex % 7
                        ? "w-2 bg-indigo-500/40"
                        : "w-2 bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Navigate</span>
            </div>

            {/* Next / End */}
            {isLast ? (
              <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative group flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #059669, #047857)",
                    boxShadow: "0 0 30px rgba(5,150,105,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
                    }}
                  />
                  <Flag size={15} className="text-white" />
                  <span className="text-white">End Interview</span>
                  <Zap size={14} className="text-emerald-200" />
                </motion.button>
              </Link>
            ) : (
              <NavButton
                direction="next"
                onClick={() => setActiveQuestionIndex((i) => i + 1)}
                className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/15 hover:border-indigo-500/50 hover:text-indigo-200"
                style={{ background: "rgba(99,102,241,0.08)" }}
              >
                Next Question
              </NavButton>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StartInterview;