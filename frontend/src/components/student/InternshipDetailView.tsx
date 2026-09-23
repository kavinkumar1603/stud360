'use client';

import React from 'react';
import { Internship } from '../../types';
import { ArrowLeft, Briefcase, Calendar, MapPin, Building2, User, Mail, Phone, ExternalLink, Pencil, Trash2, FileText, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface InternshipDetailViewProps {
  internship: Internship;
  onBack: () => void;
  onEdit: (internship: Internship) => void;
}

export const InternshipDetailView: React.FC<InternshipDetailViewProps> = ({ internship, onBack, onEdit }) => {
  const { deleteInternship } = useApp();

  const calculateDuration = (start: string, end?: string, status?: string) => {
    if (!start) return '';
    const startDate = new Date(start);
    const endDate = status === 'Ongoing' || !end ? new Date() : new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (status === 'Ongoing') {
      return `${diffDays} Days (Ongoing)`;
    }
    return `${diffDays} Days`;
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this internship record?')) {
      await deleteInternship(internship.id);
      onBack();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Internships
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(internship)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-bold transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Banner / Title section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8 text-white relative">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/10 uppercase tracking-wide">
              {internship.internship_type} Internship
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border uppercase tracking-wide ${
              internship.status === 'Completed' ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-50' : 'bg-amber-500/20 border-amber-400/30 text-amber-50'
            }`}>
              {internship.status}
            </span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">{internship.title}</h1>
          <div className="flex items-center gap-2 text-indigo-100 font-medium">
            <Building2 className="w-5 h-5" />
            <span className="text-lg">{internship.organization}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - Main Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h2>
              <p className="text-slate-700 text-sm leading-relaxed">
                {internship.description || 'No description provided.'}
              </p>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Domain</h2>
                <p className="text-slate-900 font-medium">{internship.domain || 'N/A'}</p>
              </section>
              <section>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Department</h2>
                <p className="text-slate-900 font-medium">{internship.department || 'N/A'}</p>
              </section>
              <section className="sm:col-span-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills & Technologies</h2>
                <p className="text-slate-900 font-medium">{internship.skills_used || 'N/A'}</p>
              </section>
            </div>
            
            {/* Documents */}
            {(internship.documents?.offer_letter || internship.documents?.completion_certificate || internship.documents?.internship_report) && (
              <section className="pt-6 border-t border-slate-100">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Documents</h2>
                <div className="flex flex-wrap gap-3">
                  {internship.documents?.offer_letter && (
                    <a href={internship.documents.offer_letter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Offer Letter
                      <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                    </a>
                  )}
                  {internship.documents?.completion_certificate && (
                    <a href={internship.documents.completion_certificate} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      Completion Certificate
                      <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Meta Data */}
          <div className="space-y-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
            
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Duration
              </h2>
              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Start:</span>
                  <span className="text-slate-900">{internship.start_date}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>End:</span>
                  <span className="text-slate-900">{internship.status === 'Ongoing' ? 'Present' : internship.end_date}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between text-slate-700 font-bold">
                  <span>Total:</span>
                  <span className="text-indigo-600">{calculateDuration(internship.start_date, internship.end_date, internship.status)}</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location Info
              </h2>
              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Mode:</span>
                  <span className="text-slate-900">{internship.location_type || 'N/A'}</span>
                </div>
                {internship.company_location && (
                  <div className="flex flex-col gap-1 text-slate-600 mt-2">
                    <span>Address:</span>
                    <span className="text-slate-900 leading-snug">{internship.company_location}</span>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> Mentor Info
              </h2>
              <div className="space-y-4">
                {internship.mentors && internship.mentors.length > 0 ? (
                  internship.mentors.map((mentor, index) => (
                    <div key={index} className="space-y-1.5 text-sm pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="font-bold text-slate-900">{mentor.name || 'Not Provided'}</div>
                      {mentor.email && (
                        <a href={`mailto:${mentor.email}`} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {mentor.email}
                        </a>
                      )}
                      {mentor.contact && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {mentor.contact}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm font-bold text-slate-900">Not Provided</div>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};
