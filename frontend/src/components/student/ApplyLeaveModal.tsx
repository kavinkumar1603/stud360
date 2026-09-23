import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Briefcase, UserCheck } from 'lucide-react';
import { LeaveType, ScholarType, Semester } from '../../types';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose, onSubmitted }) => {
  const { addLeaveApplication, currentStudent, advisors } = useApp();
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

  const getAssignedTutor = () => {
    if (currentStudent?.tutor_id) {
      const tut = advisors?.find((a) => a.id === currentStudent.tutor_id);
      if (tut) return tut;
    }
    const roll = (currentStudent?.roll_no || '').trim().toUpperCase();
    if (roll) {
      if (/^24CS0(7[1-9]|8[0-9]|9[0-4])$/.test(roll)) {
        return advisors?.find(a => a.name.toLowerCase().includes('kirubakaran') || a.email?.includes('kirubakaran')) || { name: 'Kirubakaran K' };
      }
      if (/^24CS0(9[5-9])|24CS1(0[1-9]|1[0-9]|20)$/.test(roll)) {
        return advisors?.find(a => a.name.toLowerCase().includes('geetha') || a.email?.includes('geetha')) || { name: 'Geetha N' };
      }
    }
    return null;
  };

  const getAssignedAdvisor = () => {
    if (currentStudent?.advisor_id) {
      const adv = advisors?.find((a) => a.id === currentStudent.advisor_id);
      if (adv) return adv;
    }
    return advisors?.find(a => a.title === 'advisor' || a.name.toLowerCase().includes('anandaraj') || a.email?.includes('anandaraj')) || { name: 'Anandaraj A' };
  };

  const assignedTutor = getAssignedTutor();
  const assignedAdvisor = getAssignedAdvisor();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Apply for Leave</h2>
              <p className="text-xs text-slate-500 font-medium">Submit a leave application to your tutor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
          <form id="apply-leave-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
              
              {/* Tutor & Advisor Info Banner */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-500 block">Assigned Tutor</span>
                    <span className="font-bold text-teal-900 text-sm">{assignedTutor?.name || 'Tutor Assigned'}</span>
                  </div>
                </div>
                {assignedAdvisor && (
                  <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-teal-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">Faculty Advisor</span>
                    <span className="font-bold text-emerald-900 text-sm">{assignedAdvisor.name}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Leave Type <span className="text-red-500">*</span></label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setLeaveType('Personal')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${leaveType === 'Personal' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Personal
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeaveType('Medical')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${leaveType === 'Medical' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Medical
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Scholar Type <span className="text-red-500">*</span></label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setScholarType('Day Scholar')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${scholarType === 'Day Scholar' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Day Scholar
                    </button>
                    <button
                      type="button"
                      onClick={() => setScholarType('Hosteller')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${scholarType === 'Hosteller' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Hosteller
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Semester <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as Semester)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  >
                    {[...Array(8)].map((_, i) => (
                      <option key={i} value={`Semester ${i + 1}`}>Semester {i + 1}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">No. of Days <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="0.5"
                    step="0.5"
                    value={noOfDays}
                    onChange={(e) => setNoOfDays(Number(e.target.value))}
                    placeholder="e.g. 1, 1.5, 2"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="isMultiDay"
                    checked={isMultiDay}
                    onChange={(e) => setIsMultiDay(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="flex flex-col">
                    <label htmlFor="isMultiDay" className="text-sm font-bold text-slate-900 cursor-pointer">Multi-day Leave</label>
                    <span className="text-xs text-slate-500 font-medium">Check this if your leave spans across multiple days</span>
                  </div>
                </div>

                {isMultiDay ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">From Date <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        required
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">To Date <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        required
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Date of Leave <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      required
                      value={onDate}
                      onChange={(e) => setOnDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Purpose of Leave <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Please explain the reason for your leave clearly..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none resize-none"
                />
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            form="apply-leave-form"
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg shadow-sm shadow-teal-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
