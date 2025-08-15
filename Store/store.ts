import {  setJwt } from './state/SetJWT';
import { authApi } from './api/AuthApi';
import { configureStore } from '@reduxjs/toolkit'
import { coursesApi } from './api/CoursesApi';
import { moduleApi } from './api/ModuleApi';
import { lectureApi } from './api/LectureApi';

export const store = configureStore({
  reducer: {
    // Add your reducers here
    [authApi.reducerPath]: authApi.reducer,
    [coursesApi.reducerPath] : coursesApi.reducer,
    [moduleApi.reducerPath] : moduleApi.reducer,
    [lectureApi.reducerPath]: lectureApi.reducer,
    JwtState: setJwt.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      coursesApi.middleware,
      moduleApi.middleware,
      lectureApi.middleware
    ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch