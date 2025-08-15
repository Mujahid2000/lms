import { createApi } from '@reduxjs/toolkit/query/react';
import { secureUrl } from './JwtHeaders';



export interface LectureData {
  lectureId: string;
  moduleId: string;
  title: string;
  duration: number;
  videoUrl: string;
  notes: string | File; // Allow File for form data
}

export interface LectureDataResponse {
  _id: string;
  moduleId: string;
  title: string;
  duration: number;
  videoUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const lectureApi = createApi({
  reducerPath: 'lectureApi',
  baseQuery: secureUrl,
  tagTypes: ['Lecture'],
  endpoints: (builder) => ({
    getLectures: builder.query<LectureDataResponse[], void>({
      query: () => '/lectures',
      providesTags: ['Lecture'],
    }),
    getLectureById: builder.query<LectureDataResponse, string>({
      query: (id) => `/lectures/${id}`,
      providesTags: ['Lecture'],
    }),
    createLecture: builder.mutation<LectureDataResponse, FormData>({
  query: (formData) => ({
    url: '/api/lectures', // make sure this matches backend route
    method: 'POST',
    body: formData,
  }),
  invalidatesTags: ['Lecture'],
}),
    updateLecture: builder.mutation<LectureDataResponse, { lectureId: string; lecture: FormData }>({
      query: ({ lectureId, lecture }) => ({
        url: `/api/lectures/${lectureId}`,
        method: 'PUT',
        body: lecture,
      }),
      invalidatesTags: ['Lecture'],
    }),
    
    deleteLecture: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/lectures/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lecture'],
    }),
  }),
});

export const {
  useGetLecturesQuery,
  useGetLectureByIdQuery,
  useCreateLectureMutation,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
} = lectureApi;