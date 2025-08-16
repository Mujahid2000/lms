'use client';
import { Button } from '@/components/ui/button';


import { redirect } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/features/auth/auth.slice';

const Navbar = () => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = useSelector((state: RootState) => state.lmsAuth.token);
  const role = useSelector((state: RootState) => state.lmsAuth.user?.role)
  
useEffect(() =>{
  if(!token){
    console.log(token)
    redirect('/')
  }
},[token])


  const handleLogout = () => {
    try {
      dispatch(logout());
      redirect('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Hide navbar if no token
  // if (!token) return null;

  return (
    <div className="bg-white">
      <header className="shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase">LMS {role} Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {role}</p>
            </div>
            {/* Desktop Navigation (visible on md: 768px and above) */}
            <nav className="hidden md:flex items-center gap-4">
              
              <Button onClick={handleLogout} variant="outline" className="hover:bg-gray-100">
                Sign Out
              </Button>
            </nav>
            {/* Mobile Menu Button (visible only below md: 768px) */}
            <div className="md:hidden flex">
              <Button
                variant="ghost"
                className="hover:bg-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
          {/* Mobile Dropdown Menu (visible only below md: 768px) */}
          {isMenuOpen && (
            <nav className="md:hidden bg-white border-t py-2">
              <div className="flex flex-col gap-2 px-4">
                <Link
                  href="/admin-dashboard/courses"
                  className="text-gray-600 hover:text-gray-900 py-2 font-medium"
                  onClick={handleLinkClick}
                >
                  Courses
                </Link>
                <Link
                  href="/admin-dashboard/modules"
                  className="text-gray-600 hover:text-gray-900 py-2 font-medium"
                  onClick={handleLinkClick}
                >
                  Modules
                </Link>
                <Link
                  href="/admin-dashboard/lectures"
                  className="text-gray-600 hover:text-gray-900 py-2 font-medium"
                  onClick={handleLinkClick}
                >
                  Lectures
                </Link>
                <Button
                  onClick={() => {
                    logout();
                    handleLinkClick();
                  }}
                  variant="outline"
                  className="w-full text-left hover:bg-gray-100"
                >
                  Sign Out
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;