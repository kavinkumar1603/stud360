'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Search, CheckCircle2, FileText, User } from 'lucide-react';

export const AdvisorODProofsView: React.FC = () => {
  const { currentAdvisor, odRequests, students, academicYear, semester } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Get cohort IDs
  const myStudentIds = students.filter(s => s.advisor_id === currentAdvisor?.id).map(s => s.id);

  // Filter ONLY APPROVED requests relevant to this advisor (All time, or current AY/sem?) 
  // The user likely wants to see all approved ODs for the current AY/sem or all-time. Let's do all-time cohort to match dashboard.
  const approvedRequests = odRequests.filter(
    (od) => myStudentIds.includes(od.student_id) && od.advisor_status === 'APPROVED'
  );

  const filteredRequests = approvedRequests.filter(od => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return od.student_name.toLowerCase().includes(s) || od.student_roll.toLowerCase().includes(s) || od.event_name.toLowerCase().includes(s);
  });

  const handleExportCSV = () => {
    // Generate CSV string
    const headers = ['Roll No', 'Student Name', 'Event Name', 'Event Date', 'Proof Status', 'Drive Link', 'Remarks'];
    
    const rows = filteredRequests.map(od => {
      // Escape commas by quoting
      const escapeStr = (str: string | undefined) => str ? `"${str.replace(/"/g, '""')}"` : '""';
      
      return [
        escapeStr(od.student_roll),
        escapeStr(od.student_name),
        escapeStr(od.event_name),
        escapeStr(`${od.from_date} to ${od.to_date}`),
        escapeStr(od.my_individual_proof_status),
        escapeStr(od.my_proof_link || 'Not provided'),
        escapeStr(od.my_proof_remarks || '')
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OD_Proofs_${currentAdvisor.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Event Proof Submissions
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            View proof documents for approved OD requests and export them.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={handleExportCSV}
            disabled={filteredRequests.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table / List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No proof records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no approved OD requests matching your search.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Event Details</th>
                  <th className="px-6 py-4">Proof Status</th>
                  <th className="px-6 py-4">Drive Link</th>
                  <th className="px-6 py-4 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(od => (
                  <tr key={od.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{od.student_name}</p>
                          <p className="text-[11px] font-semibold text-slate-500">{od.student_roll}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{od.event_name}</p>
                      <p className="text-[11px] text-slate-500">{od.from_date} to {od.to_date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                        od.my_individual_proof_status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        od.my_individual_proof_status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {od.my_individual_proof_status || 'OPEN'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {od.my_proof_link ? (
                        <a href={od.my_proof_link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2">
                          View Link
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600 text-xs max-w-[200px] truncate">
                      {od.my_proof_remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
