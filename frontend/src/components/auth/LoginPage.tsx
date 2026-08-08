import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, students, advisors, addToast } = useApp();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const input = credential.trim().toLowerCase();

    if (!input) {
      setErrorMessage('Please enter your Roll Number, Email, or Username.');
      return;
    }

    // 1. Try matching Advisor
    const matchedAdvisor = advisors.find(
      (a) =>
        a.email.toLowerCase() === input ||
        a.id.toLowerCase() === input ||
        a.name.toLowerCase().includes(input) ||
        a.email.toLowerCase().split('@')[0] === input
    );

    const isAdvisorKeyword =
      input.includes('advisor') ||
      input.includes('jenkins') ||
      input.includes('prof') ||
      input.includes('doctor') ||
      input.includes('dr.');

    if (matchedAdvisor || isAdvisorKeyword) {
      const advId = matchedAdvisor ? matchedAdvisor.id : advisors[0]?.id || 'adv-01';
      login(advId, 'ADVISOR');
      addToast(`Logged in as Faculty Advisor (${matchedAdvisor ? matchedAdvisor.name : 'Dr. Sarah Jenkins'})`, 'success');
      return;
    }

    // 2. Try matching Student
    const matchedStudent = students.find(
      (s) =>
        s.email.toLowerCase() === input ||
        s.roll_no.toLowerCase() === input ||
        s.id.toLowerCase() === input ||
        s.name.toLowerCase().includes(input) ||
        s.email.toLowerCase().split('@')[0] === input
    );

    if (matchedStudent) {
      login(matchedStudent.id, 'STUDENT');
      addToast(`Logged in as Student (${matchedStudent.name})`, 'success');
      return;
    }

    // 3. General fallback if user enters custom text
    // If input contains "student" or standard text, log in as first student
    if (input.includes('student') || input.length >= 2) {
      const defaultStudent = students[0];
      login(defaultStudent.id, 'STUDENT');
      addToast(`Logged in as Student (${defaultStudent.name})`, 'success');
      return;
    }

    setErrorMessage('Invalid credentials. Try roll number (e.g., 22CS045) or advisor email.');
  };

  const fillQuickCredential = (demoCred: string) => {
    setCredential(demoCred);
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Top Branding Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          AcademicHub Portal
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          On-Duty Leave Approval & Online Certification Tracking System
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div>
            <h3 className="text-base font-bold text-slate-900">Sign In</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your credentials to automatically access your student or advisor portal
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email / Roll Number Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Roll Number or Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="input-login-credential"
                  type="text"
                  required
                  value={credential}
                  onChange={(e) => {
                    setCredential(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. 22CS045 or sarah.jenkins@academic.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="input-login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-login-submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Quick Demo Credentials
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                id="btn-demo-student-credential"
                onClick={() => fillQuickCredential('22CS045')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-slate-800 group-hover:text-blue-700">Student Login</div>
                <div className="text-[10px] text-slate-500 font-mono">22CS045</div>
              </button>

              <button
                type="button"
                id="btn-demo-advisor-credential"
                onClick={() => fillQuickCredential('sarah.jenkins@academic.edu')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-slate-800 group-hover:text-indigo-700">Advisor Login</div>
                <div className="text-[10px] text-slate-500 font-mono">sarah.jenkins</div>
              </button>
            </div>
          </div>

          {/* Security Banner */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Automatic role authentication redirects to Student or Advisor Dashboard.</span>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Academic Management System • Smart Role-Based Redirect
        </p>
      </div>

    </div>
  );
};
