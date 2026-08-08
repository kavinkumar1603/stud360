'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SidebarLayout, NavTab } from '@/components/SidebarLayout';
import { LoginPage } from '@/components/auth/LoginPage';
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
import { ODRequest, Student } from '@/types';

export default function Home() {
  const { isAuthenticated, role } = useApp();

  const [activeTab, setActiveTab] = useState<NavTab>('student_dashboard');
  const [selectedOD, setSelectedOD] = useState<ODRequest | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [isApplyODOpen, setIsApplyODOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  useEffect(() => {
    if (role === 'STUDENT' && (activeTab === 'advisor_students' || activeTab === 'advisor_pending')) {
      setActiveTab('student_dashboard');
    }
  }, [role, activeTab]);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedOD(null);
    setSelectedStudent(null);
  };

  if (!isAuthenticated) {
    return <LoginPage />;
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
        <StudentProfileView />
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
