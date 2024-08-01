"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

const RecordAnswerSection = ({ mockInterviewQuestions, activeQuestionIndex, interviewData }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
    // if (userAnswer?.length < 10) {
    //   setLoading(false);
    //   toast("Error while saving your answer, please record again");
    //   return;
    // }
  }, [userAnswer]);

  const StartStopRecording = () => {
    if (isRecording) {
    
      stopSpeechToText()

     
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    const feedbackPrompt = `
      Question: ${mockInterviewQuestions[activeQuestionIndex]?.question},
      User Answer: ${userAnswer},
      Depends on question and user answer for given interview question
      please give us rating for answer and feedback as area of improvement if any
      in just 3 to 5 lines to improve it in JSON format with rating field.
    `;
    const result = await chatSession.sendMessage(feedbackPrompt);

    let mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    try {
      const JsonFeedbackResp = JSON.parse(mockJsonResp);
      console.log(JsonFeedbackResp);
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestions[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userAns: userAnswer,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY')
      });
      if (resp) {
        toast('User Answer recorded successfully!!');
        setUserAnswer('');
        setResults([]);

      }
      setResults([]);
     
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error("Failed to parse JSON:", e, mockJsonResp);
      toast("Error parsing the response. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center bg-black" >
        <Image src={"/webcam_logo.png"} width={200} height={150} alt="Webcam" />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording ? stopSpeechToText : startSpeechToText}

        {isRecording ? (
          <h2 className="text-red-600 flex gap-2">
            <Mic /> ' Stop Recording.....'
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
     
    </div>
  );
};

export default RecordAnswerSection;