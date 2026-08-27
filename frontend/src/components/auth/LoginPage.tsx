'use client';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Quote } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, addToast } = useApp();
  const router = useRouter();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const input = credential.trim();
    const pass = password.trim();

    if (!input || !pass) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: input, password: pass }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Invalid credentials.');
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('userId', data.user.id);
      sessionStorage.setItem('userRole', data.user.role);

      login(data.user.id, data.user.role);
      
      const roleName = data.user.role === 'STUDENT' ? 'Student' : 'Faculty Advisor';
      addToast(`Logged in as ${roleName} (${data.user.name})`, 'success');
      
      if (data.user.role === 'STUDENT') {
        router.push(`/${data.user.roll_no.toLowerCase()}`);
      } else {
        router.push('/advisor');
      }
    } catch (error) {
      console.error('Login request failed:', error);
      setErrorMessage('Failed to connect to the server. Please ensure the backend is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Side: Brand and Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 relative overflow-hidden flex-col justify-between p-12 lg:p-20">
        {/* Background Image & Overlays */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-indigo-900/90 to-slate-900/90"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent"></div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Stud360 Portal</span>
        </div>

        {/* Decorative Quote / Copy */}
        <div className="relative z-10 max-w-lg">
          <Quote className="w-10 h-10 text-indigo-400/50 mb-6 rotate-180" />
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
            Elevate your academic journey.
          </h1>
          <p className="text-lg text-indigo-200/90 leading-relaxed font-medium">
            A unified platform for students and advisors to effortlessly manage On-Duty leaves, certifications, and academic approvals.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-900 bg-indigo-200 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 12}`} alt="User avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-indigo-200">Joined by 2,000+ students & faculty</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        {/* Mobile decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-64 bg-indigo-50 rounded-b-[100px] lg:hidden -z-10"></div>
        
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Branding (Only visible on small screens) */}
          <div className="lg:hidden text-center space-y-4 mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Stud360</h2>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5 mt-8">
            
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Username field */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 tracking-wide">
                  Email or Roll Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={credential}
                    onChange={(e) => {
                      setCredential(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="e.g. 22CS045 or faculty@college.edu"
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border-transparent rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-slate-700 tracking-wide">
                    Password
                  </label>
                  <a href="#" className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border-transparent rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 mt-6"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
          </form>

          <p className="text-center text-[13px] text-slate-500 font-medium">
            By signing in, you agree to our{' '}
            <a href="#" className="text-slate-900 font-bold hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-slate-900 font-bold hover:underline">Privacy Policy</a>.
          </p>

        </div>
      </div>

    </div>
  );
};
