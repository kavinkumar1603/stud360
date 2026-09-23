'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ODRequestType, Student } from '../../types';
import { isValidDateRange } from '../../utils/validation';
import { printODForm } from '../../utils/printForm';
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
  const [venue, setVenue] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorDesignation, setMentorDesignation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [hackathonLink, setHackathonLink] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Team member repeatable search state
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Student[]>([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);

  if (!isOpen) return null;

  // Filter available students for team addition (searchable by roll number, name, department)
  const availableStudents = students
    .filter(
      (s) =>
        s.id !== currentStudent.id &&
        !selectedTeamMembers.some((m) => m.id === s.id) &&
        (memberSearchQuery.trim() === '' ||
          s.name?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
          s.roll_no?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
          s.department?.toLowerCase().includes(memberSearchQuery.toLowerCase()))
    )
    .slice(0, 30);

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

  const isSubmitEnabled = isEventFilled && isDateValid && isTeamValid && venue.trim().length > 0 && mentorName.trim().length > 0 && contactNumber.length === 10;

  
  const handleDownload = () => {
    if (!isSubmitEnabled) {
      alert("Please fill all required fields first.");
      return;
    }
    
    // Calculate days
    const fDate = new Date(fromDate);
    const tDate = new Date(toDate);
    const diffTime = Math.abs(tDate.getTime() - fDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Gather names
    const names = [currentStudent.name, ...selectedTeamMembers.map(m => m.name)].join(', ');
    const rolls = [currentStudent.roll_no, ...selectedTeamMembers.map(m => m.roll_no)].join(', ');

    printODForm({
      academicYear: currentStudent.year || '2026-2027',
      studentNames: names,
      department: currentStudent.department,
      registerNumbers: rolls,
      year: currentStudent.year || '3',
      semester: currentStudent.semester,
      section: currentStudent.section || 'A',
      numberOfDays: diffDays,
      fromDate: fromDate,
      toDate: toDate,
      mentorName: mentorName,
      mentorDesignation: mentorDesignation,
      eventName: eventName,
      venue: venue,
      contactNumber: contactNumber
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    const fullDescription = `Venue: ${venue}\nMentor: ${mentorName} (${mentorDesignation})\nContact: ${contactNumber}\nEvent Link: ${hackathonLink || 'N/A'}\n\nDetails: ${description.trim()}`;
    
    addODRequest({
      event_name: eventName.trim(),
      description: fullDescription,
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
    setVenue('');
    setMentorName('');
    setMentorDesignation('');
    setContactNumber('');
    setDescription('');
    setHackathonLink('');
    setFromDate('');
    setToDate('');
    setSelectedTeamMembers([]);
    setRequestType('Individual');

    onClose();
    if (onSubmitted) onSubmitted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Apply for Academic On-Duty (OD)</h2>
              <p className="text-xs text-slate-500 font-medium">Submit an OD application to your faculty advisor</p>
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
          <form id="apply-od-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">OD Type <span className="text-red-500">*</span></label>
                <div className="flex bg-slate-100 p-1 rounded-lg max-w-md">
                  <button
                    type="button"
                    onClick={() => setRequestType('Individual')}
                    className={`flex-1 py-2 flex justify-center items-center gap-2 text-sm font-bold rounded-md transition-all ${requestType === 'Individual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <User className="w-4 h-4" /> Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestType('Team')}
                    className={`flex-1 py-2 flex justify-center items-center gap-2 text-sm font-bold rounded-md transition-all ${requestType === 'Team' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Users className="w-4 h-4" /> Team
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Smart India Hackathon 2026 or IEEE Conference"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief details regarding event location, project topic, or paper title..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Link</label>
                <input
                  type="url"
                  value={hackathonLink}
                  onChange={(e) => setHackathonLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Venue <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Event Location"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contact Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={contactNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setContactNumber(val);
                    }}
                    placeholder="10-digit number"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mentor Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    placeholder="Faculty Mentor Name"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mentor Designation <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={mentorDesignation}
                    onChange={(e) => setMentorDesignation(e.target.value)}
                    placeholder="e.g. AP/CSE"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">From Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">To Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>
              
              {fromDate && toDate && !isValidDateRange(fromDate, toDate) && (
                <p className="text-xs text-red-500 flex items-center gap-1 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  "To Date" must be on or after "From Date".
                </p>
              )}
            </div>

            {/* Team Members Section */}
            {requestType === 'Team' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-800">Team Members <span className="text-red-500">* (Min 1 additional)</span></h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedTeamMembers.length} added
                  </span>
                </div>

                {/* Primary Student (Requester) indicator */}
                <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold">{currentStudent.name} ({currentStudent.roll_no})</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-200 text-blue-800">
                    Team Lead
                  </span>
                </div>

                {/* Search & Select Input */}
                <div className="relative">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={memberSearchQuery}
                      onChange={(e) => {
                        setMemberSearchQuery(e.target.value);
                        setIsSearchingMembers(true);
                      }}
                      onFocus={() => setIsSearchingMembers(true)}
                      placeholder="Search student by roll number or name..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                    />
                  </div>

                  {/* Dropdown Suggestions */}
                  {isSearchingMembers && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsSearchingMembers(false)}
                      />
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                        {availableStudents.length === 0 ? (
                          <div className="p-4 text-xs font-medium text-slate-500 text-center">
                            No matching students found
                          </div>
                        ) : (
                          availableStudents.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleAddMember(s)}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between border-b last:border-0 border-slate-100 transition-colors cursor-pointer"
                            >
                              <div>
                                <div className="text-sm font-bold text-slate-800">
                                  {s.name}
                                </div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">
                                  Roll No: {s.roll_no} {s.department ? `• ${s.department}` : ''}
                                </div>
                              </div>
                              <span className="text-xs text-blue-600 font-bold px-2 py-1 bg-blue-50 rounded-md">+ Add</span>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Running List of Added Team Members */}
                {selectedTeamMembers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-700 font-bold uppercase tracking-wider">Added Members</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamMembers.map((m) => (
                        <span
                          key={m.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
                        >
                          <span>{m.name} ({m.roll_no})</span>
                          <button
                            type="button"
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
                  <p className="text-xs text-amber-600 flex items-center gap-1 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    At least 1 additional team member must be added to submit a Team OD request.
                  </p>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!isSubmitEnabled}
            className={`px-4 py-2 text-sm font-bold rounded-lg border transition-all ${isSubmitEnabled ? 'border-blue-200 text-blue-700 hover:bg-blue-50 bg-white' : 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'}`}
          >
            Download Form
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            form="apply-od-form"
            type="submit"
            disabled={!isSubmitEnabled}
            className={`px-6 py-2 text-sm font-bold rounded-lg shadow-sm transition-all ${isSubmitEnabled ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Submit Application
          </button>
        </div>

      </div>
    </div>
  );
};
