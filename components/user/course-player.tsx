"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Lecture {
  id: number
  title: string
  description: string
  type: "video" | "text" | "quiz" | "assignment"
  duration: string
  content: string
  videoUrl?: string
  order: number
  isPreview: boolean
  isCompleted?: boolean
}

interface Module {
  id: number
  title: string
  description: string
  order: number
  lectures: Lecture[]
}

interface Course {
  id: number
  title: string
  description: string
  instructor: string
  modules: Module[]
  progress: number
}

const mockCourseData: Course = {
  id: 1,
  title: "React Fundamentals",
  description: "Learn the basics of React including components, props, state, and hooks.",
  instructor: "John Smith",
  progress: 75,
  modules: [
    {
      id: 1,
      title: "Getting Started with React",
      description: "Introduction to React concepts and setup",
      order: 1,
      lectures: [
        {
          id: 1,
          title: "What is React?",
          description: "Understanding React and its ecosystem",
          type: "video",
          duration: "15 min",
          content: "React is a JavaScript library for building user interfaces...",
          videoUrl: "https://example.com/video1",
          order: 1,
          isPreview: true,
          isCompleted: true,
        },
        {
          id: 2,
          title: "Setting up Development Environment",
          description: "Installing Node.js, npm, and creating your first React app",
          type: "video",
          duration: "20 min",
          content: "In this lecture, we'll set up everything you need...",
          videoUrl: "https://example.com/video2",
          order: 2,
          isPreview: false,
          isCompleted: true,
        },
        {
          id: 3,
          title: "Knowledge Check",
          description: "Test your understanding of React basics",
          type: "quiz",
          duration: "10 min",
          content: "Quiz questions about React fundamentals...",
          order: 3,
          isPreview: false,
          isCompleted: false,
        },
      ],
    },
    {
      id: 2,
      title: "Components and JSX",
      description: "Learn about React components and JSX syntax",
      order: 2,
      lectures: [
        {
          id: 4,
          title: "Understanding Components",
          description: "Functional and class components",
          type: "video",
          duration: "25 min",
          content: "Components are the building blocks of React applications...",
          videoUrl: "https://example.com/video3",
          order: 1,
          isPreview: false,
          isCompleted: false,
        },
        {
          id: 5,
          title: "JSX Syntax and Rules",
          description: "Writing JSX effectively",
          type: "text",
          duration: "15 min",
          content:
            "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files...",
          order: 2,
          isPreview: false,
          isCompleted: false,
        },
      ],
    },
  ],
}

interface CoursePlayerProps {
  courseId: number
  onBack: () => void
}

export function CoursePlayer({ courseId, onBack }: CoursePlayerProps) {
  const [course, setCourse] = useState<Course>(mockCourseData)
  const [currentLecture, setCurrentLecture] = useState<Lecture>(course.modules[0].lectures[0])
  const [activeTab, setActiveTab] = useState("content")

  const handleLectureComplete = (lectureId: number) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) => ({
        ...module,
        lectures: module.lectures.map((lecture) =>
          lecture.id === lectureId ? { ...lecture, isCompleted: true } : lecture,
        ),
      })),
    }))
  }

  const getNextLecture = () => {
    const allLectures = course.modules.flatMap((module) => module.lectures)
    const currentIndex = allLectures.findIndex((lecture) => lecture.id === currentLecture.id)
    return currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null
  }

  const getPreviousLecture = () => {
    const allLectures = course.modules.flatMap((module) => module.lectures)
    const currentIndex = allLectures.findIndex((lecture) => lecture.id === currentLecture.id)
    return currentIndex > 0 ? allLectures[currentIndex - 1] : null
  }

  const getTotalLectures = () => {
    return course.modules.reduce((total, module) => total + module.lectures.length, 0)
  }

  const getCompletedLectures = () => {
    return course.modules.reduce(
      (total, module) => total + module.lectures.filter((lecture) => lecture.isCompleted).length,
      0,
    )
  }

  const renderLectureContent = () => {
    switch (currentLecture.type) {
      case "video":
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">▶</div>
                <p className="text-lg">Video Player</p>
                <p className="text-sm opacity-75">
                  {currentLecture.videoUrl || "Video content would be displayed here"}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{currentLecture.title}</h3>
                <p className="text-gray-600">{currentLecture.description}</p>
              </div>
              <Badge>{currentLecture.duration}</Badge>
            </div>
          </div>
        )

      case "text":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{currentLecture.title}</h3>
                <p className="text-gray-600">{currentLecture.description}</p>
              </div>
              <Badge>{currentLecture.duration}</Badge>
            </div>
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p>{currentLecture.content}</p>
              </div>
            </div>
          </div>
        )

      case "quiz":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{currentLecture.title}</h3>
                <p className="text-gray-600">{currentLecture.description}</p>
              </div>
              <Badge>{currentLecture.duration}</Badge>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <h4 className="text-lg font-medium mb-2">Quiz Time!</h4>
                  <p className="text-gray-600 mb-4">Test your knowledge with interactive questions</p>
                  <Button>Start Quiz</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "assignment":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{currentLecture.title}</h3>
                <p className="text-gray-600">{currentLecture.description}</p>
              </div>
              <Badge>{currentLecture.duration}</Badge>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <h4 className="text-lg font-medium mb-2">Assignment</h4>
                  <p className="text-gray-600 mb-4">Complete the practical exercise</p>
                  <div className="text-left bg-gray-50 p-4 rounded-lg">
                    <p>{currentLecture.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return <div>Content not available</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack}>
                ← Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold">{course.title}</h1>
                <p className="text-sm text-gray-600">by {course.instructor}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {getCompletedLectures()} of {getTotalLectures()} completed
              </div>
              <Progress value={course.progress} className="w-32" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                {renderLectureContent()}

                <div className="flex justify-between items-center mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const prev = getPreviousLecture()
                      if (prev) setCurrentLecture(prev)
                    }}
                    disabled={!getPreviousLecture()}
                  >
                    ← Previous
                  </Button>

                  <div className="flex space-x-2">
                    {!currentLecture.isCompleted && (
                      <Button variant="outline" onClick={() => handleLectureComplete(currentLecture.id)}>
                        Mark Complete
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        if (!currentLecture.isCompleted) {
                          handleLectureComplete(currentLecture.id)
                        }
                        const next = getNextLecture()
                        if (next) setCurrentLecture(next)
                      }}
                      disabled={!getNextLecture()}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {course.modules.map((module, moduleIndex) => (
                    <AccordionItem key={module.id} value={`module-${module.id}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{moduleIndex + 1}</Badge>
                          <span className="text-sm font-medium">{module.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-4">
                          {module.lectures.map((lecture, lectureIndex) => (
                            <div
                              key={lecture.id}
                              className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                                currentLecture.id === lecture.id ? "bg-blue-50 border border-blue-200" : ""
                              }`}
                              onClick={() => setCurrentLecture(lecture)}
                            >
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    lecture.isCompleted ? "bg-green-500 border-green-500" : "border-gray-300"
                                  }`}
                                >
                                  {lecture.isCompleted && (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="text-white text-xs">✓</span>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{lecture.title}</p>
                                  <p className="text-xs text-gray-500">{lecture.duration}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {lecture.type}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
