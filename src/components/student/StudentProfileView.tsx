'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, GraduationCap, Building, ShieldCheck } from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { currentStudent, advisors, odRequests, onlineCourses } = useApp();

  const advisor = advisors.find((a) => a.id === currentStudent.advisor_id);

  const myODs = odRequests.filter(
    (od) => od.student_id === currentStudent.id || od.team_members.some((m) => m.student_id === currentStudent.id)
  );

  const myCourses = onlineCourses.filter((c) => c.student_id === currentStudent.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Profile Card Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
          {currentStudent.name.split(' ').map((n) => n[0]).join('')}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold text-slate-900">{currentStudent.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
              Student
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Roll Number: <span className="font-semibold text-slate-800">{currentStudent.roll_no}</span>
          </p>
          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentStudent.email}</span>
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Academic Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Academic Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Department</span>
              <span className="font-bold text-slate-800">{currentStudent.department}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Current Semester</span>
              <span className="font-bold text-slate-800">{currentStudent.semester}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Assigned Faculty Advisor</span>
              <span className="font-bold text-blue-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {advisor ? advisor.name : 'Dr. Sarah Jenkins'}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-sky-600" />
            Portal Statistics
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="text-xl font-black text-blue-600">{myODs.length}</div>
              <div className="text-[11px] font-semibold text-slate-500">Total OD Applied</div>
            </div>

            <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100">
              <div className="text-xl font-black text-sky-600">{myCourses.length}</div>
              <div className="text-[11px] font-semibold text-slate-500">Courses Logged</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
