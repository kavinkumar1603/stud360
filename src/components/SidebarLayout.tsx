'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  Clock,
  User,
  RotateCcw,
  Calendar,
  Menu,
  X,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { AcademicYear, Semester } from '../types';

export type NavTab =
  | 'student_dashboard'
  | 'student_requests'
  | 'student_courses'
  | 'student_profile'
  | 'advisor_dashboard'
  | 'advisor_students'
  | 'advisor_pending';

interface SidebarLayoutProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  activeTab,
  setActiveTab,
  children
}) => {
  const {
    role,
    logout,
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
    odRequests,
    resetToDefaultData
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Pending OD count for advisor badge
  const pendingAdvisorCount = odRequests.filter(
    (od) => od.advisor_id === currentAdvisor.id && od.advisor_status === 'PENDING'
  ).length;

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900">AcademicHub</h1>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                {role === 'STUDENT' ? 'Student Portal' : 'Advisor Portal'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* STUDENT PORTAL SECTION (Available to Student & Advisor) */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {role === 'STUDENT' ? 'Student Menu' : 'Student View Mode'}
            </div>

            {role === 'STUDENT' && (
              <>
                <button
                  id="nav-student-dashboard"
              onClick={() => handleNavClick('student_dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'student_dashboard'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'student_dashboard' ? 'text-white' : 'text-slate-400'}`} />
              <span>Dashboard</span>
            </button>

            <button
                  id="nav-student-requests"
                  onClick={() => handleNavClick('student_requests')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'student_requests'
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <FileText className={`w-4 h-4 ${activeTab === 'student_requests' ? 'text-white' : 'text-slate-400'}`} />
                  <span>My OD Requests</span>
                </button>

                <button
                  id="nav-student-courses"
                  onClick={() => handleNavClick('student_courses')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'student_courses'
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 ${activeTab === 'student_courses' ? 'text-white' : 'text-slate-400'}`} />
                  <span>My Online Courses</span>
                </button>
              </>
            )}

            <button
              id="nav-student-profile"
              onClick={() => handleNavClick('student_profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'student_profile'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === 'student_profile' ? 'text-white' : 'text-slate-400'}`} />
              <span>Profile Settings</span>
            </button>
          </div>

          {/* ADVISOR TOOLS SECTION - STRICT RBAC: ONLY visible when role === 'ADVISOR' */}
          {role === 'ADVISOR' && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Advisor Admin Tools</span>
              </div>

              <button
                id="nav-advisor-dashboard"
                onClick={() => handleNavClick('advisor_dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'advisor_dashboard'
                    ? 'bg-amber-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-amber-50 hover:text-amber-900'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'advisor_dashboard' ? 'text-white' : 'text-amber-500'}`} />
                <span>Advisor Dashboard</span>
              </button>

              <button
                id="nav-advisor-students"
                onClick={() => handleNavClick('advisor_students')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'advisor_students'
                    ? 'bg-amber-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-amber-50 hover:text-amber-900'
                }`}
              >
                <Users className={`w-4 h-4 ${activeTab === 'advisor_students' ? 'text-white' : 'text-amber-500'}`} />
                <span>My Students Cohort</span>
              </button>

              <button
                id="nav-advisor-pending"
                onClick={() => handleNavClick('advisor_pending')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'advisor_pending'
                    ? 'bg-amber-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-amber-50 hover:text-amber-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 ${activeTab === 'advisor_pending' ? 'text-white' : 'text-amber-500'}`} />
                  <span>Pending Approvals</span>
                </div>
                {pendingAdvisorCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'advisor_pending' ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pendingAdvisorCount}
                  </span>
                )}
              </button>
            </div>
          )}

        </div>

        {/* User Card Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
              {role === 'STUDENT' ? currentStudent.name?.split(' ').map(n=>n[0]).join('') || 'S' : 'RV'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {role === 'STUDENT' ? currentStudent.name || 'Loading...' : currentAdvisor.name || 'Loading...'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {role === 'STUDENT' ? currentStudent.roll_no || '' : `${currentAdvisor.department || ''} Advisor`}
              </p>
            </div>
          </div>

          <button
            id="btn-sidebar-signout"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        
        {/* Top Bar Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Academic Context Selector Pill */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-semibold text-slate-800">
                AY {academicYear}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-800">
                {semester}
              </span>
            </div>
          </div>

          {/* Right Header User Profile & Switcher */}
          <div className="flex items-center gap-3">
            
            {/* User Profile Info */}
            <div className="hidden sm:flex items-center gap-2 text-right">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {role === 'STUDENT' ? currentStudent.name || 'Loading...' : currentAdvisor.name || 'Loading...'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {role === 'STUDENT' ? `Student • ${currentStudent.department || ''}` : `Senior Faculty Advisor`}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {role === 'STUDENT' ? currentStudent.name?.[0] || 'S' : 'R'}
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
};

