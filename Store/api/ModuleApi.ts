import { createApi } from "@reduxjs/toolkit/query/react";
import { secureUrl } from "./JwtHeaders";

// --- Types ---
export interface ModuleData {
  title: string;
  description: string;
  courseId: string;
}

export type ModuleResponse = Root2[]

export interface Root2 {
  _id: string
  course: string
  title: string
  moduleNumber: number
  description: string
  createdAt: string
  updatedAt: string
  __v: number
  lectures: Lecture[]
}

export interface Lecture {
  _id: string
  moduleId: string
  title: string
  duration: number
  videoUrl: string
  isPreview: boolean
  notes: string[]
  order: number
  createdAt: string
  updatedAt: string
  __v: number
}


export interface ModuleAndCourseCombineResponse {
_id: string
  course: string
  title: string
  moduleNumber: number
  description: string
  createdAt: string
  updatedAt: string
  __v: number
  courseData: CourseDaum[]
}

export interface CourseDaum {
  _id: string
  title: string
  description: string
  price: number
  thumbnail: string
  createdAt: string
  updatedAt: string
  __v: number
}


// --- API ---
export const moduleApi = createApi({
  reducerPath: "moduleApi",
  baseQuery: secureUrl,
  tagTypes: ["Module"],

  endpoints: (builder) => ({
    // CREATE
    createModule: builder.mutation<ModuleResponse, ModuleData>({
      query: (data) => ({
        url: `/api/modules`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Module"],
    }),

    // READ (all modules for a course)
    getModulesByCourse: builder.query<ModuleAndCourseCombineResponse[], string | undefined>({
      query: (courseId) => `/api/modules/${courseId}`,
      providesTags: ["Module"],
    }),

    // READ (single module)
    getModuleById: builder.query<ModuleResponse, string>({
      query: (id) => `/api/modules/${id}`,
      providesTags: ["Module"],
    }),

    // UPDATE
    updateModule: builder.mutation<
      ModuleResponse,
      { id: string; data: Partial<ModuleData> }>({
      query: ({ id, data }) => ({
        url: `/api/modules/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Module"],
    }),

    // DELETE
    deleteModule: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/modules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Module"],
    }),
  }),
});

// --- Export hooks ---
export const {
  useCreateModuleMutation,
  useGetModulesByCourseQuery,
  useGetModuleByIdQuery,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} = moduleApi;
