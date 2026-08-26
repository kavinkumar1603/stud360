'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, FileText, BookOpen, AlertCircle, ChevronRight, User } from 'lucide-react';
import { format } from 'date-fns';
import { ODRequest } from '@/types';

interface AdvisorDashboardViewProps {
  onSelectODRequest: (od: ODRequest) => void;
  onNavigateTab: (tab: 'requests' | 'all_requests' | 'students') => void;
}

export const AdvisorDashboardView: React.FC<AdvisorDashboardViewProps> = ({
  onSelectODRequest,
  onNavigateTab
}) => {
  const { currentAdvisor, students, odRequests , academicYear, semester } = useApp();

  // Get cohort IDs
  const myStudentIds = students.filter(s => s.advisor_id === currentAdvisor?.id).map(s => s.id);

  // Filter Data by Cohort (All time / Till date)
  const cohortODs = odRequests.filter(
    od => myStudentIds.includes(od.student_id)
  );
  const pendingODs = cohortODs.filter(od => od.advisor_status === 'PENDING');
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Advisor Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Overview for <span className="text-amber-600 font-bold">{academicYear}</span> • <span className="text-amber-600 font-bold">{semester}</span>
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending ODs */}
        <div 
          onClick={() => onNavigateTab('requests')}
          className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-600">
                <Clock className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Pending Approvals</h2>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs text-amber-500 group-hover:scale-110 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-amber-900">{pendingODs.length}</span>
            <span className="text-xs font-semibold text-amber-700/70 block mt-1">Action Required</span>
          </div>
        </div>

        {/* Total ODs */}
        <div 
          onClick={() => onNavigateTab('all_requests')}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Total OD Applied</h2>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shadow-xs text-slate-400 group-hover:scale-110 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-slate-900">{cohortODs.length}</span>
            <span className="text-xs font-semibold text-slate-500 block mt-1">All-time (Till Date)</span>
          </div>
        </div>

      </div>

      {/* Quick Action: Recent Pending */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">Recent Pending Requests</h2>
          </div>
          <button 
            onClick={() => onNavigateTab('requests')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {pendingODs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">
              No pending requests found for your cohort.
            </div>
          ) : (
            pendingODs.slice(0, 5).map(od => {
              const student = students.find(s => s.id === od.student_id);
              return (
                <div 
                  key={od.id} 
                  onClick={() => onSelectODRequest(od)}
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
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{od.event_category || od.request_type}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-black tracking-wider uppercase">
                      Pending
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

      {/* Quick Action: Recent All ODs */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900">Recent OD Applications</h2>
          </div>
          <button 
            onClick={() => onNavigateTab('all_requests')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {cohortODs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">
              No OD applications found for your cohort.
            </div>
          ) : (
            cohortODs.slice(0, 5).map(od => {
              const student = students.find(s => s.id === od.student_id);
              return (
                <div 
                  key={od.id} 
                  onClick={() => onSelectODRequest(od)}
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
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{od.event_category || od.request_type}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2.5 py-1 border rounded-full text-[10px] font-black tracking-wider uppercase ${
                      od.advisor_status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      od.advisor_status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {od.advisor_status}
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
    </div>
  );
};
