'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/Layout/Navbar';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.lmsAuth.token)
  // const role = useSelector((state: RootState) => state.lmsAuth.user?.role)

 useEffect(() => {
    if(!token) {
      redirect("/");
    } else{
      
    }
  }, [token]);

  useEffect(() => {
    async function getData() {
      const url = 'https://learnig-management-server.vercel.app/api/courses';
      try {
        setIsLoading(true);
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        if (Array.isArray(result)) {
          setCourses(result);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center">
      <svg className="animate-spin h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
    </div>;;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div>
       <Navbar/>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      
      {courses.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 mb-4">No courses available</p>
        </div>
      ) : (
        courses.map((course) => (
          <Card key={course._id} className="max-w-md w-full">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={course.thumbnail || '/placeholder.svg'}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                
                
              </div>
              <div className="p-6 space-y-4">
                <h1 className="text-xl font-sans font-bold text-card-foreground">{course.title}</h1>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-sans font-bold text-card-foreground">
                    ${course.price.toFixed(2)}
                  </span>
                  <Button asChild>
                    <Link href={`/user-dashboard/courses/${course._id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
    </div>
  );
}