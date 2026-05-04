"use client";

import React, { useState, useRef } from "react";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendPrompt, sendPromptWithPDF } from "@/utils/GeminiAIModel";
import { LoaderCircle, Upload, X, FileText, ClipboardList } from "lucide-react";
import { mockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState("form"); // "form" | "resume"

  // Form mode state
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");

  // Resume mode state
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
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setMode("form");
    setJobPosition("");
    setJobDesc("");
    setJobExperience("");
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

      const resp = await db
        .insert(mockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: mockJsonResp,
          jobPosition: mode === "resume" ? "From Resume" : jobPosition,
          jobDesc: mode === "resume" ? resumeFile.name : jobDesc,
          jobExperience: mode === "resume" ? "N/A" : jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({ mockId: mockInterview.mockId });

      if (resp) {
        handleClose();
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const canSubmit =
    mode === "form"
      ? jobPosition && jobDesc && jobExperience
      : !!resumeFile;

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-102 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-center font-bold text-lg">👉 Add New</h2>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Set up your interview
            </DialogTitle>
            <DialogDescription>
              Choose how you want to get started.
            </DialogDescription>
          </DialogHeader>

          {/* ── Mode toggle ── */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={() => setMode("form")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                mode === "form"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 border-2"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <ClipboardList size={16} />
              Fill in details
            </button>
            <button
              type="button"
              onClick={() => setMode("resume")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                mode === "resume"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 border-2"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <FileText size={16} />
              Upload resume
            </button>
          </div>

          <form onSubmit={onSubmit}>
            {/* ── Form mode ── */}
            {mode === "form" && (
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-sm font-bold text-black block mb-1">
                    Job role / position
                  </label>
                  <Input
                    placeholder="Ex. Full Stack Developer"
                    required
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-black block mb-1">
                    Job description / tech stack
                  </label>
                  <Textarea
                    placeholder="Ex. React, Next.js, Angular, MySQL etc."
                    required
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-black block mb-1">
                    Years of experience
                  </label>
                  <Input
                    placeholder="Ex. 5"
                    type="number"
                    max="50"
                    required
                    value={jobExperience}
                    className="w-32"
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── Resume mode ── */}
            {mode === "resume" && (
              <div className="mt-2">
                {!resumeFile ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleFileChange(e.dataTransfer.files[0]);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mx-auto mb-3 text-gray-400" size={32} />
                    <p className="text-sm font-medium text-gray-700">
                      Drop your resume PDF here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      or click to browse — PDF only
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 mt-2">
                    <FileText size={20} className="text-red-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                      {resumeFile.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {(resumeFile.size / 1024).toFixed(0)} KB
                    </span>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Questions will be generated entirely from your resume content.
                </p>
              </div>
            )}

            {/* ── Actions ── */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !canSubmit}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2" size={16} />
                    Generating...
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;