'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CourseForm from './CourseForm';

import { useState } from 'react';
import Link from 'next/link';

import { Edit, Trash2 } from 'lucide-react';
import { Course, useDeleteCourseMutation, useGetCoursesQuery } from '@/redux/features/course/course';

export function CourseManagement() {
  const { data: courses = [], isLoading, error } = useGetCoursesQuery();
  // console.log(courses)
  const [deleteCourse] = useDeleteCourseMutation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseForContent, setSelectedCourseForContent] = useState<Course | null>(null);

  // Handle content management navigation
  const handleManageContent = (course: Course) => {
    setSelectedCourseForContent(course);
  };

  // Handle course deletion
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId).unwrap();
    } catch (err) {
      console.error('Failed to delete course:', err);
      alert('Failed to delete course. Please try again.');
    }
  };

  // Render content management view (placeholder)
  if (selectedCourseForContent) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedCourseForContent(null)}
            className="hover:bg-gray-100"
          >
            ← Back to Courses
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedCourseForContent.title}</h2>
            <p className="text-gray-600 text-sm">Manage course content</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p>Course content management for {selectedCourseForContent.title} (ModuleLectureManagement not implemented)</p>
        </div>
      </div>
    );
  }

  // Handle loading and error states
  if (isLoading) return <div className="text-center text-gray-600">Loading courses...</div>;
  if (error) return <div className="text-center text-red-500">Error loading courses: {JSON.stringify(error)}</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Create Course Button */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Course Management</h2>
          <p className="text-gray-600 text-sm">Create, edit, and manage your course catalog</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hover:bg-primary-600">Create New Course</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new course to your catalog</DialogDescription>
            </DialogHeader>
            <CourseForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-gray-600 text-sm">Total Courses</p>
          </CardContent>
        </Card>
        {/* <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {courses.filter((c) => c.status === 'published').length}
            </div>
            <p className="text-gray-600 text-sm">Published</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {courses.filter((c) => c.status === 'draft').length}
            </div>
            <p className="text-gray-600 text-sm">Drafts</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {courses.reduce((sum, c) => sum + (c.students ?? 0), 0)}
            </div>
            <p className="text-gray-600 text-sm">Total Students</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course._id}
            className="bg-white border p-0 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="relative">
                <img
                  src={course?.thumbnail}
                  alt={course?.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  // onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                />
                <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs font-semibold px-0 py-1 rounded">
                  ${course.price}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-gray-900 truncate">{course.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
              </div>
              <div className="flex flex-col gap-2">
                {/* <Link
                  href={`/admin/courses/${course._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View Course Details
                </Link> */}
                <Link
                  href={`/admin/courses/${course._id}`}
                  className="text-blue-600 underline hover:text-blue-800 font-medium text-sm"
                >
                  Manage Modules & Lectures
                </Link>
              </div>
              <div className="flex gap-2 flex-wrap">
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsEditDialogOpen(true);
                  }}
                  className="flex items-center gap-1 border-gray-300 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteCourse(course._id)}
                  className="flex items-center gap-1 border-gray-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course information</DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <CourseForm
              initialData={selectedCourse}
              courseId={selectedCourse.id}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedCourse(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}