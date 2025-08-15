"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  modules: Module[]
}

const mockCourse: Course = {
  id: 1,
  title: "React Fundamentals",
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
          content: "Introduction to React framework...",
          videoUrl: "https://example.com/video1",
          order: 1,
          isPreview: true,
        },
        {
          id: 2,
          title: "Setting up Development Environment",
          description: "Installing Node.js, npm, and creating your first React app",
          type: "video",
          duration: "20 min",
          content: "Step by step setup guide...",
          videoUrl: "https://example.com/video2",
          order: 2,
          isPreview: false,
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
          content: "Deep dive into React components...",
          videoUrl: "https://example.com/video3",
          order: 1,
          isPreview: false,
        },
        {
          id: 5,
          title: "JSX Syntax and Rules",
          description: "Writing JSX effectively",
          type: "text",
          duration: "15 min",
          content: "JSX is a syntax extension for JavaScript...",
          order: 2,
          isPreview: false,
        },
      ],
    },
  ],
}

export function ModuleLectureManagement({ courseId }: { courseId: number }) {
  const [course, setCourse] = useState<Course>(mockCourse)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false)
  const [isLectureDialogOpen, setIsLectureDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const handleCreateModule = (moduleData: Partial<Module>) => {
    const newModule: Module = {
      id: Date.now(),
      title: moduleData.title || "",
      description: moduleData.description || "",
      order: course.modules.length + 1,
      lectures: [],
    }
    setCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }))
    setIsModuleDialogOpen(false)
  }

  const handleUpdateModule = (moduleData: Partial<Module>) => {
    if (!selectedModule) return

    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) => (module.id === selectedModule.id ? { ...module, ...moduleData } : module)),
    }))
    setIsModuleDialogOpen(false)
    setSelectedModule(null)
    setIsEditMode(false)
  }

  const handleCreateLecture = (lectureData: Partial<Lecture>, moduleId: number) => {
    const targetModule = course.modules.find((m) => m.id === moduleId)
    if (!targetModule) return

    const newLecture: Lecture = {
      id: Date.now(),
      title: lectureData.title || "",
      description: lectureData.description || "",
      type: lectureData.type || "video",
      duration: lectureData.duration || "",
      content: lectureData.content || "",
      videoUrl: lectureData.videoUrl,
      order: targetModule.lectures.length + 1,
      isPreview: lectureData.isPreview || false,
    }

    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId ? { ...module, lectures: [...module.lectures, newLecture] } : module,
      ),
    }))
    setIsLectureDialogOpen(false)
  }

  const handleUpdateLecture = (lectureData: Partial<Lecture>, moduleId: number) => {
    if (!selectedLecture) return

    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lectures: module.lectures.map((lecture) =>
                lecture.id === selectedLecture.id ? { ...lecture, ...lectureData } : lecture,
              ),
            }
          : module,
      ),
    }))
    setIsLectureDialogOpen(false)
    setSelectedLecture(null)
    setIsEditMode(false)
  }

  const handleDeleteModule = (moduleId: number) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((module) => module.id !== moduleId),
    }))
  }

  const handleDeleteLecture = (lectureId: number, moduleId: number) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? { ...module, lectures: module.lectures.filter((lecture) => lecture.id !== lectureId) }
          : module,
      ),
    }))
  }

  const getTotalDuration = () => {
    return course.modules.reduce((total, module) => {
      const moduleDuration = module.lectures.reduce((moduleTotal, lecture) => {
        const minutes = Number.parseInt(lecture.duration.split(" ")[0]) || 0
        return moduleTotal + minutes
      }, 0)
      return total + moduleDuration
    }, 0)
  }

  const getTotalLectures = () => {
    return course.modules.reduce((total, module) => total + module.lectures.length, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Course Content</h2>
          <p className="text-gray-600">{course.title}</p>
        </div>
        <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsEditMode(false)
                setSelectedModule(null)
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
            <ModuleForm initialData={selectedModule} onSubmit={isEditMode ? handleUpdateModule : handleCreateModule} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{course.modules.length}</div>
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
            <div className="text-2xl font-bold">
              {course.modules.reduce((count, module) => count + module.lectures.filter((l) => l.isPreview).length, 0)}
            </div>
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
          {course.modules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No modules created yet</p>
              <Button onClick={() => setIsModuleDialogOpen(true)}>Create Your First Module</Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <AccordionItem key={module.id} value={`module-${module.id}`} className="border rounded-lg">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{moduleIndex + 1}</Badge>
                        <div className="text-left">
                          <h3 className="font-semibold">{module.title}</h3>
                          <p className="text-sm text-gray-600">{module.lectures.length} lectures</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedModule(module)
                            setIsEditMode(true)
                            setIsModuleDialogOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteModule(module.id)
                          }}
                        >
                          Delete
                        </Button>
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
                                setIsEditMode(false)
                                setSelectedLecture(null)
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
                              initialData={selectedLecture}
                              onSubmit={(data) =>
                                isEditMode ? handleUpdateLecture(data, module.id) : handleCreateLecture(data, module.id)
                              }
                            />
                          </DialogContent>
                        </Dialog>
                      </div>

                      {module.lectures.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No lectures in this module</p>
                      ) : (
                        <div className="space-y-2">
                          {module.lectures.map((lecture, lectureIndex) => (
                            <div
                              key={lecture.id}
                              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                            >
                              <div className="flex items-center space-x-3">
                                <Badge variant="secondary">{lectureIndex + 1}</Badge>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h5 className="font-medium">{lecture.title}</h5>
                                    <Badge
                                      variant={
                                        lecture.type === "video"
                                          ? "default"
                                          : lecture.type === "quiz"
                                            ? "destructive"
                                            : lecture.type === "assignment"
                                              ? "secondary"
                                              : "outline"
                                      }
                                    >
                                      {lecture.type}
                                    </Badge>
                                    {lecture.isPreview && <Badge variant="outline">Preview</Badge>}
                                  </div>
                                  <p className="text-sm text-gray-600">{lecture.duration}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedLecture(lecture)
                                    setIsEditMode(true)
                                    setIsLectureDialogOpen(true)
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteLecture(lecture.id, module.id)}
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
  )
}

interface ModuleFormProps {
  initialData?: Module | null
  onSubmit: (data: Partial<Module>) => void
}

function ModuleForm({ initialData, onSubmit }: ModuleFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="module-title">Module Title</Label>
        <Input
          id="module-title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Getting Started with React"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="module-description">Description</Label>
        <Textarea
          id="module-description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Brief description of what this module covers"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">{initialData ? "Update Module" : "Create Module"}</Button>
      </div>
    </form>
  )
}

interface LectureFormProps {
  initialData?: Lecture | null
  onSubmit: (data: Partial<Lecture>) => void
}

function LectureForm({ initialData, onSubmit }: LectureFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || ("video" as const),
    duration: initialData?.duration || "",
    content: initialData?.content || "",
    videoUrl: initialData?.videoUrl || "",
    isPreview: initialData?.isPreview || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lecture-title">Lecture Title</Label>
          <Input
            id="lecture-title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g., What is React?"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lecture-type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="text">Text/Article</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lecture-description">Description</Label>
        <Textarea
          id="lecture-description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Brief description of this lecture"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lecture-duration">Duration</Label>
          <Input
            id="lecture-duration"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            placeholder="e.g., 15 min"
            required
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="is-preview"
            checked={formData.isPreview}
            onChange={(e) => handleChange("isPreview", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="is-preview">Allow preview</Label>
        </div>
      </div>

      {formData.type === "video" && (
        <div className="space-y-2">
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            value={formData.videoUrl}
            onChange={(e) => handleChange("videoUrl", e.target.value)}
            placeholder="https://example.com/video.mp4"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="lecture-content">Content</Label>
        <Textarea
          id="lecture-content"
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder={
            formData.type === "video"
              ? "Video description and key points..."
              : formData.type === "quiz"
                ? "Quiz questions and answers..."
                : formData.type === "assignment"
                  ? "Assignment instructions..."
                  : "Article content..."
          }
          rows={6}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">{initialData ? "Update Lecture" : "Create Lecture"}</Button>
      </div>
    </form>
  )
}
