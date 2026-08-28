'use client';
import React, { useState, useEffect, use } from 'react';
import { useApp } from '@/context/AppContext';
import { SidebarLayout, NavTab } from '@/components/SidebarLayout';
import { DashboardView } from '@/components/student/DashboardView';
import { ODRequestsListView } from '@/components/student/ODRequestsListView';
import { ODDetailView } from '@/components/student/ODDetailView';
import { StudentProfileView } from '@/components/student/StudentProfileView';
import { ApplyODModal } from '@/components/student/ApplyODModal';
import { ApplyLeaveModal } from '@/components/student/ApplyLeaveModal';
import { LeaveApplicationsListView } from '@/components/student/LeaveApplicationsListView';
import { MyStudentsView } from '@/components/advisor/MyStudentsView';
import { AdvisorODRequestsView } from '@/components/advisor/AdvisorODRequestsView';
import { StudentProfileAdvisorView } from '@/components/advisor/StudentProfileAdvisorView';
import { ODDetailAdvisorView } from '@/components/advisor/ODDetailAdvisorView';
import { AdvisorProfileView } from '@/components/advisor/AdvisorProfileView';
import { AdvisorDashboardView } from '@/components/advisor/AdvisorDashboardView';
import { ManageDeadlinesView } from '@/components/advisor/ManageDeadlinesView';
import { AdvisorODProofsView } from '@/components/advisor/AdvisorODProofsView';
import { ODRequest, Student } from '@/types';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated, isInitializing, role, currentStudent } = useApp();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<NavTab>(role === 'ADVISOR' ? 'advisor_dashboard' : 'student_dashboard');
  const [selectedOD, setSelectedOD] = useState<ODRequest | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [advisorReqFilter, setAdvisorReqFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const [isApplyODOpen, setIsApplyODOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  // Sync tab state with browser history to fix back button bug
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({ tab: activeTab }, '', window.location.href);

      const handlePopState = (event: PopStateEvent) => {
        if (event.state && event.state.tab) {
          setActiveTab(event.state.tab as NavTab);
        }
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  // Security checks
  useEffect(() => {
    if (isInitializing) return;

    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (role === 'STUDENT' && currentStudent?.roll_no) {
      if (id.toLowerCase() !== currentStudent.roll_no.toLowerCase()) {
        router.push('/');
      }
    } else if (role === 'ADVISOR') {
      if (id.toLowerCase() !== 'advisor') {
        router.push('/');
      }
    }
  }, [isInitializing, isAuthenticated, role, currentStudent, id, router]);

  useEffect(() => {
    if (role === 'STUDENT' && (activeTab.startsWith('advisor_'))) {
      setActiveTab('student_dashboard');
    } else if (role === 'ADVISOR' && (activeTab.startsWith('student_'))) {
      setActiveTab('advisor_dashboard');
    }
  }, [role, activeTab]);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedOD(null);
    setSelectedStudent(null);
    if (typeof window !== 'undefined') {
      // Use URL constructor to only change search params if we wanted, or just replace state. We'll just pushState.
      window.history.pushState({ tab }, '', window.location.href);
    }
  };

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  // Prevent rendering if the route is incorrect for the user
  if (role === 'STUDENT' && id.toLowerCase() !== currentStudent?.roll_no?.toLowerCase()) {
    return null;
  }
  if (role === 'ADVISOR' && id.toLowerCase() !== 'advisor') {
    return null;
  }

  return (
    <SidebarLayout activeTab={activeTab} setActiveTab={handleTabChange}>
      {selectedOD ? (
        role === 'ADVISOR' ? (
          <ODDetailAdvisorView odRequest={selectedOD} onBack={() => setSelectedOD(null)} />
        ) : (
          <ODDetailView odRequest={selectedOD} onBack={() => setSelectedOD(null)} />
        )
      ) : selectedStudent ? (
        <StudentProfileAdvisorView
          student={selectedStudent}
          onBack={() => setSelectedStudent(null)}
          onSelectODRequest={(od) => setSelectedOD(od)}
        />
      ) : activeTab === 'student_dashboard' ? (
        <DashboardView
          onOpenApplyOD={() => setIsApplyODOpen(true)}
          onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
          onSelectODRequest={(od) => setSelectedOD(od)}
          onNavigateTab={(tab) => {
            if (tab === 'requests') setActiveTab('student_requests');
          }}
        />
      ) : activeTab === 'student_requests' ? (
        <ODRequestsListView
          onSelectODRequest={(od) => setSelectedOD(od)}
          onOpenApplyOD={() => setIsApplyODOpen(true)}
        />
      ) : activeTab === 'student_leaves' ? (
        <LeaveApplicationsListView
          onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
        />
      ) : activeTab === 'student_profile' ? (
        role === 'ADVISOR' ? <AdvisorProfileView /> : <StudentProfileView />
      ) : activeTab === 'advisor_dashboard' && role === 'ADVISOR' ? (
        <AdvisorDashboardView
          onSelectODRequest={(od) => setSelectedOD(od)}
          onNavigateTab={(tab) => {
            if (tab === 'requests') {
              setAdvisorReqFilter('PENDING');
              setActiveTab('advisor_requests');
            }
            if (tab === 'all_requests') {
              setAdvisorReqFilter('ALL');
              setActiveTab('advisor_requests');
            }
            if (tab === 'students') setActiveTab('advisor_students');
          }}
        />
      ) : activeTab === 'advisor_students' && role === 'ADVISOR' ? (
        <MyStudentsView onSelectStudent={(st) => setSelectedStudent(st)} />
      ) : activeTab === 'advisor_requests' && role === 'ADVISOR' ? (
        <AdvisorODRequestsView onSelectODRequest={(od) => setSelectedOD(od)} defaultFilter={advisorReqFilter} />
      ) : activeTab === 'advisor_deadlines' && role === 'ADVISOR' ? (
        <ManageDeadlinesView />
      ) : activeTab === 'advisor_proofs' && role === 'ADVISOR' ? (
        <AdvisorODProofsView />
      ) : (
        <DashboardView
          onOpenApplyOD={() => setIsApplyODOpen(true)}
          onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
          onSelectODRequest={(od) => setSelectedOD(od)}
          onNavigateTab={(tab) => {
            if (tab === 'requests') setActiveTab('student_requests');
          }}
        />
      )}

      <ApplyODModal
        isOpen={isApplyODOpen}
        onClose={() => setIsApplyODOpen(false)}
        onSubmitted={() => {
          setActiveTab('student_requests');
          setSelectedOD(null);
        }}
      />
      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        onSubmitted={() => {
          setActiveTab('student_leaves');
          setSelectedOD(null);
        }}
      />
    </SidebarLayout>
  );
}
