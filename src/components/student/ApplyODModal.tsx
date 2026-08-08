'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ODRequestType, Student } from '../../types';
import { isValidDateRange } from '../../utils/validation';
import { Users, User, X, Search, AlertCircle, FileText, CheckCircle } from 'lucide-react';

interface ApplyODModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const ApplyODModal: React.FC<ApplyODModalProps> = ({ isOpen, onClose, onSubmitted }) => {
  const { currentStudent, students, addODRequest } = useApp();

  const [requestType, setRequestType] = useState<ODRequestType>('Individual');
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Team member repeatable search state
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Student[]>([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);

  if (!isOpen) return null;

  // Filter available students for team addition
  const availableStudents = students.filter(
    (s) =>
      s.id !== currentStudent.id &&
      !selectedTeamMembers.some((m) => m.id === s.id) &&
      (memberSearchQuery.trim() === '' ||
        s.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        s.roll_no.toLowerCase().includes(memberSearchQuery.toLowerCase()))
  );

  const handleAddMember = (student: Student) => {
    setSelectedTeamMembers((prev) => [...prev, student]);
    setMemberSearchQuery('');
    setIsSearchingMembers(false);
  };

  const handleRemoveMember = (id: string) => {
    setSelectedTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const isDateValid = fromDate && toDate && isValidDateRange(fromDate, toDate);
  const isEventFilled = eventName.trim().length > 0;
  const isTeamValid = requestType === 'Individual' || selectedTeamMembers.length >= 1;

  const isSubmitEnabled = isEventFilled && isDateValid && isTeamValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    addODRequest({
      event_name: eventName.trim(),
      description: description.trim() || undefined,
      from_date: fromDate,
      to_date: toDate,
      request_type: requestType,
      team_members: selectedTeamMembers.map((m) => ({
        student_id: m.id,
        roll_no: m.roll_no,
        name: m.name
      }))
    });

    // Reset form
    setEventName('');
    setDescription('');
    setFromDate('');
    setToDate('');
    setSelectedTeamMembers([]);
    setRequestType('Individual');

    onClose();
    if (onSubmitted) onSubmitted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Apply for Academic On-Duty (OD)</h2>
              <p className="text-xs text-slate-500">
                Submit an OD application to your faculty advisor
              </p>
            </div>
          </div>
          <button
            id="close-apply-od-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Step 1: Select Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Step 1: Select OD Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="od-type-individual"
                onClick={() => setRequestType('Individual')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  requestType === 'Individual'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/30'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${requestType === 'Individual' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Individual OD</div>
                  <div className="text-xs text-slate-500">Single participant application</div>
                </div>
              </button>

              <button
                type="button"
                id="od-type-team"
                onClick={() => setRequestType('Team')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  requestType === 'Team'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/30'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${requestType === 'Team' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Team OD</div>
                  <div className="text-xs text-slate-500">Group/team hackathon or event</div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Form Fields */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Step 2: Event Information
            </label>

            {/* Event Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                id="input-od-event-name"
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Smart India Hackathon 2026 or IEEE Conference"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="input-od-description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief details regarding event location, project topic, or paper title..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* From Date / To Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-od-from-date"
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  To Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-od-to-date"
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Date Validation Notice */}
            {fromDate && toDate && !isValidDateRange(fromDate, toDate) && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                "To Date" must be on or after "From Date".
              </p>
            )}

            {/* Team Members Section */}
            {requestType === 'Team' && (
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Add Team Members <span className="text-red-500">* (Min 1 additional)</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    {selectedTeamMembers.length} added
                  </span>
                </div>

                {/* Primary Student (Requester) indicator */}
                <div className="flex items-center justify-between px-3 py-2 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-blue-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold">{currentStudent.name} ({currentStudent.roll_no})</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-200 text-blue-800">
                    Team Lead
                  </span>
                </div>

                {/* Search & Select Input */}
                <div className="relative">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="input-search-team-member"
                      type="text"
                      value={memberSearchQuery}
                      onChange={(e) => {
                        setMemberSearchQuery(e.target.value);
                        setIsSearchingMembers(true);
                      }}
                      onFocus={() => setIsSearchingMembers(true)}
                      placeholder="Search student by roll number or name..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Dropdown Suggestions */}
                  {isSearchingMembers && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                      {availableStudents.length === 0 ? (
                        <div className="p-3 text-xs text-slate-500 text-center">
                          No matching students found
                        </div>
                      ) : (
                        availableStudents.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            id={`add-member-${s.roll_no}`}
                            onClick={() => handleAddMember(s)}
                            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center justify-between border-b last:border-0 border-slate-100 transition-colors cursor-pointer"
                          >
                            <div>
                              <div className="text-sm font-semibold text-slate-800">
                                {s.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                Roll No: {s.roll_no} • {s.department}
                              </div>
                            </div>
                            <span className="text-xs text-blue-600 font-medium">+ Add</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Running List of Added Team Members */}
                {selectedTeamMembers.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs text-slate-500 font-medium">Added Members:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamMembers.map((m) => (
                        <span
                          key={m.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
                        >
                          <span>{m.name} ({m.roll_no})</span>
                          <button
                            type="button"
                            id={`remove-member-${m.id}`}
                            onClick={() => handleRemoveMember(m.id)}
                            className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTeamMembers.length === 0 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    At least 1 additional team member must be added to submit a Team OD request.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-apply-od-modal"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-od-request-btn"
              disabled={!isSubmitEnabled}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all ${
                isSubmitEnabled
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer active:scale-98'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-200'
              }`}
            >
              Submit OD Application
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
