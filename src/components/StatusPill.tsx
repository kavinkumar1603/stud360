'use client';

import React from 'react';
import { AdvisorStatus, CourseStatus, ODFinalStatus, ODRequest, ProofStatus, StatusPillConfig } from '../types';

/**
 * Single source of truth for OD status pill logic as defined in section 2.4 & 4.2
 */
export function getODStatusConfig(req: {
  advisor_status: AdvisorStatus;
  od_final_status: ODFinalStatus;
  individual_proof_status?: ProofStatus;
  my_individual_proof_status?: ProofStatus;
}): StatusPillConfig {
  const proofStatus = req.my_individual_proof_status || req.individual_proof_status || 'LOCKED';

  if (req.advisor_status === 'PENDING') {
    return {
      text: 'Pending Advisor',
      colorClass: 'text-gray-700 dark:text-gray-300',
      bgClass: 'bg-gray-100 dark:bg-gray-800/80',
      borderClass: 'border-gray-300 dark:border-gray-700'
    };
  }

  if (req.advisor_status === 'REJECTED') {
    return {
      text: 'Rejected by Advisor',
      colorClass: 'text-red-700 dark:text-red-300',
      bgClass: 'bg-red-50 dark:bg-red-950/50',
      borderClass: 'border-red-200 dark:border-red-800'
    };
  }

  if (req.advisor_status === 'APPROVED' && req.od_final_status === 'PENDING') {
    return {
      text: 'Pending Final Approval',
      colorClass: 'text-amber-800 dark:text-amber-300',
      bgClass: 'bg-amber-50 dark:bg-amber-950/50',
      borderClass: 'border-amber-200 dark:border-amber-800'
    };
  }

  if (req.od_final_status === 'REJECTED') {
    return {
      text: 'OD Rejected',
      colorClass: 'text-red-700 dark:text-red-300',
      bgClass: 'bg-red-50 dark:bg-red-950/50',
      borderClass: 'border-red-200 dark:border-red-800'
    };
  }

  if (req.od_final_status === 'APPROVED') {
    if (proofStatus === 'OPEN') {
      return {
        text: 'Upload Proof Now',
        colorClass: 'text-blue-700 dark:text-blue-300',
        bgClass: 'bg-blue-50 dark:bg-blue-950/60',
        borderClass: 'border-blue-300 dark:border-blue-700',
        isTappable: true
      };
    }
    if (proofStatus === 'SUBMITTED') {
      return {
        text: 'Proof Submitted — Awaiting Verification',
        colorClass: 'text-amber-800 dark:text-amber-300',
        bgClass: 'bg-amber-50 dark:bg-amber-950/50',
        borderClass: 'border-amber-200 dark:border-amber-800'
      };
    }
    if (proofStatus === 'VERIFIED') {
      return {
        text: 'Completed',
        colorClass: 'text-emerald-700 dark:text-emerald-300',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
        borderClass: 'border-emerald-200 dark:border-emerald-800'
      };
    }
    if (proofStatus === 'REJECTED') {
      return {
        text: 'Proof Rejected — Resubmit',
        colorClass: 'text-red-700 dark:text-red-300',
        bgClass: 'bg-red-50 dark:bg-red-950/50',
        borderClass: 'border-red-300 dark:border-red-700',
        isTappable: true
      };
    }
    // Default fallback if locked or unknown
    return {
      text: 'OD Approved',
      colorClass: 'text-emerald-700 dark:text-emerald-300',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderClass: 'border-emerald-200 dark:border-emerald-800'
    };
  }

  return {
    text: 'Unknown',
    colorClass: 'text-gray-600',
    bgClass: 'bg-gray-100',
    borderClass: 'border-gray-200'
  };
}

export function getCourseStatusConfig(status: CourseStatus): StatusPillConfig {
  switch (status) {
    case 'Enrolled':
      return {
        text: 'Enrolled',
        colorClass: 'text-sky-700 dark:text-sky-300',
        bgClass: 'bg-sky-50 dark:bg-sky-950/50',
        borderClass: 'border-sky-200 dark:border-sky-800'
      };
    case 'In Progress':
      return {
        text: 'In Progress',
        colorClass: 'text-indigo-700 dark:text-indigo-300',
        bgClass: 'bg-indigo-50 dark:bg-indigo-950/50',
        borderClass: 'border-indigo-200 dark:border-indigo-800'
      };
    case 'Completed':
      return {
        text: 'Completed',
        colorClass: 'text-emerald-700 dark:text-emerald-300',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/50',
        borderClass: 'border-emerald-200 dark:border-emerald-800'
      };
    case 'Dropped':
      return {
        text: 'Dropped',
        colorClass: 'text-gray-600 dark:text-gray-400',
        bgClass: 'bg-gray-100 dark:bg-gray-800',
        borderClass: 'border-gray-200 dark:border-gray-700'
      };
  }
}

interface StatusPillProps {
  type: 'OD' | 'COURSE';
  odRequest?: ODRequest | {
    advisor_status: AdvisorStatus;
    od_final_status: ODFinalStatus;
    individual_proof_status?: ProofStatus;
    my_individual_proof_status?: ProofStatus;
  };
  courseStatus?: CourseStatus;
  onClick?: () => void;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  type,
  odRequest,
  courseStatus,
  onClick,
  className = ''
}) => {
  let config: StatusPillConfig;

  if (type === 'OD' && odRequest) {
    config = getODStatusConfig(odRequest);
  } else if (type === 'COURSE' && courseStatus) {
    config = getCourseStatusConfig(courseStatus);
  } else {
    config = {
      text: 'None',
      colorClass: 'text-gray-500',
      bgClass: 'bg-gray-100',
      borderClass: 'border-gray-200'
    };
  }

  const isInteractive = Boolean(onClick && config.isTappable);

  return (
    <span
      onClick={isInteractive ? onClick : undefined}
      id={`status-pill-${config.text.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${config.bgClass} ${config.colorClass} ${config.borderClass} ${
        isInteractive ? 'cursor-pointer hover:opacity-80 transition-opacity shadow-xs' : ''
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          config.colorClass.includes('emerald')
            ? 'bg-emerald-500'
            : config.colorClass.includes('blue') || config.colorClass.includes('sky')
            ? 'bg-blue-500'
            : config.colorClass.includes('amber')
            ? 'bg-amber-500'
            : config.colorClass.includes('red')
            ? 'bg-red-500'
            : 'bg-gray-400'
        }`}
      />
      <span className="whitespace-nowrap">{config.text}</span>
    </span>
  );
};
