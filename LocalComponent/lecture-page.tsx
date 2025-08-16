"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Download,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { LectureDataResponse, useUpdateLectureStatusMutation } from "@/redux/features/lecture/lecture";
import { Root2, useGetModuleByIdQuery } from "@/redux/features/module/module";

interface Lecture {
  _id: string;
  title: string;
  duration: number; // In seconds from API
  videoUrl: string;
  notes: string[];
  isCompleted: boolean;
  isUnlocked: boolean;
  order?: number; // Optional field from API
}

interface Module {
  _id: string;
  title: string;
  lectures: Lecture[];
  totalDuration?: number; // Changed from string to number to match calculated value
  completedCount?: number; // Calculated
  totalCount?: number; // Calculated
}

export default function LecturePage({ courseId }: { courseId: string }) {
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(["689f6a8244172477d16a9b89"]));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [modules, setModules] = useState<Module[]>([]);
  const [updateStatus] = useUpdateLectureStatusMutation();
  const { data: modulesData = [], isLoading: modulesLoading, error, refetch } = useGetModuleByIdQuery(courseId);

  // Sync modules with API data
  useEffect(() => {
    if (modulesData.length > 0) {
      const transformedModules = modulesData.map((module: Root2) => ({
        _id: module._id,
        title: module.title,
        lectures: module.lectures.map((lecture) => ({
          _id: lecture._id,
          title: lecture.title,
          duration: lecture.duration || 0,
          videoUrl: lecture.videoUrl,
          notes: lecture.notes || [],
          isCompleted: lecture.isCompleted,
          isUnlocked: lecture.isUnlocked,
          order: lecture.order,
        })),
        totalDuration: module.lectures.reduce((acc: number, curr: Lecture) => acc + (curr.duration || 0), 0),
        completedCount: module.lectures.filter((l: Lecture) => l.isCompleted).length,
        totalCount: module.lectures.length,
      }));
      setModules(transformedModules);
    }
  }, [modulesData]);

  // Set initial lecture
  useEffect(() => {
    if (modules.length > 0 && modules[0].lectures.length > 0 && !currentLecture) {
      setCurrentLecture(modules[0].lectures[0]);
      setDuration(modules[0].lectures[0].duration || 0);
    }
  }, [modules, currentLecture]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) newSet.delete(moduleId);
      else newSet.add(moduleId);
      return newSet;
    });
  };

  const selectLecture = (lecture: Lecture) => {
    if (lecture.isUnlocked) {
      setCurrentLecture(lecture);
      setDuration(lecture.duration || 0);
    }
  };

  const markLectureComplete = async () => {
    if (!currentLecture) return;

    try {
      console.log("Sending update (Complete):", {
        lectureId: currentLecture._id,
        lecture: {
          lectureId: currentLecture._id,
          isCompleted: true,
          isUnlocked: true,
        },
      });

      const response = await updateStatus({
        lectureId: currentLecture._id,
        lecture: {
          lectureId: currentLecture._id,
          isCompleted: true,
          isUnlocked: true,
        },
      }).unwrap();
      // check complete or not
      console.log("Update response (Complete):", response);

      await refetch();

      setModules((prevModules) => {
        const updatedModules = prevModules.map((module) => {
          const updatedLectures = module.lectures.map((lecture) =>
            lecture._id === currentLecture._id
              ? { ...lecture, isCompleted: true, isUnlocked: true }
              : lecture
          );
          return {
            ...module,
            lectures: updatedLectures,
            completedCount: updatedLectures.filter((l) => l.isCompleted).length,
          };
        });
        return updatedModules;
      });
    } catch (err) {
      console.error("Failed to update lecture status (Complete):", err);
    }
  };

  const unlockNextLecture = async () => {
    if (!currentLecture) return;

    for (const mod of modules) {
      const currentIndex = mod.lectures.findIndex((l) => l._id === currentLecture._id);
      if (currentIndex !== -1 && currentIndex + 1 < mod.lectures.length) {
        const nextLecture = mod.lectures[currentIndex + 1];
        try {
          console.log("Sending update (Next):", {
            lectureId: nextLecture._id,
            lecture: {
              lectureId: nextLecture._id,
              isCompleted: false,
              isUnlocked: true,
            },
          });

          const response = await updateStatus({
            lectureId: nextLecture._id,
            lecture: {
              lectureId: nextLecture._id,
              isCompleted: false,
              isUnlocked: true,
            },
          }).unwrap();
          // check unlock or not
          console.log("Update response (Next):", response);

          await refetch();

          setModules((prevModules) => {
            const updatedModules = prevModules.map((module) => {
              const updatedLectures = module.lectures.map((lecture) =>
                lecture._id === nextLecture._id
                  ? { ...lecture, isUnlocked: true }
                  : lecture
              );
              return {
                ...module,
                lectures: updatedLectures,
              };
            });
            setCurrentLecture(nextLecture);
            setDuration(nextLecture.duration || 0);
            return updatedModules;
          });
        } catch (err) {
          console.error("Failed to update lecture status (Next):", err);
        }
        return;
      }
    }
  };

  const goToPreviousLecture = (updatedModules: Module[]) => {
    if (!currentLecture) return;

    for (let i = 0; i < updatedModules.length; i++) {
      const mod = updatedModules[i];
      const currentIndex = mod.lectures.findIndex((l) => l._id === currentLecture._id);
      if (currentIndex !== -1) {
        if (currentIndex > 0) {
          const previousLecture = mod.lectures[currentIndex - 1];
          if (previousLecture.isUnlocked) {
            setCurrentLecture(previousLecture);
            setDuration(previousLecture.duration || 0);
            return;
          }
        } else if (i > 0) {
          const previousModule = updatedModules[i - 1];
          const lastLectureIndex = previousModule.lectures.length - 1;
          const previousLecture = previousModule.lectures[lastLectureIndex];
          if (previousLecture.isUnlocked) {
            setCurrentLecture(previousLecture);
            setDuration(previousLecture.duration || 0);
            return;
          }
        }
        break;
      }
    }
  };

  const filteredModules = modules.map((module) => ({
    ...module,
    lectures: module.lectures.filter((lecture) =>
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  if (modulesLoading) return <div className="flex justify-center items-center">
      <svg className="animate-spin h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
    </div>;
  if (error) return <div className="text-center py-12 text-red-500">Error loading modules</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h1 className="text-xl font-semibold">{currentLecture?.title || "Select a lecture"}</h1>
            </div>
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-gray-400" />
              <Bookmark className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center bg-black p-8">
            <div className="w-full max-w-4xl">
              {currentLecture ? (
                <div className="relative">
                  <iframe
                    width="100%"
                    height="500"
                    src={currentLecture.videoUrl}
                    title={currentLecture.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Select a lecture to start watching</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation and Notes */}
          <div className="p-6 border-t border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                  onClick={markLectureComplete}
                  disabled={!currentLecture}
                >
                  <CheckCircle className="w-4 h-4" />
                  {currentLecture?.isCompleted ? "Completed" : "Complete Video"}
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  onClick={() => goToPreviousLecture(modules)}
                  disabled={!currentLecture}
                >
                  Previous
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  onClick={unlockNextLecture}
                  disabled={!currentLecture}
                >
                  Next
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">Notes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Copyright Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                  <ThumbsUp className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                  <ThumbsDown className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                </div>
              </div>
            </div>

            {/* PDF Notes */}
            {currentLecture?.notes && currentLecture.notes.length > 0 && (
              <div className="flex gap-2">
                {currentLecture.notes.map((note, index) => (
                  <a
                    key={index}
                    href={note}
                    target="blank"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent flex items-center"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download Note
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Progress Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Running Module: 01</span>
              <div className="flex items-center gap-2">
                <Progress value={25} className="w-20 h-2 bg-gray-700" />
                <span className="text-sm text-green-400 font-medium">1/4</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search Lesson"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto">
            {filteredModules.map((module) => (
              <div key={module._id} className="border-b border-gray-700">
                <button
                  onClick={() => toggleModule(module._id)}
                  className="w-full p-4 text-left hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white mb-1">{module.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{formatTime(module.totalDuration || 0)}</span>
                        <span>
                          {module.completedCount}/{module.totalCount}
                        </span>
                      </div>
                    </div>
                    {expandedModules.has(module._id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <Progress
                      value={getProgressPercentage(module.completedCount || 0, module.totalCount || 0)}
                      className="h-1 bg-gray-600"
                    />
                  </div>
                </button>

                {/* Expanded Lectures */}
                {expandedModules.has(module._id) && (
                  <div className="bg-gray-750">
                    {module.lectures.map((lecture) => (
                      <button
                        key={lecture._id}
                        onClick={() => selectLecture(lecture)}
                        disabled={!lecture.isUnlocked}
                        className={`w-full p-3 text-left text-sm transition-colors ${
                          lecture.isUnlocked ? "hover:bg-gray-600 cursor-pointer" : "opacity-50 cursor-not-allowed"
                        } ${currentLecture?._id === lecture._id ? "bg-purple-600/20 border-r-2 border-purple-500" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={lecture.isUnlocked ? "text-white" : "text-gray-500"}>{lecture.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{formatTime(lecture.duration || 0)}</span>
                            {lecture.isCompleted && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                            {!lecture.isUnlocked && <div className="w-2 h-2 bg-gray-500 rounded-full"></div>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}