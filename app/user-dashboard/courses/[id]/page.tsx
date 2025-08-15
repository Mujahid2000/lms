'use client'
import { Button } from '@/components/ui/button';
import { CourseDetails } from '@/LocalComponent/CourseDetails';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
    const params = useParams();
    const id = params.id as string;
    console.log(id)
    return (
        <main className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {/* <Button asChild variant="outline">
          <Link href="/">Course Details</Link>
        </Button> */}
        <Button>
          <Link href={`/lecture/video/${id}`}>Lecture Page</Link>
        </Button>
      </div>
      <CourseDetails id={id}/>
    </main>
    );
};

export default Page;