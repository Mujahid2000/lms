'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, Users, BookOpen, Play, Download, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

// Mock course data - in real app this would come from props or API
const courseData = {
  id: 1,
  title: "Complete React Development Masterclass",
  description:
    "Master React from fundamentals to advanced concepts. Build real-world projects and learn modern development practices with hooks, context, and state management.",
  thumbnail: "/placeholder.svg?height=400&width=600",
  price: 89.99,
  originalPrice: 149.99,
  rating: 4.8,
  totalRatings: 2847,
  students: 15420,
  duration: "42 hours",
  lectures: 156,
  level: "All Levels",
  lastUpdated: "December 2024",
  instructor: {
    name: "Sarah Johnson",
    title: "Senior React Developer",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.9,
    students: 45000,
    courses: 12,
  },
  features: [
    "42 hours of on-demand video",
    "156 downloadable resources",
    "Full lifetime access",
    "Access on mobile and TV",
    "Certificate of completion",
  ],
  requirements: [
    "Basic knowledge of HTML, CSS, and JavaScript",
    "A computer with internet connection",
    "No prior React experience needed",
  ],
  whatYouLearn: [
    "Build modern React applications from scratch",
    "Master React Hooks and Context API",
    "Implement state management with Redux",
    "Create responsive and interactive UIs",
    "Deploy applications to production",
    "Write clean, maintainable code",
  ],
}

const reviews = [
  {
    id: 1,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Excellent course! The instructor explains complex concepts in a very clear way. The projects are practical and helped me land my first React job.",
  },
  {
    id: 2,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "1 month ago",
    comment:
      "Best React course I've taken. Great balance of theory and hands-on practice. The instructor is very knowledgeable and responsive to questions.",
  },
  {
    id: 3,
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "3 weeks ago",
    comment:
      "Comprehensive course with lots of practical examples. Would recommend to anyone wanting to learn React properly.",
  },
]

export interface Root {
  _id: string
  title: string
  description: string
  price: number
  thumbnail: string
  createdAt: string
  updatedAt: string
  __v: number
}


export function CourseDetails({id}: {id: string}) {

  
   const [course, setCourse] = useState<Root | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const url = `https://learnig-management-server.vercel.app/api/courses/${id}`;
      try {
        setIsLoading(true);
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error(`Response status: ${response.status}`);
        const result = await response.json();
        if (Array.isArray(result)) {
          setCourse(result[0]); // Assuming the first item if it's an array
        } else if (result && typeof result === "object") {
          setCourse(result);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);



  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Course Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge variant="secondary" className="mb-4">
              {courseData.level}
            </Badge>
            <h1 className="text-4xl font-sans font-bold text-foreground mb-4">{course?.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{course?.description}</p>
          </div>

          {/* Course Stats */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(courseData.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium text-foreground">{courseData.rating}</span>
              <span>({courseData.totalRatings.toLocaleString()} ratings)</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{courseData.students.toLocaleString()} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{courseData.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{courseData.lectures} lectures</span>
            </div>
          </div>

          {/* Instructor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={courseData.instructor.avatar || "/placeholder.svg"}
                    alt={courseData.instructor.name}
                  />
                  <AvatarFallback>
                    {courseData.instructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-sans font-semibold text-lg text-card-foreground">{courseData.instructor.name}</h3>
                  <p className="text-muted-foreground mb-2">{courseData.instructor.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{courseData.instructor.rating} rating</span>
                    </div>
                    <span>{courseData.instructor.students.toLocaleString()} students</span>
                    <span>{courseData.instructor.courses} courses</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Preview Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={course?.thumbnail || "/placeholder.svg"}
                  alt={course?.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-sans font-bold text-card-foreground">${course?.price}</span>
                  <span className="text-lg text-muted-foreground line-through">${courseData.originalPrice}</span>
                  <Badge variant="destructive">40% OFF</Badge>
                </div>

                <div className="space-y-3">
                  <Button size="lg" className="w-full font-sans font-semibold">
                    Enroll Now
                  </Button>
                  <Button size="lg" className="w-full font-sans font-semibold">
                    <Link href={`/lecture/video/${id}`}>Lecture Page</Link>
                    </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <h4 className="font-sans font-semibold text-card-foreground">This course includes:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {courseData.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-accent rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content Sections */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* What You'll Learn */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">What you&apos;ll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {courseData.whatYouLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {courseData.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Student Reviews</CardTitle>
              <CardDescription>See what our students are saying about this course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                      <AvatarFallback>
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-sans font-semibold text-card-foreground">{review.name}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with additional info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level:</span>
                <span className="font-medium">{courseData.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{courseData.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lectures:</span>
                <span className="font-medium">{courseData.lectures}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">{courseData.lastUpdated}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
