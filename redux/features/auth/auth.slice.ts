// features/auth/authSlice.ts
import { RootState } from '@/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './authApi';


// User interface


// Redux auth state
interface AuthState {
  user: User | null;
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
};

// Slice
const authSlice = createSlice({
  name: 'lmsAuth',
  initialState,
  reducers: {
    // When API call starts
   
    // When login/signup is successful
    setCredential(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      
    },
    
    // Logout
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredential, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors

export const selectCurrentUser = (state: RootState) => state.lmsAuth.user  
