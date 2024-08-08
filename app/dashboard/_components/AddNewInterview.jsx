"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { mockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    console.log(jobPosition, jobDesc, jobExperience);
    const InputPrompt = `Job position: ${jobPosition} Job Description: ${jobDesc}; Years of Experience: ${jobExperience}. Based on the job position, job description, and years of experience, provide ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions along with answers in JSON format. Include questions and answers fields in JSON. Only give questions and answers dont give any further explanantion.`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const textResult = await result.response.text();
      const mockJsonResp = textResult.replace('```json', '').replace('```', '').trim();
      
      console.log(mockJsonResp); // Log the raw JSON string to debug

      try {
        const parsedJson = JSON.parse(mockJsonResp);
        console.log(parsedJson);
        setJsonResponse(parsedJson);
        
        const resp = await db.insert(mockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: mockJsonResp,
            jobPosition,
            jobDesc,
            jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
          })
          .returning({
            mockId: mockInterview.mockId
          });

        console.log("Inserted ID:", resp);
        if(resp){
          setOpenDialog(false);
          router.push('/dashboard/interview/'+resp[0]?.mockId);
        }
      } catch (jsonParseError) {
        console.error("JSON Parse Error:", jsonParseError);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-102 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-center font-bold text-lg">👉Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-sm md:text-2xl">
              Tell us about your interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2 >
                    Add Details about your job position/role, job description
                  </h2>
                  <div className="mt-7 my-2 ">
                    <label className="text-black font-bold">Job Role/Job Position :</label>
                    <Input className="my-2"
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label  className="text-black font-bold">Job Description/Tech Stack (In Short)</label>
                    <Textarea className="my-2"
                      placeholder="Ex. React, Next, Angular, MySQL etc"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label  className="text-black font-bold">Years of Experience</label>
                    <Input className="my-2"
                      placeholder="Ex. 5"
                      type="number"
                      max="50"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                  <div className="flex gap-5 justify-end text-black">
                    <Button variant="outline" onClick={() => setOpenDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <LoaderCircle className="animate-spin" /> 'Generating from AI'
                        </>
                      ) : (
                        "Start Interview"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
