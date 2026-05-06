"use client";

import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/interviewList";
import { motion } from "framer-motion";
import { Terminal, Cpu, Zap } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="relative min-h-screen bg-[#04040a] text-white overflow-x-hidden">
      {/* Grid bg */}
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

      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 3px)",
        }}
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-violet-500/8 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-500/8 blur-[140px] rounded-full" />
        <div className="absolute -bottom-20 right-1/3 w-[400px] h-[400px] bg-purple-500/8 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* ── Header ── */}
        <header className="mb-12 pb-10 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Session Active
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
              <Terminal size={10} />
              geterview Lab
            </div>
          </motion.div>

          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
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
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #818cf8, #a78bfa, #ec4899)",
                  }}
                >
                  DASHBOARD
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-white text-sm  tracking-widest"
              >
                AI-POWERED MOCK INTERVIEWS · REAL-TIME FEEDBACK
              </motion.p>
            </div>
          </div>
        </header>

        {/* ── Add New ── */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-1.5 rounded-lg bg-white/4 border border-white/6 text-indigo-400">
              <Zap size={14} />
            </div>
            <h2
              className="text-white text-base font-black uppercase tracking-wider"
              
            >
              New Session
            </h2>
            <div className="flex-1 h-[1px] bg-white/5" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AddNewInterview />
          </div>
        </section>

        {/* ── Interview List ── */}
        <InterviewList />
      </div>
    </div>
  );
};

export default Dashboard;
