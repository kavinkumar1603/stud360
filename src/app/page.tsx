'use client';
import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { LoginPage } from '@/components/auth/LoginPage';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, isInitializing, role, currentStudent } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      if (role === 'STUDENT' && currentStudent?.roll_no) {
        router.push(`/${currentStudent.roll_no.toLowerCase()}`);
      } else if (role === 'ADVISOR') {
        router.push('/advisor');
      }
    }
  }, [isInitializing, isAuthenticated, role, currentStudent, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  // If not authenticated, or waiting for redirect, show login page
  return <LoginPage />;
}
