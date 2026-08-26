'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ManageDeadlinesView: React.FC = () => {
  const { deadlines, addDeadline, deleteDeadline } = useApp();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    setIsSubmitting(true);
    await addDeadline({ title, description, due_date: dueDate });
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Deadlines</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white">{deadlines.length}</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl">
            Set and manage upcoming deadlines for your assigned cohort. These will appear on the student dashboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs h-fit">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Add New Deadline</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NPTEL Registration"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional context or instructions..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Due Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm mt-4 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Publish Deadline
              </button>
            </div>
          </form>
        </div>

        {/* Right Columns: List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-4 border-b border-slate-100 mb-4">
              Current Deadlines
            </h2>

            {deadlines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
                  <Clock className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-900">No active deadlines</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  You haven't posted any deadlines yet. Create one using the form to notify your students.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {deadlines.map((dl) => (
                  <div key={dl.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/10 transition-all group">
                    <div className="flex gap-4 items-start">
                      <div className="text-center px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0 min-w-[60px]">
                        <span className="text-[10px] font-black uppercase text-blue-600 block leading-none mb-1">
                          {new Date(dl.due_date).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black text-slate-900 leading-none">
                          {new Date(dl.due_date).getDate().toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{dl.title}</h4>
                        {dl.description && <p className="text-xs text-slate-600 mt-1 max-w-lg">{dl.description}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                            Upcoming
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteDeadline(dl.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete Deadline"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
