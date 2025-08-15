"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

interface Lecture {
  id: string
  title: string
  duration: string
  videoUrl: string
  pdfNotes: string[]
  isCompleted: boolean
  isUnlocked: boolean
}

interface Module {
  id: string
  title: string
  lectures: Lecture[]
  totalDuration: string
  completedCount: number
  totalCount: number
}

export default function LecturePage({courseId}:{courseId: string}) {
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(["module-1"]))
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(970) // 16:10 in seconds

  // Sample data - replace with your actual data
  const [modules, setModules] = useState<Module[]>([
    {
      id: "module-1",
      title: "MODULE 01 - INTRODUCTION TO BASICS",
      totalDuration: "2h 15m",
      completedCount: 1,
      totalCount: 4,
      lectures: [
        {
          id: "lecture-1-1",
          title: "Getting Started - Course Overview",
          duration: "16:10",
          videoUrl: "https://res.cloudinary.com/dkffqpque/video/upload/v1755274997/--_--_soul_life_o1_songstatus_lyricedits_songreels_explorereels_lovesongreels_lyricsvideo_lovestatus_songforyou_online-video-cutter.com_gwop6h.mp4",
          pdfNotes: ["Course Overview.pdf", "Getting Started Guide.pdf"],
          isCompleted: false,
          isUnlocked: true,
        },
        {
          id: "lecture-1-2",
          title: "Setting Up Your Environment",
          duration: "22:30",
          videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
          pdfNotes: ["Environment Setup.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-1-3",
          title: "Basic Concepts and Terminology",
          duration: "18:45",
          videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
          pdfNotes: ["Basic Concepts.pdf", "Terminology Guide.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-1-4",
          title: "Your First Project",
          duration: "25:20",
          videoUrl: "https://www.youtube.com/embed/L_LUpnjgPso",
          pdfNotes: ["First Project Guide.pdf", "Project Template.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
      ],
    },
    {
      id: "module-2",
      title: "MODULE 02 - INTERMEDIATE CONCEPTS",
      totalDuration: "1h 54m",
      completedCount: 0,
      totalCount: 5,
      lectures: [
        {
          id: "lecture-2-1",
          title: "Advanced Techniques",
          duration: "20:15",
          videoUrl: "https://www.youtube.com/embed/fJ9rUzIMcZQ",
          pdfNotes: ["Advanced Techniques.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-2-2",
          title: "Working with Data",
          duration: "24:30",
          videoUrl: "https://www.youtube.com/embed/Ks-_Mh1QhMc",
          pdfNotes: ["Data Handling.pdf", "Best Practices.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-2-3",
          title: "Error Handling and Debugging",
          duration: "19:45",
          videoUrl: "https://www.youtube.com/embed/YQHsXMglC9A",
          pdfNotes: ["Debugging Guide.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-2-4",
          title: "Performance Optimization",
          duration: "26:10",
          videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
          pdfNotes: ["Performance Tips.pdf", "Optimization Checklist.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-2-5",
          title: "Testing Your Code",
          duration: "23:40",
          videoUrl: "https://www.youtube.com/embed/RGOj5yH7evk",
          pdfNotes: ["Testing Guide.pdf", "Test Examples.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
      ],
    },
    {
      id: "module-3",
      title: "MODULE 03 - ADVANCED TOPICS",
      totalDuration: "2h 16m",
      completedCount: 0,
      totalCount: 6,
      lectures: [
        {
          id: "lecture-3-1",
          title: "Architecture Patterns",
          duration: "28:15",
          videoUrl: "https://www.youtube.com/embed/FTSuUnpKxdQ",
          pdfNotes: ["Architecture Patterns.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-3-2",
          title: "Security Best Practices",
          duration: "22:30",
          videoUrl: "https://www.youtube.com/embed/3klLJceIN7s",
          pdfNotes: ["Security Guide.pdf", "Common Vulnerabilities.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-3-3",
          title: "Scalability Considerations",
          duration: "25:45",
          videoUrl: "https://www.youtube.com/embed/kpzQrFC55q4",
          pdfNotes: ["Scalability Guide.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-3-4",
          title: "Integration with External APIs",
          duration: "21:20",
          videoUrl: "https://www.youtube.com/embed/GJzFKDLRfss",
          pdfNotes: ["API Integration.pdf", "Authentication Methods.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-3-5",
          title: "Deployment Strategies",
          duration: "19:30",
          videoUrl: "https://www.youtube.com/embed/Tng6Fox8EfI",
          pdfNotes: ["Deployment Guide.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-3-6",
          title: "Monitoring and Maintenance",
          duration: "18:45",
          videoUrl: "https://www.youtube.com/embed/BxV14h0kFs0",
          pdfNotes: ["Monitoring Setup.pdf", "Maintenance Checklist.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
      ],
    },
    {
      id: "module-4",
      title: "MODULE 04 - REAL WORLD PROJECTS",
      totalDuration: "1h 58m",
      completedCount: 0,
      totalCount: 4,
      lectures: [
        {
          id: "lecture-4-1",
          title: "Project Planning and Setup",
          duration: "30:15",
          videoUrl: "https://www.youtube.com/embed/SWYqp7iY_Tc",
          pdfNotes: ["Project Planning.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-4-2",
          title: "Building the Core Features",
          duration: "35:20",
          videoUrl: "https://www.youtube.com/embed/rAb3NuudUlY",
          pdfNotes: ["Core Features.pdf", "Implementation Guide.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-4-3",
          title: "Adding Advanced Features",
          duration: "28:45",
          videoUrl: "https://www.youtube.com/embed/QH2-TGUlwu4",
          pdfNotes: ["Advanced Features.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-4-4",
          title: "Final Testing and Deployment",
          duration: "23:40",
          videoUrl: "https://www.youtube.com/embed/nfWlot6h_JM",
          pdfNotes: ["Testing Checklist.pdf", "Deployment Guide.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
      ],
    },
    {
      id: "module-5",
      title: "MODULE 05 - BONUS CONTENT",
      totalDuration: "1h 8m",
      completedCount: 0,
      totalCount: 3,
      lectures: [
        {
          id: "lecture-5-1",
          title: "Industry Best Practices",
          duration: "24:30",
          videoUrl: "https://www.youtube.com/embed/Taylor_Swift",
          pdfNotes: ["Industry Standards.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-5-2",
          title: "Career Development Tips",
          duration: "22:15",
          videoUrl: "https://www.youtube.com/embed/career_tips",
          pdfNotes: ["Career Guide.pdf", "Resume Tips.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
        {
          id: "lecture-5-3",
          title: "What's Next - Advanced Learning",
          duration: "21:45",
          videoUrl: "https://www.youtube.com/embed/next_steps",
          pdfNotes: ["Learning Path.pdf", "Resources.pdf"],
          isCompleted: false,
          isUnlocked: false,
        },
      ],
    },
  ])

  // Set initial lecture
  useEffect(() => {
    if (modules[0]?.lectures[0]) {
      setCurrentLecture(modules[0].lectures[0])
    }
  }, [])

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const selectLecture = (lecture: Lecture) => {
    if (lecture.isUnlocked) {
      setCurrentLecture(lecture)
    }
  }

  const markLectureComplete = () => {
    if (!currentLecture) return

    setModules((prevModules) => {
      const updatedModules = prevModules.map((module) => {
        const updatedLectures = module.lectures.map((lecture) =>
          lecture.id === currentLecture.id ? { ...lecture, isCompleted: true } : lecture,
        )

        // Find current lecture and unlock the next one
        const currentIndex = updatedLectures.findIndex((l) => l.id === currentLecture.id)
        if (currentIndex !== -1 && currentIndex + 1 < updatedLectures.length) {
          updatedLectures[currentIndex + 1].isUnlocked = true
        }

        return {
          ...module,
          lectures: updatedLectures,
          completedCount: updatedLectures.filter((l) => l.isCompleted).length,
        }
      })

      // Also unlock first lecture of next module if we completed current module
      const currentModuleIndex = updatedModules.findIndex((module) =>
        module.lectures.some((l) => l.id === currentLecture.id),
      )

      if (currentModuleIndex !== -1) {
        const currentModule = updatedModules[currentModuleIndex]
        const currentLectureIndex = currentModule.lectures.findIndex((l) => l.id === currentLecture.id)

        // If this was the last lecture in the module, unlock first lecture of next module
        if (
          currentLectureIndex === currentModule.lectures.length - 1 &&
          currentModuleIndex + 1 < updatedModules.length
        ) {
          const nextModule = updatedModules[currentModuleIndex + 1]
          if (nextModule.lectures.length > 0) {
            nextModule.lectures[0].isUnlocked = true
          }
        }
      }

      // Navigate to next lecture using updated state
      setTimeout(() => {
        goToNextLecture(updatedModules)
      }, 100)

      return updatedModules
    })
  }

  const goToNextLecture = (updatedModules: Module[]) => {
    for (const module of updatedModules) {
      const currentIndex = module.lectures.findIndex((l) => l.id === currentLecture?.id)
      if (currentIndex !== -1) {
        // Check if there's a next lecture in current module
        if (currentIndex + 1 < module.lectures.length) {
          const nextLecture = module.lectures[currentIndex + 1]
          if (nextLecture.isUnlocked) {
            setCurrentLecture(nextLecture)
            return
          }
        }
        // Move to first lecture of next module
        const moduleIndex = updatedModules.findIndex((m) => m.id === module.id)
        if (moduleIndex + 1 < updatedModules.length) {
          const nextModule = updatedModules[moduleIndex + 1]
          if (nextModule.lectures.length > 0 && nextModule.lectures[0].isUnlocked) {
            setCurrentLecture(nextModule.lectures[0])
            return
          }
        }
      }
    }
  }

  const filteredModules = modules.map((module) => ({
    ...module,
    lectures: module.lectures.filter((lecture) => lecture.title.toLowerCase().includes(searchQuery.toLowerCase())),
  }))

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
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
                  disabled={!currentLecture || currentLecture.isCompleted}
                >
                  <CheckCircle className="w-4 h-4" />
                  {currentLecture?.isCompleted ? "Completed" : "Complete Video & Next"}
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
            {currentLecture?.pdfNotes && (
              <div className="flex gap-2">
                {currentLecture.pdfNotes.map((note, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    {note}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
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
              <div key={module.id} className="border-b border-gray-700">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 text-left hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white mb-1">{module.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{module.totalDuration}</span>
                        <span>
                          {module.completedCount}/{module.totalCount}
                        </span>
                      </div>
                    </div>
                    {expandedModules.has(module.id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <Progress
                      value={getProgressPercentage(module.completedCount, module.totalCount)}
                      className="h-1 bg-gray-600"
                    />
                  </div>
                </button>

                {/* Expanded Lectures */}
                {expandedModules.has(module.id) && (
                  <div className="bg-gray-750">
                    {module.lectures.map((lecture) => (
                      <button
                        key={lecture.id}
                        onClick={() => selectLecture(lecture)}
                        disabled={!lecture.isUnlocked}
                        className={`w-full p-3 text-left text-sm transition-colors ${
                          lecture.isUnlocked ? "hover:bg-gray-600 cursor-pointer" : "opacity-50 cursor-not-allowed"
                        } ${currentLecture?.id === lecture.id ? "bg-purple-600/20 border-r-2 border-purple-500" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={lecture.isUnlocked ? "text-white" : "text-gray-500"}>{lecture.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{lecture.duration}</span>
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
  )
}
