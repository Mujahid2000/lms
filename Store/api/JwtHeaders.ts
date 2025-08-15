import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';


export const secureUrl = fetchBaseQuery({
  baseUrl: 'http://localhost:4000',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).JwtState.token;
    console.log("token 1",token)
    if (token) {
      headers.set('authorization', `${token}`);
    }
    return headers;
  },
});