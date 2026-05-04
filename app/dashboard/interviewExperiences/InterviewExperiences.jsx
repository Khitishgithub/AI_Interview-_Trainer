"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  X, MapPin, Calendar, ChevronRight, Briefcase,
  Hash, Star, MessageSquare, Clock, Lightbulb,
  Users, Award, ExternalLink, Terminal
} from "lucide-react";

/* ─── Company accent colors ──────────────────────────────────── */
const companyConfig = {
  Google:   { color: "text-sky-300",    border: "border-sky-500/30",    bg: "bg-sky-500/10",    dot: "#38bdf8" },
  Meta:     { color: "text-blue-300",   border: "border-blue-500/30",   bg: "bg-blue-500/10",   dot: "#60a5fa" },
  Amazon:   { color: "text-amber-300",  border: "border-amber-500/30",  bg: "bg-amber-500/10",  dot: "#fcd34d" },
  Apple:    { color: "text-slate-300",  border: "border-slate-500/30",  bg: "bg-slate-500/10",  dot: "#cbd5e1" },
  Netflix:  { color: "text-rose-300",   border: "border-rose-500/30",   bg: "bg-rose-500/10",   dot: "#fda4af" },
  Microsoft:{ color: "text-green-300",  border: "border-green-500/30",  bg: "bg-green-500/10",  dot: "#86efac" },
  default:  { color: "text-indigo-300", border: "border-indigo-500/30", bg: "bg-indigo-500/10", dot: "#818cf8" },
};

const getCompany = (name) => companyConfig[name] || companyConfig.default;

/* ─── Cursor Glow (shared with Practice page) ────────────────── */
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

/* ─── Scanlines ──────────────────────────────────────────────── */
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

/* ─── Avatar initials ────────────────────────────────────────── */
function Avatar({ name, size = "lg" }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const palette = [
    ["from-indigo-600 to-violet-600", "shadow-indigo-500/30"],
    ["from-sky-600 to-blue-600",      "shadow-sky-500/30"],
    ["from-rose-600 to-pink-600",     "shadow-rose-500/30"],
    ["from-amber-500 to-orange-600",  "shadow-amber-500/30"],
    ["from-emerald-600 to-teal-600",  "shadow-emerald-500/30"],
  ];
  const pick = palette[name.charCodeAt(0) % palette.length];

  const cls = size === "lg"
    ? "w-16 h-16 text-lg rounded-2xl"
    : "w-10 h-10 text-sm rounded-xl";

  return (
    <div className={`${cls} bg-gradient-to-br ${pick[0]} flex items-center justify-center font-black text-white shadow-lg ${pick[1]} shrink-0`}
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      {initials}
    </div>
  );
}

/* ─── Experience Card ────────────────────────────────────────── */
function ExperienceCard({ item, index, onClick }) {
  const co = getCompany(item.company);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 120, damping: 14 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClick(item)}
      className="group cursor-pointer"
    >
      <div
        className={`relative bg-[#0a0a12] border rounded-2xl p-6 h-full transition-all duration-300 overflow-hidden
          ${hovered ? "border-indigo-500/40 shadow-2xl shadow-indigo-500/10" : "border-white/6"}`}
      >
        {/* Card top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${co.dot}, transparent)`,
          }}
        />

        {/* Hover inner glow */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(500px circle at 50% 0%, rgba(99,102,241,0.07), transparent 70%)" }}
            />
          )}
        </AnimatePresence>

        {/* Ghost index */}
        <div
          className="absolute top-4 right-4 text-[56px] font-black italic leading-none pointer-events-none select-none"
          style={{ color: "rgba(255,255,255,0.018)", fontFamily: "'Courier New', monospace" }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <Avatar name={item.name} />
          <div className="min-w-0">
            <h2
              className="text-white font-black text-base group-hover:text-indigo-300 transition-colors truncate"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              {item.name}
            </h2>
            <div className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${co.bg} ${co.border} ${co.color}`}>
              {item.company}
            </div>
            {item.role && (
              <p className="text-slate-500 text-[11px] mt-1 truncate font-mono">{item.role}</p>
            )}
          </div>
        </div>

        {/* Quote */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-5 font-sans italic border-l-2 border-indigo-500/30 pl-3">
          "{item.shortQuote}"
        </p>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {item.date && (
            <span className="flex items-center gap-1 text-[9px] px-2 py-1 rounded bg-white/4 text-slate-500 border border-white/6 font-bold uppercase">
              <Calendar size={8} />
              {item.date}
            </span>
          )}
          {item.location && (
            <span className="flex items-center gap-1 text-[9px] px-2 py-1 rounded bg-white/4 text-slate-500 border border-white/6 font-bold uppercase">
              <MapPin size={8} />
              {item.location}
            </span>
          )}
          {item.timeline?.length && (
            <span className="flex items-center gap-1 text-[9px] px-2 py-1 rounded bg-indigo-500/5 text-indigo-400 border border-indigo-500/15 font-bold uppercase">
              <Hash size={7} />
              {item.timeline.length} rounds
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Terminal size={10} />
            Full Story
          </span>
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
    </motion.div>
  );
}

/* ─── Timeline Step ──────────────────────────────────────────── */
function TimelineStep({ round, index, total }) {
  return (
    <div className="relative flex gap-5">
      {/* Connector */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#0a0a12] border-2 border-indigo-500/50 flex items-center justify-center z-10 shrink-0">
          <span className="text-indigo-400 text-[11px] font-black" style={{ fontFamily: "'Courier New', monospace" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        {index < total - 1 && (
          <div className="w-[2px] flex-1 mt-1 bg-gradient-to-b from-indigo-500/30 to-transparent min-h-[2rem]" />
        )}
      </div>

      <div className="pb-6 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h4 className="text-white font-black text-sm" style={{ fontFamily: "'Courier New', monospace" }}>
            {round.round}
          </h4>
          {round.duration && (
            <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase">
              <Clock size={8} />
              {round.duration}
            </span>
          )}
        </div>
        <p className="text-slate-400 text-xs leading-relaxed font-sans">{round.description}</p>
      </div>
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────── */
function ExperienceModal({ item, onClose }) {
  const co = getCompany(item.company);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="relative bg-[#07070f] border border-white/8 w-full max-w-5xl max-h-[88vh] rounded-3xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden z-10"
      >
        {/* Top gradient bar */}
        <div
          className="h-[2px] w-full shrink-0"
          style={{ backgroundImage: `linear-gradient(90deg, #4f46e5, #7c3aed, #db2777)` }}
        />

        {/* Modal header */}
        <div className="px-8 py-6 border-b border-white/6 flex items-start justify-between gap-4 shrink-0 bg-[#07070f]">
          <div className="flex items-start gap-5">
            <Avatar name={item.name} size="lg" />
            <div>
              <h2
                className="text-white text-2xl font-black"
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                {item.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${co.bg} ${co.border} ${co.color}`}>
                  {item.company}
                </span>
                {item.role && (
                  <span className="text-slate-400 text-[11px] font-mono">{item.role}</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/4 hover:bg-white/8 text-slate-400 hover:text-white transition-colors shrink-0 border border-white/6"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-8 py-8 space-y-10"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#334155 transparent",
          }}
        >
          <div className="grid md:grid-cols-3 gap-10">

            {/* Left: main content */}
            <div className="md:col-span-2 space-y-10">

              {/* Overview */}
              {item.overview && (
                <section>
                  <SectionTitle icon={MessageSquare} label="Overview" color="text-indigo-400" />
                  <div className="mt-4 p-5 rounded-2xl bg-white/[0.02] border border-white/6 text-slate-300 text-sm leading-relaxed font-sans">
                    {item.overview}
                  </div>
                </section>
              )}

              {/* Timeline */}
              {item.timeline?.length > 0 && (
                <section>
                  <SectionTitle icon={Clock} label="Interview Journey" color="text-emerald-400" />
                  <div className="mt-6">
                    {item.timeline.map((round, i) => (
                      <TimelineStep key={i} round={round} index={i} total={item.timeline.length} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right: sidebar */}
            <div className="space-y-5">

              {/* Quick info */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/6 space-y-4">
                <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">Quick Info</h3>
                {item.location && (
                  <InfoRow icon={MapPin} label="Location" value={item.location} />
                )}
                {item.date && (
                  <InfoRow icon={Calendar} label="Date" value={item.date} />
                )}
                {item.role && (
                  <InfoRow icon={Briefcase} label="Role" value={item.role} />
                )}
                {item.timeline?.length && (
                  <InfoRow icon={Users} label="Rounds" value={`${item.timeline.length} interviews`} />
                )}
              </div>

              {/* Tips */}
              {item.tips?.length > 0 && (
                <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-4">
                  <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400">
                    <Lightbulb size={12} />
                    Key Tips
                  </h3>
                  <ul className="space-y-3">
                    {item.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2.5 text-slate-300 text-xs leading-relaxed font-sans">
                        <span className="mt-0.5 w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outcome badge */}
              {item.outcome && (
                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
                  item.outcome === "Offer" || item.outcome === "Selected"
                    ? "bg-emerald-500/8 border-emerald-500/25"
                    : "bg-rose-500/8 border-rose-500/25"
                }`}>
                  <Award size={18} className={item.outcome === "Offer" || item.outcome === "Selected" ? "text-emerald-400" : "text-rose-400"} />
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Outcome</p>
                    <p className={`text-sm font-black ${item.outcome === "Offer" || item.outcome === "Selected" ? "text-emerald-300" : "text-rose-300"}`}
                      style={{ fontFamily: "'Courier New', monospace" }}>
                      {item.outcome}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Small helpers ──────────────────────────────────────────── */
function SectionTitle({ icon: Icon, label, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg bg-white/4 border border-white/6 ${color}`}>
        <Icon size={14} />
      </div>
      <h3
        className="text-white text-base font-black uppercase tracking-wider"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        {label}
      </h3>
      <div className="flex-1 h-[1px] bg-white/5" />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={12} className="text-slate-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">{label}</p>
        <p className="text-slate-300 text-xs font-mono mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
const InterviewExperiences = ({ data = [] }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#04040a] text-slate-200 overflow-x-hidden selection:bg-indigo-500/30">
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

      {/* ── HERO HEADER ── */}
      <header className="relative z-10 pt-16 pb-10 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Community Archive
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Terminal size={10} />
              {data.length} Entries
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-3"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            <span className="text-white">INTERVIEW</span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa, #ec4899)" }}
            >
              EXPERIENCES
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-slate-500 text-sm font-mono tracking-widest max-w-md"
          >
            REAL STORIES · FIRST-HAND ACCOUNTS · FRONT-LINE HIRING INTEL
          </motion.p>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">
        {data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 flex flex-col items-center gap-5 opacity-30"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl border border-white/10 flex items-center justify-center">
                <Users size={40} strokeWidth={1} />
              </div>
              <div className="absolute -inset-3 rounded-[30px] border border-dashed border-white/5" />
            </div>
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] mb-1">No Entries Yet</p>
              <p className="text-[11px] text-slate-600">Be the first to share your experience</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data.map((item, i) => (
              <ExperienceCard
                key={item.id}
                item={item}
                index={i}
                onClick={setSelected}
              />
            ))}
          </motion.div>
        )}
      </main>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selected && (
          <ExperienceModal item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewExperiences;