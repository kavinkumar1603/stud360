import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusPill } from '../StatusPill';
import { formatDateRange } from '../../utils/validation';
import { ODRequest } from '../../types';
import {
  FileText,
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface DashboardViewProps {
  onOpenApplyOD: () => void;
  onOpenAddCourse: () => void;
  onSelectODRequest: (od: ODRequest) => void;
  onNavigateTab: (tab: 'requests' | 'courses') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenApplyOD,
  onOpenAddCourse,
  onSelectODRequest,
  onNavigateTab
}) => {
  const { currentStudent, academicYear, semester, odRequests, onlineCourses } = useApp();

  // Filter student data scoped to current academic_year + semester
  const studentODs = odRequests.filter(
    (od) =>
      (od.student_id === currentStudent.id || od.team_members.some((m) => m.student_id === currentStudent.id)) &&
      od.academic_year === academicYear &&
      od.semester === semester
  );

  const studentCourses = onlineCourses.filter(
    (c) => c.student_id === currentStudent.id && c.academic_year === academicYear && c.semester === semester
  );

  // Count Badges calculations
  const countODPending = studentODs.filter(
    (od) => od.advisor_status === 'PENDING' || (od.advisor_status === 'APPROVED' && od.od_final_status === 'PENDING')
  ).length;

  const countODApproved = studentODs.filter((od) => od.od_final_status === 'APPROVED').length;

  const countODRejected = studentODs.filter(
    (od) => od.advisor_status === 'REJECTED' || od.od_final_status === 'REJECTED'
  ).length;

  const countCoursesCompleted = studentCourses.filter((c) => c.status === 'Completed').length;
  const countCoursesInProgress = studentCourses.filter((c) => c.status === 'In Progress' || c.status === 'Enrolled').length;

  return (
    <div className="space-y-6">
      
      {/* Top Title & Primary Action Buttons (Matching Screenshot 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Overview of your academic requests and progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-dashboard-apply-od"
            onClick={onOpenApplyOD}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for OD</span>
          </button>

          <button
            id="btn-dashboard-add-course"
            onClick={onOpenAddCourse}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Top 2-Column Summary Cards (Exact Layout from Image 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2-Cols: On-Duty (OD) Requests Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50/90 to-indigo-50/60 border border-blue-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">On-Duty (OD) Requests</h2>
              </div>
              <p className="text-xs text-slate-600 max-w-md">
                Track your current semester leave requests and their approval statuses across different departments.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-3xl font-extrabold text-slate-900">{studentODs.length}</span>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Total Semester
              </span>
            </div>
          </div>

          {/* 3 Status Stat Boxes */}
          <div className="grid grid-cols-3 gap-3">
            
            <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Pending</span>
                <span className="text-xl font-bold text-slate-900">{countODPending}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Approved</span>
                <span className="text-xl font-bold text-slate-900">{countODApproved}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Rejected</span>
                <span className="text-xl font-bold text-slate-900">{countODRejected}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>

        {/* Right 1-Col: Online Courses Dark Blue Card */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-200" />
              <h2 className="text-base font-bold">Online Courses</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
              Active
            </span>
          </div>

          {/* Donut Ring Progress */}
          <div className="flex items-center gap-4 py-2">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-white"
                  strokeDasharray="67, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-bold block leading-tight">2/3</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold">Credits Earned</p>
              <p className="text-[11px] text-blue-200">NPTEL / Coursera</p>
            </div>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <div>
              <span className="text-blue-200 text-[10px] uppercase font-bold block">In Progress</span>
              <span className="text-lg font-bold">{countCoursesInProgress}</span>
            </div>
            <div>
              <span className="text-blue-200 text-[10px] uppercase font-bold block">Completed</span>
              <span className="text-lg font-bold">{countCoursesCompleted}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom 2 Columns: Recent Activity & Upcoming Deadlines (Exact from Image 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity (Left 2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Recent Activity
            </h2>
            <button
              onClick={() => onNavigateTab('requests')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              View All
            </button>
          </div>

          {studentODs.length === 0 && studentCourses.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No recent activity on record.</p>
          ) : (
            <div className="space-y-3">
              {studentODs.slice(0, 3).map((od) => (
                <div
                  key={od.id}
                  onClick={() => onSelectODRequest(od)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{od.event_name}</h3>
                      <p className="text-[11px] text-slate-500">
                        OD Request for {formatDateRange(od.from_date, od.to_date)}
                      </p>
                    </div>
                  </div>

                  <StatusPill type="OD" odRequest={od} />
                </div>
              ))}

              {studentCourses.slice(0, 2).map((crs) => (
                <div
                  key={crs.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{crs.course_name}</h3>
                      <p className="text-[11px] text-slate-500">
                        {crs.platform} • {crs.duration}
                      </p>
                    </div>
                  </div>

                  <StatusPill type="COURSE" courseStatus={crs.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines & Explore Banner (Right 1 Column) */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
              Upcoming Deadlines
            </h2>

            <div className="space-y-3">
              
              {/* Deadline Item 1 */}
              <div className="p-3.5 rounded-xl bg-red-50/60 border-l-4 border-red-500 border border-slate-100 flex items-center gap-3">
                <div className="text-center px-2 py-1 bg-white rounded-lg border border-red-100 shrink-0">
                  <span className="text-[9px] font-extrabold uppercase text-red-500 block">OCT</span>
                  <span className="text-base font-black text-slate-900 leading-none">15</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">NPTEL Final Exam Registration</h3>
                  <p className="text-[11px] text-slate-500">Course: Cloud Computing Essentials</p>
                </div>
              </div>

              {/* Deadline Item 2 */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border-l-4 border-blue-500 border border-slate-100 flex items-center gap-3">
                <div className="text-center px-2 py-1 bg-white rounded-lg border border-blue-100 shrink-0">
                  <span className="text-[9px] font-extrabold uppercase text-blue-600 block">NOV</span>
                  <span className="text-base font-black text-slate-900 leading-none">02</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Submit Event Participation Proof</h3>
                  <p className="text-[11px] text-slate-500">For OD applied on Sep 20</p>
                </div>
              </div>

            </div>
          </div>

          {/* Explore Electives Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Catalog Available
              </span>
              <h3 className="text-sm font-bold">Explore Electives</h3>
              <p className="text-[11px] text-slate-300">Spring 2024 Course Catalog →</p>
            </div>
            <Sparkles className="w-8 h-8 text-indigo-400 opacity-60" />
          </div>
        </div>

      </div>

    </div>
  );
};
