'use client';

import React, { useState } from 'react';
import { DashboardView } from './DashboardView';
import { ODRequestsListView } from './ODRequestsListView';
import { ODDetailView } from './ODDetailView';
import { StudentProfileView } from './StudentProfileView';
import { ApplyODModal } from './ApplyODModal';
import { ODRequest } from '../../types';
import { LayoutDashboard, FileText, User, Plus } from 'lucide-react';
import { ApplyLeaveModal } from './ApplyLeaveModal';
import { LeaveApplicationsListView } from './LeaveApplicationsListView';
import { Briefcase, Users } from 'lucide-react';
import { RepresentativeDashboardView } from './RepresentativeDashboardView';
import { useApp } from '../../context/AppContext';

type StudentTab = 'dashboard' | 'requests' | 'leaves' | 'rep_dashboard' | 'profile';

export const StudentShell: React.FC = () => {
  const { currentStudent } = useApp();
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');
  const [selectedOD, setSelectedOD] = useState<ODRequest | null>(null);

  // Modal states
  const [isApplyODOpen, setIsApplyODOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);

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
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => { setActiveTab('dashboard'); setSelectedOD(null); }}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'dashboard' && !selectedOD
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              My Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('requests'); setSelectedOD(null); }}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'requests' && !selectedOD
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              OD Requests
            </button>
            <button
              onClick={() => { setActiveTab('leaves'); setSelectedOD(null); }}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'leaves' && !selectedOD
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Leave Applications
            </button>
            {currentStudent?.is_representative && (
              <button
                onClick={() => { setActiveTab('rep_dashboard'); setSelectedOD(null); }}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'rep_dashboard' && !selectedOD
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4" />
                Class Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-xs border border-[#E5E7EB] p-4 sm:p-6 min-h-[60vh]">
          {selectedOD ? (
            <ODDetailView odRequest={selectedOD} onBack={handleBackFromDetail} />
          ) : activeTab === 'dashboard' ? (
            <DashboardView 
              onOpenApplyOD={() => setIsApplyODOpen(true)}
              onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
              onNavigateTab={(t) => setActiveTab(t as any)}
              onSelectODRequest={handleSelectOD}
            />
          ) : activeTab === 'requests' ? (
            <ODRequestsListView 
              onSelectODRequest={handleSelectOD} 
              onOpenApplyOD={() => setIsApplyODOpen(true)} 
            />
          ) : activeTab === 'leaves' ? (
            <LeaveApplicationsListView 
              onOpenApplyLeave={() => setIsApplyLeaveOpen(true)} 
            />
          ) : activeTab === 'rep_dashboard' && currentStudent?.is_representative ? (
            <RepresentativeDashboardView />
          ) : activeTab === 'profile' ? (
            <StudentProfileView />
          ) : null}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#E5E7EB] flex items-center justify-around px-2 py-3 z-40 pb-safe">
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
            activeTab === 'requests' && !selectedOD
              ? 'text-indigo-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>OD Requests</span>
        </button>
        <button
          id="mobile-nav-leaves"
          onClick={() => {
            setActiveTab('leaves');
            setSelectedOD(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
            activeTab === 'leaves' && !selectedOD
              ? 'text-indigo-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Leaves</span>
        </button>

        {currentStudent?.is_representative && (
          <button
            id="mobile-nav-rep"
            onClick={() => {
              setActiveTab('rep_dashboard');
              setSelectedOD(null);
            }}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
              activeTab === 'rep_dashboard' && !selectedOD
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Class</span>
          </button>
        )}

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
      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        onSubmitted={() => {
          setActiveTab('leaves');
          setSelectedOD(null);
        }}
      />

    </div>
  );
};
