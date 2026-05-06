"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

const roadmaps = [
  {
    slug: "frontend",
    title: "Frontend Developer",
    desc: "Master the browser stack — React, CSS systems, performance, and modern tooling.",
    icon: "🖥️",
    accent: "#38bdf8",
    iconBg: "rgba(56,189,248,0.1)",
    iconBorder: "rgba(56,189,248,0.2)",
    topBar: "linear-gradient(90deg, transparent, #38bdf8, transparent)",
  },
  {
    slug: "backend",
    title: "Backend Developer",
    desc: "APIs, databases, auth flows, and scalable server architecture from scratch.",
    icon: "⚙️",

    accent: "#a78bfa",
    iconBg: "rgba(167,139,250,0.1)",
    iconBorder: "rgba(167,139,250,0.2)",
    topBar: "linear-gradient(90deg, transparent, #a78bfa, transparent)",
  },
  {
    slug: "fullstack",
    title: "Full Stack Developer",
    desc: "End-to-end product thinking — frontend, backend, deployment, and CI/CD.",
    icon: "🚀",

    accent: "#818cf8",
    iconBg: "rgba(129,140,248,0.1)",
    iconBorder: "rgba(129,140,248,0.2)",
    topBar: "linear-gradient(90deg, transparent, #818cf8, transparent)",
  },
  {
    slug: "java",
    title: "Java Developer",
    desc: "OOP, Spring Boot, JVM internals, and enterprise-grade system design patterns.",
    icon: "☕",

    accent: "#fcd34d",
    iconBg: "rgba(252,211,77,0.1)",
    iconBorder: "rgba(252,211,77,0.2)",
    topBar: "linear-gradient(90deg, transparent, #fcd34d, transparent)",
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    desc: "Transform raw data into insights — SQL, Python, BI tools, and statistics.",
    icon: "📊",

    accent: "#6ee7b7",
    iconBg: "rgba(110,231,183,0.1)",
    iconBorder: "rgba(110,231,183,0.2)",
    topBar: "linear-gradient(90deg, transparent, #6ee7b7, transparent)",
  },
  {
    slug: "system-design",
    title: "System Design",
    desc: "Design distributed systems at scale — load balancers, caches, queues, and more.",
    icon: "🧠",

    accent: "#f9a8d4",
    iconBg: "rgba(249,168,212,0.1)",
    iconBorder: "rgba(249,168,212,0.2)",
    topBar: "linear-gradient(90deg, transparent, #f9a8d4, transparent)",
  },
];

const levelLabel = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/* ─── Cursor Glow ─────────────────────────────────────────────── */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(99,102,241,0.07), transparent 60%)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-100"
    />
  );
}

/* ─── Roadmap Card ────────────────────────────────────────────── */
function RoadmapCard({ r, index }) {
  return (
    <Link
      href={`/dashboard/roadmap/${r.slug}`}
      className="group relative bg-[#0a0a12] border border-white/[0.06] rounded-2xl p-7 overflow-hidden
                 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10
                 hover:-translate-y-1 block"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ backgroundImage: r.topBar }}
      />

      {/* Hover inner glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(500px circle at 50% 0%, rgba(99,102,241,0.07), transparent 70%)",
        }}
      />

      {/* Ghost index number */}
      <div
        className="absolute top-4 right-4 text-[56px] font-black italic leading-none pointer-events-none select-none"
        style={{
          color: "rgba(255,255,255,0.018)",
          fontFamily: "'Courier New', monospace",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-[26px] mb-5 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
        style={{ background: r.iconBg, border: `1px solid ${r.iconBorder}` }}
      >
        {r.icon}
      </div>

      {/* Title */}
      <h2 className="text-white font-black text-[17px] mb-1.5 relative z-10 group-hover:text-indigo-300 transition-colors">
        {r.title}
      </h2>

      {/* Desc */}
      <p className="text-white/40 text-[11px] leading-relaxed mb-5 relative z-10">
        {r.desc}
      </p>

  

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.05] relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: r.levelColor }}
          />
          {levelLabel[r.level]} · {r.rounds}
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm
                     bg-white/[0.05] text-white transition-all duration-200
                     group-hover:bg-indigo-500 group-hover:translate-x-0.5"
        >
          ›
        </div>
      </div>
    </Link>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function RoadmapHome() {
  return (
    <div className="relative min-h-screen bg-[#04040a] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <CursorGlow />

      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 3px)",
        }}
      />

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
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-violet-500/[0.08] blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-500/[0.08] blur-[140px] rounded-full" />
        <div className="absolute -bottom-20 right-1/3 w-[400px] h-[400px] bg-purple-500/[0.08] blur-[140px] rounded-full" />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-10 pt-16 pb-10 px-6 md:px-12 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          {/* Badges */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Learning Paths
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-bold text-white/70 uppercase tracking-widest">
              ⌘ {roadmaps.length} Roadmaps
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(40px,7vw,72px)] font-black italic uppercase tracking-tighter leading-[0.95] mb-3">
            <span className="text-white">CHOOSE YOUR</span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #818cf8, #a78bfa, #ec4899)",
              }}
            >
              ROADMAP
            </span>
          </h1>
          <p className="text-white/25 text-xs font-bold tracking-[0.2em] uppercase mt-2">
            Pick a track · Follow the path · Land the role
          </p>
        </div>
      </header>

      {/* ── GRID ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
            All tracks
          </span>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roadmaps.map((r, i) => (
            <RoadmapCard key={r.slug} r={r} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
