'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Internship } from '../../types';
import {
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Search,
  ExternalLink,
  User,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  ArrowRight,
  Sparkles,
  Download
} from 'lucide-react';

interface AdvisorInternshipsViewProps {
  onSelectInternship: (internship: Internship) => void;
}

export const AdvisorInternshipsView: React.FC<AdvisorInternshipsViewProps> = ({
  onSelectInternship
}) => {
  const { currentAdvisor, internships, students } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Ongoing' | 'Completed'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Internal' | 'External'>('ALL');
  const [scopeFilter, setScopeFilter] = useState<'COHORT' | 'ALL'>('COHORT');
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>('ALL');

  const isTutor = currentAdvisor?.title === 'tutor';

  // Check if a student belongs to the advisor/tutor's cohort or batch
  const isBatchStudent = (studentId?: string, studentRoll?: string) => {
    if (!currentAdvisor) return false;
    if (studentId && students.some(s => s.id === studentId && (s.tutor_id === currentAdvisor.id || s.advisor_id === currentAdvisor.id))) return true;
    const s = students.find(st => st.id === studentId);
    const roll = (studentRoll || s?.roll_no || '').trim().toUpperCase();
    if (roll && currentAdvisor.email) {
      if (currentAdvisor.email.includes('kirubakaran') && /^24CS0(7[1-9]|8[0-9]|9[0-4])$/.test(roll)) return true;
      if (currentAdvisor.email.includes('geetha') && (/^24CS0(9[5-9])$/.test(roll) || /^24CS1(0[1-9]|1[0-9]|20)$/.test(roll))) return true;
    }
    return false;
  };

  const isCohortInternship = (item: Internship) => {
    if (!currentAdvisor) return true;
    if (item.student_advisor_id === currentAdvisor.id || item.student_tutor_id === currentAdvisor.id) return true;
    if (isBatchStudent(item.student_id, item.student_roll)) return true;
    if (students.some(s => s.id === item.student_id && (s.advisor_id === currentAdvisor.id || s.tutor_id === currentAdvisor.id))) return true;
    return false;
  };

  // Resolve student display information for any internship
  const getStudentInfo = (item: Internship) => {
    const student = students.find(s => s.id === item.student_id);
    return {
      name: item.student_name || student?.name || 'Unknown Student',
      roll: item.student_roll || student?.roll_no || 'N/A',
      dept: item.student_dept || student?.department || '',
      section: item.student_section || student?.section || '',
      avatar: item.student_avatar || student?.avatar || ''
    };
  };

  // Filtered internships
  const filteredInternships = useMemo(() => {
    return (internships || []).filter(item => {
      // Cohort scoping
      if (scopeFilter === 'COHORT' && !isCohortInternship(item)) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'ALL' && item.internship_type !== typeFilter) {
        return false;
      }

      // Location type filter
      if (locationTypeFilter !== 'ALL' && item.location_type !== locationTypeFilter) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const studentInfo = getStudentInfo(item);
        const matchesStudent = studentInfo.name.toLowerCase().includes(query) || studentInfo.roll.toLowerCase().includes(query);
        const matchesOrg = item.organization?.toLowerCase().includes(query);
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesSkills = item.skills_used?.toLowerCase().includes(query);
        const matchesDomain = item.domain?.toLowerCase().includes(query);
        if (!matchesStudent && !matchesOrg && !matchesTitle && !matchesSkills && !matchesDomain) {
          return false;
        }
      }

      return true;
    });
  }, [internships, scopeFilter, statusFilter, typeFilter, locationTypeFilter, searchQuery, students, currentAdvisor]);

  // Cohort statistics
  const cohortList = (internships || []).filter(isCohortInternship);
  const totalCohort = cohortList.length;
  const ongoingCount = cohortList.filter(i => i.status === 'Ongoing').length;
  const completedCount = cohortList.filter(i => i.status === 'Completed').length;
  const internalCount = cohortList.filter(i => i.internship_type === 'Internal').length;
  const externalCount = cohortList.filter(i => i.internship_type === 'External').length;

  const calculateDuration = (start: string, end?: string, status?: string) => {
    if (!start) return '';
    const startDate = new Date(start);
    const endDate = status === 'Ongoing' || !end ? new Date() : new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (status === 'Ongoing') {
      return `${diffDays} Days (Active)`;
    }
    return `${diffDays} Days`;
  };

  // CSV export functionality
  const exportToCSV = () => {
    if (!filteredInternships.length) return;
    const headers = ['Student Name', 'Roll Number', 'Department', 'Title', 'Organization', 'Type', 'Status', 'Start Date', 'End Date', 'Location Mode', 'Mentor Name', 'Mentor Email'];
    const rows = filteredInternships.map(i => {
      const st = getStudentInfo(i);
      const mentor = i.mentors && i.mentors[0] ? i.mentors[0] : { name: '', email: '' };
      return [
        `"${st.name}"`,
        `"${st.roll}"`,
        `"${st.dept}"`,
        `"${i.title || ''}"`,
        `"${i.organization || ''}"`,
        `"${i.internship_type || ''}"`,
        `"${i.status || ''}"`,
        `"${i.start_date || ''}"`,
        `"${i.end_date || ''}"`,
        `"${i.location_type || ''}"`,
        `"${mentor.name || ''}"`,
        `"${mentor.email || ''}"`
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_internships_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Internships</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Monitor and verify industry internships, practical training, and work experience of students
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            disabled={filteredInternships.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cohort Records</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{totalCohort}</span>
            <span className="text-xs font-semibold text-slate-500">Total</span>
          </div>
        </div>

        <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ongoing</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-amber-700">{ongoingCount}</span>
            <span className="text-xs font-semibold text-amber-600">Active</span>
          </div>
        </div>

        <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-emerald-700">{completedCount}</span>
            <span className="text-xs font-semibold text-emerald-600">Finished</span>
          </div>
        </div>

        <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Internal Training</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-indigo-700">{internalCount}</span>
            <span className="text-xs font-semibold text-indigo-600">In-house</span>
          </div>
        </div>

        <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">External Industry</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-purple-700">{externalCount}</span>
            <span className="text-xs font-semibold text-purple-600">Industry</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student, roll no, company, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Cohort Scoping Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-stretch md:self-auto">
            <button
              onClick={() => setScopeFilter('COHORT')}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scopeFilter === 'COHORT'
                  ? 'bg-white text-amber-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Cohort ({totalCohort})
            </button>
            <button
              onClick={() => setScopeFilter('ALL')}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scopeFilter === 'ALL'
                  ? 'bg-white text-amber-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Students ({(internships || []).length})
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
            {(['ALL', 'Ongoing', 'Completed'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === s
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s === 'ALL' ? 'All Status' : s}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Type:</span>
            {(['ALL', 'Internal', 'External'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'ALL' ? 'All Types' : t}
              </button>
            ))}
          </div>

          {/* Location Mode Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Mode:</span>
            <select
              value={locationTypeFilter}
              onChange={(e) => setLocationTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Modes</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

        </div>
      </div>

      {/* Internship Cards Grid */}
      {filteredInternships.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No internships found</h3>
          <p className="text-xs text-slate-500 max-w-md">
            {searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'No student internship records matched your current filters. Try changing or clearing filters.'
              : 'There are currently no internship submissions logged for your students.'}
          </p>
          {(searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL' || locationTypeFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setTypeFilter('ALL');
                setLocationTypeFilter('ALL');
              }}
              className="mt-4 px-4 py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl hover:bg-amber-100 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInternships.map((item) => {
            const st = getStudentInfo(item);
            const durationStr = calculateDuration(item.start_date, item.end_date, item.status);
            const hasDocs = !!(item.documents?.offer_letter || item.documents?.completion_certificate || item.documents?.internship_report);

            return (
              <div
                key={item.id}
                onClick={() => onSelectInternship(item)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden group"
              >
                {/* Student Banner Header */}
                <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {st.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                        {st.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {st.roll} • {st.dept} {st.section ? `(${st.section})` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Main Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Status & Type Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {item.internship_type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        item.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                      }`}>
                        {item.status}
                      </span>
                      {item.location_type && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                          {item.location_type}
                        </span>
                      )}
                    </div>

                    {/* Internship Title */}
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1 mb-1">
                      {item.title}
                    </h3>

                    {/* Company / Organization */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.organization}</span>
                      {item.company_website && (
                        <a
                          href={item.company_website.startsWith('http') ? item.company_website : `https://${item.company_website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-amber-600 ml-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Dates & Duration */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.start_date}</span>
                        <span>→</span>
                        <span className={item.status === 'Ongoing' ? 'text-amber-600 font-semibold' : 'text-slate-700'}>
                          {item.status === 'Ongoing' ? 'Present' : item.end_date || 'N/A'}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        {durationStr}
                      </span>
                    </div>

                    {/* Mentors Preview */}
                    {item.mentors && item.mentors.length > 0 && item.mentors[0].name && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          Mentor: <strong className="text-slate-800">{item.mentors[0].name}</strong>
                          {item.mentors.length > 1 && ` (+${item.mentors.length - 1} more)`}
                        </span>
                      </div>
                    )}

                    {/* Documents Indicator */}
                    {hasDocs && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                        <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Documents attached:</span>
                        <div className="flex items-center gap-1">
                          {item.documents?.offer_letter && (
                            <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded text-[9px] font-bold">Offer</span>
                          )}
                          {item.documents?.completion_certificate && (
                            <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold">Cert</span>
                          )}
                          {item.documents?.internship_report && (
                            <span className="px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded text-[9px] font-bold">Report</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:bg-amber-50/50 transition-colors">
                  <span>View Details & Verification</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
