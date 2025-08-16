'use client'
import { Button } from '@/components/ui/button';
import Navbar from '@/Layout/Navbar';
import { CourseDetails } from '@/LocalComponent/CourseDetails';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
    const params = useParams();
    const id = params.id as string;
    // console.log(id)
    return (
        <main className="min-h-screen bg-background">
           <Navbar/>
      <div className="fixed top-25 right-4 z-50 flex gap-2">
       
        
      </div>
      <CourseDetails id={id}/>
    </main>
    );
};

export default Page;