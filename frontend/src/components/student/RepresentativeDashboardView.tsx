'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

export const RepresentativeDashboardView: React.FC = () => {
  const { currentStudent, students, leaveApplications } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  
  // Representative should only see leaves for students in their same class
  const sameClassStudents = students.filter(s => s.class_id === currentStudent.class_id);
  const validStudentIds = new Set(sameClassStudents.map(s => s.id));
  const classLeaves = leaveApplications.filter(l => validStudentIds.has(l.student_id));
  const filteredLeaves = classLeaves.filter(l => filter === 'ALL' || l.advisor_status === filter);

  // Stats should reflect their class
  const totalStudents = sameClassStudents.length;
  
  // Calculate how many students are on leave today (approved leaves only)
  const today = new Date().toISOString().split('T')[0];
  const todaysLeaves = classLeaves.filter(l => {
    if (l.advisor_status !== 'APPROVED') return false;
    if (l.no_of_days === 1) {
      return l.on_date === today;
    } else {
      return l.from_date && l.to_date && l.from_date <= today && l.to_date >= today;
    }
  }).length;

  const totalLeaves = classLeaves.length;
  const approvedLeaves = classLeaves.filter(l => l.advisor_status === 'APPROVED').length;
  const pendingLeaves = classLeaves.filter(l => l.advisor_status === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Class Representative Dashboard
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Overview of leave applications and approvals for all batches in the portal.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</p>
            <p className="text-2xl font-black text-slate-900">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">On Leave Today</p>
            <p className="text-2xl font-black text-slate-900">{todaysLeaves}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-black text-slate-900">{approvedLeaves}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-slate-900">{pendingLeaves}</p>
          </div>
        </div>
      </div>

      {/* Leave List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900">Leave Applications</h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                  filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.map(leave => {
                let isToday = false;
                if (leave.no_of_days === 1) {
                  isToday = leave.on_date === today;
                } else if (leave.from_date && leave.to_date) {
                  isToday = leave.from_date <= today && leave.to_date >= today;
                }

                return (
                  <tr key={leave.id} className={`transition-colors ${isToday && leave.advisor_status === 'APPROVED' ? 'bg-purple-50/50 hover:bg-purple-50' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-bold text-slate-900">{leave.student_name}</p>
                          <p className="text-[11px] font-semibold text-slate-500">{leave.student_roll}</p>
                        </div>
                        {isToday && leave.advisor_status === 'APPROVED' && (
                          <span className="ml-2 px-2 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-700 uppercase tracking-wider">
                            Absent Today
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">
                        {leave.leave_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{leave.no_of_days} Day(s)</p>
                      <p className="text-[11px] text-slate-500">
                        {leave.no_of_days === 1 ? leave.on_date : `${leave.from_date} to ${leave.to_date}`}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                        leave.advisor_status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        leave.advisor_status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {leave.advisor_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No leave applications found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
