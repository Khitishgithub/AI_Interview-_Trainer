"use client";

import React, { useState, useRef } from "react";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendPrompt, sendPromptWithPDF } from "@/utils/GeminiAIModel";
import { LoaderCircle, Upload, X, FileText, ClipboardList, Plus, Sparkles, Terminal } from "lucide-react";
import { mockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState("form");
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const { user } = useUser();

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = (file) => {
    if (file && file.type === "application/pdf") setResumeFile(file);
    else alert("Please upload a PDF file.");
  };

  const handleClose = () => {
    setOpenDialog(false);
    setMode("form");
    setJobPosition(""); setJobDesc(""); setJobExperience("");
    setResumeFile(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let rawResult;
      if (mode === "resume") {
        const pdfBase64 = await fileToBase64(resumeFile);
        const prompt = `The candidate's resume is attached. Based on their experience and skills in the resume, generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} relevant interview questions with answers in JSON. Return only a JSON object with a key "questions" containing an array of objects, each with "question" and "answer" fields.`;
        rawResult = await sendPromptWithPDF(prompt, pdfBase64);
      } else {
        const prompt = `Job position: ${jobPosition}. Job Description: ${jobDesc}. Years of Experience: ${jobExperience}. Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON. Return only a JSON object with a key "questions" containing an array of objects, each with "question" and "answer" fields.`;
        rawResult = await sendPrompt(prompt);
      }
      const mockJsonResp = rawResult.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedJson = JSON.parse(mockJsonResp);
      const resp = await db.insert(mockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: mockJsonResp,
        jobPosition: mode === "resume" ? "From Resume" : jobPosition,
        jobDesc: mode === "resume" ? resumeFile.name : jobDesc,
        jobExperience: mode === "resume" ? "N/A" : jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      }).returning({ mockId: mockInterview.mockId });
      if (resp) { handleClose(); router.push("/dashboard/interview/" + resp[0]?.mockId); }
    } catch (error) { console.error("Error:", error); }
    setLoading(false);
  };

  const canSubmit = mode === "form" ? jobPosition && jobDesc && jobExperience : !!resumeFile;

  return (
    <>
      {/* ── Trigger Card ── */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpenDialog(true)}
        className="group relative cursor-pointer h-[160px] rounded-2xl overflow-hidden border border-white/6 bg-[#0a0a12]"
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ backgroundImage: "linear-gradient(90deg, transparent, #818cf8, transparent)" }}
        />
        {/* Inner glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ background: "radial-gradient(500px circle at 50% 0%, rgba(99,102,241,0.08), transparent 70%)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
            <Plus size={22} className="text-indigo-400" />
          </div>
          <div className="text-center">
            <p
              className="text-white text-sm font-black uppercase tracking-widest group-hover:text-indigo-300 transition-colors"
              
            >
              New Interview
            </p>
            <p className="text-white text-[10px]  mt-0.5">Start a session</p>
          </div>
        </div>
        {/* Bottom shimmer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* ── Dialog ── */}
      <Dialog open={openDialog} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-2xl bg-[#07070f] border border-white/8 text-white rounded-3xl shadow-2xl shadow-black/60 p-0 overflow-hidden">

          {/* Top gradient bar */}
          <div className="h-[2px] w-full shrink-0" style={{ backgroundImage: "linear-gradient(90deg, #4f46e5, #7c3aed, #db2777)" }} />

          <div className="px-8 py-7">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Terminal size={13} className="text-indigo-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Interview Setup</span>
              </div>
              <DialogTitle
                className="text-white text-2xl font-black"
                
              >
                Configure Session
              </DialogTitle>
              <DialogDescription className="text-white text-xs  mt-1">
                Choose how to generate your interview questions
              </DialogDescription>
            </DialogHeader>

            {/* ── Mode toggle ── */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { key: "form", icon: ClipboardList, label: "Fill Details" },
                { key: "resume", icon: FileText, label: "Upload Resume" },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key)}
                  className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                    mode === key
                      ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                      : "border-white/6 bg-white/[0.02] text-white hover:border-white/12 hover:text-white"
                  }`}
                  
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit}>
              <AnimatePresence mode="wait">
                {/* ── Form mode ── */}
                {mode === "form" && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4"
                  >
                    {[
                      { label: "Job Role / Position", placeholder: "Ex. Full Stack Developer", value: jobPosition, setter: setJobPosition, type: "input" },
                      { label: "Job Description / Tech Stack", placeholder: "Ex. React, Next.js, MySQL...", value: jobDesc, setter: setJobDesc, type: "textarea" },
                    ].map(({ label, placeholder, value, setter, type }) => (
                      <div key={label}>
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white block mb-1.5">
                          {label}
                        </label>
                        {type === "input" ? (
                          <Input
                            placeholder={placeholder}
                            required
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            className="bg-white/[0.03] border-white/8 text-white placeholder:text-white rounded-xl focus:border-indigo-500/50 focus:ring-0  text-sm"
                          />
                        ) : (
                          <Textarea
                            placeholder={placeholder}
                            required
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            className="bg-white/[0.03] border-white/8 text-white placeholder:text-white rounded-xl focus:border-indigo-500/50 focus:ring-0  text-sm resize-none"
                            rows={3}
                          />
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white block mb-1.5">
                        Years of Experience
                      </label>
                      <Input
                        placeholder="Ex. 5"
                        type="number"
                        max="50"
                        required
                        value={jobExperience}
                        onChange={(e) => setJobExperience(e.target.value)}
                        className="bg-white/[0.03] border-white/8 text-white placeholder:text-white rounded-xl focus:border-indigo-500/50 focus:ring-0  text-sm w-32"
                      />
                    </div>
                  </motion.div>
                )}

                {/* ── Resume mode ── */}
                {mode === "resume" && (
                  <motion.div
                    key="resume"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {!resumeFile ? (
                      <div
                        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                          isDragging
                            ? "border-indigo-500/60 bg-indigo-500/8"
                            : "border-white/8 hover:border-indigo-500/30 hover:bg-indigo-500/4"
                        }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files[0]); }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mx-auto mb-4">
                          <Upload size={22} className="text-indigo-400" />
                        </div>
                        <p className="text-white text-sm font-black uppercase tracking-widest mb-1" >
                          Drop Resume Here
                        </p>
                        <p className="text-white text-[11px] ">
                          or click to browse — PDF only
                        </p>
                        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden"
                          onChange={(e) => handleFileChange(e.target.files[0])} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/8 border border-emerald-500/20">
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <FileText size={16} className="text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-black truncate" >
                            {resumeFile.name}
                          </p>
                          <p className="text-emerald-600 text-[10px]  mt-0.5">
                            {(resumeFile.size / 1024).toFixed(0)} KB · Ready
                          </p>
                        </div>
                        <button type="button" onClick={() => setResumeFile(null)}
                          className="p-1.5 rounded-lg text-white hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-white  mt-3">
                      Questions will be generated from your resume content.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Actions ── */}
              <div className="flex justify-end gap-3 mt-7 pt-6 border-t border-white/6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl bg-white/4 border border-white/8 text-white hover:text-white hover:border-white/16 transition-colors text-xs font-bold uppercase tracking-widest"
                  
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  style={{
                    fontFamily: "'Courier New', monospace",
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  }}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" size={13} />
                      Generating...
                    </>
                  ) : (
                    <>
                      
                      Start Interview
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewInterview;