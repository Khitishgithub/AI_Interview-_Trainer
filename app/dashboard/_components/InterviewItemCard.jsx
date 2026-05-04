import { Button } from '@/components/ui/button';
import { CalendarDays, Briefcase, Play, ClipboardCheck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const InterviewItemCard = ({ interview }) => {
  return (
    <div className='group relative'>
      {/* Outer Glow Effect (Behind Card) */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      
      {/* Main Card */}
      <div className='relative bg-[#0f172a]/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 transition-all duration-300 group-hover:border-slate-700 shadow-xl'>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h2 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-300'>
              {interview?.jobPosition}
            </h2>
            <div className='flex items-center gap-2 text-slate-400'>
              <Briefcase size={14} className="text-indigo-400" />
              <span className='text-xs font-medium tracking-wide uppercase'>
                {interview?.jobExperience} Yrs Experience
              </span>
            </div>
          </div>
          
          {/* Subtle Icon Badge */}
          <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700 text-slate-400 group-hover:text-indigo-400 transition-colors">
            <ArrowUpRight size={18} />
          </div>
        </div>

        {/* Date Section */}
        <div className='flex items-center gap-2 text-slate-500 mb-6'>
          <CalendarDays size={14} />
          <span className='text-[11px]'>Recorded: {interview.createdAt}</span>
        </div>

        {/* Action Buttons: The "Glass" Style */}
        <div className='flex items-center gap-4'>
          <Link href={"/dashboard/interview/" + interview?.mockId} className="flex-1">
            <Button 
              size="sm" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] flex gap-2"
            >
              <Play size={14} fill="currentColor" /> Start
            </Button>
          </Link>
          
          <Link href={"/dashboard/interview/" + interview?.mockId + "/feedback"} className="flex-1">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-slate-700 bg-transparent text-slate-300 font-bold rounded-xl  hover:border-slate-600 transition-all flex gap-2"
            >
              <ClipboardCheck size={14} /> Feedback
            </Button>
          </Link>
        </div>

        {/* Bottom Decorative Shimmer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}

export default InterviewItemCard;