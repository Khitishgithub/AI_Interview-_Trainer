import { UserButton } from '@clerk/nextjs';
import React from 'react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/interviewList';

const Dashboard = () => {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2>Createw and Start your AI Mock up interview</h2>
      <div className='grid grid-cols-1 md:gris-cols-3 my-5'>
        <AddNewInterview/>
      </div>
      <div>
        <InterviewList/>

      
      </div>
      
    
      
    </div>
  );
}

export default Dashboard;
