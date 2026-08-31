'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdvisorODRequestsView } from './AdvisorODRequestsView';
import { MyStudentsView } from './MyStudentsView';
import { StudentProfileAdvisorView } from './StudentProfileAdvisorView';
import { ODDetailAdvisorView } from './ODDetailAdvisorView';
import { ODRequest, Student } from '../../types';
import { Clock, Users, ShieldCheck } from 'lucide-react';

type AdvisorTab = 'pending' | 'students';

export const AdvisorShell: React.FC = () => {
  const { currentAdvisor, odRequests, leaveApplications } = useApp();
  const [activeTab, setActiveTab] = useState<AdvisorTab>('pending');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedOD, setSelectedOD] = useState<ODRequest | null>(null);

  const pendingCount = odRequests.filter(
    (od) => od.advisor_id === currentAdvisor.id && od.advisor_status === 'PENDING'
  ).length + (leaveApplications?.filter(
    (l) => (l.advisor_id === currentAdvisor.id && l.advisor_status === 'PENDING') || (l.tutor_id === currentAdvisor.id && l.tutor_status === 'PENDING')
  )?.length || 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 text-[#111827] dark:text-slate-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Advisor Navigation Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-[#E5E7EB] dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              id="tab-advisor-pending"
              onClick={() => {
                setActiveTab('pending');
                setSelectedStudent(null);
                setSelectedOD(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pending' && !selectedStudent && !selectedOD
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pending Approvals</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold ml-1">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              id="tab-advisor-students"
              onClick={() => {
                setActiveTab('students');
                setSelectedStudent(null);
                setSelectedOD(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'students' || selectedStudent
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>My Advisee Students</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Faculty Advisor: {currentAdvisor.name} ({currentAdvisor.department})</span>
          </div>
        </div>

        {/* Dynamic View Rendering */}
        {selectedOD ? (
          <ODDetailAdvisorView
            odRequest={selectedOD}
            onBack={() => setSelectedOD(null)}
          />
        ) : selectedStudent ? (
          <StudentProfileAdvisorView
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
            onSelectODRequest={(od) => setSelectedOD(od)}
          />
        ) : activeTab === 'pending' ? (
          <AdvisorODRequestsView
            onSelectODRequest={(od) => setSelectedOD(od)}
            defaultFilter="PENDING"
          />
        ) : (
          <MyStudentsView
            onSelectStudent={(student) => setSelectedStudent(student)}
          />
        )}

      </div>
    </div>
  );
};
