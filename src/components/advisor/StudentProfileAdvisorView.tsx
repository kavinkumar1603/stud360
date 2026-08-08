'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ODRequest, Student } from '../../types';
import { StatusPill } from '../StatusPill';
import { CourseVerifyToggle } from './CourseVerifyToggle';
import { formatDateRange } from '../../utils/validation';
import { ArrowLeft, FileText, BookOpen, Mail, ExternalLink, ChevronRight } from 'lucide-react';

interface StudentProfileAdvisorViewProps {
  student: Student;
  onBack: () => void;
  onSelectODRequest: (od: ODRequest) => void;
}

export const StudentProfileAdvisorView: React.FC<StudentProfileAdvisorViewProps> = ({
  student,
  onBack,
  onSelectODRequest
}) => {
  const { odRequests, onlineCourses } = useApp();

  const [activeTab, setActiveTab] = useState<'od_history' | 'online_courses'>('od_history');

  // Find all OD history for this student
  const studentODHistory = odRequests.filter(
    (od) => od.student_id === student.id || od.team_members.some((m) => m.student_id === student.id)
  );

  // Online courses for this student
  const studentCourses = onlineCourses.filter((c) => c.student_id === student.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Navigation */}
      <button
        id="btn-back-students-list"
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Advisee List</span>
      </button>

      {/* Student Profile Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
          {student.name.split(' ').map((n) => n[0]).join('')}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold text-slate-900">{student.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
              Advisee Profile
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Roll Number: <span className="font-semibold text-slate-800">{student.roll_no}</span> • {student.department} • {student.semester}
          </p>
          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{student.email}</span>
          </p>
        </div>
      </div>

      {/* Tabs: OD History | Online Courses */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          id="tab-advisor-student-od"
          onClick={() => setActiveTab('od_history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'od_history'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>OD History ({studentODHistory.length})</span>
        </button>

        <button
          id="tab-advisor-student-courses"
          onClick={() => setActiveTab('online_courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'online_courses'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Online Courses ({studentCourses.length})</span>
        </button>
      </div>

      {/* Tab Content 1: OD History */}
      {activeTab === 'od_history' && (
        <div>
          {studentODHistory.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2 text-slate-500 text-xs">
              No OD applications on record for this student.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
              {studentODHistory.map((od) => (
                <div
                  key={od.id}
                  onClick={() => onSelectODRequest(od)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {od.request_type}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {od.event_name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatDateRange(od.from_date, od.to_date)} • {od.academic_year} ({od.semester})
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusPill type="OD" odRequest={od} />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Online Courses */}
      {activeTab === 'online_courses' && (
        <div>
          {studentCourses.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2 text-slate-500 text-xs">
              No online courses logged by this student yet.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
              {studentCourses.map((crs) => (
                <div
                  key={crs.id}
                  className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {crs.platform}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {crs.course_name}
                      </h3>
                      <StatusPill type="COURSE" courseStatus={crs.status} />
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{crs.provider || crs.platform}</span>
                      <span>•</span>
                      <span>Duration: {crs.duration}</span>
                      {crs.grade && <span className="font-bold text-amber-600">• Grade: {crs.grade}</span>}
                    </p>

                    {crs.cert_drive_link && (
                      <div className="pt-1">
                        <a
                          href={crs.cert_drive_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-sky-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Certificate Link</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Course Verify Toggle */}
                  <div className="shrink-0 self-start sm:self-center">
                    <CourseVerifyToggle course={crs} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
