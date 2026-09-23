'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InternshipType, InternshipStatus, LocationType, Internship } from '../../types';
import { X, Briefcase, Building2, MapPin, CheckCircle, Calendar, User, Mail, Phone, Link2, Plus, Trash2 } from 'lucide-react';

interface AddInternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  internshipToEdit?: Internship | null;
  onSubmitted?: () => void;
}

export const AddInternshipModal: React.FC<AddInternshipModalProps> = ({ isOpen, onClose, internshipToEdit, onSubmitted }) => {
  const { addInternship, updateInternship } = useApp();

  const [internshipType, setInternshipType] = useState<InternshipType>(internshipToEdit?.internship_type || 'Internal');
  const [status, setStatus] = useState<InternshipStatus>(internshipToEdit?.status || 'Completed');
  
  const [title, setTitle] = useState(internshipToEdit?.title || '');
  const [organization, setOrganization] = useState(internshipToEdit?.organization || '');
  const [department, setDepartment] = useState(internshipToEdit?.department || '');
  const [domain, setDomain] = useState(internshipToEdit?.domain || '');
  const [description, setDescription] = useState(internshipToEdit?.description || '');
  const [skillsUsed, setSkillsUsed] = useState(internshipToEdit?.skills_used || '');
  
  const [startDate, setStartDate] = useState(internshipToEdit?.start_date || '');
  const [endDate, setEndDate] = useState(internshipToEdit?.end_date || '');
  
  const [mentors, setMentors] = useState<{name: string, email: string, contact: string}[]>(
    internshipToEdit?.mentors?.length ? internshipToEdit.mentors : [{ name: '', email: '', contact: '' }]
  );
  
  const [locationType, setLocationType] = useState<LocationType>(internshipToEdit?.location_type || 'On-site');
  const [companyLocation, setCompanyLocation] = useState(internshipToEdit?.company_location || '');
  const [companyWebsite, setCompanyWebsite] = useState(internshipToEdit?.company_website || '');
  
  const [offerLetter, setOfferLetter] = useState(internshipToEdit?.documents?.offer_letter || '');
  const [completionCert, setCompletionCert] = useState(internshipToEdit?.documents?.completion_certificate || '');
  const [internshipReport, setInternshipReport] = useState(internshipToEdit?.documents?.internship_report || '');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organization || !startDate) return;
    if (status === 'Completed' && !endDate) return;

    setIsSubmitting(true);
    
    const payload: Partial<Internship> = {
      internship_type: internshipType,
      status,
      title,
      organization,
      department,
      domain,
      description,
      skills_used: skillsUsed,
      start_date: startDate,
      end_date: status === 'Ongoing' ? undefined : endDate,
      mentors: mentors.filter(m => m.name.trim() !== ''),
      location_type: locationType,
      company_location: companyLocation,
      company_website: companyWebsite,
      documents: {
        offer_letter: offerLetter,
        completion_certificate: completionCert,
        internship_report: internshipReport
      }
    };

    if (internshipToEdit) {
      await updateInternship(internshipToEdit.id, payload);
    } else {
      await addInternship(payload);
    }
    
    setIsSubmitting(false);
    onClose();
    if (onSubmitted) onSubmitted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{internshipToEdit ? 'Edit Internship' : 'Add Internship'}</h2>
              <p className="text-xs text-slate-500 font-medium">Record your professional experience</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
          <form id="internship-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Primary Details Segment */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Internship Type <span className="text-red-500">*</span></label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    {(['Internal', 'External'] as InternshipType[]).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setInternshipType(type)}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                          internshipType === type
                            ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Status <span className="text-red-500">*</span></label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    {(['Completed', 'Ongoing'] as InternshipStatus[]).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                          status === s
                            ? s === 'Completed' ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-200/50' : 'bg-amber-50 text-amber-600 shadow-sm border border-amber-200/50'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Role / Title <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Full Stack Intern"
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Organization <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={e => setOrganization(e.target.value)}
                      placeholder={internshipType === 'Internal' ? 'e.g. Center of Excellence' : 'e.g. Acme Corp'}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    placeholder="e.g. Artificial Intelligence"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Start Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">End Date {status === 'Completed' && <span className="text-red-500">*</span>}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    {status === 'Ongoing' ? (
                      <div className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 font-semibold rounded-lg text-sm flex items-center">
                        Present (Ongoing)
                      </div>
                    ) : (
                      <input
                        type="date"
                        required={status === 'Completed'}
                        value={endDate}
                        min={startDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Skills & Technologies Used</label>
                <input
                  type="text"
                  value={skillsUsed}
                  onChange={e => setSkillsUsed(e.target.value)}
                  placeholder="e.g. React, Node.js, Python, AWS"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                />
              </div>

            </div>

            {/* Mentor & Location Details */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
               <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                 <h3 className="text-sm font-bold text-slate-800">Location & Mentor Details</h3>
                 <button
                   type="button"
                   onClick={() => setMentors([...mentors, { name: '', email: '', contact: '' }])}
                   className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                 >
                   <Plus className="w-3 h-3" /> Add Mentor
                 </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Location Mode</label>
                    <select
                      value={locationType}
                      onChange={e => setLocationType(e.target.value as LocationType)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  {internshipType === 'External' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={companyLocation}
                          onChange={e => setCompanyLocation(e.target.value)}
                          placeholder="City, State"
                          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                        />
                      </div>
                    </div>
                  )}
               </div>

               <div className="space-y-4">
                 {mentors.map((mentor, index) => (
                   <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mentor Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={mentor.name}
                          onChange={e => {
                            const newMentors = [...mentors];
                            newMentors[index].name = e.target.value;
                            setMentors(newMentors);
                          }}
                          placeholder="Name"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mentor Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={mentor.email}
                          onChange={e => {
                            const newMentors = [...mentors];
                            newMentors[index].email = e.target.value;
                            setMentors(newMentors);
                          }}
                          placeholder="Email"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mentor Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={mentor.contact}
                          onChange={e => {
                            const newMentors = [...mentors];
                            newMentors[index].contact = e.target.value;
                            setMentors(newMentors);
                          }}
                          placeholder="Contact No"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      {mentors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newMentors = mentors.filter((_, i) => i !== index);
                            setMentors(newMentors);
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors w-full flex justify-center"
                          title="Remove Mentor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Documents */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Documents & Proofs (Drive Links)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Offer Letter</label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={offerLetter}
                      onChange={e => setOfferLetter(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                    />
                  </div>
                </div>
                
                {status === 'Completed' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Completion Certificate</label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        value={completionCert}
                        onChange={e => setCompletionCert(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="internship-form"
            disabled={isSubmitting || !title || !organization || !startDate || (status === 'Completed' && !endDate)}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {internshipToEdit ? 'Update Record' : 'Save Record'}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
