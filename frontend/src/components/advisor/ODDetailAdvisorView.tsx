'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ODRequest } from '../../types';
import { StatusPill } from '../StatusPill';
import { formatDateRange } from '../../utils/validation';
import {
  ArrowLeft,
  Calendar,
  Users,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';

interface ODDetailAdvisorViewProps {
  odRequest: ODRequest;
  onBack: () => void;
}

export const ODDetailAdvisorView: React.FC<ODDetailAdvisorViewProps> = ({ odRequest, onBack }) => {
  const { odRequests, advisorReviewOD, advisorVerifyProof, deleteODRequest } = useApp();

  // Find live state from context
  const currentOD = odRequests.find((r) => r.id === odRequest.id) || odRequest;

  // Local state for advisor decision remarks
  const [remarksInput, setRemarksInput] = useState(currentOD.advisor_remarks || '');
  const [remarksError, setRemarksError] = useState(false);
  const [isActionPending, setIsActionPending] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this OD request? This action cannot be undone.')) {
      setIsActionPending(true);
      await deleteODRequest(currentOD.id);
      setIsActionPending(false);
      onBack();
    }
  };

  const handleApprove = async () => {
    setIsActionPending(true);
    setRemarksError(false);
    await advisorReviewOD(currentOD.id, 'APPROVED', remarksInput.trim() || 'Approved by Faculty Advisor');
    setIsActionPending(false);
  };

  const handleReject = async () => {
    if (!remarksInput.trim()) {
      setRemarksError(true);
      return;
    }
    setIsActionPending(true);
    setRemarksError(false);
    await advisorReviewOD(currentOD.id, 'REJECTED', remarksInput.trim());
    setIsActionPending(false);
  };

  const handleVerifyMemberProof = async (memberStudentId: string, status: 'VERIFIED' | 'REJECTED') => {
    await advisorVerifyProof(currentOD.id, memberStudentId, status);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-advisor-detail"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          id="btn-delete-od-request"
          onClick={handleDelete}
          disabled={isActionPending}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Remove Request</span>
        </button>
      </div>

      {/* Main OD Info Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Advisor Review Mode
              </span>
              <span className="text-xs text-slate-400">
                Request ID: {currentOD.id}
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
              Student Requester
            </span>
            <div className="text-sm font-bold text-slate-900">
              {currentOD.student_name} ({currentOD.student_roll})
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Date Range
            </span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
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
        </div>

        {/* Description */}
        {currentOD.description && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Event Description & Purpose
            </h3>
            <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line">
              {currentOD.description}
            </p>
          </div>
        )}

        {/* Team Members List (if Team) */}
        {currentOD.request_type === 'Team' && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              Team Members ({currentOD.team_members.length + 1} Total)
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs">
                <div>
                  <span className="font-bold text-slate-900">{currentOD.student_name} ({currentOD.student_roll})</span>
                  <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-800">
                    Lead
                  </span>
                </div>
                <span className="text-slate-500">Proof: {currentOD.my_individual_proof_status}</span>
              </div>

              {currentOD.team_members.map((m) => (
                <div
                  key={m.student_id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{m.name} ({m.roll_no})</span>
                  </div>
                  <span className="text-slate-500">Proof: {m.individual_proof_status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Decision Block for Pending Status */}
      {currentOD.advisor_status === 'PENDING' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">
              Advisor Decision & Review
            </h2>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Advisor Remarks <span className="text-slate-400 font-normal">(Required if Rejecting)</span>
            </label>
            <textarea
              id="input-advisor-remarks"
              rows={3}
              value={remarksInput}
              onChange={(e) => {
                setRemarksInput(e.target.value);
                if (e.target.value.trim()) setRemarksError(false);
              }}
              placeholder="Enter reasons or approval notes for the student..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 ${
                remarksError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:ring-amber-500'
              }`}
            />
            {remarksError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Remarks are required before rejecting an OD request.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              id="btn-advisor-reject-od"
              disabled={isActionPending}
              onClick={handleReject}
              className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Reject OD Request</span>
            </button>

            <button
              type="button"
              id="btn-advisor-approve-od"
              disabled={isActionPending}
              onClick={handleApprove}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Approve OD Request</span>
            </button>
          </div>
        </div>
      )}

      {currentOD.advisor_status === 'APPROVED' && currentOD.od_final_status === 'PENDING' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs font-semibold">
            <span className="font-bold">Awaiting Final Approval:</span> You have approved this OD request. It is now awaiting secondary/final administrative sign-off.
          </div>
        </div>
      )}

      {/* Per-member Proof Verification */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          Individual Proof Verification (Per Member)
        </h2>

        {(() => {
          const participants = [
            {
              student_id: currentOD.student_id,
              name: currentOD.student_name,
              roll_no: currentOD.student_roll,
              proof_status: currentOD.my_individual_proof_status,
              drive_link: currentOD.my_proof_link,
              remarks: currentOD.my_proof_remarks
            },
            ...currentOD.team_members.map((m) => ({
              student_id: m.student_id,
              name: m.name,
              roll_no: m.roll_no,
              proof_status: m.individual_proof_status,
              drive_link: m.drive_link,
              remarks: m.remarks
            }))
          ];

          return (
            <div className="divide-y divide-slate-100">
              {participants.map((p) => (
                <div key={p.student_id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {p.name} ({p.roll_no})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.proof_status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : p.proof_status === 'SUBMITTED'
                            ? 'bg-amber-100 text-amber-800'
                            : p.proof_status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        Proof: {p.proof_status}
                      </span>
                    </div>

                    {p.drive_link ? (
                      <div className="text-xs">
                        <a
                          href={p.drive_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline font-medium inline-flex items-center gap-1"
                        >
                          <span>{p.drive_link}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {p.remarks && <p className="text-slate-500 text-[11px] mt-0.5">Remarks: {p.remarks}</p>}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No proof link submitted yet.</p>
                    )}
                  </div>

                  {p.drive_link && p.proof_status === 'SUBMITTED' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        id={`reject-proof-${p.student_id}`}
                        onClick={() => handleVerifyMemberProof(p.student_id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        Reject Proof
                      </button>
                      <button
                        type="button"
                        id={`verify-proof-${p.student_id}`}
                        onClick={() => handleVerifyMemberProof(p.student_id, 'VERIFIED')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Verify Proof ✓
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}
      </div>

    </div>
  );
};
