'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ODRequest, ProofStatus } from '../../types';
import { StatusPill } from '../StatusPill';
import { formatDateRange, isValidDriveLink } from '../../utils/validation';
import {
  ArrowLeft,
  Calendar,
  Users,
  Upload,
  Link2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface ODDetailViewProps {
  odRequest: ODRequest;
  onBack: () => void;
}

export const ODDetailView: React.FC<ODDetailViewProps> = ({ odRequest, onBack }) => {
  const { currentStudent, updateODRequestProof, odRequests } = useApp();

  // Retrieve latest state for this OD from context
  const currentOD = odRequests.find((r) => r.id === odRequest.id) || odRequest;

  // Determine my individual proof status & link
  const isMainRequester = currentOD.student_id === currentStudent.id;
  let myProofStatus: ProofStatus = currentOD.my_individual_proof_status;
  let myProofLink: string | undefined = currentOD.my_proof_link;
  let myProofRemarks: string | undefined = currentOD.my_proof_remarks;

  if (!isMainRequester) {
    const myMember = currentOD.team_members.find((m) => m.student_id === currentStudent.id);
    if (myMember) {
      myProofStatus = myMember.individual_proof_status;
      myProofLink = myMember.drive_link;
      myProofRemarks = myMember.remarks;
    }
  }

  // Form local state
  const [driveLinkInput, setDriveLinkInput] = useState(myProofLink || '');
  const [remarksInput, setRemarksInput] = useState(myProofRemarks || '');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  const isLinkValid = isValidDriveLink(driveLinkInput);

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLinkValid || isSubmittingProof) return;

    setIsSubmittingProof(true);
    await updateODRequestProof(currentOD.id, driveLinkInput.trim(), remarksInput.trim() || undefined);
    setIsSubmittingProof(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Navigation */}
      <button
        id="btn-back-to-od-list"
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to OD Applications</span>
      </button>

      {/* Main OD Info Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                {currentOD.request_type} OD
              </span>
              <span className="text-xs text-slate-400">
                Applied on {currentOD.created_at}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {currentOD.event_name}
            </h1>
          </div>

          <StatusPill type="OD" odRequest={currentOD} />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Date Range
            </span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-500" />
              {formatDateRange(currentOD.from_date, currentOD.to_date)}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Academic Term
            </span>
            <div className="text-sm font-bold text-slate-900">
              {currentOD.academic_year} • {currentOD.semester}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Requester
            </span>
            <div className="text-sm font-bold text-slate-900">
              {currentOD.student_name} ({currentOD.student_roll})
            </div>
          </div>
        </div>

        {/* Description */}
        {currentOD.description && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Event Details & Description
            </h3>
            <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line">
              {currentOD.description}
            </p>
          </div>
        )}

        {/* Team Members List (If Team) */}
        {currentOD.request_type === 'Team' && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              Team Members ({currentOD.team_members.length + 1} Total)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Lead Student */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs">
                <div>
                  <div className="font-bold text-slate-900">
                    {currentOD.student_name}
                  </div>
                  <div className="text-slate-500">Roll No: {currentOD.student_roll}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-800">
                  Lead Requester
                </span>
              </div>

              {/* Other Members */}
              {currentOD.team_members.map((m) => (
                <div
                  key={m.student_id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{m.name}</div>
                    <div className="text-slate-500">Roll No: {m.roll_no}</div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                    Proof: {m.individual_proof_status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advisor Remarks */}
        {currentOD.advisor_remarks && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              Advisor Remarks:
            </div>
            <p className="pl-5">{currentOD.advisor_remarks}</p>
          </div>
        )}

      </div>

      {/* Participation Proof Submission */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Participation Proof Submission
            </h2>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Status: {myProofStatus}
          </span>
        </div>

        {(myProofStatus === 'OPEN' || myProofStatus === 'REJECTED') && (
          <form onSubmit={handleSubmitProof} className="space-y-4 pt-2">
            {myProofStatus === 'REJECTED' && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Proof Rejected by Advisor.</span> Please upload a revised, valid drive link containing your attendance certificate or photos.
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 text-xs text-blue-900">
              Your OD has been approved! Please paste your certificate/participation Drive link below for advisor verification.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Drive Link <span className="text-red-500">* (Must start with "https://")</span>
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-proof-drive-link"
                  type="url"
                  required
                  value={driveLinkInput}
                  onChange={(e) => setDriveLinkInput(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 ${
                    driveLinkInput && !isLinkValid
                      ? 'border-red-400 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              {driveLinkInput && !isLinkValid && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  URL must start with "https://"
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Remarks
              </label>
              <textarea
                id="input-proof-remarks"
                rows={2}
                value={remarksInput}
                onChange={(e) => setRemarksInput(e.target.value)}
                placeholder="e.g. Attached certificate of merit and official event photo badge."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                id="btn-submit-proof"
                disabled={!isLinkValid || isSubmittingProof}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-2 ${
                  isLinkValid && !isSubmittingProof
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer active:scale-98'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmittingProof ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Proof...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Submit Proof for Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {(myProofStatus === 'SUBMITTED' || myProofStatus === 'VERIFIED') && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                {myProofStatus === 'VERIFIED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
                <span>
                  {myProofStatus === 'VERIFIED'
                    ? 'Proof Verified by Advisor'
                    : 'Awaiting Advisor Verification'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Read-Only View</span>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-slate-400 font-semibold block">Submitted Drive Link:</span>
              <a
                href={myProofLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline font-medium flex items-center gap-1 break-all"
              >
                <span>{myProofLink}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            {myProofRemarks && (
              <div className="text-xs text-slate-600">
                <span className="font-semibold">Remarks:</span> {myProofRemarks}
              </div>
            )}
          </div>
        )}

        {myProofStatus === 'LOCKED' && (
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-center space-y-2 opacity-75">
            <Lock className="w-5 h-5 text-slate-400 mx-auto" />
            <p className="text-xs font-medium text-slate-500">
              Proof upload opens once your OD is fully approved.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
