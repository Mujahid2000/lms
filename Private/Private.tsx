// components/ProtectedRoute.tsx
'use client';
import { useSelector, useDispatch } from 'react-redux';

import { redirect } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { setJwtToken } from '@/Store/state/SetJWT';
import { RootState } from '@/Store/store';

const ProtectedRoute = ({ children }: {children: ReactNode}) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.JwtState.token);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken && !token) {
      dispatch(setJwtToken(storedToken)); // টোকেন Redux স্টোরে সেট করুন
    } else if (!storedToken) {
      redirect('/'); // টোকেন না থাকলে রিডাইরেক্ট
    }
  }, [token, dispatch]);

  return token ? children : null;
};

export default ProtectedRoute;