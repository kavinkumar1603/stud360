'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Search,
  Download,
  Mail,
  AlertTriangle,
  ClipboardList,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface MyStudentsViewProps {
  onSelectStudent: (student: Student) => void;
}

export const MyStudentsView: React.FC<MyStudentsViewProps> = ({ onSelectStudent }) => {
  const { currentAdvisor, students, odRequests } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'RISK' | 'BORDERLINE' | 'TRACK'>('ALL');

  const myAssignedStudents = students.filter((s) => s.advisor_id === currentAdvisor.id);

  // Extend mock students for rich table presentation matching Image 2
  const adviseeData = [
    {
      id: 'st-1',
      name: 'Priya Sharma',
      degree: 'B.Tech CS • Yr 3',
      roll_no: 'CS21045',
      cgpa: 6.8,
      attendance: 68,
      attendanceNote: '4 classes missed',
      status: 'RISK',
      pendingOD: 2,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'st-2',
      name: 'Arjun Reddy',
      degree: 'B.Tech CS • Yr 3',
      roll_no: 'CS21089',
      cgpa: 8.4,
      attendance: 92,
      attendanceNote: 'On Track',
      status: 'TRACK',
      pendingOD: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'st-3',
      name: 'David Chen',
      degree: 'B.Tech CS • Yr 3',
      roll_no: 'CS21102',
      cgpa: 7.2,
      attendance: 78,
      attendanceNote: 'Nearing limit',
      status: 'BORDERLINE',
      pendingOD: 1,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    }
  ];

  const filtered = adviseeData.filter((item) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.roll_no.toLowerCase().includes(q)) return false;
    }
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Cohort Actions (Matching Image 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Advisees</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">42</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl">
            Monitor academic progress, attendance anomalies, and review pending on-duty requests for your assigned cohort.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-xs flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm flex items-center gap-1.5 cursor-pointer">
            <Mail className="w-3.5 h-3.5" />
            <span>Message Cohort</span>
          </button>
        </div>
      </div>

      {/* Main Advisees Table Container (Matching Image 2) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="input-search-advisees"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll number, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>



        {/* Data Table - Scrollable Container */}
        <div className="overflow-x-auto overflow-y-auto max-h-[450px] pt-1 rounded-xl border border-slate-200/60 shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200">
              <tr className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 bg-slate-50">Student Details</th>
                <th className="py-3.5 px-4 bg-slate-50">Roll Number</th>
                <th className="py-3.5 px-4 bg-slate-50">Department</th>
                <th className="py-3.5 px-4 bg-slate-50">Year</th>
                <th className="py-3.5 px-4 bg-slate-50 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs bg-white">
              {myAssignedStudents
                .filter((s) => {
                  if (searchQuery.trim() !== '') {
                    const q = searchQuery.toLowerCase();
                    if (!s.name.toLowerCase().includes(q) && !s.roll_no.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) return false;
                  }
                  return true;
                })
                .map((st) => {
                  const pendingCount = odRequests.filter(r => r.student_id === st.id && r.advisor_status === 'PENDING').length;

                  return (
                    <tr
                      key={st.id}
                      onClick={() => onSelectStudent(st)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {/* STUDENT DETAILS */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {st.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{st.name}</div>
                            <div className="text-[11px] text-slate-500">{st.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* ROLL NUMBER */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {st.roll_no}
                      </td>

                      {/* DEPARTMENT */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {st.department} • {st.semester}
                      </td>

                      {/* YEAR (Replaced CGPA and removed Attendance) */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {st.semester.includes('1') || st.semester.includes('2') ? 'I' :
                           st.semester.includes('3') || st.semester.includes('4') ? 'II' :
                           st.semester.includes('5') || st.semester.includes('6') ? 'III' :
                           st.semester.includes('7') || st.semester.includes('8') ? 'IV' : 'N/A'}
                        </div>
                      </td>

                      {/* ACTION / PENDING OD */}
                      <td className="py-3.5 px-4 text-center">
                        {pendingCount > 0 ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            {pendingCount} Pending OD
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200">
                            View Profile →
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="p-2 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1-3 of 42 students</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-slate-200"><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-2.5 py-1 rounded font-bold bg-blue-600 text-white">1</button>
            <button className="px-2.5 py-1 rounded font-bold text-slate-600 hover:bg-slate-100">2</button>
            <button className="px-2.5 py-1 rounded font-bold text-slate-600 hover:bg-slate-100">3</button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-2.5 py-1 rounded font-bold text-slate-600 hover:bg-slate-100">14</button>
            <button className="p-1 rounded border border-slate-200"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>



    </div>
  );
};
