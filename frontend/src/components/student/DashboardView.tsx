'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../StatusPill';
import { formatDateRange } from '../../utils/validation';
import { ODRequest } from '../../types';
import {
  FileText,
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';

interface DashboardViewProps {
  onOpenApplyOD: () => void;
  onSelectODRequest: (od: ODRequest) => void;
  onNavigateTab: (tab: 'requests' ) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenApplyOD,
  onSelectODRequest,
  onNavigateTab
}) => {
  const { currentStudent, academicYear, semester, odRequests , advisors, deadlines } = useApp();

  const myAdvisor = advisors.find((a) => a.id === currentStudent.advisor_id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const myDeadlines = deadlines.filter((d) => {
    if (d.advisor_id !== currentStudent.advisor_id) return false;
    const dueDate = new Date(d.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate >= today;
  });

  // Filter student data
  const studentODs = odRequests.filter(
    (od) =>
      (od.student_id === currentStudent.id || od.team_members.some((m) => m.student_id === currentStudent.id))
  );


  // Count Badges calculations
  const countODPending = studentODs.filter((od) => od.advisor_status === 'PENDING').length;
  const countODApproved = studentODs.filter((od) => od.advisor_status === 'APPROVED').length;
  const countODRejected = studentODs.filter((od) => od.advisor_status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Welcome back, {currentStudent?.name?.split(' ')[0] || 'Student'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentStudent?.roll_no} • {currentStudent?.department}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenApplyOD}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
          >
            <Plus className="w-4 h-4" />
            <span>Apply OD</span>
          </button>
          <button
            onClick={() => {
              // Dispatch a custom event to open the leave modal
              const event = new CustomEvent('open-apply-leave');
              window.dispatchEvent(event);
            }}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-teal-200 dark:shadow-none"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* Top 2-Column Summary Cards (Exact Layout from Image 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2-Cols: On-Duty (OD) Requests Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50/90 to-indigo-50/60 border border-blue-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">On-Duty (OD) Requests</h2>
              </div>
              <p className="text-xs text-slate-600 max-w-md">
                Track your current semester leave requests and their approval statuses across different departments.
              </p>
            </div>

            
          </div>

          {/* 3 Status Stat Boxes */}
          <div className="grid grid-cols-3 gap-3">
            
            <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Pending</span>
                <span className="text-xl font-bold text-slate-900">{countODPending}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Approved</span>
                <span className="text-xl font-bold text-slate-900">{countODApproved}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Rejected</span>
                <span className="text-xl font-bold text-slate-900">{countODRejected}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>

        {/* Right 1-Col: My Advisor Card (Horizontal Layout) */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-center h-full group">
          {/* Decorative background flair */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-10 translate-x-10 transition-transform duration-700 group-hover:scale-150"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            {/* Avatar on the Left */}
            <div className="w-20 h-20 shrink-0 rounded-full bg-white p-1 shadow-md border border-indigo-100">
              <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                {myAdvisor?.avatar ? (
                  <img src={myAdvisor.avatar} alt="Advisor" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-indigo-500">
                    {myAdvisor?.name?.charAt(0) || 'A'}
                  </span>
                )}
              </div>
            </div>

            {/* Details on the Right */}
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Advisor
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                {myAdvisor?.name || 'Unassigned'}
              </h2>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {myAdvisor?.department || 'Department'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {myAdvisor?.title || 'Faculty'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom 2 Columns: Recent Activity & Upcoming Deadlines (Exact from Image 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity (Left 2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Recent Activity
            </h2>
            <button
              onClick={() => onNavigateTab('requests')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              View All
            </button>
          </div>

          {studentODs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No recent activity on record.</p>
          ) : (
            <div className="space-y-3">
              {studentODs.slice(0, 3).map((od) => (
                <div
                  key={od.id}
                  onClick={() => onSelectODRequest(od)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{od.event_name}</h3>
                      <p className="text-[11px] text-slate-500">
                        OD Request for {formatDateRange(od.from_date, od.to_date)}
                      </p>
                    </div>
                  </div>

                  <StatusPill type="OD" odRequest={od} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines & Explore Banner (Right 1 Column) */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
              Upcoming Deadlines
            </h2>

            <div className="space-y-3">
              {myDeadlines.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
                  No upcoming deadlines.
                </p>
              ) : (
                myDeadlines.map((dl, index) => {
                  const date = new Date(dl.due_date);
                  const month = date.toLocaleString('default', { month: 'short' });
                  const day = date.getDate().toString().padStart(2, '0');
                  
                  // Alternate colors for a dynamic look
                  const isRed = index % 2 === 0;
                  const bgClass = isRed ? 'bg-red-50/60' : 'bg-blue-50/60';
                  const borderLeftClass = isRed ? 'border-red-500' : 'border-blue-500';
                  const textClass = isRed ? 'text-red-500' : 'text-blue-600';
                  const borderIconClass = isRed ? 'border-red-100' : 'border-blue-100';

                  return (
                    <div key={dl.id} className={`p-3.5 rounded-xl ${bgClass} border-l-4 ${borderLeftClass} border border-slate-100 flex items-center gap-3`}>
                      <div className={`text-center px-2 py-1 bg-white rounded-lg border ${borderIconClass} shrink-0`}>
                        <span className={`text-[9px] font-extrabold uppercase ${textClass} block`}>{month}</span>
                        <span className="text-base font-black text-slate-900 leading-none">{day}</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{dl.title}</h3>
                        {dl.description && <p className="text-[11px] text-slate-500">{dl.description}</p>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
