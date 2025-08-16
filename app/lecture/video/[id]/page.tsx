'use client'

import LecturePage from "@/LocalComponent/lecture-page";
import { useParams } from "next/navigation";


export default function LecturePageRoute() {
  const params = useParams();
      const id = params.id as string;
      
  return (
    <main className="min-h-screen bg-background">
      <LecturePage courseId={id} />
    </main>
  )
}
