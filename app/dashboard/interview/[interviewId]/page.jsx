"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { mockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import {
  Lightbulb,
  WebcamIcon,
  Briefcase,
  Clock,
  FileText,
  Play,
  Camera,
  CameraOff,
  ChevronRight,
  Terminal,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

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

/* ─── Stat Card ───────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accent = "indigo", delay = 0 }) {
  const accents = {
    indigo: { border: "border-indigo-500/25", bg: "bg-indigo-500/8", icon: "text-indigo-400", dot: "bg-indigo-400" },
    violet: { border: "border-violet-500/25", bg: "bg-violet-500/8", icon: "text-violet-400", dot: "bg-violet-400" },
    emerald: { border: "border-emerald-500/25", bg: "bg-emerald-500/8", icon: "text-emerald-400", dot: "bg-emerald-400" },
  };
  const a = accents[accent] || accents.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 120, damping: 14 }}
      className={`relative p-5 rounded-2xl border ${a.border} ${a.bg} overflow-hidden group`}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ backgroundImage: `linear-gradient(90deg, transparent, currentColor, transparent)` }}
      />
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 bg-white/5 border border-white/8`}>
        <Icon size={16} className={a.icon} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">{label}</p>
      <p className="text-white font-black text-sm leading-snug">{value || "—"}</p>
    </motion.div>
  );
}

/* ─── Webcam Panel ────────────────────────────────────────────── */
function WebcamPanel({ webcamEnable, setWebcamEnable }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 18 }}
      className="relative h-full"
    >
      <div className="relative bg-[#0a0a12] border border-white/8 rounded-3xl overflow-hidden h-full min-h-[400px] flex flex-col">
        {/* Top accent */}
        <div className="h-[2px] w-full shrink-0"
          style={{ backgroundImage: "linear-gradient(90deg, #4f46e5, #7c3aed, #db2777)" }}
        />

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={14} className="text-indigo-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">Camera Feed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${webcamEnable ? "bg-emerald-400 animate-pulse" : "bg-red-400/50"}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${webcamEnable ? "text-emerald-400" : "text-red-400/50"}`}>
              {webcamEnable ? "Live" : "Offline"}
            </span>
          </div>
        </div>

        {/* Camera area */}
        <div className="flex-1 relative flex items-center justify-center p-6">
          <AnimatePresence mode="wait">
            {webcamEnable ? (
              <motion.div
                key="cam"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full"
              >
                {/* Corner brackets */}
                {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-6 h-6 z-10 pointer-events-none`}>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500/70" />
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-indigo-500/70" />
                  </div>
                ))}
                <Webcam
                  onUserMedia={() => setWebcamEnable(true)}
                  onUserMediaError={() => setWebcamEnable(false)}
                  mirrored={true}
                  className="w-full rounded-xl"
                  style={{ maxHeight: 300, objectFit: "cover" }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 w-full"
              >
                {/* Camera idle state */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-3xl bg-white/3 border border-white/6 flex items-center justify-center">
                    <CameraOff size={40} className="text-white/20" />
                  </div>
                  <div className="absolute -inset-4 rounded-[40px] border border-dashed border-white/5 animate-spin" style={{ animationDuration: "20s" }} />
                  <div className="absolute -inset-8 rounded-[50px] border border-dashed border-indigo-500/5 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
                </div>

                <div className="text-center">
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-1 font-bold">Camera Inactive</p>
                  <p className="text-white/15 text-[11px]">Enable to proceed with interview</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWebcamEnable(true)}
                  className="relative group flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-sm hover:bg-indigo-500/25 hover:border-indigo-500/50 transition-all duration-200"
                >
                  <Camera size={16} />
                  Activate Camera & Mic
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom hint */}
        <div className="px-6 py-4 border-t border-white/5">
          <p className="text-[10px] text-white/25 font-bold uppercase tracking-widest flex items-center gap-2">
            <Shield size={10} className="text-emerald-400/50" />
            Your feed is not recorded or stored
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Info Panel ──────────────────────────────────────────────── */
function InfoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="relative p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ backgroundImage: "linear-gradient(90deg, transparent, #f59e0b, transparent)" }}
      />
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb size={15} className="text-amber-400" />
        </div>
        <div>
          <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Before You Begin</h4>
          <p className="text-white/50 text-xs leading-relaxed font-sans">
            {process.env.NEXT_PUBLIC_INFORMATION ||
              "Enable your webcam and microphone for the best experience. Your responses will be analyzed by AI to provide personalized feedback. Answer each question naturally — there are no right or wrong answers, only your authentic experience."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webcamEnable, setWebcamEnable] = useState(false);

  useEffect(() => {
    GetinterviewDetails();
  }, []);

  const GetinterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(mockInterview)
        .where(eq(mockInterview.mockId, params.interviewId));

      if (result.length > 0) {
        setInterviewData(result[0]);
      } else {
        setInterviewData({});
      }
    } catch (error) {
      console.error("Failed to fetch interview details", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#04040a] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <CursorGlow />
      <Scanlines />

      {/* Grid background */}
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

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-violet-500/8 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-500/8 blur-[140px] rounded-full" />
        <div className="absolute -bottom-20 right-1/3 w-[400px] h-[400px] bg-purple-500/6 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">

        {/* ── HEADER ── */}
        <header className="mb-14">
          {/* Status badge row */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-7"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Session Ready
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <Terminal size={10} />
              AI Mock Interview
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4"
          >
            <span className="text-white">LET'S GET</span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa, #ec4899)" }}
            >
              STARTED
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-white/30 text-sm tracking-widest"
          >
            REVIEW YOUR DETAILS · ENABLE CAMERA · BEGIN INTERVIEW
          </motion.p>
        </header>

        {/* ── MAIN CONTENT ── */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left column */}
          <div className="space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-4">
              <StatCard
                icon={Briefcase}
                label="Job Position"
                value={interviewData?.jobPosition}
                accent="indigo"
                delay={0.2}
              />
              <StatCard
                icon={FileText}
                label="Tech Stack / Description"
                value={interviewData?.jobDesc}
                accent="violet"
                delay={0.28}
              />
              <StatCard
                icon={Clock}
                label="Years of Experience"
                value={interviewData?.jobExperience ? `${interviewData.jobExperience} years` : undefined}
                accent="emerald"
                delay={0.36}
              />
            </div>

            {/* Info banner */}
            <InfoBanner />

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 120 }}
            >
              <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative w-full group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-base uppercase tracking-widest overflow-hidden transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    boxShadow: "0 0 40px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Shimmer */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
                    }}
                  />
                  <Play size={18} className="text-white" />
                  <span className="text-white">Start Interview</span>
                 
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Right column: webcam */}
          <WebcamPanel webcamEnable={webcamEnable} setWebcamEnable={setWebcamEnable} />
        </div>
      </div>
    </div>
  );
}

export default Interview;