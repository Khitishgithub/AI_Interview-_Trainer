"use client"


import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Header = () => {
  const path= usePathname();
  useEffect(()=>{
    console.log(path);

  })
  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-md">
      <Image src={"/logo.svg"} width={100} height={30} alt="logo" />
      <ul className=" hidden md:flex gap-6">
        <li className={` text-black-900  font-bold transition cursor-pointer
          ${path=='/dashboard' && 'text-primary font-bold'}`
        }>Dashboard</li>
        
        <li className={`text-black-900  font-bold transition cursor-pointer
          ${path=='/dashboard/interview/' && 'text-primary font-bold'}`
        }>Questions</li>
       
      
        
      </ul>
      <UserButton />
    </div>
  );
};

export default Header;