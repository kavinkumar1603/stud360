'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, FileText, Briefcase, AlertCircle, ChevronRight, User } from 'lucide-react';
import { format } from 'date-fns';
import { ODRequest, LeaveApplication } from '@/types';

interface AdvisorDashboardViewProps {
  onSelectODRequest: (od: ODRequest) => void;
  onSelectLeaveRequest?: (l: LeaveApplication) => void;
  onNavigateTab: (tab: 'requests' | 'all_requests' | 'students' | 'leaves' | 'all_leaves') => void;
}

export const AdvisorDashboardView: React.FC<AdvisorDashboardViewProps> = ({
  onSelectODRequest,
  onSelectLeaveRequest,
  onNavigateTab
}) => {
  const { currentAdvisor, students, odRequests, leaveApplications, academicYear, semester } = useApp();

  const isTutor = currentAdvisor?.title === 'tutor';

  // Get cohort IDs
  const myStudentIds = students.filter(s => s.advisor_id === currentAdvisor?.id || s.tutor_id === currentAdvisor?.id).map(s => s.id);

  // If Tutor -> Show Leaves metrics. If Advisor -> Show OD metrics.
  
  // ADVISOR METRICS
  const cohortODs = odRequests.filter(od => myStudentIds.includes(od.student_id));
  const pendingODs = cohortODs.filter(od => od.advisor_status === 'PENDING');

  // TUTOR METRICS
  const cohortLeaves = (leaveApplications || []).filter(l => myStudentIds.includes(l.student_id));
  const pendingLeaves = cohortLeaves.filter(l => l.tutor_status === 'PENDING');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{isTutor ? 'Tutor Dashboard' : 'Advisor Dashboard'}</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Overview for <span className="text-amber-600 font-bold">{academicYear}</span> • <span className="text-amber-600 font-bold">{semester}</span>
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div 
          onClick={() => onNavigateTab(isTutor ? 'leaves' : 'requests')}
          className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-600">
                <Clock className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Pending {isTutor ? 'Leaves' : 'Approvals'}</h2>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs text-amber-500 group-hover:scale-110 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-amber-900">{isTutor ? pendingLeaves.length : pendingODs.length}</span>
            <span className="text-xs font-semibold text-amber-700/70 block mt-1">Action Required</span>
          </div>
        </div>

        {/* Total Applications */}
        <div 
          onClick={() => onNavigateTab(isTutor ? 'all_leaves' : 'all_requests')}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-600">
                {isTutor ? <Briefcase className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                <h2 className="text-sm font-bold uppercase tracking-wider">Total {isTutor ? 'Leaves Applied' : 'OD Applied'}</h2>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shadow-xs text-slate-400 group-hover:scale-110 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-slate-900">{isTutor ? cohortLeaves.length : cohortODs.length}</span>
            <span className="text-xs font-semibold text-slate-500 block mt-1">All-time (Till Date)</span>
          </div>
        </div>
      </div>

      {/* Quick Action: Recent Pending */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">Recent Pending {isTutor ? 'Leaves' : 'Requests'}</h2>
          </div>
          <button 
            onClick={() => onNavigateTab(isTutor ? 'leaves' : 'requests')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {(isTutor ? pendingLeaves : pendingODs).length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">
              No pending {isTutor ? 'leaves' : 'requests'} found for your cohort.
            </div>
          ) : (
            (isTutor ? pendingLeaves : pendingODs).slice(0, 5).map(req => {
              const student = students.find(s => s.id === req.student_id);
              return (
                <div 
                  key={req.id} 
                  onClick={() => {
                    if (isTutor) {
                      onSelectLeaveRequest?.(req as LeaveApplication);
                    } else {
                      onSelectODRequest(req as ODRequest);
                    }
                  }}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {student?.name || 'Unknown Student'}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {isTutor ? (req as LeaveApplication).leave_type : (req as ODRequest).event_category || (req as ODRequest).request_type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-black tracking-wider uppercase">
                      Pending
                    </span>
                    <p className="text-[11px] font-semibold text-slate-400 mt-2">
                      {format(new Date(req.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Action: Recent All Applications */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            {isTutor ? <Briefcase className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-blue-500" />}
            <h2 className="text-sm font-bold text-slate-900">Recent {isTutor ? 'Leave' : 'OD'} Applications</h2>
          </div>
          <button 
            onClick={() => onNavigateTab(isTutor ? 'all_leaves' : 'all_requests')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {(isTutor ? cohortLeaves : cohortODs).length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">
              No applications found for your cohort.
            </div>
          ) : (
            (isTutor ? cohortLeaves : cohortODs).slice(0, 5).map(req => {
              const student = students.find(s => s.id === req.student_id);
              const status = isTutor ? (req as LeaveApplication).tutor_status : (req as ODRequest).advisor_status;
              return (
                <div 
                  key={req.id} 
                  onClick={() => {
                    if (isTutor) {
                      onSelectLeaveRequest?.(req as LeaveApplication);
                    } else {
                      onSelectODRequest(req as ODRequest);
                    }
                  }}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {student?.name || 'Unknown Student'}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {isTutor ? (req as LeaveApplication).leave_type : (req as ODRequest).event_category || (req as ODRequest).request_type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2.5 py-1 border rounded-full text-[10px] font-black tracking-wider uppercase ${
                      status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {status || 'PENDING'}
                    </span>
                    <p className="text-[11px] font-semibold text-slate-400 mt-2">
                      {format(new Date(req.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
