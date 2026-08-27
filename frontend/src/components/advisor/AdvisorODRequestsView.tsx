'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ODRequest } from '../../types';
import { formatDateRange } from '../../utils/validation';
import { Clock, Users, User, ChevronRight, CheckCircle2, FileText, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface AdvisorODRequestsViewProps {
  onSelectODRequest: (od: ODRequest) => void;
  defaultFilter?: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const AdvisorODRequestsView: React.FC<AdvisorODRequestsViewProps> = ({ 
  onSelectODRequest,
  defaultFilter = 'PENDING'
}) => {
  const { currentAdvisor, odRequests, students, deleteODRequest } = useApp();
  const [activeFilter, setActiveFilter] = useState(defaultFilter);
  const [activeType, setActiveType] = useState<'ALL' | 'INDIVIDUAL' | 'TEAM'>('ALL');
  
  // New state for AY and Semester filters
  const [selectedAY, setSelectedAY] = useState<string>('ALL');
  const [selectedSem, setSelectedSem] = useState<string>('ALL');

  // Get cohort IDs
  const myStudentIds = students.filter(s => s.advisor_id === currentAdvisor?.id).map(s => s.id);

  // Filter requests relevant to this advisor (All time / Till date)
  const allRequests = odRequests.filter(
    (od) => myStudentIds.includes(od.student_id)
  );

  const displayedRequests = allRequests.filter(od => {
    if (activeFilter !== 'ALL' && od.advisor_status !== activeFilter) return false;
    if (activeType === 'INDIVIDUAL' && od.request_type === 'Team') return false;
    if (activeType === 'TEAM' && od.request_type !== 'Team') return false;
    if (selectedAY !== 'ALL' && od.academic_year !== selectedAY) return false;
    if (selectedSem !== 'ALL' && od.semester !== selectedSem) return false;
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent opening details
    if (window.confirm('Are you sure you want to permanently delete this OD request?')) {
      await deleteODRequest(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              OD Applications
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Review and manage student OD requests
            </p>
            
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
              {['ALL', 'INDIVIDUAL', 'TEAM'].map((typeFilter) => (
                <button
                  key={typeFilter}
                  onClick={() => setActiveType(typeFilter as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeType === typeFilter
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {typeFilter === 'ALL' ? 'All Types' : typeFilter === 'INDIVIDUAL' ? 'Individual' : 'Team'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            {/* Status Filter */}
            <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-end">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === filter
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {filter === 'ALL' ? 'All Status' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* AY & Semester Filters */}
            <div className="flex gap-2 self-start sm:self-end">
              <select
                value={selectedAY}
                onChange={(e) => setSelectedAY(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {['ALL', '2026-2027', '2027-2028', '2028-2029', '2029-2030'].map(ay => (
                  <option key={ay} value={ay}>{ay === 'ALL' ? 'All Years' : ay}</option>
                ))}
              </select>

              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {['ALL', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map(sem => (
                  <option key={sem} value={sem}>{sem === 'ALL' ? 'All Semesters' : sem}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* List or Empty State */}
      {displayedRequests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No {activeFilter === 'ALL' ? '' : activeFilter.toLowerCase()} requests found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no OD applications matching this filter for your cohort.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
          {displayedRequests.map((od) => (
            <div
              key={od.id}
              onClick={() => onSelectODRequest(od)}
              className="p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      od.request_type === 'Team'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {od.request_type === 'Team' ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {od.request_type}
                  </span>

                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {od.event_name}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-800">
                    Requester: {od.student_name} ({od.student_roll})
                  </span>
                  <span>•</span>
                  <span>{formatDateRange(od.from_date, od.to_date)}</span>
                  <span>•</span>
                  <span>{od.academic_year}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold capitalize bg-white shadow-sm">
                  {getStatusIcon(od.advisor_status)}
                  <span className={
                    od.advisor_status === 'APPROVED' ? 'text-emerald-700' :
                    od.advisor_status === 'REJECTED' ? 'text-red-700' : 'text-amber-700'
                  }>
                    {od.advisor_status.toLowerCase()}
                  </span>
                </div>
                
                <button
                  onClick={(e) => handleDelete(e, od.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Request"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
