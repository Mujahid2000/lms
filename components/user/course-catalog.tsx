"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Course {
  id: number
  title: string
  description: string
  instructor: string
  category: string
  level: string
  price: number
  duration: string
  thumbnail: string
  rating: number
  students: number
  modules: number
  lectures: number
  isEnrolled?: boolean
  progress?: number
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: "React Fundamentals",
    description:
      "Learn the basics of React including components, props, state, and hooks. Perfect for beginners who want to start their React journey.",
    instructor: "John Smith",
    category: "Web Development",
    level: "Beginner",
    price: 99,
    duration: "8 hours",
    thumbnail: "/react-course.png",
    rating: 4.8,
    students: 1245,
    modules: 6,
    lectures: 24,
    isEnrolled: true,
    progress: 75,
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    description:
      "Deep dive into advanced JavaScript concepts and modern ES6+ features. Master closures, promises, async/await, and more.",
    instructor: "Jane Doe",
    category: "Programming",
    level: "Advanced",
    price: 149,
    duration: "12 hours",
    thumbnail: "/javascript-course.png",
    rating: 4.6,
    students: 892,
    modules: 8,
    lectures: 36,
    isEnrolled: true,
    progress: 45,
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    description:
      "Master the fundamentals of user interface and user experience design. Learn design thinking, prototyping, and user research.",
    instructor: "Mike Johnson",
    category: "Design",
    level: "Intermediate",
    price: 129,
    duration: "10 hours",
    thumbnail: "/ui-ux-design-course.png",
    rating: 4.9,
    students: 1567,
    modules: 7,
    lectures: 28,
    isEnrolled: false,
  },
  {
    id: 4,
    title: "Python for Data Science",
    description:
      "Learn Python programming specifically for data science applications. Covers pandas, numpy, matplotlib, and machine learning basics.",
    instructor: "Sarah Wilson",
    category: "Data Science",
    level: "Intermediate",
    price: 179,
    duration: "15 hours",
    thumbnail: "/course-thumbnail.png",
    rating: 4.7,
    students: 2134,
    modules: 9,
    lectures: 42,
    isEnrolled: false,
  },
  {
    id: 5,
    title: "Mobile App Development with React Native",
    description:
      "Build cross-platform mobile applications using React Native. Learn navigation, state management, and native device features.",
    instructor: "David Chen",
    category: "Mobile Development",
    level: "Intermediate",
    price: 199,
    duration: "18 hours",
    thumbnail: "/course-thumbnail.png",
    rating: 4.5,
    students: 756,
    modules: 10,
    lectures: 48,
    isEnrolled: false,
  },
]

interface CourseCatalogProps {
  onCourseSelect: (course: Course) => void
  onEnrollCourse: (courseId: number) => void
}

export function CourseCatalog({ onCourseSelect, onEnrollCourse }: CourseCatalogProps) {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false)

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter
    const matchesLevel = levelFilter === "all" || course.level === levelFilter
    const matchesEnrollment = !showEnrolledOnly || course.isEnrolled

    return matchesSearch && matchesCategory && matchesLevel && matchesEnrollment
  })

  const categories = Array.from(new Set(courses.map((course) => course.category)))
  const levels = Array.from(new Set(courses.map((course) => course.level)))

  const handleEnroll = (courseId: number) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === courseId ? { ...course, isEnrolled: true, progress: 0 } : course)),
    )
    onEnrollCourse(courseId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Course Catalog</h2>
        <p className="text-gray-600">Discover and enroll in courses to advance your skills</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="enrolled-only"
                checked={showEnrolledOnly}
                onChange={(e) => setShowEnrolledOnly(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="enrolled-only">My Courses Only</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div onClick={() => onCourseSelect(course)}>
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {course.isEnrolled && <Badge className="absolute top-2 right-2 bg-green-600">Enrolled</Badge>}
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">by {course.instructor}</CardDescription>
                  </div>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{course.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{course.duration}</span>
                    <span>
                      {course.modules} modules • {course.lectures} lectures
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-sm text-gray-600">({course.students.toLocaleString()})</span>
                    </div>
                    <span className="text-lg font-bold">${course.price}</span>
                  </div>

                  {course.isEnrolled && course.progress !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
            <div className="p-6 pt-0">
              {course.isEnrolled ? (
                <Button className="w-full" onClick={() => onCourseSelect(course)}>
                  Continue Learning
                </Button>
              ) : (
                <Button className="w-full" onClick={() => handleEnroll(course.id)}>
                  Enroll Now
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No courses found matching your criteria</p>
          <Button
            onClick={() => {
              setSearchTerm("")
              setCategoryFilter("all")
              setLevelFilter("all")
              setShowEnrolledOnly(false)
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
