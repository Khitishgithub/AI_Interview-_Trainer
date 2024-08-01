import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const InterviewItemCard = ({interview}) => {
  return (
    <div>
        <div className='border shadow-sm rounded-lg p-3'>
            <h2 className='text-purple-500 font-bold'>{interview?.jobPosition}</h2>
            <h2 className='text-sm text-black'>{interview?.jobExperience} Years of Experience</h2>
            <h2 className='text-xs text-gray-400'>Created At :{interview.createdAt}</h2>
        </div>
        <div className='flex justify-between my-2 mt-2 gap-5'>
        <Link href={"dashboard/interview/"+interview?.mockId}  className="w-full">
          <Button size="sm" variant="outline"
         
          
          >Start</Button>
          </Link>
          <Link href={"dashboard/interview/"+interview?.mockId+"/feedback"} >
          <Button size="sm"  className="w-full" >Feedback</Button>
          </Link>
        </div>
      
    </div>
  );
}

export default InterviewItemCard;
