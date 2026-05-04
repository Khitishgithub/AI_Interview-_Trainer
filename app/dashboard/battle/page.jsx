"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Play, Bot, Loader2, RefreshCcw } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

/* 🧠 QUESTION BANK */
const QUESTIONS = [
  {
    title: "Two Sum",
    description: "Find indices of two numbers that add up to target.",
    solution: `int twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> mp;
    for(int i=0;i<nums.size();i++){
        int diff = target - nums[i];
        if(mp.count(diff)) return {mp[diff], i};
        mp[nums[i]] = i;
    }
    return {};
}`
  },
  {
    title: "Palindrome Check",
    description: "Check if a string is palindrome.",
    solution: `bool isPalindrome(string s) {
    int l = 0, r = s.size() - 1;
    while(l < r){
        if(s[l] != s[r]) return false;
        l++; r--;
    }
    return true;
}`
  },
  {
    title: "Max Subarray",
    description: "Find maximum sum subarray.",
    solution: `int maxSubArray(vector<int>& nums) {
    int sum = nums[0], maxSum = nums[0];
    for(int i=1;i<nums.size();i++){
        sum = max(nums[i], sum + nums[i]);
        maxSum = max(maxSum, sum);
    }
    return maxSum;
}`
  }
];

export default function BattlePage() {
  const [question, setQuestion] = useState(QUESTIONS[0]);
  const [code, setCode] = useState("// Write your solution...");
  const [aiCode, setAiCode] = useState("");
  const [status, setStatus] = useState("Ready");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  /* 🎯 Pick Random Question */
  const getRandomQuestion = () => {
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    setQuestion(q);
    setCode("// Write your solution...");
    setAiCode("");
    setResult(null);
    setStatus("New Question Loaded");
  };

  /* 🤖 HUMAN-LIKE AI TYPING */
  const simulateAI = async () => {
    const aiSolution = question.solution;
    setAiCode("");

    for (let i = 0; i < aiSolution.length; i++) {
      const char = aiSolution[i];

      // Random typing delay (human-like)
      const delay =
        char === "\n"
          ? 200
          : Math.random() * 80 + 20; // 20ms - 100ms

      await new Promise((r) => setTimeout(r, delay));

      setAiCode((prev) => prev + char);

      // occasional pause (thinking)
      if (Math.random() < 0.03) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }
  };

  const runBattle = async () => {
    setRunning(true);
    setStatus("Battle Started ⚔️");
    setResult(null);

    simulateAI();

    // User execution time
    await new Promise((r) => setTimeout(r, 4000));

    // AI "finishing"
    await new Promise((r) => setTimeout(r, 2000));

    const userPassed = code.includes("return");
    const aiPassed = true;

    let finalResult;

    if (userPassed && aiPassed) finalResult = "🤝 Draw";
    else if (userPassed) finalResult = "🏆 You Win!";
    else finalResult = "💀 AI Wins";

    setResult(finalResult);
    setStatus("Battle Finished");
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          ⚔️ Battle Mode <Bot size={20} className="text-indigo-400" />
        </h1>

        <button
          onClick={getRandomQuestion}
          className="flex items-center gap-2 text-xs bg-white/5 px-3 py-2 rounded-lg"
        >
          <RefreshCcw size={14} /> New Question
        </button>
      </div>

      <p className="text-gray-400 mb-4">{status}</p>

      {/* Question */}
      <div className="mb-6 bg-[#111827] p-5 rounded-xl">
        <h3 className="font-semibold mb-2">{question.title}</h3>
        <p className="text-gray-300 text-sm">{question.description}</p>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-2 gap-6 h-[400px]">
        
        {/* YOU */}
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <div className="bg-[#111] px-3 py-2 text-xs text-gray-400">You</div>
          <MonacoEditor
            height="100%"
            language="cpp"
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || "")}
          />
        </div>

        {/* AI */}
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <div className="bg-[#111] px-3 py-2 text-xs text-indigo-400">
            AI Opponent 🤖
          </div>
          <MonacoEditor
            height="100%"
            language="cpp"
            theme="vs-dark"
            value={aiCode}
            options={{ readOnly: true }}
          />
        </div>
      </div>

      {/* Run */}
      <button
        onClick={runBattle}
        disabled={running}
        className="mt-6 flex items-center gap-2 bg-indigo-600 px-6 py-2 rounded-lg"
      >
        {running ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
        {running ? "Battling..." : "Start Battle"}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-6 text-lg font-semibold text-indigo-400">
          {result}
        </div>
      )}
    </div>
  );
}