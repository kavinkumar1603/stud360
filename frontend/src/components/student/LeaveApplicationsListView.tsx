import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveApplication } from '../../types';
import { Plus, Search, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface LeaveApplicationsListViewProps {
  onOpenApplyLeave: () => void;
}

export const LeaveApplicationsListView: React.FC<LeaveApplicationsListViewProps> = ({ onOpenApplyLeave }) => {
  const { currentStudent, leaveApplications } = useApp();
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fallback to empty array if leaveApplications is undefined
  const safeLeaves = leaveApplications || [];
  const myLeaves = safeLeaves.filter((l) => l.student_id === currentStudent.id);

  const getFinalStatus = (l: LeaveApplication) => {
      if (l.tutor_id && l.tutor_status === 'REJECTED') return 'REJECTED';
      if (l.tutor_id && l.tutor_status === 'PENDING') return 'PENDING';
      return l.advisor_status;
  };

  const filteredLeaves = myLeaves.filter((l) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchPurpose = l.purpose.toLowerCase().includes(q);
      const matchType = l.leave_type.toLowerCase().includes(q);
      if (!matchPurpose && !matchType) return false;
    }
    if (activeTabFilter !== 'ALL' && getFinalStatus(l) !== activeTabFilter) return false;
    return true;
  });

  const getDisplayStatus = (l: LeaveApplication) => {
    if (l.tutor_id) {
      if (l.tutor_status === 'REJECTED') return 'REJECTED (Tutor)';
      if (l.tutor_status === 'PENDING') return 'PENDING (Tutor)';
      if (l.tutor_status === 'APPROVED') {
         if (l.advisor_status === 'PENDING') return 'PENDING (Advisor)';
         if (l.advisor_status === 'REJECTED') return 'REJECTED (Advisor)';
      }
    }
    return l.advisor_status;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">Leave Applications</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage and track your leave requests.</p>
        </div>
        <button
          onClick={onOpenApplyLeave}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Leave Request</span>
        </button>
      </div>

      <div className="bg-white  border border-slate-200  rounded-2xl p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by purpose or type..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200  bg-slate-50/50  text-xs text-slate-900  focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTabFilter(tab as any)}
              className={`${activeTabFilter === tab ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {filteredLeaves.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-xs text-slate-500 font-medium">No leave applications found matching this filter.</p>
            <button
              onClick={onOpenApplyLeave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Apply for Leave
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-6">Leave Type</th>
                  <th className="py-3 px-6">Purpose</th>
                  <th className="py-3 px-6">Date Range</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* LEAVE TYPE */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-xs">{l.leave_type} Leave</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{l.scholar_type}</div>
                    </td>

                    {/* PURPOSE */}
                    <td className="py-4 px-6">
                      <div className="text-slate-600 line-clamp-2 max-w-xs">{l.purpose}</div>
                    </td>

                    {/* DATE RANGE */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">
                        {l.from_date ? `${l.from_date} to ${l.to_date}` : l.on_date}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {l.no_of_days} Day(s)
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-6 text-right">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        getFinalStatus(l) === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        getFinalStatus(l) === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {getFinalStatus(l) === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                        {getFinalStatus(l) === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        {getFinalStatus(l) === 'PENDING' && <Clock className="w-3 h-3" />}
                        <span>{getDisplayStatus(l)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
