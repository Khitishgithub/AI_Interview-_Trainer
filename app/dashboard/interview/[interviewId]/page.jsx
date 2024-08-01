"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { mockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null); // Initialize with null
  const [webcamEnable, setWebcamEnable] = useState(false);

  useEffect(() => {
    console.log(params.interviewId);
    GetinterviewDetails();
  }, []); // Add params.interviewId to dependency array

  const GetinterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(mockInterview)
        .where(eq(mockInterview.mockId, params.interviewId));

      console.log("Raw Result:", result); // Check the raw result
      if (result.length > 0) {
        console.log("Interview Data:", result[0]); // Check the specific result object
        setInterviewData(result[0]);
      } else {
        console.warn("No data found for the provided interview ID");
        setInterviewData({});
      }
    } catch (error) {
      console.error("Failed to fetch interview details", error);
    }
  };

  return (
    <div className="my-10 flex justify-center flex-col items-center">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-10 ">
          <div className="flex flex-col p-5 rounded-lg border gap-5">
            <h2 className="text-lg">
              <strong>Job Role/Job Position: </strong>
              {interviewData ? interviewData.jobPosition : "Loading..."}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description: </strong>
              {interviewData ? interviewData.jobDesc : "Loading..."}
            </h2>
            <h2 className="text-lg">
              <strong>Year of Experience: </strong>
              {interviewData ? interviewData.jobExperience : "Loading..."}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-blue-300 bg-blue-100">
            <h2 className="flex gap-2 items-center text-red-900">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="text-blue-800">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>
        <div>
          {webcamEnable ? (
            <Webcam
              onUserMedia={() => setWebcamEnable(true)}
              onUserMediaError={() => setWebcamEnable(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button variant="outline" onClick={() => setWebcamEnable(true)}>
                Activate WebCam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-start items-start mt-10">
        <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
