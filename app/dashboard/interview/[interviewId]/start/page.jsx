"use client";

import { db } from "@/utils/db";
import { mockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useState, useEffect } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StartInterview = ({ params }) => {
  const { interviewId } = params;

  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(mockInterview)
        .where(eq(mockInterview.mockId, interviewId));

      if (!result || result.length === 0) {
        setError("Interview not found.");
        return;
      }

      const parsed = JSON.parse(result[0].jsonMockResp);

      const normalized = Array.isArray(parsed)
        ? { questions: parsed }
        : parsed?.questions
        ? parsed
        : { questions: [] };

      setMockInterviewQuestions(normalized);
      setInterviewData(result[0]);
    } catch (err) {
      console.error("Failed to load interview:", err);
      setError("Failed to load interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 animate-pulse">Loading interview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const totalQuestions = mockInterviewQuestions?.questions?.length ?? 0;
  const isFirst = activeQuestionIndex === 0;
  const isLast = activeQuestionIndex === totalQuestions - 1;

  return (
    <div>
      {/* ── Progress bar ── */}
      {totalQuestions > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Question {activeQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {interviewData?.jobPosition}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${((activeQuestionIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
          {/* ── Dot indicators ── */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {mockInterviewQuestions.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`w-7 h-7 rounded-full text-xs font-medium transition-all ${
                  idx === activeQuestionIndex
                    ? "bg-indigo-500 text-white scale-110"
                    : idx < activeQuestionIndex
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Main panels ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      {/* ── Navigation ── */}
      {totalQuestions > 0 && (
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => setActiveQuestionIndex((i) => i - 1)}
            disabled={isFirst}
            className={isFirst ? "invisible" : ""}
          >
            ← Previous
          </Button>

          {isLast ? (
            <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                End Interview
              </Button>
            </Link>
          ) : (
            <Button onClick={() => setActiveQuestionIndex((i) => i + 1)}>
              Next →
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default StartInterview;