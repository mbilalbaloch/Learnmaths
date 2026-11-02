'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setIsSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFDFD] flex flex-col justify-center px-6 py-12 text-[#0F172A]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5 text-2xl font-bold tracking-tight mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#486851] flex items-center justify-center text-white font-serif italic text-xl font-bold leading-none select-none">
            ∫
          </div>
          <span>LearnMaths</span>
        </Link>
        
        {!isSubmitted ? (
          <h2 className="text-3xl font-extrabold tracking-tight text-center">
            Create your account
          </h2>
        ) : (
          <h2 className="text-3xl font-extrabold tracking-tight text-center">
            Check your email
          </h2>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {!isSubmitted ? (
          <form onSubmit={handleSignup} className="space-y-5 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            {errorMsg && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#486851] transition"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#486851] transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#486851] transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 font-semibold text-white bg-[#486851] hover:bg-[#3b5542] disabled:opacity-50 rounded-lg transition-colors shadow-sm"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        ) : (
          /* Success Screen for Email Confirmation */
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-50 text-[#486851] rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#0F172A]">
                Confirmation Email Sent
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We sent a verification link to <span className="font-semibold text-slate-900">{email}</span>. Please open your inbox, click the confirmation link, and then log in.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 font-semibold text-white bg-[#486851] hover:bg-[#3b5542] rounded-lg transition-colors shadow-sm"
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#486851] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}