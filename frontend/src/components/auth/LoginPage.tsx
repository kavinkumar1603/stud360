import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, students, advisors, addToast } = useApp();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const input = credential.trim();
    const pass = password.trim();

    if (!input || !pass) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: input, password: pass }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Invalid credentials.');
        return;
      }

      // Store JWT token (in production this could be an HttpOnly cookie or secure storage)
      localStorage.setItem('token', data.token);

      // Login using the context
      login(data.user.id, data.user.role);
      
      const roleName = data.user.role === 'STUDENT' ? 'Student' : 'Faculty Advisor';
      addToast(`Logged in as ${roleName} (${data.user.name})`, 'success');
    } catch (error) {
      console.error('Login request failed:', error);
      setErrorMessage('Failed to connect to the server. Please ensure the backend is running.');
    }
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
