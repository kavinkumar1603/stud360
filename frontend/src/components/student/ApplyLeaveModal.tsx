import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Briefcase } from 'lucide-react';
import { LeaveType, ScholarType, Semester } from '../../types';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose, onSubmitted }) => {
  const { addLeaveApplication, currentStudent } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [leaveType, setLeaveType] = useState<LeaveType>('Personal');
  const [scholarType, setScholarType] = useState<ScholarType>('Day Scholar');
  const [semester, setSemester] = useState<Semester>(currentStudent?.semester || 'Semester 5');
  
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [onDate, setOnDate] = useState('');
  const [noOfDays, setNoOfDays] = useState<number>(1);
  const [purpose, setPurpose] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addLeaveApplication({
        leave_type: leaveType,
        scholar_type: scholarType,
        semester,
        from_date: isMultiDay ? fromDate : undefined,
        to_date: isMultiDay ? toDate : undefined,
        on_date: !isMultiDay ? onDate : undefined,
        no_of_days: Number(noOfDays),
        purpose
      });
      
      // Reset form
      setLeaveType('Personal');
      setScholarType('Day Scholar');
      setSemester(currentStudent?.semester || 'Semester 5');
      setIsMultiDay(false);
      setFromDate('');
      setToDate('');
      setOnDate('');
      setNoOfDays(1);
      setPurpose('');

      onSubmitted();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Apply for Leave</h2>
              <p className="text-xs text-slate-500">
                Submit a leave application to your faculty advisor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="apply-leave-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Leave Type <span className="text-red-500">*</span></label>
                <select
                  required
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                >
                  <option value="Personal">Personal Leave</option>
                  <option value="Medical">Medical Leave</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Scholar Type <span className="text-red-500">*</span></label>
                <select
                  required
                  value={scholarType}
                  onChange={(e) => setScholarType(e.target.value as ScholarType)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                >
                  <option value="Day Scholar">Day Scholar</option>
                  <option value="Hosteller">Hosteller</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Semester <span className="text-red-500">*</span></label>
              <select
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value as Semester)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={`Semester ${i + 1}`}>Semester {i + 1}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <input
                type="checkbox"
                id="isMultiDay"
                checked={isMultiDay}
                onChange={(e) => setIsMultiDay(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <div className="flex flex-col">
                <label htmlFor="isMultiDay" className="text-sm font-bold text-slate-900 cursor-pointer">Multi-day Leave</label>
                <span className="text-xs text-slate-500">Check this if your leave spans across multiple days</span>
              </div>
            </div>

            {isMultiDay ? (
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">From Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">To Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Date of Leave <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={onDate}
                  onChange={(e) => setOnDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">No. of Days <span className="text-red-500">*</span></label>
              <input
                type="number"
                required
                min="0.5"
                step="0.5"
                value={noOfDays}
                onChange={(e) => setNoOfDays(Number(e.target.value))}
                placeholder="e.g. 1, 1.5, 2"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Purpose of Leave <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Please explain the reason for your leave clearly..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-none"
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            form="apply-leave-form"
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-sm shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
