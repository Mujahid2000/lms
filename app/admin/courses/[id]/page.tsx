"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import ModuleForm from "@/LocalComponent/ModuleForm";
import LectureForm from "@/LocalComponent/Lecture";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import Navbar from "@/Layout/Navbar";
import { useGetModuleByIdQuery } from "@/redux/features/module/module";
import { useDeleteLectureMutation } from "@/redux/features/lecture/lecture";
import { RootState } from "@/redux/store";
import { Course } from "@/redux/features/course/course";


export interface Lecture {
  _id: string;
  moduleId: string;
  title: string;
  duration: number;
  videoUrl: string;
  notes: string[]; 
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  order: number;
  __v: number;
}

export interface Module {
  _id: string;
  course: string;
  title: string;
  moduleNumber: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lectures: Lecture[];
}

export default function ModuleLectureManagement() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isLectureDialogOpen, setIsLectureDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const params = useParams();
  const id = params.id as string;
  const { data: modules = [], isLoading: modulesLoading, refetch } = useGetModuleByIdQuery(id);
  const [deleteLecture, { isLoading: isDeleting, isSuccess, isError, error }] = useDeleteLectureMutation();
  const token = useSelector((state: RootState) => state.lmsAuth.token);


  if (modulesLoading) {
    return <div className="flex justify-center items-center">
      <svg className="animate-spin h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
    </div>;
  }

  const handleDeleteLecture = async (lectureId: string, moduleId: string) => {
    try {
      await deleteLecture(lectureId).unwrap();
      toast.success("Lecture deleted successfully!");
      refetch()
    } catch (err) {
      console.error("Error deleting lecture:", err);
      toast.error("Failed to delete lecture. Please try again.");
    }
  };

  const getTotalLectures = () => modules?.reduce((count, module) => count + module.lectures.length, 0) || 0;

  const getTotalDuration = () => {
    return (
      modules?.reduce((acc, module) => {
        return (
          acc +
          module.lectures.reduce((lacc, lecture) => {
            return lacc + (lecture.duration || 0); // Use 0 if duration is undefined
          }, 0)
        );
      }, 0) || 0
    );
  };

  const getPreviewCount = () =>
    modules?.reduce((count, module) => count + module.lectures.filter((l) => l.isPreview).length, 0) || 0;

  return (
    <div>
      <Navbar />
      <div className="space-y-6 px-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Course Content</h2>
            <p className="text-gray-600">Manage your course modules and lectures</p>
          </div>
        
<Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
  <DialogTrigger asChild>
    <Button
      onClick={() => {
        setIsEditMode(false);
        setSelectedModule(null);
      }}
    >
      Add Module
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{isEditMode ? "Edit Module" : "Create New Module"}</DialogTitle>
      <DialogDescription>
        {isEditMode ? "Update module information" : "Add a new module to your course"}
      </DialogDescription>
    </DialogHeader>
    <ModuleForm
      onSuccess={() => setIsModuleDialogOpen(false)} // Close dialog on success
      courseId={id}
    />
  </DialogContent>
</Dialog>
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{modules?.length || 0}</div>
              <p className="text-sm text-gray-600">Modules</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{getTotalLectures()}</div>
              <p className="text-sm text-gray-600">Lectures</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m
              </div>
              <p className="text-sm text-gray-600">Total Duration</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{getPreviewCount()}</div>
              <p className="text-sm text-gray-600">Preview Lectures</p>
            </CardContent>
          </Card>
        </div>

        {/* Modules and Lectures */}
        <Card>
          <CardHeader>
            <CardTitle>Course Modules</CardTitle>
            <CardDescription>Organize your course content into modules and lectures</CardDescription>
          </CardHeader>
          <CardContent>
            {modules?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No modules created yet</p>
                <Button onClick={() => setIsModuleDialogOpen(true)}>Create Your First Module</Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {modules?.map((module) => (
                  <AccordionItem key={module._id} value={`module-${module._id}`} className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{module.moduleNumber}</Badge>
                          <div className="text-left">
                            <h3 className="font-semibold">{module.title}</h3>
                            <p className="text-sm text-gray-600">{module.lectures.length} lectures</p>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        <p className="text-gray-600">{module.description}</p>

                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Lectures</h4>
                          <Dialog open={isLectureDialogOpen} onOpenChange={setIsLectureDialogOpen}>
  <DialogTrigger asChild>
    <Button
      size="sm"
      onClick={() => {
        setIsEditMode(false); // Set to false for creating a new lecture
        setSelectedLecture(null);
      }}
    >
      Add Lecture
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>{isEditMode ? "Edit Lecture" : "Create New Lecture"}</DialogTitle>
      <DialogDescription>
        {isEditMode ? "Update lecture information" : "Add a new lecture to this module"}
      </DialogDescription>
    </DialogHeader>
    <LectureForm
      onSuccess={() => setIsLectureDialogOpen(false)}
      initialData={selectedLecture ?? undefined}
      moduleId={module._id}
      refe={()=>refetch()}
    />
  </DialogContent>
</Dialog>
                        </div>

                        {module.lectures.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No lectures in this module</p>
                        ) : (
                          <div className="space-y-2">
                            {module?.lectures?.map((lecture, lectureIndex) => (
                              <div
                                key={lecture._id}
                                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                              >
                                <div className="flex items-center space-x-3">
                                  <Badge variant="secondary">{lectureIndex + 1}</Badge>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <h5 className="font-medium">{lecture.title}</h5>
                                    </div>
                                    <p className="text-sm text-gray-600">{lecture.duration || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedLecture(lecture); // Type error resolved by aligning interfaces
                                      setIsEditMode(true);
                                      setIsLectureDialogOpen(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteLecture(lecture._id, module._id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}