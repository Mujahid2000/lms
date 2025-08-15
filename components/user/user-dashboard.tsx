"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { CourseCatalog } from "./course-catalog"
import { CoursePlayer } from "./course-player"
import { ProgressAnalytics } from "../progress/progress-analytics"

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

export function UserDashboard() {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState<"dashboard" | "catalog" | "player" | "progress">("dashboard")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const enrolledCourses = [
    { id: 1, title: "React Fundamentals", progress: 75, instructor: "John Smith", thumbnail: "/react-course.png" },
    { id: 2, title: "Advanced JavaScript", progress: 45, instructor: "Jane Doe", thumbnail: "/javascript-course.png" },
    {
      id: 3,
      title: "UI/UX Design Principles",
      progress: 90,
      instructor: "Mike Johnson",
      thumbnail: "/ui-ux-design-course.png",
    },
  ]

  const recentActivity = [
    { id: 1, action: "Completed", item: "React Components Basics", time: "2 hours ago" },
    { id: 2, action: "Started", item: "Advanced JavaScript Module 3", time: "1 day ago" },
    { id: 3, action: "Completed", item: "UI Design Quiz", time: "2 days ago" },
    { id: 4, action: "Enrolled", item: "Python for Data Science", time: "3 days ago" },
  ]

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
    setActiveView("player")
  }

  const handleEnrollCourse = (courseId: number) => {
    // Handle enrollment logic here
    console.log("Enrolled in course:", courseId)
  }

  const handleBackToDashboard = () => {
    setActiveView("dashboard")
    setSelectedCourse(null)
  }

  if (activeView === "player" && selectedCourse) {
    return <CoursePlayer courseId={selectedCourse.id} onBack={handleBackToDashboard} />
  }

  if (activeView === "catalog") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  ← Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
                  <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
                </div>
              </div>
              <Button onClick={logout} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <CourseCatalog onCourseSelect={handleCourseSelect} onEnrollCourse={handleEnrollCourse} />
        </main>
      </div>
    )
  }

  if (activeView === "progress") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  ← Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Progress Analytics</h1>
                  <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
                </div>
              </div>
              <Button onClick={logout} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <ProgressAnalytics />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Learning Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <Button onClick={logout} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="browse">Browse Courses</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <span className="text-2xl">📚</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Active enrollments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <span className="text-2xl">✅</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Courses finished</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                  <span className="text-2xl">🔥</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">Days in a row</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                  <span className="text-2xl">⏱️</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Learning time</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump back into your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col" onClick={() => setActiveView("catalog")}>
                    <span className="text-lg mb-1">🔍</span>
                    Browse Courses
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <span className="text-lg mb-1">📖</span>
                    Continue Learning
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col bg-transparent"
                    onClick={() => setActiveView("progress")}
                  >
                    <span className="text-lg mb-1">📊</span>
                    View Progress
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <span className="text-lg mb-1">🎯</span>
                    Set Goals
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                      <Button
                        className="ml-4"
                        onClick={() =>
                          handleCourseSelect({
                            id: course.id,
                            title: course.title,
                            instructor: course.instructor,
                            thumbnail: course.thumbnail,
                            progress: course.progress,
                            isEnrolled: true,
                          } as Course)
                        }
                      >
                        Continue
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Enrolled Courses</CardTitle>
                <CardDescription>Track your progress across all enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>by {course.instructor}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <Button
                            className="w-full"
                            onClick={() =>
                              handleCourseSelect({
                                id: course.id,
                                title: course.title,
                                instructor: course.instructor,
                                thumbnail: course.thumbnail,
                                progress: course.progress,
                                isEnrolled: true,
                              } as Course)
                            }
                          >
                            Continue Learning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="browse">
            <CourseCatalog onCourseSelect={handleCourseSelect} onEnrollCourse={handleEnrollCourse} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressAnalytics />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your learning activity over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.action === "Completed"
                            ? "bg-green-500"
                            : activity.action === "Started"
                              ? "bg-blue-500"
                              : activity.action === "Enrolled"
                                ? "bg-purple-500"
                                : "bg-gray-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          <span className="text-gray-600">{activity.action}</span> {activity.item}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
