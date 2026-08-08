'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CoursePlatform, CourseStatus } from '../../types';
import { isValidDriveLink } from '../../utils/validation';
import { BookOpen, X, AlertCircle } from 'lucide-react';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onSubmitted }) => {
  const { addOnlineCourse } = useApp();

  const [platform, setPlatform] = useState<CoursePlatform>('NPTEL');
  const [courseName, setCourseName] = useState('');
  const [provider, setProvider] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState<CourseStatus>('In Progress');
  const [certDriveLink, setCertDriveLink] = useState('');
  const [grade, setGrade] = useState('');

  if (!isOpen) return null;

  const durationPlaceholder =
    platform === 'NPTEL' ? 'e.g. 8 weeks or 12 weeks' : 'e.g. 12 hours or 40 hours';

  const isCertLinkValid =
    status !== 'Completed' || (certDriveLink.trim() !== '' && isValidDriveLink(certDriveLink));

  const isFormValid =
    courseName.trim().length > 0 &&
    isCertLinkValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    addOnlineCourse({
      platform,
      course_name: courseName.trim(),
      provider: provider.trim() || undefined,
      start_date: startDate,
      end_date: endDate,
      duration: duration.trim() || (platform === 'NPTEL' ? '8 weeks' : '10 hours'),
      status,
      cert_drive_link: status === 'Completed' ? certDriveLink.trim() : certDriveLink.trim() || undefined,
      grade: platform === 'NPTEL' && grade.trim() ? grade.trim() : undefined
    });

    // Reset form
    setCourseName('');
    setProvider('');
    setStartDate('');
    setEndDate('');
    setDuration('');
    setStatus('In Progress');
    setCertDriveLink('');
    setGrade('');

    onClose();
    if (onSubmitted) onSubmitted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add Online Course</h2>
              <p className="text-xs text-slate-500">
                Log an online certification course (NPTEL, Coursera, Udemy, etc.)
              </p>
            </div>
          </div>
          <button
            id="close-add-course-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Platform & Course Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Platform <span className="text-red-500">*</span>
              </label>
              <select
                id="select-course-platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as CoursePlatform)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
              >
                <option value="NPTEL">NPTEL</option>
                <option value="Coursera">Coursera</option>
                <option value="Udemy">Udemy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                id="input-course-name"
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. Deep Learning or AWS Cloud Foundations"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Provider / Institution */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Provider / Institution <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="input-course-provider"
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. IIT Madras, DeepLearning.AI, Meta, Stanford"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Start Date / End Date / Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
              <input
                id="input-course-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
              <input
                id="input-course-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Duration</label>
              <input
                id="input-course-duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder={durationPlaceholder}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Course Status <span className="text-red-500">*</span>
              </label>
              <select
                id="select-course-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as CourseStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
              >
                <option value="Enrolled">Enrolled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>

            {/* Grade / Score */}
            {platform === 'NPTEL' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Grade / Score <span className="text-slate-400 font-normal">(NPTEL Elite/Silver/Gold)</span>
                </label>
                <input
                  id="input-course-grade"
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. Elite + Gold (88%)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}
          </div>

          {/* Certificate Drive Link */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Certificate Drive Link{' '}
              {status === 'Completed' ? (
                <span className="text-red-500">* (Required for Completed status)</span>
              ) : (
                <span className="text-slate-400 font-normal">(Optional unless Completed)</span>
              )}
            </label>
            <input
              id="input-course-cert-link"
              type="url"
              value={certDriveLink}
              onChange={(e) => setCertDriveLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 ${
                status === 'Completed' && certDriveLink && !isValidDriveLink(certDriveLink)
                  ? 'border-red-400 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-sky-500'
              }`}
            />
            {status === 'Completed' && certDriveLink && !isValidDriveLink(certDriveLink) && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Drive link must start with "https://"
              </p>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-add-course-modal"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-course-btn"
              disabled={!isFormValid}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all ${
                isFormValid
                  ? 'bg-sky-600 hover:bg-sky-700 cursor-pointer active:scale-98'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-200'
              }`}
            >
              Add Course
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
