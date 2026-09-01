'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

export const RepresentativeDashboardView: React.FC = () => {
  const { currentStudent, students, leaveApplications } = useApp();

  // For representative, we already fetch leaves where advisor_id = currentStudent.advisor_id
  const cohortStudents = students.filter(s => s.advisor_id === currentStudent.advisor_id);
  
  const totalStudents = cohortStudents.length;
  const totalLeaves = leaveApplications.length;
  const approvedLeaves = leaveApplications.filter(l => l.advisor_status === 'APPROVED').length;
  const pendingLeaves = leaveApplications.filter(l => l.advisor_status === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Class Representative Dashboard
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Overview of leave applications and approvals for your cohort.
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
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leaves</p>
            <p className="text-2xl font-black text-slate-900">{totalLeaves}</p>
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
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Leave Applications</h3>
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
              {leaveApplications.map(leave => (
                <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{leave.student_name}</p>
                    <p className="text-[11px] font-semibold text-slate-500">{leave.student_roll}</p>
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
              ))}
              {leaveApplications.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No leave applications found for your cohort.
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
