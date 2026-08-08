import React from 'react';
import { useApp } from '../context/AppContext';
import { AcademicYear, Semester } from '../types';
import { GraduationCap, ShieldCheck, User, RotateCcw } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    academicYear,
    setAcademicYear,
    semester,
    setSemester,
    currentStudent,
    setCurrentStudent,
    currentAdvisor,
    setCurrentAdvisor,
    students,
    advisors,
    resetToDefaultData
  } = useApp();

  const ACADEMIC_YEARS: AcademicYear[] = ['2025-2026', '2024-2025', '2023-2024'];
  const SEMESTERS: Semester[] = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8'
  ];

  return (
    <header className="h-16 border-b border-[#E5E7EB] bg-white text-[#111827] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        
        {/* Brand & Portal Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-[#111827]">ACADEMIC OD</h1>
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider border border-indigo-100">
                {role} SHELL
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
              On-Duty Applications & Online Course Verification
            </p>
          </div>
        </div>

        {/* Dynamic Controls & Context */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Academic Context Selectors */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Context:</span>
            <div className="flex items-center bg-gray-100/90 rounded-md p-0.5 border border-gray-200">
              <select
                id="header-academic-year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
                className="text-xs font-semibold bg-transparent border-none rounded px-2 py-1 text-gray-800 focus:outline-none cursor-pointer"
              >
                {ACADEMIC_YEARS.map((ay) => (
                  <option key={ay} value={ay}>
                    AY {ay}
                  </option>
                ))}
              </select>
              <span className="text-gray-300 px-0.5">|</span>
              <select
                id="header-semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value as Semester)}
                className="text-xs font-semibold bg-transparent border-none rounded px-2 py-1 text-gray-800 focus:outline-none cursor-pointer"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role User Switch Dropdown */}
          {role === 'STUDENT' ? (
            <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-md border border-gray-200 text-xs">
              <User className="w-3.5 h-3.5 text-gray-500" />
              <select
                id="select-student-user"
                value={currentStudent.id}
                onChange={(e) => {
                  const found = students.find((s) => s.id === e.target.value);
                  if (found) setCurrentStudent(found);
                }}
                className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer max-w-[120px] sm:max-w-none truncate"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.roll_no})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-md border border-gray-200 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <select
                id="select-advisor-user"
                value={currentAdvisor.id}
                onChange={(e) => {
                  const found = advisors.find((a) => a.id === e.target.value);
                  if (found) setCurrentAdvisor(found);
                }}
                className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
              >
                {advisors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Role Mode Toggle Switch */}
          <div className="flex items-center p-0.5 bg-gray-100 rounded-md border border-gray-200">
            <button
              id="role-switch-student"
              onClick={() => setRole('STUDENT')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                role === 'STUDENT'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Student
            </button>
            <button
              id="role-switch-advisor"
              onClick={() => setRole('ADVISOR')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                role === 'ADVISOR'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Advisor
            </button>
          </div>

          {/* Reset Demo Data Button */}
          <button
            id="btn-reset-data"
            onClick={resetToDefaultData}
            title="Reset Demo Data"
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
