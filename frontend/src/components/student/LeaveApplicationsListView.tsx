import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const LeaveApplicationsListView: React.FC = () => {
  const { currentStudent, leaveApplications } = useApp();
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fallback to empty array if leaveApplications is undefined
  const safeLeaves = leaveApplications || [];
  const myLeaves = safeLeaves.filter((l) => l.student_id === currentStudent.id);

  const filteredLeaves = myLeaves.filter((l) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchPurpose = l.purpose.toLowerCase().includes(q);
      const matchType = l.leave_type.toLowerCase().includes(q);
      if (!matchPurpose && !matchType) return false;
    }
    if (activeTabFilter !== 'ALL' && l.advisor_status !== activeTabFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Leave Applications</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage and track your leave requests.</p>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-apply-leave'))}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Leave Request</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by purpose or type..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTabFilter(tab as any)}
              className={`${activeTabFilter === tab ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'} px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeaves.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-sm">No leave applications found.</div>
        ) : (
          filteredLeaves.map((l) => (
            <div key={l.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-teal-300 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{l.leave_type} Leave</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {l.from_date ? `${l.from_date} to ${l.to_date}` : l.on_date} • {l.no_of_days} Day(s)
                  </p>
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  l.advisor_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                  l.advisor_status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {l.advisor_status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                  {l.advisor_status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                  {l.advisor_status === 'PENDING' && <Clock className="w-3 h-3" />}
                  <span>{l.advisor_status}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 line-clamp-2">
                {l.purpose}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
