
import baseApi from '@/redux/api/baseApi';



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
  isCompleted: boolean,
  isUnlocked: boolean,
  order: number,
  __v: number;
}

export interface lectureStatusUpdateByUser {
  lectureId: string,
  isCompleted: boolean
  isUnlocked: boolean
}

export const lectureApi = baseApi.injectEndpoints({
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
    url: '/lectures', // make sure this matches backend route
    method: 'POST',
    body: formData,
  }),
  invalidatesTags: ['Lecture'],
}),
    updateLecture: builder.mutation<LectureDataResponse, { lectureId: string; lecture: FormData }>({
      query: ({ lectureId, lecture }) => ({
        url: `/lectures/${lectureId}`,
        method: 'PUT',
        body: lecture,
      }),
      invalidatesTags: ['Lecture'],
    }),
    
    deleteLecture: builder.mutation<void, string>({
      query: (id) => ({
        url: `/lectures/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lecture'],
    }),
    updateLectureStatus: builder.mutation<lectureStatusUpdateByUser, { lectureId: string; lecture: {lectureId: string, isCompleted: boolean, isUnlocked: boolean} }>({
      query: ({ lectureId, lecture }) => ({
        url: `/lectures/${lectureId}`,
        method: 'PATCH',
        body: lecture,
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
  useUpdateLectureStatusMutation
} = lectureApi;