'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Class } from '../../types';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Users,
  BookOpen,
  Trash2
} from 'lucide-react';
import { AddStudentModal } from './AddStudentModal';
import { AddClassModal } from './AddClassModal';

interface MyStudentsViewProps {
  onSelectStudent: (student: Student) => void;
}

interface DisplayClass {
  id: string;
  name: string;
  isDynamic: boolean;
  studentsCount: number;
}

export const MyStudentsView: React.FC<MyStudentsViewProps> = ({ onSelectStudent }) => {
  const { currentAdvisor, students, odRequests, classes, addStudent, addClass, removeClass } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<DisplayClass | null>(null);

  const myAssignedStudents = students.filter((s) => s.advisor_id === currentAdvisor.id || s.tutor_id === currentAdvisor.id);
  const myAssignedClasses = classes.filter((c) => c.advisor_id === currentAdvisor.id);

  const dynamicClasses = useMemo(() => {
    const classMap = new Map<string, Student[]>();
    myAssignedStudents.forEach(st => {
      // Group students who don't have a specific explicit class_id
      if (st.class_id) return;
      
      const className = `${st.year || ''} ${st.department} ${st.section || ''}`.trim().replace(/\s+/g, ' ');
      if (!className) return;

      if (!classMap.has(className)) {
        classMap.set(className, []);
      }
      classMap.get(className)!.push(st);
    });
    return Array.from(classMap.entries()).map(([name, studentsList]) => ({ 
      id: name,
      name, 
      isDynamic: true,
      studentsCount: studentsList.length
    }));
  }, [myAssignedStudents]);

  const explicitClasses = myAssignedClasses.map(c => ({
    id: c.id,
    name: c.name,
    isDynamic: false,
    studentsCount: myAssignedStudents.filter(s => s.class_id === c.id).length
  }));

  const allDisplayClasses = [...dynamicClasses, ...explicitClasses];

  const studentsInSelectedClass = selectedClass 
    ? myAssignedStudents.filter(s => {
        if (selectedClass.isDynamic) {
          const sClassName = `${s.year || ''} ${s.department} ${s.section || ''}`.trim().replace(/\s+/g, ' ');
          return !s.class_id && sClassName === selectedClass.id;
        } else {
          return s.class_id === selectedClass.id;
        }
      })
    : [];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Cohort Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {selectedClass && (
              <button onClick={() => setSelectedClass(null)} className="mr-2 p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {selectedClass ? `${selectedClass.name} - Students` : 'My Advisees Cohorts'}
            </h1>
            {!selectedClass && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">{allDisplayClasses.length}</span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl">
            {selectedClass ? `Viewing students assigned to you in ${selectedClass.name}.` : 'Select a class cohort to view student details and academic progress.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedClass && (
            <button className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-xs flex items-center gap-1.5 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
          {!selectedClass && (
            <button 
              onClick={() => setIsAddClassModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Add Class</span>
            </button>
          )}
          {selectedClass && !selectedClass.isDynamic && (
            <button 
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${selectedClass.name}? Students will be unassigned but not deleted.`)) {
                  removeClass(selectedClass.id);
                  setSelectedClass(null);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Class</span>
            </button>
          )}
          {selectedClass && (
            <button 
              onClick={() => setIsAddStudentModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          )}
        </div>
      </div>

      {selectedClass === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDisplayClasses.map((cls) => (
            <div 
              key={cls.id} 
              onClick={() => setSelectedClass(cls)}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-blue-400 group flex flex-col justify-between min-h-[160px]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{cls.name || 'Unknown Class'}</h3>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                  {cls.studentsCount} Students Assigned {cls.isDynamic ? '(Auto)' : '(Custom)'}
                </p>
              </div>
            </div>
          ))}
          {allDisplayClasses.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-600">No classes assigned yet.</p>
              <button 
                onClick={() => setIsAddClassModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Add Your First Class
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll number, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[450px] pt-1 rounded-xl border border-slate-200/60 shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200">
              <tr className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 bg-slate-50">Student Details</th>
                <th className="py-3.5 px-4 bg-slate-50">Roll Number</th>
                <th className="py-3.5 px-4 bg-slate-50">Department</th>
                <th className="py-3.5 px-4 bg-slate-50 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs bg-white">
              {studentsInSelectedClass
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
              {studentsInSelectedClass.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">
                    No students found in this class. Add some to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        </div>
      )}

      <AddStudentModal 
        isOpen={isAddStudentModalOpen} 
        onClose={() => setIsAddStudentModalOpen(false)} 
        onAdd={addStudent}
        classId={selectedClass?.isDynamic ? undefined : selectedClass?.id}
      />

      <AddClassModal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        onAdd={addClass}
      />
    </div>
  );
};
