"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { sendPrompt } from "@/utils/GeminiAIModel";

const RecordAnswerSection = ({ mockInterviewQuestions, activeQuestionIndex, interviewData }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  // 🔧 FIX 2: ref to prevent the useEffect from double-saving
  const justStoppedRef = useRef(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  // 🔧 FIX 2: only save when we explicitly stopped recording
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10 && justStoppedRef.current) {
      justStoppedRef.current = false;
      UpdateUserAnswer();
    }
  }, [isRecording, userAnswer]);

  const StartStopRecording = () => {
    if (isRecording) {
      justStoppedRef.current = true; // mark intentional stop
      stopSpeechToText();
    } else {
      setUserAnswer(""); // clear previous answer on new recording
      setResults([]);
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    if (loading) return;
    setLoading(true);
    console.log("Saving answer:", userAnswer);

    const feedbackPrompt = `
      Question: ${mockInterviewQuestions?.questions[activeQuestionIndex]?.question},
      User Answer: ${userAnswer},
      Depends on question and user answer for given interview question
      please give us rating for answer and feedback as area of improvement if any
      in just 3 to 5 lines to improve it in JSON format with rating field and feedback field.
      Return ONLY valid JSON, no markdown, no backticks.
      Example: {"rating": "7/10", "feedback": "Good answer but could improve on..."}
    `;

    try {
      const result = await sendPrompt(feedbackPrompt);

      // 🔧 FIX 3: strip ALL markdown fences before parsing
      const cleaned = result
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      const JsonFeedbackResp = JSON.parse(cleaned);
      console.log("Feedback:", JsonFeedbackResp);

      // 🔧 FIX 1: use mockInterviewQuestions?.questions[i] (not [i] directly)
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestions?.questions[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestions?.questions[activeQuestionIndex]?.answer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userAns: userAnswer,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      });

      if (resp) {
        toast("User Answer recorded successfully!");
        setUserAnswer("");
        setResults([]);
      }
    } catch (e) {
      console.error("Failed to save answer:", e);
      toast("Error saving your answer, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center bg-black">
        <Image src={"/webcam_logo.png"} width={200} height={150} alt="Webcam" />
        <Webcam
          mirrored={true}
          style={{ height: 300, width: "100%", zIndex: 10 }}
        />
      </div>

      {/* 🔧 FIX 4: show a string label, not a function reference */}
      <Button
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
        disabled={loading}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2 items-center">
            <MicOff className="h-4 w-4" /> Stop Recording...
          </h2>
        ) : (
          <h2 className="flex gap-2 items-center">
            <Mic className="h-4 w-4" />
            {loading ? "Saving..." : "Record Answer"}
          </h2>
        )}
      </Button>

      {interimResult && (
        <p className="text-sm text-gray-500 italic px-4 text-center">
          {interimResult}
        </p>
      )}
    </div>
  );
};

export default RecordAnswerSection;