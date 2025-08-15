import baseApi from "@/redux/api/baseApi";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Register {
  email: string;
  password: string;
  role: string | undefined ;
}

export interface ResponseRegister {
  message: string;
  data: RegisterData;
}

export interface RegisterData {
  email: string;
  password: string;
  role: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Login {
  email: string;
  password: string;
}

export interface ResponseLogin {
  success: boolean
  token: string
  user: User
}

export interface User {
  _id: string
  email: string
  password: string
  role: string
  createdAt: string
  updatedAt: string
  __v: number
}


// Define a service using a base URL and expected endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    authRegister: builder.mutation< ResponseRegister, Register>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body: body,
      }),
    }),
    authLogin: builder.mutation<ResponseLogin, Login >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body: body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useAuthRegisterMutation, useAuthLoginMutation} = authApi;
