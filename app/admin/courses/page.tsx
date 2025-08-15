"use client"

import { useEffect } from "react"

import { useSelector } from "react-redux"
import { redirect } from "next/navigation"
import { CourseManagement } from "@/components/course-managment"
import Navbar from "@/Layout/Navbar"
import { RootState } from "@/redux/store"


export default function AdminDashboard() {
  const token = useSelector((state: RootState) => state.lmsAuth.token)


  useEffect(() => {
    if(!token) {
      redirect("/");
    } else{
      
    }
  }, [token]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <CourseManagement />
      </main>
    </div>
  )
}
