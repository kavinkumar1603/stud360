'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Internship } from '../../types';
import { Plus, Briefcase, Building2, MapPin, Calendar, ArrowRight, User } from 'lucide-react';

interface InternshipsListViewProps {
  onOpenAddInternship: () => void;
  onSelectInternship: (internship: Internship) => void;
}

export const InternshipsListView: React.FC<InternshipsListViewProps> = ({ onOpenAddInternship, onSelectInternship }) => {
  const { internships } = useApp();
  const [filter, setFilter] = useState<'All' | 'Internal' | 'External' | 'Ongoing' | 'Completed'>('All');

  // Compute stats
  const total = internships.length;
  const internal = internships.filter(i => i.internship_type === 'Internal').length;
  const external = internships.filter(i => i.internship_type === 'External').length;
  const ongoing = internships.filter(i => i.status === 'Ongoing').length;
  const completed = internships.filter(i => i.status === 'Completed').length;

  const filteredInternships = internships.filter(i => {
    if (filter === 'All') return true;
    if (filter === 'Internal') return i.internship_type === 'Internal';
    if (filter === 'External') return i.internship_type === 'External';
    if (filter === 'Ongoing') return i.status === 'Ongoing';
    if (filter === 'Completed') return i.status === 'Completed';
    return true;
  });

  const StatCard = ({ label, value, bg, textColor }: { label: string, value: number, bg: string, textColor: string }) => (
    <div className={`p-4 rounded-2xl border ${bg} shadow-sm flex flex-col justify-center`}>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-extrabold ${textColor}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            My Internships
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track and manage your professional experience
          </p>
        </div>
        <button
          onClick={onOpenAddInternship}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Internship
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total" value={total} bg="bg-white border-slate-200" textColor="text-slate-900" />
        <StatCard label="Internal" value={internal} bg="bg-indigo-50/50 border-indigo-100" textColor="text-indigo-700" />
        <StatCard label="External" value={external} bg="bg-fuchsia-50/50 border-fuchsia-100" textColor="text-fuchsia-700" />
        <StatCard label="Ongoing" value={ongoing} bg="bg-amber-50/50 border-amber-100" textColor="text-amber-700" />
        <StatCard label="Completed" value={completed} bg="bg-emerald-50/50 border-emerald-100" textColor="text-emerald-700" />
      </div>

      {/* Tabs / Filters */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl w-fit">
        {(['All', 'Internal', 'External', 'Ongoing', 'Completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === f
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredInternships.length === 0 ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No internships found</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} internship records yet. Click the button above to add one.
          </p>
          <button
            onClick={onOpenAddInternship}
            className="px-6 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors text-sm"
          >
            Add New Record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map(internship => (
            <div
              key={internship.id}
              onClick={() => onSelectInternship(internship)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                      {internship.internship_type}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md ${
                      internship.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {internship.status}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 line-clamp-2 leading-snug mb-1">
                  {internship.title}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">{internship.organization}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 bg-slate-50/50 flex-1 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{internship.start_date}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <div className="text-slate-600 font-medium">
                    {internship.status === 'Ongoing' ? (
                      <span className="text-amber-600">Present</span>
                    ) : (
                      <span>{internship.end_date}</span>
                    )}
                  </div>
                </div>
                
                {internship.domain && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700 font-medium truncate">{internship.domain}</span>
                  </div>
                )}
                
                {internship.mentors && internship.mentors.length > 0 && internship.mentors[0].name && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700 font-medium truncate">
                      {internship.mentors[0].name}
                      {internship.mentors.length > 1 && <span className="text-slate-400 text-xs ml-1">(+{internship.mentors.length - 1})</span>}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
