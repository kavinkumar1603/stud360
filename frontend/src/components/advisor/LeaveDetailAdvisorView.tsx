'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveApplication } from '../../types';
import {
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Briefcase
} from 'lucide-react';
import { format } from 'date-fns';

interface LeaveDetailAdvisorViewProps {
  leaveApplication: LeaveApplication;
  onBack: () => void;
}

export const LeaveDetailAdvisorView: React.FC<LeaveDetailAdvisorViewProps> = ({ leaveApplication, onBack }) => {
  const { leaveApplications, advisorReviewLeave, deleteLeaveApplication } = useApp();

  // Find live state from context
  const currentLeave = leaveApplications?.find((r) => r.id === leaveApplication.id) || leaveApplication;

  const [isActionPending, setIsActionPending] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this leave application? This action cannot be undone.')) {
      setIsActionPending(true);
      await deleteLeaveApplication(currentLeave.id);
      setIsActionPending(false);
      onBack();
    }
  };

  const handleApprove = async () => {
    setIsActionPending(true);
    await advisorReviewLeave(currentLeave.id, 'APPROVED');
    setIsActionPending(false);
  };

  const handleReject = async () => {
    setIsActionPending(true);
    await advisorReviewLeave(currentLeave.id, 'REJECTED');
    setIsActionPending(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-rose-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleDelete}
          disabled={isActionPending}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          <span>Remove Request</span>
        </button>
      </div>

      {/* Main Info Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-[10px] font-extrabold uppercase tracking-widest border border-teal-100">
                <Briefcase className="w-3.5 h-3.5" />
                {currentLeave.leave_type} Leave
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentLeave.student_name}
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              {currentLeave.student_roll} &bull; {currentLeave.semester} &bull; {currentLeave.scholar_type}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${
              currentLeave.advisor_status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              currentLeave.advisor_status === 'REJECTED' ? 'bg-rose-50 border-rose-200 text-rose-800' :
              'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              {getStatusIcon(currentLeave.advisor_status)}
              <span className="text-sm uppercase tracking-wide">{currentLeave.advisor_status}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Submitted on {format(new Date(currentLeave.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Leave Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Date of Leave
            </p>
            <p className="text-base font-semibold text-slate-900">
              {currentLeave.from_date ? `${currentLeave.from_date} to ${currentLeave.to_date}` : currentLeave.on_date}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Duration
            </p>
            <p className="text-base font-semibold text-slate-900">
              {currentLeave.no_of_days} Day(s)
            </p>
          </div>
        </div>

        {/* Purpose */}
        <div className="pt-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Reason / Purpose
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5">
            <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
              {currentLeave.purpose}
            </p>
          </div>
        </div>

        {/* Advisor Actions (Only if PENDING) */}
        {currentLeave.advisor_status === 'PENDING' && (
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Advisor Review Decision</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApprove}
                disabled={isActionPending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                Approve Leave
              </button>
              
              <button
                onClick={handleReject}
                disabled={isActionPending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-rose-600 text-rose-700 text-sm font-bold hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
                Reject Leave
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
