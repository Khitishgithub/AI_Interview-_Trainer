"use client";
import {
  FingerprintIcon,
  LockIcon,
  BriefcaseIcon,
  UserIcon,
  AwardIcon,
  Terminal,
  Zap,
  Target,
  ChevronRight,
  Star,
  ArrowRight,
  Code2,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ─── Cursor Glow ────────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });

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
        background: `radial-gradient(700px circle at ${sx}px ${sy}px, rgba(99,102,241,0.08), transparent 60%)`,
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

/* ─── Typing animation ───────────────────────────────────────── */
function TypeWriter({ words, speed = 80 }) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (charIdx < current.length) {
            setDisplayed(current.slice(0, charIdx + 1));
            setCharIdx((c) => c + 1);
          } else {
            setTimeout(() => setDeleting(true), 1500);
          }
        } else {
          if (charIdx > 0) {
            setDisplayed(current.slice(0, charIdx - 1));
            setCharIdx((c) => c - 1);
          } else {
            setDeleting(false);
            setWordIdx((i) => (i + 1) % words.length);
          }
        }
      },
      deleting ? 40 : speed,
    );
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed]);

  return (
    <span
      className="text-transparent bg-clip-text"
      style={{
        backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa, #ec4899)",
      }}
    >
      {displayed}
      <span className="animate-pulse text-indigo-400">|</span>
    </span>
  );
}

/* ─── Floating code blocks ───────────────────────────────────── */
function FloatingCodeBlock({ code, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay, duration: 0.8 } }}
      className={`absolute  text-[10px] p-3 rounded-xl bg-[#0a0a12] border border-white/8 text-white select-none pointer-events-none ${className}`}
    >
      {code}
    </motion.div>
  );
}

/* ─── Stat counter ───────────────────────────────────────────── */
function CountUp({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Feature card ───────────────────────────────────────────── */
function FeatureCard({ feature, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group"
    >
      <div
        className={`relative bg-[#0a0a12] border rounded-2xl p-7 h-full overflow-hidden transition-all duration-300
          ${hovered ? "border-indigo-500/40 shadow-2xl shadow-indigo-500/10" : "border-white/6"}`}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${feature.dot}, transparent)`,
          }}
        />
        {/* Ghost number */}
        <div
          className="absolute bottom-4 right-4 text-[80px] font-black italic leading-none pointer-events-none select-none"
          style={{
            color: "rgba(255,255,255,0.018)",
            // fontFamily: "'Courier New', monospace",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(400px circle at 30% 30%, rgba(99,102,241,0.07), transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${feature.iconBg} ${feature.iconBorder}`}
        >
          <feature.icon size={22} className={feature.iconColor} />
        </div>
        <h3
          className="text-white text-lg font-black mb-3 group-hover:text-indigo-300 transition-colors"
          
        >
          {feature.title}
        </h3>
        <p className="text-white text-sm leading-relaxed">
          {feature.description}
        </p>
        <div className="flex items-center gap-2 mt-5 text-indigo-400 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Explore</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Testimonial card ───────────────────────────────────────── */
function TestimonialCard({ t, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#0a0a12] border border-white/6 rounded-2xl p-6 relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(129,140,248,0.3), transparent)",
        }}
      />
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-white text-sm leading-relaxed mb-5 italic">
        "{t.quote}"
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white"
          style={{
            backgroundImage: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            // fontFamily: "'Courier New', monospace",
          }}
        >
          {t.name[0]}
        </div>
        <div>
          <p
            className="text-white text-xs font-black"
            // 
          >
            {t.name}
          </p>
          <p className="text-white text-[10px] ">
            {t.role} · {t.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function Home() {
  const features = [
    {
      title: "AI Mock Interviews",
      description:
        "Face adaptive AI interviewers that ask follow-ups, probe weak spots, and mirror real company styles across any tech role.",
      icon: Terminal,
      iconBg: "bg-indigo-500/10",
      iconBorder: "border-indigo-500/20",
      iconColor: "text-indigo-400",
      dot: "#818cf8",
    },
    {
      title: "Live Code Battles",
      description:
        "Compete head-to-head on real LeetCode-style problems in timed arenas. Sharpen your instincts under pressure.",
      icon: Code2,
      iconBg: "bg-violet-500/10",
      iconBorder: "border-violet-500/20",
      iconColor: "text-violet-400",
      dot: "#a78bfa",
    },
    {
      title: "Instant Deep Feedback",
      description:
        "Every answer analyzed: communication clarity, technical accuracy, filler words, body language cues, and confidence scoring.",
      icon: MessageSquare,
      iconBg: "bg-pink-500/10",
      iconBorder: "border-pink-500/20",
      iconColor: "text-pink-400",
      dot: "#f472b6",
    },
    {
      title: "Community War Stories",
      description:
        "Browse real interview experiences from Google, Meta, Amazon, and more. Learn what actually gets asked behind closed doors.",
      icon: Target,
      iconBg: "bg-sky-500/10",
      iconBorder: "border-sky-500/20",
      iconColor: "text-sky-400",
      dot: "#38bdf8",
    },
    {
      title: "Progress Tracking",
      description:
        "Watch your performance scores climb across multiple practice sessions. Data-driven insights pinpoint your blind spots.",
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconBorder: "border-emerald-500/20",
      iconColor: "text-emerald-400",
      dot: "#34d399",
    },
    {
      title: "Role-Specific Training",
      description:
        "Tailored paths for SWE, ML Engineer, PM, and more. Company-specific question banks updated with insider intel.",
      icon: AwardIcon,
      iconBg: "bg-amber-500/10",
      iconBorder: "border-amber-500/20",
      iconColor: "text-amber-400",
      dot: "#fbbf24",
    },
  ];

  const stats = [
    { value: 98, suffix: "%", label: "Confidence boost rate" },
    { value: 12000, suffix: "+", label: "Questions in bank" },
    { value: 50000, suffix: "+", label: "Interviews practiced" },
    { value: 24, suffix: "/7", label: "Always available" },
  ];

  const testimonials = [
    {
      quote:
        "Got my Google L5 offer after 3 weeks of InterviewForge. The AI interviewer was harder than the real thing.",
      name: "Rohan Mehta",
      role: "SWE L5",
      company: "Google",
    },
    {
      quote:
        "Battle Mode is addictive. My LeetCode speed went from 40min to under 20min per medium problem.",
      name: "Priya Sharma",
      role: "SDE-2",
      company: "Amazon",
    },
    {
      quote:
        "The community experiences page was gold. Knew exactly what Amazon LPs to prep for.",
      name: "Arjun Das",
      role: "PM",
      company: "Meta",
    },
  ];

  const typeWords = [
    "Your Dream Job.",
    "FAANG Interviews.",
    "Coding Rounds.",
    "System Design.",
    "Behavioral Questions.",
  ];

  return (
    <div className="relative min-h-screen bg-[#04040a] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <CursorGlow />
      <Scanlines />

      {/* Grid background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.9) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-violet-500/6 blur-[160px] rounded-full" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-500/7 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/6 blur-[130px] rounded-full" />
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                <span className="text-white font-black text-xl italic">IF</span>
              </div>
              <h2 className="hidden sm:block text-white font-black tracking-tighter uppercase text-lg">
                Interview<span className="text-indigo-400">Forge</span>
              </h2>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/sign-in"
              className="hidden sm:flex items-center gap-2 text-white hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
            >
              <LockIcon size={14} />
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
              // 
            >
              Start Free
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </nav>

        {/* Hero content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 w-full">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    AI-Powered · Live Now
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1
                    className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] mb-6"
                    // 
                  >
                    <span className="text-white">CRACK</span>
                    <br />
                    <TypeWriter words={typeWords} />
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white text-base leading-relaxed mb-10 max-w-lg font-sans"
                >
                  Train with adaptive AI interviewers, battle peers in coding
                  arenas, and study real war stories from engineers who cracked
                  FAANG.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    href="/sign-up"
                    className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] text-sm"
                    // 
                  >
                    <Terminal size={16} />
                    Start Practicing Free
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>

                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-black uppercase tracking-wider transition-all text-sm"
                    // 
                  >
                    <LockIcon size={14} />
                    Sign In
                  </Link>
                </motion.div>

                {/* Trust line */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 text-white text-[11px]  uppercase tracking-widest"
                >
                  No credit card · Free forever tier · Cancel anytime
                </motion.p>
              </div>

              {/* Right: Terminal mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 80,
                  damping: 15,
                }}
                className="relative"
              >
                <div className="relative bg-[#07070f] border border-white/8 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                  {/* Top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #4f46e5, #7c3aed, #db2777)",
                    }}
                  />

                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    <span className="ml-2 text-white text-[10px] ">
                      interviewforge — mock-session
                    </span>
                  </div>

                  <div className="p-6 space-y-4 min-h-[360px]">
                    {/* AI interviewer */}
                    <div className="flex gap-3">
                      <div
                        className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 text-white text-xs font-black"
                        // 
                      >
                        AI
                      </div>
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl rounded-tl-none p-3 text-white text-xs leading-relaxed flex-1">
                        Design a rate limiter for an API that handles 10M
                        requests/day. Walk me through your approach.
                      </div>
                    </div>

                    {/* User */}
                    <div className="flex gap-3 justify-end">
                      <div className="bg-white/5 border border-white/8 rounded-xl rounded-tr-none p-3 text-white text-xs leading-relaxed max-w-[80%]">
                        I'd use a token bucket algorithm with Redis...
                      </div>
                      <div
                        className="w-8 h-8 rounded-lg bg-violet-600/80 flex items-center justify-center shrink-0 text-white text-xs font-black"
                        // 
                      >
                        YOU
                      </div>
                    </div>

                    {/* AI follow-up */}
                    <div className="flex gap-3">
                      <div
                        className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 text-white text-xs font-black"
                        // 
                      >
                        AI
                      </div>
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl rounded-tl-none p-3 text-white text-xs leading-relaxed flex-1">
                        Good choice. How would you handle distributed rate
                        limiting across 50 servers?
                      </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="flex gap-3 justify-end items-center mt-2">
                      <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                      <div
                        className="w-8 h-8 rounded-lg bg-violet-600/80 flex items-center justify-center shrink-0 text-white text-xs font-black"
                        // 
                      >
                        YOU
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="mt-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-white  uppercase tracking-widest">
                          Live Score
                        </span>
                        <span
                          className="text-emerald-400 text-xs font-black"
                          // 
                        >
                          82 / 100
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "82%" }}
                          transition={{
                            delay: 1.2,
                            duration: 1.5,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, #4f46e5, #7c3aed)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating chips */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 px-3 py-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest"
                  // 
                >
                  ✓ Offer Received
                </motion.div>
                <motion.div
                  animate={{ y: [4, -4, 4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.5,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-4 -left-4 px-3 py-2 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-[10px] font-black text-indigo-400 uppercase tracking-widest"
                  // 
                >
                  ⚡ AI Interviewer
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p
                  className="text-4xl md:text-6xl font-black text-transparent bg-clip-text mb-2"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #818cf8, #a78bfa)",
                    // fontFamily: "'Courier New', monospace",
                  }}
                >
                  <CountUp target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-white text-xs  uppercase tracking-widest">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">
              <Zap size={10} />
              Full Arsenal
            </div>
            <h2
              className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-4"
              // 
            >
              EVERY TOOL
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #818cf8, #a78bfa, #ec4899)",
                }}
              >
                YOU NEED
              </span>
            </h2>
            <p className="text-white text-sm  max-w-md mx-auto">
              From first mock to final offer — we cover every stage of the
              interview gauntlet.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-4"
              // 
            >
              THREE STEPS
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #818cf8, #ec4899)",
                }}
              >
                TO AN OFFER
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-10 left-1/3 right-1/3 h-[1px]"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)",
              }}
            />

            {[
              {
                step: "01",
                title: "Create Your Profile",
                desc: "Tell us your target role, companies, and current level. We calibrate your interview difficulty instantly.",
                color: "indigo",
              },
              {
                step: "02",
                title: "Practice Daily",
                desc: "AI interviews, coding battles, and mock sessions. Track progress with each session.",
                color: "violet",
              },
              {
                step: "03",
                title: "Land the Offer",
                desc: "Walk into real interviews with muscle memory, confidence, and insider knowledge.",
                color: "pink",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-black border"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(99,102,241,0.1), rgba(124,58,237,0.1))`,
                    borderColor: "rgba(99,102,241,0.2)",
                    // fontFamily: "'Courier New', monospace",
                    color:
                      step.color === "pink"
                        ? "#f472b6"
                        : step.color === "violet"
                          ? "#a78bfa"
                          : "#818cf8",
                  }}
                >
                  {step.step}
                </div>
                <h3
                  className="text-white text-xl font-black mb-3 uppercase"
                  // 
                >
                  {step.title}
                </h3>
                <p className="text-white text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2
              className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white"
              // 
            >
              WAR STORIES
            </h2>
            <p className="text-white text-sm  mt-2">
              From engineers who made it
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-8 md:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Start your prep tonight
            </div>
            <h2
              className="text-4xl md:text-6xl  font-black uppercase italic tracking-tighter leading-none mb-8"
              // 
            >
              <span className="text-white">READY TO</span>
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #818cf8, #a78bfa, #ec4899)",
                }}
              >
                FORGE YOUR
              </span>
              <br />
              <span className="text-white">CAREER?</span>
            </h2>
            <p className="text-white text-base leading-relaxed mb-10 max-w-xl mx-auto font-sans">
              Join 50,000+ engineers who transformed their interview skills and
              landed offers at their dream companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider transition-all shadow-[0_0_40px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_rgba(79,70,229,0.7)] text-sm"
                // 
              >
                <Terminal size={16} />
                Create Free Account
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-black uppercase tracking-wider transition-all text-sm"
                // 
              >
                View Dashboard
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FingerprintIcon size={14} className="text-white" />
            </div>
            <span
              className="text-white font-black text-sm uppercase italic tracking-tighter"
              // 
            >
              Interview<span className="text-indigo-500">Forge</span>
            </span>
          </div>
          <p className="text-white text-[10px]  uppercase tracking-widest">
            © 2026 InterviewForge · All rights reserved
          </p>
          <div className="flex items-center gap-6 text-[10px] text-text-white  uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
