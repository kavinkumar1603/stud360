import React, { useState } from 'react';
import { DashboardView } from './DashboardView';
import { ODRequestsListView } from './ODRequestsListView';
import { ODDetailView } from './ODDetailView';
import { OnlineCoursesListView } from './OnlineCoursesListView';
import { StudentProfileView } from './StudentProfileView';
import { ApplyODModal } from './ApplyODModal';
import { AddCourseModal } from './AddCourseModal';
import { ODRequest } from '../../types';
import { LayoutDashboard, FileText, BookOpen, User, Plus } from 'lucide-react';

type StudentTab = 'dashboard' | 'requests' | 'courses' | 'profile';

export const StudentShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');
  const [selectedOD, setSelectedOD] = useState<ODRequest | null>(null);

  // Modal states
  const [isApplyODOpen, setIsApplyODOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  const handleSelectOD = (od: ODRequest) => {
    setSelectedOD(od);
  };

  const handleBackFromDetail = () => {
    setSelectedOD(null);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Tabs Bar for Desktop/Tablet */}
        <div className="hidden md:flex items-center justify-between gap-4 mb-6 bg-white p-2 rounded-xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-1">
            <button
              id="tab-student-dashboard"
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedOD(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard' && !selectedOD
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 opacity-70" />
              <span>Dashboard</span>
            </button>

            <button
              id="tab-student-requests"
              onClick={() => {
                setActiveTab('requests');
                setSelectedOD(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'requests' || selectedOD
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 opacity-70" />
              <span>My OD Requests</span>
            </button>

            <button
              id="tab-student-courses"
              onClick={() => {
                setActiveTab('courses');
                setSelectedOD(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'courses' && !selectedOD
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4 opacity-70" />
              <span>Online Courses</span>
            </button>

            <button
              id="tab-student-profile"
              onClick={() => {
                setActiveTab('profile');
                setSelectedOD(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile' && !selectedOD
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 opacity-70" />
              <span>Profile</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <button
              id="btn-apply-od-header"
              onClick={() => setIsApplyODOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Apply for OD</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tab Content rendering */}
        {selectedOD ? (
          <ODDetailView odRequest={selectedOD} onBack={handleBackFromDetail} />
        ) : activeTab === 'dashboard' ? (
          <DashboardView
            onOpenApplyOD={() => setIsApplyODOpen(true)}
            onOpenAddCourse={() => setIsAddCourseOpen(true)}
            onSelectODRequest={handleSelectOD}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        ) : activeTab === 'requests' ? (
          <ODRequestsListView
            onSelectODRequest={handleSelectOD}
            onOpenApplyOD={() => setIsApplyODOpen(true)}
          />
        ) : activeTab === 'courses' ? (
          <OnlineCoursesListView onOpenAddCourse={() => setIsAddCourseOpen(true)} />
        ) : (
          <StudentProfileView />
        )}

      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] shadow-lg">
        <div className="grid grid-cols-4 h-16">
          <button
            id="mobile-nav-dashboard"
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedOD(null);
            }}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
              activeTab === 'dashboard' && !selectedOD
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            id="mobile-nav-requests"
            onClick={() => {
              setActiveTab('requests');
              setSelectedOD(null);
            }}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
              activeTab === 'requests' || selectedOD
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>OD Requests</span>
          </button>

          <button
            id="mobile-nav-courses"
            onClick={() => {
              setActiveTab('courses');
              setSelectedOD(null);
            }}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
              activeTab === 'courses' && !selectedOD
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Courses</span>
          </button>

          <button
            id="mobile-nav-profile"
            onClick={() => {
              setActiveTab('profile');
              setSelectedOD(null);
            }}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
              activeTab === 'profile' && !selectedOD
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <ApplyODModal
        isOpen={isApplyODOpen}
        onClose={() => setIsApplyODOpen(false)}
        onSubmitted={() => {
          setActiveTab('requests');
          setSelectedOD(null);
        }}
      />

      <AddCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        onSubmitted={() => {
          setActiveTab('courses');
          setSelectedOD(null);
        }}
      />

    </div>
  );
};
