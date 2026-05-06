"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  BookOpen,
  Lightbulb,
  Terminal,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

// Judge0 language IDs
const LANGUAGE_IDS = { "C++": 54, Java: 62, Python: 71, SQL: 82 };

const LANGUAGE_DEFAULTS = {
  "C++": "cpp",
  Java: "java",
  Python: "python",
  SQL: "sql",
};

const tabConfig = [
  { id: "description", label: "Description", icon: BookOpen },
  { id: "solution", label: "Solution", icon: Lightbulb },
  { id: "output", label: "Output", icon: Terminal },
];

export default function QuestionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [copied, setCopied] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const raw = searchParams.get("data");
    if (raw) {
      try {
        const q = JSON.parse(decodeURIComponent(raw));
        setQuestion(q);
        setLanguage(
          q.language && LANGUAGE_IDS[q.language] ? q.language : "C++",
        );
        setCode(q.starterCode?.["C++"] || "");
      } catch {
        /* ignore */
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (question) {
      setCode(
        question.starterCode?.[language] ||
          `// Write your ${language} solution here`,
      );
      setResult(null);
    }
  }, [language, question]);

  const runCode = useCallback(async () => {
    if (!code.trim()) return;
    setRunning(true);
    setResult(null);
    setActiveTab("output");

    const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

    if (!rapidApiKey) {
      // Simulate without Judge0 if key not set
      await new Promise((r) => setTimeout(r, 1200));
      setResult({
        status: "simulated",
        stdout:
          "⚠️ Add NEXT_PUBLIC_RAPIDAPI_KEY to .env.local to enable real execution.\n\nCode received successfully!",
        time: "~",
        memory: "~",
      });
      setRunning(false);
      return;
    }

    try {
      const submitRes = await fetch(
        "http://localhost:2358/submissions?base64_encoded=false",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": rapidApiKey,
            "X-RapidAPI-Host": "judge0-extra-ce1.p.rapidapi.com",
          },
          body: JSON.stringify({
            source_code: code,
            language_id: LANGUAGE_IDS[language] || 54,
            stdin: question?.testCases?.[0]?.input || "",
          }),
        },
      );
      const { token } = await submitRes.json();


      let output = null;
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        const pollRes = await fetch(
          `http://localhost:2358/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              "X-RapidAPI-Key": rapidApiKey,
              "X-RapidAPI-Host": "judge0-extra-ce1.p.rapidapi.com",
            },
          },
        );
        const data = await pollRes.json();
        if (data.status?.id > 2) {
          output = data;
          break;
        }
      }

      if (!output) throw new Error("Timeout");

      const expected = question?.testCases?.[0]?.expectedOutput?.trim();
      const actual = (output.stdout || "").trim();
      const passed = expected && actual === expected;

      setResult({
        status: output.status?.description || "Unknown",
        stdout: output.stdout || "",
        stderr: output.stderr || output.compile_output || "",
        time: output.time,
        memory: output.memory,
        passed,
        expected,
      });
    } catch (err) {
      setResult({ status: "Error", stderr: err.message });
    } finally {
      setRunning(false);
    }
  }, [code, language, question]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    if (question) setCode(question.starterCode?.[language] || "");
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  const diffColors = {
    Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Hard: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white  flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0d0d14]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-500 hover:text-white text-xs transition-colors"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <span className="text-white/10">|</span>
          <span className="text-sm font-semibold text-white truncate max-w-xs">
            {question.title}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border ${diffColors[question.difficulty] || ""}`}
          >
            {question.difficulty}
          </span>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
          >
            {Object.keys(LANGUAGE_IDS).map((l) => (
              <option key={l} value={l} className="bg-[#1a1a2e]">
                {l}
              </option>
            ))}
          </select>
          <button
            onClick={resetCode}
            title="Reset"
            className="p-1.5 text-gray-500 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={copyCode}
            title="Copy"
            className="p-1.5 text-gray-500 hover:text-white transition-colors"
          >
            {copied ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
          <button
            onClick={runCode}
            disabled={running}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs px-4 py-1.5 rounded-lg font-semibold transition-all"
          >
            {running ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Play size={13} />
            )}
            {running ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* ── Main split layout ── */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ height: "calc(100vh - 57px)" }}
      >

        <div className="w-[42%] flex flex-col border-r border-white/5 overflow-hidden">
          <div className="flex border-b border-white/5">
            {tabConfig.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs transition-colors ${
                  activeTab === t.id
                    ? "text-indigo-400 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <t.icon size={12} />
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 text-sm">
            {/* Description tab */}
            {activeTab === "description" && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-lg font-bold text-white mb-1">
                    {question.title}
                  </h1>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[10px] text-gray-500 border border-white/5 px-2 py-0.5 rounded-full">
                      {question.platform}
                    </span>
                    {question.tags?.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] text-gray-600 border border-white/5 px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed text-xs">
                  {question.description}
                </p>

                {question.examples?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-widest text-gray-600">
                      Examples
                    </h3>
                    {question.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-xs space-y-2"
                      >
                        <div>
                          <span className="text-gray-500">Input: </span>
                          <span className="text-indigo-300">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Output: </span>
                          <span className="text-emerald-300">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-gray-500 italic">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {question.constraints?.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-gray-600 mb-2">
                      Constraints
                    </h3>
                    <ul className="space-y-1">
                      {question.constraints.map((c, i) => (
                        <li
                          key={i}
                          className="text-xs text-gray-400 flex items-start gap-2"
                        >
                          <span className="text-indigo-500 mt-0.5">·</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {question.testCases?.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-gray-600 mb-2">
                      Test Cases
                    </h3>
                    <div className="space-y-2">
                      {question.testCases.map((tc, i) => (
                        <div
                          key={i}
                          className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-xs"
                        >
                          <div>
                            <span className="text-gray-500">In: </span>
                            <span className="text-blue-300">{tc.input}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Expected: </span>
                            <span className="text-emerald-300">
                              {tc.expectedOutput}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Solution tab */}
            {activeTab === "solution" && (
              <div className="space-y-4">
                <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 text-xs text-amber-300">
                  Try solving it yourself first! The solution is hidden until
                  you reveal it.
                </div>
                {!showSolution ? (
                  <button
                    onClick={() => setShowSolution(true)}
                    className="w-full py-3 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 text-xs transition-all"
                  >
                    Reveal Solution
                  </button>
                ) : (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      Solution in {language}:
                    </p>
                    <pre className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                      {question.solution?.[language] ||
                        "No solution available for this language."}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === "output" && (
              <div className="space-y-4">
                {!result && !running && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Terminal size={32} className="text-white/10 mb-3" />
                    <p className="text-gray-600 text-xs">
                      Run your code to see output
                    </p>
                  </div>
                )}
                {running && (
                  <div className="flex items-center gap-2 text-indigo-400 text-xs py-8 justify-center">
                    <Loader2 size={16} className="animate-spin" /> Executing
                    code...
                  </div>
                )}
                {result && !running && (
                  <div className="space-y-4">
                    {/* Status */}
                    <div
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold ${
                        result.status === "simulated"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          : result.passed
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      }`}
                    >
                      {result.status === "simulated" ? (
                        <Terminal size={16} />
                      ) : result.passed ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                     {result.status === "simulated" ? "Simulation Mode" : result.passed ? "Accepted" : "Wrong Answer"}
                      {result.time && result.time !== "~" && (
                        <span className="ml-auto text-xs font-normal text-gray-500">
                          {result.time}s · {result.memory} KB
                        </span>
                      )}
                    </div>
                    {/* stdout */}
                    {result.stdout && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1 uppercase tracking-widest">
                          Output
                        </p>
                        <pre className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-xs text-white overflow-x-auto whitespace-pre-wrap">
                          {result.stdout}
                        </pre>
                      </div>
                    )}
                    {/* expected */}
                    {result.expected && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1 uppercase tracking-widest">
                          Expected
                        </p>
                        <pre className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-xs text-emerald-300 overflow-x-auto">
                          {result.expected}
                        </pre>
                      </div>
                    )}
                    {/* stderr */}
                    {result.stderr && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1 uppercase tracking-widest">
                          Error
                        </p>
                        <pre className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 text-xs text-rose-300 overflow-x-auto whitespace-pre-wrap">
                          {result.stderr}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — Monaco Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={LANGUAGE_DEFAULTS[language] || "cpp"}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "gutter",
                padding: { top: 16, bottom: 16 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
