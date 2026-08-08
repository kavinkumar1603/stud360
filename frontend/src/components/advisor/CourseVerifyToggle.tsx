import React from 'react';
import { OnlineCourse } from '../../types';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

interface CourseVerifyToggleProps {
  course: OnlineCourse;
}

export const CourseVerifyToggle: React.FC<CourseVerifyToggleProps> = ({ course }) => {
  const { toggleCourseVerify } = useApp();

  // Rule 3.6: Only enabled if course.status == "Completed" and a certificate link exists — disabled otherwise with a tooltip
  const hasCertificate = Boolean(course.cert_drive_link && course.cert_drive_link.trim().length > 0);
  const isEligibleForVerification = course.status === 'Completed' && hasCertificate;

  const tooltipText = !isEligibleForVerification
    ? 'No certificate submitted yet.'
    : course.verified_by_advisor
    ? 'Mark course as unverified'
    : 'Mark course as verified';

  return (
    <div className="flex items-center gap-2">
      <div className="relative group inline-block">
        <label
          htmlFor={`course-verify-toggle-${course.id}`}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            !isEligibleForVerification
              ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-75'
              : course.verified_by_advisor
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 cursor-pointer hover:bg-emerald-100'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <input
            type="checkbox"
            id={`course-verify-toggle-${course.id}`}
            disabled={!isEligibleForVerification}
            checked={course.verified_by_advisor}
            onChange={(e) => toggleCourseVerify(course.id, e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
          />
          <span className="whitespace-nowrap">
            {course.verified_by_advisor ? 'Verified ✓' : 'Mark Verified'}
          </span>
        </label>

        {/* Tooltip for disabled state */}
        {!isEligibleForVerification && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2.5 py-1 rounded bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap shadow-xl z-30 pointer-events-none">
            {tooltipText}
          </div>
        )}
      </div>
    </div>
  );
};
