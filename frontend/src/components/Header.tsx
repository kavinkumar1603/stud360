'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { AcademicYear, Semester } from '../types';
import { GraduationCap, ShieldCheck, User, RotateCcw } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    academicYear,
    setAcademicYear,
    semester,
    setSemester,
    currentStudent,
    setCurrentStudent,
    currentAdvisor,
    setCurrentAdvisor,
    students,
    advisors,
    resetToDefaultData
  } = useApp();

  return (
    <header className="h-16 border-b border-[#E5E7EB] bg-white text-[#111827] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        
        {/* Brand & Portal Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-[#111827]">ACADEMIC OD</h1>
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider border border-indigo-100">
                {role} SHELL
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
              On-Duty Applications
            </p>
          </div>
        </div>

        {/* Dynamic Controls & Context */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Academic Context Selectors */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Context:</span>
            <div className="flex items-center bg-gray-100/90 rounded-md p-0.5 border border-gray-200">
               <span className="text-xs font-semibold px-2 py-1 text-gray-800">
                 AY {academicYear}
               </span>
               <span className="text-gray-300 px-0.5">|</span>
               <span className="text-xs font-semibold px-2 py-1 text-gray-800">
                 {semester}
               </span>
            </div>
          </div>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-3 bg-gray-100/90 px-3 py-1.5 rounded-md border border-gray-200">
            {role === 'STUDENT' ? (
              <User className="w-4 h-4 text-gray-500" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            )}
            <span className="text-xs font-bold text-gray-800">
              {role === 'STUDENT' ? currentStudent?.name : currentAdvisor?.name}
            </span>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button
              onClick={() => {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userId');
                sessionStorage.removeItem('userRole');
                window.location.reload();
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
