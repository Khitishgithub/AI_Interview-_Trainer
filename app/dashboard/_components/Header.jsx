"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/practice", label: "Practice Coding" },
  { href: "/dashboard/interviewExperiences", label: "Experiences" },
  { href: "/dashboard/battle", label: "Battle Mode" },
];

const Header = () => {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3">
      <div
        className="max-w-7xl mx-auto flex items-center justify-between p-3 px-6 
                      bg-black backdrop-blur-xl border border-white/10 
                      rounded-2xl  transition-all duration-300"
      >
        {/* Logo Section */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="relative w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <span className="text-white font-black text-xl italic">IF</span>
          </div>
          <h2 className="hidden sm:block text-white font-black tracking-tighter uppercase italic text-lg">
            Interview<span className="text-indigo-400">Forge</span>
          </h2>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => {
              const isActive = path === href;
              return (
                <li key={href} className="relative">
                  <Link
                    href={href}
                    className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 px-1
                      ${isActive ? "text-indigo-400" : "text-slate-400 hover:text-white"}`}
                  >
                    {label}
                  </Link>

                  {/* Underline for Active Link */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Action Area */}
        <div className="flex items-center gap-4">
          <div className="h-6 w-[1px] bg-slate-700 hidden sm:block mx-2" />
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "border-2 border-indigo-500/50 hover:border-indigo-400 transition-all shadow-lg",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
