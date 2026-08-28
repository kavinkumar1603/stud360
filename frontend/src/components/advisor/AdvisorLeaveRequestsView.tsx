'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveApplication } from '../../types';
import { Clock, CheckCircle2, FileText, CheckCircle, XCircle, Trash2, Calendar, Briefcase } from 'lucide-react';

interface AdvisorLeaveRequestsViewProps {
  onSelectLeaveRequest: (leave: LeaveApplication) => void;
  defaultFilter?: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const AdvisorLeaveRequestsView: React.FC<AdvisorLeaveRequestsViewProps> = ({ 
  onSelectLeaveRequest,
  defaultFilter = 'PENDING'
}) => {
  const { currentAdvisor, leaveApplications, advisorReviewLeave, deleteLeaveApplication } = useApp();
  const [activeFilter, setActiveFilter] = useState(defaultFilter);
  const [selectedSem, setSelectedSem] = useState<string>('ALL');

  const allLeaveRequests = leaveApplications?.filter(
    (l) => l.advisor_id === currentAdvisor?.id
  ) || [];

  const displayedLeaves = allLeaveRequests.filter(l => {
    if (activeFilter !== 'ALL' && l.advisor_status !== activeFilter) return false;
    if (selectedSem !== 'ALL' && l.semester !== selectedSem) return false;
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleDeleteLeave = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this Leave application?')) {
      await deleteLeaveApplication(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-600" />
              Leave Applications
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Review and manage student Leave requests
            </p>
          </div>
        </div>

        {/* Global Filters: Semester (Inline with Header logic) */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-200">
          <div className="flex-1">
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Semesters</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
              <option value="Semester 7">Semester 7</option>
              <option value="Semester 8">Semester 8</option>
            </select>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 overflow-x-auto custom-scrollbar pb-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(tab => {
            const count = allLeaveRequests.filter(l => tab === 'ALL' || l.advisor_status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {displayedLeaves.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No {activeFilter === 'ALL' ? '' : activeFilter.toLowerCase()} leave applications</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              You're all caught up! There are no applications matching your current filters.
            </p>
          </div>
        ) : (
          displayedLeaves.map((l) => (
            <div 
              key={l.id}
              onClick={() => onSelectLeaveRequest(l)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col gap-4 cursor-pointer hover:border-teal-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                
                {/* Left: Student Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center shrink-0">
                    {l.student_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{l.student_name}</h3>
                    <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded-md">{l.student_roll}</span>
                      <span>&bull;</span>
                      <span>{l.semester}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto">
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 ${
                    l.advisor_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    l.advisor_status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {getStatusIcon(l.advisor_status)}
                    <span>{l.advisor_status}</span>
                  </div>
                </div>
              </div>

              {/* Leave Details Box */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 pb-3 border-b border-slate-200/60">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Leave Type</p>
                    <p className="text-xs font-semibold text-slate-700">{l.leave_type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Scholar Type</p>
                    <p className="text-xs font-semibold text-slate-700">{l.scholar_type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Duration</p>
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {l.no_of_days} Day(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Date</p>
                    <p className="text-xs font-semibold text-slate-700">
                      {l.from_date ? `${l.from_date} to ${l.to_date}` : l.on_date}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Purpose</p>
                  <p className="text-sm font-medium text-slate-800">{l.purpose}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={(e) => handleDeleteLeave(e, l.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                {l.advisor_status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); advisorReviewLeave(l.id, 'REJECTED'); }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); advisorReviewLeave(l.id, 'APPROVED'); }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
