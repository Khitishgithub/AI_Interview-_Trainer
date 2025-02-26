"use client"
import { FingerprintIcon, LockIcon, BriefcaseIcon, UserIcon, AwardIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      title: "Realistic Interview Simulations",
      description: "Practice with AI-powered interviews that adapt to your responses and industry",
      icon: <BriefcaseIcon className="w-6 h-6 text-indigo-300" />
    },
    {
      title: "Personalized Feedback",
      description: "Receive detailed analysis on your performance, communication skills, and areas to improve",
      icon: <UserIcon className="w-6 h-6 text-indigo-300" />
    },
    {
      title: "Industry-Specific Training",
      description: "Prepare for interviews in tech specialized questions",
      icon: <AwardIcon className="w-6 h-6 text-indigo-300" />
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
       
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 pb-20">
          <div className="md:w-1/2">
            <div className="flex items-center mb-6">
              <FingerprintIcon className="text-indigo-400 w-10 h-10 mr-3" />
              <h2 className="text-white text-2xl font-bold">InterviewMaster</h2>
            </div>
            
            <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight mb-6">
              Master Your Interviews with <span className="text-indigo-300">AI-Powered</span> Practice
            </h1>
            
            <p className="text-indigo-100 text-lg mb-8">
              Prepare for your dream job with personalized mock interviews and real-time feedback powered by advanced AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-400 transition-colors"
              >
                <span>Start Practicing Now</span>
              </Link>
              
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-md bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-white/20 transition-colors"
              >
                <LockIcon className="w-4 h-4 mr-2" />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-video bg-indigo-800/50 rounded-xl overflow-hidden border border-indigo-600/40 shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="mx-auto w-20 h-20 bg-indigo-700/80 rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-indigo-200 font-medium mb-4">Ready for your practice interview?</p>
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-400 transition-colors">
                    Start Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-white text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-indigo-800/30 backdrop-blur-sm border border-indigo-700/30 rounded-xl p-6 hover:bg-indigo-800/40 transition-colors cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="w-12 h-12 bg-indigo-900/80 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-indigo-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="bg-indigo-800/20 backdrop-blur-sm border border-indigo-700/30 rounded-xl p-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-indigo-300 text-4xl font-bold mb-2">98%</p>
              <p className="text-white">Improved interview confidence</p>
            </div>
            <div>
              <p className="text-indigo-300 text-4xl font-bold mb-2">1000+</p>
              <p className="text-white">Interview questions</p>
            </div>
            <div>
              <p className="text-indigo-300 text-4xl font-bold mb-2">24/7</p>
              <p className="text-white">Practice availability</p>
            </div>
          </div>
        </div>
        
      
        <div className="text-center">
          <h2 className="text-white text-3xl font-bold mb-6">Ready to ace your next interview?</h2>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of job seekers who have improved their interview skills and landed their dream jobs.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-400 transition-colors"
          >
            <span>Create Free Account</span>
          </Link>
        </div>
      </div>
      
   
      <footer className="border-t border-indigo-800/30 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-indigo-300">
          <p>© 2025 InterviewMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}