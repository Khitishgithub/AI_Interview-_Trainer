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

const RecordAnswerSection = ({
  mockInterviewQuestions,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const shouldSubmit = useRef(false);

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
    speechRecognitionProperties: {
      lang: "en-US",
      interimResults: true,
    },
  });

  // Catch any speech recognition errors
  useEffect(() => {
    if (error) {
      console.error("🔴 [SPEECH ERROR]:", error);
      toast(`Microphone error: ${error}`);
    }
  }, [error]);

  // Accumulate transcript results into userAnswer
  useEffect(() => {
    if (results.length === 0) return;
    console.log("🎙️ [SPEECH] New results:", results);
    results.forEach((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  // Log interim results to confirm mic is hearing audio
  useEffect(() => {
    if (interimResult) {
      console.log("🎤 [INTERIM]:", interimResult);
    }
  }, [interimResult]);

  // Submit only when recording has fully stopped and answer is long enough
  useEffect(() => {
    console.log(
      "📝 [ANSWER] userAnswer:",
      userAnswer,
      "| length:",
      userAnswer.length,
      "| shouldSubmit:",
      shouldSubmit.current,
      "| isRecording:",
      isRecording
    );
    if (!isRecording && shouldSubmit.current && userAnswer.length > 10) {
      console.log("✅ [TRIGGER] Calling UpdateUserAnswer");
      shouldSubmit.current = false;
      UpdateUserAnswer();
    }
  }, [isRecording, userAnswer]);

  const StartStopRecording = () => {
    if (isRecording) {
      console.log("⏹️ [RECORD] Stop clicked");
      shouldSubmit.current = true;
      stopSpeechToText();
    } else {
      console.log("▶️ [RECORD] Start clicked — resetting answer");
      setUserAnswer("");
      setResults([]);
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    console.log("🚀 [SAVE] UpdateUserAnswer started, answer:", userAnswer);

    if (userAnswer.length < 10) {
      console.warn("⚠️ [SAVE] Answer too short — aborting");
      toast("Answer too short. Please record again.");
      return;
    }

    setLoading(true);

    const currentQuestion =
      mockInterviewQuestions?.questions?.[activeQuestionIndex];

    console.log("📌 [SAVE] currentQuestion:", currentQuestion);
    console.log("📌 [SAVE] mockId:", interviewData?.mockId);
    console.log("📌 [SAVE] userEmail:", user?.primaryEmailAddress?.emailAddress);

    if (!currentQuestion) {
      console.error("❌ [SAVE] currentQuestion is undefined — check mockInterviewQuestions shape:", mockInterviewQuestions);
      toast("Could not find question. Please try again.");
      setLoading(false);
      return;
    }

    const feedbackPrompt = `
      Question: ${currentQuestion?.question}
      User Answer: ${userAnswer}
      Based on the question and user answer for this interview question,
      please give a rating for the answer and feedback as areas of improvement
      in just 3 to 5 lines in JSON format with exactly these two fields:
      "rating" (a number from 1-10) and "feedback" (a string).
      Return only the JSON object, no extra text.
    `;

    console.log("📤 [GEMINI] Sending prompt...");

    try {
      const result = await sendQuestions(feedbackPrompt);
      console.log("📥 [GEMINI] Raw result:", result);

      const mockJsonResp = result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      console.log("🧹 [GEMINI] Cleaned JSON:", mockJsonResp);

      const JsonFeedbackResp = JSON.parse(mockJsonResp);
      console.log("✅ [GEMINI] Parsed:", JsonFeedbackResp);

      const insertPayload = {
        mockIdRef: interviewData?.mockId,
        question: currentQuestion?.question,
        correctAns: currentQuestion?.answer,
        feedback: JsonFeedbackResp?.feedback,
        rating: String(JsonFeedbackResp?.rating),
        userAns: userAnswer,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      };

      console.log("💾 [DB] Inserting payload:", insertPayload);

      await db.insert(UserAnswer).values(insertPayload);

      console.log("💾 [DB] Insert successful!");
      toast("Answer recorded successfully!");
      setResults([]);
      setUserAnswer("");
    } catch (e) {
      console.error("❌ [ERROR] Full error:", e);
      console.error("❌ [ERROR] Message:", e?.message);
      toast("Error saving your answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center bg-black rounded-xl overflow-hidden">
        <Image
          src={"/webcam_logo.png"}
          width={200}
          height={150}
          alt="Webcam"
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{ height: 300, width: "100%", zIndex: 10 }}
        />
      </div>

      <Button
        variant="outline"
        className="my-10 text-black"
        onClick={StartStopRecording}
        disabled={loading}
      >
        {isRecording ? (
          <span className="text-red-600 flex gap-2 items-center">
            <MicOff size={16} /> Stop Recording...
          </span>
        ) : (
          <span className="flex gap-2 items-center">
            <Mic size={16} /> {loading ? "Saving..." : "Record Answer"}
          </span>
        )}
      </Button>

      {/* Live interim transcript while speaking */}
      {interimResult && (
        <p className="text-sm text-gray-400 italic px-4 text-center animate-pulse">
          {interimResult}
        </p>
      )}

      {/* Accumulated answer so far */}
      {userAnswer && (
        <p className="text-sm text-gray-300 px-4 text-center mt-2 max-w-lg">
          <span className="font-semibold text-white">Your answer: </span>
          {userAnswer}
        </p>
      )}

      {/* Loading indicator */}
      {loading && (
        <p className="text-sm text-indigo-400 mt-3 animate-pulse">
          Analyzing your answer...
        </p>
      )}
    </div>
  );
};

export default RecordAnswerSection;