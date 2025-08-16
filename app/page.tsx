"use client"

import React, {  useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Zap } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, Toaster } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import {  useRouter } from "next/navigation"

import { setCredential } from "@/redux/features/auth/auth.slice"
import { RootState } from "@/redux/store"
import { useAuthLoginMutation, useAuthRegisterMutation } from "@/redux/features/auth/authApi"

type Theme = {
  name: string
  icon: React.ComponentType<{ className?: string }>
  bg: string
  cardBg: string
  text: string
  accent: string
  border: string
  button: string
  input: string
  themeButton: string
}

const theme: Theme = {
  name: "Cyberpunk",
  icon: Zap,
  bg: "bg-gray-900",
  cardBg: "bg-black",
  text: "text-green-400",
  accent: "text-cyan-400",
  border: "border-green-400",
  button: "bg-green-400 text-black hover:bg-green-300",
  input: "border-green-400 bg-black text-green-400 focus:ring-green-400",
  themeButton: "bg-gray-800 hover:bg-gray-700 text-green-400",
}

interface FormData {
  email: string
  password: string
  role?: string
  confirmPassword?: string
}

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [registerUser, { isLoading: isRegisterLoading }] = useAuthRegisterMutation();
  const [loginUser, { isLoading: isLoginLoading }] = useAuthLoginMutation()
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.lmsAuth.token)
  const router = useRouter()
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      role: "user",
    },
  })

  



  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form submitted:", { isLogin, ...data })
    if (isLogin) {
      try {
        const response = await loginUser({ email: data.email, password: data.password }).unwrap();
        console.log("Login successful:", response);
        if (response?.success) {
          dispatch(setCredential({user: response.user, token: response.token}));
          
        }
        toast.success("Login successful!");
        if(response.token  && response?.user?.role === "user") {
          router.push("/user-dashboard");
        } else{
          router.push("/admin/courses");
        }
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Login failed. Please check your credentials.");
      }
    } else {
      try {
        const response = await registerUser({ email: data.email, password: data.password, role: data.role }).unwrap();
        console.log("Signup successful:", response);
        toast.success("Signup successful!");
        reset();
        setIsLogin((prev) => !prev)
      } catch (error) {
        console.error("Signup failed:", error);
        toast.error("Signup failed. Please try again.");
      }
    }
  }

  const toggleMode = () => {
    setIsLogin((prev) => !prev)
    reset() // Reset form when toggling between login and signup
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ease-in-out ${theme.bg} ${theme.text} font-mono`}>
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card
          className={`w-full max-w-md ${theme.cardBg} ${theme.border} border-2 transition-all duration-500 ease-in-out transform`}
        >
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl font-bold ${theme.text} transition-colors duration-300`}>
              {isLogin ? "LOGIN" : "SIGNUP"}
            </CardTitle>
            <CardDescription className={`${theme.accent} transition-colors duration-300`}>
              {isLogin ? "Access your account" : "Create new account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2 animate-in slide-in-from-top duration-300">
                  <Label htmlFor="role" className={theme.text}>
                    ROLE
                  </Label>
                  <Select
                    defaultValue="user"
                    {...register("role", { required: !isLogin })}
                  >
                    <SelectTrigger className={`${theme.input} transition-all duration-300 focus:scale-105`}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className={`${theme.cardBg} ${theme.border} ${theme.text}`}>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-red-500 text-sm">Role is required</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className={theme.text}>
                  EMAIL
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                  className={`${theme.input} transition-all duration-300 focus:scale-105`}
                  placeholder="Enter email"
                />
                {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={theme.text}>
                  PASSWORD
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                    className={`${theme.input} pr-10 transition-all duration-300 focus:scale-105`}
                    placeholder="Enter password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute right-0 top-0 h-full px-3 ${theme.text} hover:bg-transparent`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
              </div>

              {!isLogin && (
                <div className="space-y-2 animate-in slide-in-from-top duration-300">
                  <Label htmlFor="confirmPassword" className={theme.text}>
                    CONFIRM PASSWORD
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword", { 
                      required: !isLogin,
                      validate: (val: string | undefined) => {
                        if (watch('password') !== val) {
                          return "Passwords do not match";
                        }
                      },
                    })}
                    className={`${theme.input} transition-all duration-300 focus:scale-105`}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message || "Confirm Password is required"}</p>}
                </div>
              )}

              <Button
                type="submit"
                className={`w-full ${theme.button} transition-all duration-300 hover:scale-105 active:scale-95`}
                disabled={isLoginLoading || isRegisterLoading}
              >
                {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={toggleMode}
                className={`${theme.text} hover:bg-transparent transition-all duration-300 hover:scale-105`}
              >
                {isLogin ? "Don't have an account? SIGNUP" : "Already have an account? LOGIN"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-10 left-10 w-4 h-4 ${theme.border} border-2 animate-pulse`} />
        <div className={`absolute top-20 right-20 w-6 h-6 ${theme.border} border-2 animate-bounce`} />
        <div className={`absolute bottom-20 left-20 w-3 h-3 ${theme.border} border-2 animate-ping`} />
        <div className={`absolute bottom-10 right-10 w-5 h-5 ${theme.border} border-2 animate-pulse`} />
      </div>
      <Toaster richColors/>
    </div>
  )
}