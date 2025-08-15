"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CourseManagement } from "../../components/course-managment"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/Store/store"
import { redirect } from "next/navigation"
import { clearJwtToken } from "@/Store/state/SetJWT"

// Mock data
const mockCourses = [
  {
    id: 1,
    title: "React Fundamentals",
    instructor: "John Smith",
    students: 45,
    status: "published",
    created: "2024-01-15",
  },
  { id: 2, title: "Advanced JavaScript", instructor: "Jane Doe", students: 32, status: "draft", created: "2024-02-01" },
  {
    id: 3,
    title: "UI/UX Design Principles",
    instructor: "Mike Johnson",
    students: 67,
    status: "published",
    created: "2024-01-20",
  },
]

const mockUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "user", enrolled: 3, lastActive: "2024-01-20" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "user", enrolled: 2, lastActive: "2024-01-19" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", role: "instructor", enrolled: 0, lastActive: "2024-01-21" },
]

// Added progress analytics data for admin view
const mockProgressAnalytics = [
  {
    courseId: 1,
    courseTitle: "React Fundamentals",
    totalStudents: 45,
    avgProgress: 68,
    avgScore: 85,
    completionRate: 42,
  },
  {
    courseId: 2,
    courseTitle: "Advanced JavaScript",
    totalStudents: 32,
    avgProgress: 52,
    avgScore: 78,
    completionRate: 25,
  },
  {
    courseId: 3,
    courseTitle: "UI/UX Design Principles",
    totalStudents: 67,
    avgProgress: 74,
    avgScore: 92,
    completionRate: 58,
  },
]

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.JwtState.token)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if(!token) {
      redirect("/");
    } else{
      
    }
  }, [token]);

  const logout = () => {
    dispatch(clearJwtToken());
    redirect("/");
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LMS Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, Mujahid</p>
            </div>
            <Button onClick={logout} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <span className="text-2xl">📚</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                  <span className="text-2xl">👥</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">248</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <span className="text-2xl">💰</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,450</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <span className="text-2xl">📊</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New course &quot;Python Basics&quot; created</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">15 new student enrollments</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Course &quot;React Advanced&quot; published</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex-col">
                      <span className="text-lg mb-1">➕</span>
                      Create Course
                    </Button>
                    <Button variant="outline" className="h-20 flex-col bg-transparent">
                      <span className="text-lg mb-1">👤</span>
                      Add User
                    </Button>
                    <Button variant="outline" className="h-20 flex-col bg-transparent">
                      <span className="text-lg mb-1">📧</span>
                      Send Announcement
                    </Button>
                    <Button variant="outline" className="h-20 flex-col bg-transparent">
                      <span className="text-lg mb-1">📈</span>
                      View Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button>Add New User</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Enrolled Courses</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "instructor" ? "default" : "secondary"}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.enrolled}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-2xl font-bold">Student Progress Overview</h2>

            <Card>
              <CardHeader>
                <CardTitle>Course Performance Metrics</CardTitle>
                <CardDescription>Track student progress and engagement across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Avg Progress</TableHead>
                      <TableHead>Avg Score</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProgressAnalytics.map((course) => (
                      <TableRow key={course.courseId}>
                        <TableCell className="font-medium">{course.courseTitle}</TableCell>
                        <TableCell>{course.totalStudents}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{course.avgProgress}%</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${course.avgProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{course.avgScore}%</TableCell>
                        <TableCell>
                          <Badge variant={course.completionRate > 50 ? "default" : "secondary"}>
                            {course.completionRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProgressAnalytics
                      .sort((a, b) => b.completionRate - a.completionRate)
                      .slice(0, 3)
                      .map((course, index) => (
                        <div key={course.courseId} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span className="font-medium">{course.courseTitle}</span>
                          </div>
                          <span className="text-sm text-green-600">{course.completionRate}% completion</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Study Time</span>
                      <span className="text-sm font-medium">2.5 hours/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Learners</span>
                      <span className="text-sm font-medium">186 (75%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Certificates Issued</span>
                      <span className="text-sm font-medium">42 this month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Rating</span>
                      <span className="text-sm font-medium">4.6/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Chart placeholder - Enrollment over time</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Chart placeholder - Completion rates by course</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <p className="text-gray-500">Chart placeholder - Revenue trends</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Platform Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="Learning Management System" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-description">Description</Label>
                    <Textarea id="platform-description" defaultValue="A comprehensive learning platform" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input id="smtp-server" placeholder="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-email">From Email</Label>
                    <Input id="from-email" placeholder="noreply@example.com" />
                  </div>
                  <Button>Save Email Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
