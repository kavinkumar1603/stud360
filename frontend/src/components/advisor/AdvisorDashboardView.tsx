'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, FileText, Briefcase, AlertCircle, ChevronRight, User, CheckCircle2, Users, FileCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ODRequest, LeaveApplication } from '@/types';
import { formatDateRange } from '../../utils/validation';

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
  const { currentAdvisor, students, advisors, odRequests, leaveApplications, academicYear, semester } = useApp();

  const isTutor = currentAdvisor?.title === 'tutor';

  // Get cohort IDs
  const myStudentIds = students.filter(s => s.advisor_id === currentAdvisor?.id || s.tutor_id === currentAdvisor?.id).map(s => s.id);

  // Check if a student belongs to the tutor's cohort/batch
  const isBatchStudent = (studentId: string, studentRoll?: string) => {
    if (!currentAdvisor) return false;
    if (studentId && students.some(s => s.id === studentId && (s.tutor_id === currentAdvisor.id || s.advisor_id === currentAdvisor.id))) return true;
    const s = students.find(st => st.id === studentId);
    const roll = (studentRoll || s?.roll_no || '').trim().toUpperCase();
    if (roll && currentAdvisor.email) {
      if (currentAdvisor.email.includes('kirubakaran') && /^24CS0(7[1-9]|8[0-9]|9[0-4])$/.test(roll)) return true;
      if (currentAdvisor.email.includes('geetha') && (/^24CS0(9[5-9])$/.test(roll) || /^24CS1(0[1-9]|1[0-9]|20)$/.test(roll))) return true;
    }
    return false;
  };

  const isBatchOD = (od: ODRequest) => {
    if (isBatchStudent(od.student_id, od.student_roll)) return true;
    if (Array.isArray(od.team_members) && od.team_members.some(m => isBatchStudent(m.student_id, m.roll_no))) return true;
    return false;
  };

  // For Tutors: OD requests of their batch members that have been approved by the advisor
  const approvedBatchODs = odRequests.filter(od => isBatchOD(od) && od.advisor_status === 'APPROVED');

  const getTutorName = (req: LeaveApplication) => {
    if (req.tutor_name) return req.tutor_name;
    if (req.tutor_id) {
      const tut = advisors.find(a => a.id === req.tutor_id);
      if (tut) return tut.name;
    }
    const student = students.find(s => s.id === req.student_id);
    if (student?.tutor_id) {
      const tut = advisors.find(a => a.id === student.tutor_id);
      if (tut) return tut.name;
    }

    const roll = (req.student_roll || student?.roll_no || '').trim().toUpperCase();
    if (roll) {
      if (/^24CS0(7[1-9]|8[0-9]|9[0-4])$/.test(roll)) {
        const tut = advisors?.find(a => a.name.toLowerCase().includes('kirubakaran') || a.email.includes('kirubakaran'));
        if (tut) return tut.name;
        return 'Kirubakaran K';
      }
      if (/^24CS0(9[5-9])|24CS1(0[1-9]|1[0-9]|20)$/.test(roll)) {
        const tut = advisors?.find(a => a.name.toLowerCase().includes('geetha') || a.email.includes('geetha'));
        if (tut) return tut.name;
        return 'Geetha N';
      }
    }
    return null;
  };

  // ADVISOR METRICS
  const cohortODs = odRequests.filter(od => myStudentIds.includes(od.student_id));
  const pendingODs = cohortODs.filter(od => od.advisor_status === 'PENDING');

  // LEAVES METRICS
  const cohortLeaves = (leaveApplications || []).filter(l => l.advisor_id === currentAdvisor?.id || l.tutor_id === currentAdvisor?.id || myStudentIds.includes(l.student_id));
  const pendingLeaves = cohortLeaves.filter(l => {
    if (l.tutor_status === 'APPROVED' || l.advisor_status === 'APPROVED') return false;
    return isTutor ? l.tutor_status === 'PENDING' : l.advisor_status === 'PENDING';
  });

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
      <div className={`grid grid-cols-1 ${isTutor ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        {/* Card 1: Pending Action */}
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

        {/* For Tutor: Card 2: Batch Approved ODs */}
        {isTutor && (
          <div 
            onClick={() => onNavigateTab('requests')}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <h2 className="text-sm font-bold uppercase tracking-wider">Batch Approved ODs</h2>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shadow-xs text-emerald-600 group-hover:scale-110 transition-transform">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-4xl font-black text-slate-900">{approvedBatchODs.length}</span>
              <span className="text-xs font-semibold text-slate-500 block mt-1">View Approved Records</span>
            </div>
          </div>
        )}

        {/* Card: Total Applications */}
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
                    if (isTutor || 'leave_type' in req) {
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
                        {student?.name || (req as LeaveApplication).student_name || 'Unknown Student'}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {isTutor || 'leave_type' in req 
                          ? `${(req as LeaveApplication).leave_type} Leave ${getTutorName(req as LeaveApplication) ? `• Tutor: ${getTutorName(req as LeaveApplication)}` : ''}` 
                          : (req as ODRequest).event_category || (req as ODRequest).request_type}
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

      {/* For Tutor: Batch Students' Approved ODs */}
      {isTutor && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Batch Students' Approved ODs</h2>
                <p className="text-[11px] text-slate-500 font-medium">View approved On-Duty records for students in your batch</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('requests')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View All ({approvedBatchODs.length})
            </button>
          </div>
          
          <div className="divide-y divide-slate-100">
            {approvedBatchODs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm font-medium">
                No advisor-approved OD applications found for your batch members.
              </div>
            ) : (
              approvedBatchODs.slice(0, 5).map(od => {
                const isPrimary = isBatchStudent(od.student_id, od.student_roll);
                const batchTeamMember = !isPrimary && Array.isArray(od.team_members) 
                  ? od.team_members.find(m => isBatchStudent(m.student_id, m.roll_no))
                  : null;

                return (
                  <div 
                    key={od.id} 
                    onClick={() => onSelectODRequest(od)}
                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        {od.request_type === 'Team' ? <Users className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {od.student_name} ({od.student_roll})
                          </p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            od.request_type === 'Team' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {od.request_type}
                          </span>
                          {batchTeamMember && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              Batch Member: {batchTeamMember.name} ({batchTeamMember.roll_no})
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          {od.event_name} • <span className="text-slate-500">{formatDateRange(od.from_date, od.to_date)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black tracking-wider uppercase">
                        <CheckCircle2 className="w-3 h-3" />
                        Advisor Approved
                      </span>
                      <p className="text-[11px] font-semibold text-slate-400 mt-2">
                        {format(new Date(od.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

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
              const status = isTutor || 'leave_type' in req 
                ? (((req as LeaveApplication).tutor_status === 'APPROVED' || (req as LeaveApplication).advisor_status === 'APPROVED') 
                    ? 'APPROVED' 
                    : (isTutor ? (req as LeaveApplication).tutor_status : (req as LeaveApplication).advisor_status))
                : (req as ODRequest).advisor_status;
              return (
                <div 
                  key={req.id} 
                  onClick={() => {
                    if (isTutor || 'leave_type' in req) {
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
                        {student?.name || (req as LeaveApplication).student_name || 'Unknown Student'}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {isTutor || 'leave_type' in req 
                          ? `${(req as LeaveApplication).leave_type} Leave ${getTutorName(req as LeaveApplication) ? `• Tutor: ${getTutorName(req as LeaveApplication)}` : ''}` 
                          : (req as ODRequest).event_category || (req as ODRequest).request_type}
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
