'use client';

import React from 'react';
import { AdvisorStatus, ODFinalStatus, ODRequest, ProofStatus, StatusPillConfig } from '../types';

interface StatusPillProps {
  type: 'OD';
  odRequest?: ODRequest;
}

export function getAdvisorStatusConfig(status: AdvisorStatus): StatusPillConfig {
  switch (status) {
    case 'APPROVED':
      return { text: 'Advisor Approved', colorClass: 'text-emerald-700', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200' };
    case 'REJECTED':
      return { text: 'Advisor Rejected', colorClass: 'text-red-700', bgClass: 'bg-red-50', borderClass: 'border-red-200' };
    default:
      return { text: 'Advisor Pending', colorClass: 'text-amber-700', bgClass: 'bg-amber-50', borderClass: 'border-amber-200' };
  }
}

export function getFinalStatusConfig(status: ODFinalStatus): StatusPillConfig {
  switch (status) {
    case 'APPROVED':
      return { text: 'Final Approved', colorClass: 'text-emerald-700', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200' };
    case 'REJECTED':
      return { text: 'Final Rejected', colorClass: 'text-red-700', bgClass: 'bg-red-50', borderClass: 'border-red-200' };
    default:
      return { text: 'Final Pending', colorClass: 'text-blue-700', bgClass: 'bg-blue-50', borderClass: 'border-blue-200' };
  }
}

export function getProofStatusConfig(status: ProofStatus): StatusPillConfig {
  switch (status) {
    case 'VERIFIED':
      return { text: 'Proof Verified', colorClass: 'text-emerald-700', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200' };
    case 'SUBMITTED':
      return { text: 'Proof Submitted', colorClass: 'text-purple-700', bgClass: 'bg-purple-50', borderClass: 'border-purple-200' };
    case 'REJECTED':
      return { text: 'Proof Rejected', colorClass: 'text-red-700', bgClass: 'bg-red-50', borderClass: 'border-red-200' };
    case 'OPEN':
      return { text: 'Submit Proof', colorClass: 'text-sky-700', bgClass: 'bg-sky-50', borderClass: 'border-sky-200', isTappable: true };
    case 'LOCKED':
      return { text: 'Proof Locked', colorClass: 'text-slate-500', bgClass: 'bg-slate-50', borderClass: 'border-slate-200' };
    default:
      return { text: 'Proof Status Unknown', colorClass: 'text-slate-500', bgClass: 'bg-slate-50', borderClass: 'border-slate-200' };
  }
}


export const StatusPill: React.FC<StatusPillProps> = ({
  type,
  odRequest,
}) => {
  let config: StatusPillConfig = {
    text: 'Unknown',
    colorClass: 'text-slate-500',
    bgClass: 'bg-slate-100',
    borderClass: 'border-slate-200'
  };

  if (type === 'OD' && odRequest) {
    if (odRequest.od_final_status === 'APPROVED' || odRequest.od_final_status === 'REJECTED') {
      config = getFinalStatusConfig(odRequest.od_final_status);
    } else {
      config = getAdvisorStatusConfig(odRequest.advisor_status);
    }
  }

  return (
    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${config.bgClass} ${config.colorClass} ${config.borderClass} ${config.isTappable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}>
      {config.text}
    </div>
  );
};
