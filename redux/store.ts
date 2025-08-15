// ====================================================
// 🧾 Redux Store Configuration with Persist & RTK Query
// ====================================================

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage for web

// ===== Feature Reducers =====
import authReducer from './features/auth/auth.slice';


import baseApi from './api/baseApi'; // RTK Query base API slice

// ===== Combine Reducers =====
const rootReducer = combineReducers({
  lmsAuth: authReducer,


  [baseApi.reducerPath]: baseApi.reducer, // RTK Query API reducer
});

// ===== Persist Config =====
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['lmsAuth' ], // persist only these slices
};

// ===== Persisted Reducer =====
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ===== Store Setup =====
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid serializability warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware), // Add RTK Query middleware
});

// ===== Persistor Instance (for <PersistGate /> in React) =====
export const persistor = persistStore(store);

// ===== Types for Usage in app (e.g. useSelector, useDispatch) =====
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;