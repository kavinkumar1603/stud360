'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Building, Phone, ShieldCheck, Users } from 'lucide-react';

export const AdvisorProfileView: React.FC = () => {
  const { currentAdvisor, students } = useApp();

  if (!currentAdvisor?.name) return null;

  const myStudents = students.filter((s) => s.advisor_id === currentAdvisor.id || s.tutor_id === currentAdvisor.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Profile Card Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
          {currentAdvisor.name.split(' ').map((n) => n[0]).join('')}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold text-slate-900">{currentAdvisor.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
              Faculty Advisor
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-800">
            {currentAdvisor.title}
          </p>
          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 pt-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentAdvisor.email}</span>
          </p>
          {currentAdvisor.phone && (
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentAdvisor.phone}</span>
            </p>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Academic Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-amber-600" />
            Department Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Department</span>
              <span className="font-bold text-slate-800">{currentAdvisor.department}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Designation</span>
              <span className="font-bold text-slate-800">{currentAdvisor.title}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">System Role</span>
              <span className="font-bold text-amber-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Users className="w-4 h-4 text-orange-600" />
            Advisory Statistics
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center h-[104px]">
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col items-center justify-center">
              <div className="text-xl font-black text-amber-600">{myStudents.length}</div>
              <div className="text-[11px] font-semibold text-slate-500">Assigned Students</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
