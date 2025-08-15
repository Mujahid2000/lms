import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { secureUrl } from './JwtHeaders';

// Define the Course interface for input
export interface Course {
  id?: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: string; // Base64 string
}

// Define the CoursesResponse interface for API responses
export interface CoursesResponse {
   _id: string
  title: string
  description: string
  price: number
  thumbnail: string
  createdAt: string
  updatedAt: string
  __v: number
}

// Define the API slice
export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: secureUrl,
  tagTypes: ['Courses'],
  endpoints: (builder) => ({
    getCourses: builder.query<CoursesResponse[], void>({
      query: () => '/api/courses',
      providesTags: ['Courses'],
      transformResponse: (response: CoursesResponse[]) =>
        response.map((course) => ({
          ...course,
          id: course._id,
        })),
    }),
    getCourseById: builder.query<CoursesResponse, string>({
      query: (id) => `/api/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Courses', id }],
      transformResponse: (response: CoursesResponse) => ({
        ...response,
        id: response._id,
      }),
    }),
    createCourse: builder.mutation<CoursesResponse, FormData>({
      query: (formData) => ({
        url: '/api/courses',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Courses'],
      transformResponse: (response: CoursesResponse) => ({
        ...response,
        id: response._id,
      }),
    }),
    updateCourse: builder.mutation<CoursesResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/api/courses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Courses', { type: 'Courses', id }],
      transformResponse: (response: CoursesResponse) => ({
        ...response,
        id: response._id,
      }),
    }),
    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses'],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi;