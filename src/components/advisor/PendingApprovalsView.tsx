'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ODRequest } from '../../types';
import { formatDateRange } from '../../utils/validation';
import { Clock, Users, User, ChevronRight, CheckCircle2 } from 'lucide-react';

interface PendingApprovalsViewProps {
  onSelectODRequest: (od: ODRequest) => void;
}

export const PendingApprovalsView: React.FC<PendingApprovalsViewProps> = ({ onSelectODRequest }) => {
  const { currentAdvisor, odRequests } = useApp();

  // Filter requests relevant to this advisor with advisor_status == PENDING
  const pendingRequests = odRequests.filter(
    (od) => od.advisor_id === currentAdvisor.id && od.advisor_status === 'PENDING'
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pending OD Approvals
          </h2>
          <p className="text-xs text-slate-500">
            On-Duty applications awaiting review by advisor {currentAdvisor.name}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          {pendingRequests.length} Pending
        </span>
      </div>

      {/* List or Empty State */}
      {pendingRequests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No pending approvals 🎉</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Great job! You've reviewed all incoming On-Duty applications.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
          {pendingRequests.map((od) => (
            <div
              key={od.id}
              id={`pending-od-row-${od.id}`}
              onClick={() => onSelectODRequest(od)}
              className="p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">
                  Review Application →
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
