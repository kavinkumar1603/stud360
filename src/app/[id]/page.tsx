'use client';
import React, { useState, useEffect, use } from 'react';
import { useApp } from '@/context/AppContext';
import { SidebarLayout, NavTab } from '@/components/SidebarLayout';
import { DashboardView } from '@/components/student/DashboardView';
import { ODRequestsListView } from '@/components/student/ODRequestsListView';
import { ODDetailView } from '@/components/student/ODDetailView';
import { OnlineCoursesListView } from '@/components/student/OnlineCoursesListView';
import { StudentProfileView } from '@/components/student/StudentProfileView';
import { ApplyODModal } from '@/components/student/ApplyODModal';
import { AddCourseModal } from '@/components/student/AddCourseModal';
import { MyStudentsView } from '@/components/advisor/MyStudentsView';
import { PendingApprovalsView } from '@/components/advisor/PendingApprovalsView';
import { StudentProfileAdvisorView } from '@/components/advisor/StudentProfileAdvisorView';
import { ODDetailAdvisorView } from '@/components/advisor/ODDetailAdvisorView';
import { AdvisorProfileView } from '@/components/advisor/AdvisorProfileView';
import { AdvisorDashboardView } from '@/components/advisor/AdvisorDashboardView';
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

  const [isApplyODOpen, setIsApplyODOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

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
    if (role === 'STUDENT' && (activeTab === 'advisor_dashboard' || activeTab === 'advisor_students' || activeTab === 'advisor_pending')) {
      setActiveTab('student_dashboard');
    } else if (role === 'ADVISOR' && (activeTab === 'student_dashboard' || activeTab === 'student_requests' || activeTab === 'student_courses')) {
      setActiveTab('advisor_dashboard');
    }
  }, [role, activeTab]);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedOD(null);
    setSelectedStudent(null);
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
          onOpenAddCourse={() => setIsAddCourseOpen(true)}
          onSelectODRequest={(od) => setSelectedOD(od)}
          onNavigateTab={(tab) => {
            if (tab === 'requests') setActiveTab('student_requests');
            if (tab === 'courses') setActiveTab('student_courses');
          }}
        />
      ) : activeTab === 'student_requests' ? (
        <ODRequestsListView
          onSelectODRequest={(od) => setSelectedOD(od)}
          onOpenApplyOD={() => setIsApplyODOpen(true)}
        />
      ) : activeTab === 'student_courses' ? (
        <OnlineCoursesListView onOpenAddCourse={() => setIsAddCourseOpen(true)} />
      ) : activeTab === 'student_profile' ? (
        role === 'ADVISOR' ? <AdvisorProfileView /> : <StudentProfileView />
      ) : activeTab === 'advisor_dashboard' && role === 'ADVISOR' ? (
        <AdvisorDashboardView
          onSelectODRequest={(od) => setSelectedOD(od)}
          onNavigateTab={(tab) => {
            if (tab === 'requests') setActiveTab('advisor_pending');
            if (tab === 'students') setActiveTab('advisor_students');
          }}
        />
      ) : activeTab === 'advisor_students' && role === 'ADVISOR' ? (
        <MyStudentsView onSelectStudent={(st) => setSelectedStudent(st)} />
      ) : activeTab === 'advisor_pending' && role === 'ADVISOR' ? (
        <PendingApprovalsView onSelectODRequest={(od) => setSelectedOD(od)} />
      ) : (
        <DashboardView
          onOpenApplyOD={() => setIsApplyODOpen(true)}
          onOpenAddCourse={() => setIsAddCourseOpen(true)}
          onSelectODRequest={(od) => setSelectedOD(od)}
          onNavigateTab={(tab) => {
            if (tab === 'requests') setActiveTab('student_requests');
            if (tab === 'courses') setActiveTab('student_courses');
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

      <AddCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        onSubmitted={() => {
          setActiveTab('student_courses');
          setSelectedOD(null);
        }}
      />
    </SidebarLayout>
  );
}
