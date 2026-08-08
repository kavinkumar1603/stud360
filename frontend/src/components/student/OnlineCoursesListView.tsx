import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OnlineCourse } from '../../types';
import {
  Plus,
  BookOpen,
  Calendar,
  Download,
  Clock,
  XCircle,
  ExternalLink,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface OnlineCoursesListViewProps {
  onOpenAddCourse: () => void;
}

export const OnlineCoursesListView: React.FC<OnlineCoursesListViewProps> = ({
  onOpenAddCourse
}) => {
  const { currentStudent, academicYear: globalAY, semester: globalSem, onlineCourses, updateOnlineCourseStatus } = useApp();

  const [filterYear, setFilterYear] = useState<string>('ALL');
  const [filterSem, setFilterSem] = useState<string>('ALL');
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const myCourses = onlineCourses.filter((c) => c.student_id === currentStudent.id);

  const filteredCourses = myCourses.filter((c) => {
    if (filterYear !== 'ALL' && c.academic_year !== filterYear) return false;
    if (filterSem !== 'ALL' && c.semester !== filterSem) return false;
    if (filterPlatform !== 'ALL' && c.platform !== filterPlatform) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Card: Filter & Header Bar (Matching Image 1) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">My Online Courses</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage and track your external certifications
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Years</option>
            <option value="2023-2024">AY 2023-24</option>
            <option value="2024-2025">AY 2024-25</option>
          </select>

          {/* Semester Filter */}
          <select
            value={filterSem}
            onChange={(e) => setFilterSem(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Semesters</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
          </select>

          {/* Platform Filter */}
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Platforms</option>
            <option value="NPTEL">NPTEL</option>
            <option value="Coursera">Coursera</option>
            <option value="Udemy">Udemy</option>
            <option value="edX">edX</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Enrolled">Waiting</option>
          </select>

          {/* Add Course CTA */}
          <button
            id="btn-add-course-page"
            onClick={onOpenAddCourse}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Course</span>
          </button>

        </div>
      </div>

      {/* Course Cards Grid (Matching Image 1) */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <p className="text-xs text-slate-500 font-medium">No online courses matching selected filters.</p>
          <button
            onClick={onOpenAddCourse}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((crs, idx) => {
            const isCompleted = crs.status === 'Completed';
            const isInProgress = crs.status === 'In Progress';
            const isWaiting = crs.status === 'Enrolled';

            const courseCode = `CS40${idx + 1} • ${crs.platform.toUpperCase()}`;
            const accentColor = isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-blue-600' : 'bg-amber-500';
            const pillColor = isCompleted
              ? 'bg-emerald-100 text-emerald-800'
              : isInProgress
              ? 'bg-blue-100 text-blue-800'
              : 'bg-amber-100 text-amber-800';

            return (
              <div
                key={crs.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all relative"
              >
                {/* Top Accent Stripe */}
                <div className={`h-1.5 w-full ${accentColor}`} />

                <div className="p-6 space-y-5">
                  {/* Top Row: Icon + Code + Status Pill */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCompleted ? 'bg-emerald-50 text-emerald-600' : isInProgress ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">
                          {courseCode}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${pillColor}`}>
                          {isCompleted ? 'COMPLETED' : isInProgress ? 'IN PROGRESS' : 'WAITING'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {crs.course_name}
                  </h3>

                  {/* Middle Progress / Status Info */}
                  {isCompleted ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-slate-500">
                        <span>Progress</span>
                        <span className="font-bold text-slate-900">100%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-full rounded-full" />
                      </div>
                    </div>
                  ) : isInProgress ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-slate-500">
                        <span>Progress</span>
                        <span className="font-bold text-slate-900">65%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[65%] rounded-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                      <span className="text-xs font-bold text-slate-800 block">Pending Advisor Approval</span>
                    </div>
                  )}

                </div>

                {/* Card Footer (Matching Image 1) */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-bold">
                  {isCompleted ? (
                    <>
                      <span className="text-emerald-700 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4" /> Certificate Earned
                      </span>
                      <a
                        href={crs.certificate_url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                      >
                        Download <Download className="w-3.5 h-3.5" />
                      </a>
                    </>
                  ) : isInProgress ? (
                    <>
                      <span className="text-slate-500 flex items-center gap-1 font-normal">
                        <Calendar className="w-3.5 h-3.5" /> Due: Dec 15
                      </span>
                      <button
                        onClick={() => updateOnlineCourseStatus(crs.id, 'Completed')}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        View Details →
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-500 flex items-center gap-1 font-normal">
                        <Clock className="w-3.5 h-3.5" /> Submitted: Oct 12
                      </span>
                      <button
                        className="text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                      >
                        Cancel Request ✕
                      </button>
                    </>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
