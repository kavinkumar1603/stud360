'use client';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  GraduationCap,
  Lock,
  IdCard,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  FileText,
  ShieldCheck,
  CalendarClock,
  BadgeCheck,
  Loader2
} from 'lucide-react';

// clg_logo.webp is a 5650x1378 banner; request a small optimized render at that
// aspect ratio so the login screen doesn't pull the full-size original.
const LOGO_W = 328;
const LOGO_H = 80;

const HIGHLIGHTS = [
  {
    icon: FileText,
    title: 'Apply for On-Duty',
    copy: 'Raise individual or team OD requests with full event details in one form.'
  },
  {
    icon: ShieldCheck,
    title: 'Advisor approvals',
    copy: 'Faculty advisors review, approve or reject requests from a single queue.'
  },
  {
    icon: BadgeCheck,
    title: 'Proof verification',
    copy: 'Upload certificates after the event and track verification status live.'
  },
  {
    icon: CalendarClock,
    title: 'Deadline tracking',
    copy: 'Never miss a submission window with advisor-published deadlines.'
  }
];

export const LoginPage: React.FC = () => {
  const { login, addToast } = useApp();
  const router = useRouter();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stud360.onrender.com/api';
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
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900 font-sans">

      {/* ---------- Center: sign-in form ---------- */}
      <div className="w-full flex flex-col items-center justify-center p-6 sm:p-10 relative">

        {/* Ambient wash: decorative header on mobile, subtle tint on desktop */}
        <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-blue-100/80 to-transparent pointer-events-none" />

        <div className="w-full max-w-[26rem] relative z-10 animate-rise">

          {/* Brand lockup */}
          <div className="flex flex-col items-center text-center mb-10">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-left leading-tight">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Stud360</h1>
                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                  Academic OD Portal
                </p>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs p-7 sm:p-8">

            <div className="space-y-1.5 mb-7">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
              <p className="text-xs text-slate-500 font-medium">
                Sign in to manage your On-Duty requests and approvals.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>

              {/* Error banner */}
              {errorMessage && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5 animate-shake"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Credential */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-credential"
                  className="block text-[10px] font-bold uppercase tracking-widest text-slate-500"
                >
                  Roll Number or Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <IdCard className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="login-credential"
                    name="username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    value={credential}
                    onChange={(e) => {
                      setCredential(e.target.value.toUpperCase());
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="username"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="login-password"
                    className="block text-[10px] font-bold uppercase tracking-widest text-slate-500"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline underline-offset-2"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value.toUpperCase());
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="password"
                    className="block w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20 active:scale-[0.985] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm shadow-blue-600/25 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Role hint strip */}
            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2.5 rounded-xl bg-blue-50/70 border border-blue-100 px-3 py-2.5">
                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="leading-tight min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Student</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate">Use roll number</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-amber-50/70 border border-amber-100 px-3 py-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="leading-tight min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Advisor</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate">Use email ID</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal footer */}
          <p className="text-center text-[11px] text-slate-400 font-medium mt-6 leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="#" className="text-slate-600 font-semibold hover:text-slate-900 hover:underline underline-offset-2">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-slate-600 font-semibold hover:text-slate-900 hover:underline underline-offset-2">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
