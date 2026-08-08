import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ODRequest } from '../../types';
import { formatDateRange } from '../../utils/validation';
import {
  Plus,
  Search,
  Filter,
  Trophy,
  FlaskConical,
  Dribbble,
  Megaphone,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ODRequestsListViewProps {
  onSelectODRequest: (od: ODRequest) => void;
  onOpenApplyOD: () => void;
}

export const ODRequestsListView: React.FC<ODRequestsListViewProps> = ({
  onSelectODRequest,
  onOpenApplyOD
}) => {
  const { currentStudent, academicYear: globalAY, semester: globalSem, odRequests } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAY, setSelectedAY] = useState<string>('2023-2024');
  const [selectedSem, setSelectedSem] = useState<string>('Fall');

  // Filter requests for current student
  const myODs = odRequests.filter(
    (od) =>
      od.student_id === currentStudent.id || od.team_members.some((m) => m.student_id === currentStudent.id)
  );

  // Apply tab + search filter
  const filteredODs = myODs.filter((od) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = od.event_name.toLowerCase().includes(q);
      const matchCategory = od.event_category?.toLowerCase().includes(q);
      const matchLoc = od.location?.toLowerCase().includes(q);
      const matchId = od.id.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchLoc && !matchId) return false;
    }

    if (activeTabFilter === 'PENDING') {
      return od.advisor_status === 'PENDING' || (od.advisor_status === 'APPROVED' && od.od_final_status === 'PENDING');
    }
    if (activeTabFilter === 'APPROVED') {
      return od.od_final_status === 'APPROVED';
    }
    if (activeTabFilter === 'REJECTED') {
      return od.advisor_status === 'REJECTED' || od.od_final_status === 'REJECTED';
    }

    return true;
  });

  const countAll = myODs.length;
  const countPending = myODs.filter(
    (od) => od.advisor_status === 'PENDING' || (od.advisor_status === 'APPROVED' && od.od_final_status === 'PENDING')
  ).length;
  const countApproved = myODs.filter((od) => od.od_final_status === 'APPROVED').length;
  const countRejected = myODs.filter((od) => od.advisor_status === 'REJECTED' || od.od_final_status === 'REJECTED').length;

  // Render Type Icon based on Category
  const renderCategoryIcon = (category?: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('hackathon') || cat.includes('tech')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
      );
    }
    if (cat.includes('paper') || cat.includes('conference') || cat.includes('research')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
          <FlaskConical className="w-5 h-5" />
        </div>
      );
    }
    if (cat.includes('sport') || cat.includes('athletic')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <Dribbble className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
        <Megaphone className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & New Request Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">On-Duty Requests</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage and track your official duty leaves for academic events.
          </p>
        </div>

        <button
          id="btn-od-list-new-request"
          onClick={onOpenApplyOD}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Request</span>
        </button>
      </div>

      {/* Filter Box (Matching Image 3) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              id="input-search-od-requests"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name, location, or ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Academic Year Select */}
          <select
            value={selectedAY}
            onChange={(e) => setSelectedAY(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="2023-2024">Academic Year: 2023-24</option>
            <option value="2024-2025">Academic Year: 2024-25</option>
            <option value="2025-2026">Academic Year: 2025-26</option>
          </select>

          {/* Semester Select */}
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="Fall">Semester: Fall</option>
            <option value="Spring">Semester: Spring</option>
          </select>

        </div>

        {/* Tab Pills Row (Matching Image 3) */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 flex-wrap">
          <button
            id="filter-tab-all"
            onClick={() => setActiveTabFilter('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTabFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({countAll})
          </button>

          <button
            id="filter-tab-pending"
            onClick={() => setActiveTabFilter('PENDING')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTabFilter === 'PENDING'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending ({countPending})
          </button>

          <button
            id="filter-tab-approved"
            onClick={() => setActiveTabFilter('APPROVED')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTabFilter === 'APPROVED'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Approved ({countApproved})
          </button>

          <button
            id="filter-tab-rejected"
            onClick={() => setActiveTabFilter('REJECTED')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTabFilter === 'REJECTED'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rejected ({countRejected})
          </button>
        </div>
      </div>

      {/* OD Requests Data Table (Matching Image 3) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        
        {filteredODs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-xs text-slate-500 font-medium">No OD requests found matching this tab filter.</p>
            <button
              onClick={onOpenApplyOD}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Apply for New OD
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Event Details</th>
                  <th className="py-3 px-6">Date Range</th>
                  <th className="py-3 px-6">Submitted</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredODs.map((od, idx) => {
                  const reqCode = `REQ-23-01${42 + idx}`;
                  const isApproved = od.od_final_status === 'APPROVED';
                  const isRejected = od.advisor_status === 'REJECTED' || od.od_final_status === 'REJECTED';

                  return (
                    <tr
                      key={od.id}
                      onClick={() => onSelectODRequest(od)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      {/* TYPE */}
                      <td className="py-4 px-6">
                        {renderCategoryIcon(od.event_category)}
                      </td>

                      {/* EVENT DETAILS */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-xs">{od.event_name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {reqCode} • {od.event_category || 'Academic Event'}
                        </div>
                      </td>

                      {/* DATE RANGE */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800">
                          {formatDateRange(od.from_date, od.to_date)}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {od.number_of_days} Day{od.number_of_days > 1 ? 's' : ''}
                        </div>
                      </td>

                      {/* SUBMITTED */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800">
                          {od.created_at.split('T')[0]}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Prof. Academic Advisor
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-6 text-right">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                            <XCircle className="w-3.5 h-3.5" /> REJECTED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" /> PENDING
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination Bar (Matching Image 3) */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filteredODs.length} of {myODs.length} requests</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 rounded font-bold bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 rounded font-bold text-slate-600 hover:bg-slate-100">2</button>
            <button className="px-3 py-1 rounded font-bold text-slate-600 hover:bg-slate-100">3</button>
            <button className="p-1 rounded border border-slate-200 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
