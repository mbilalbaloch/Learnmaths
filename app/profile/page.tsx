'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LogOut, 
  ShieldCheck, 
  BookOpen, 
  Lock, 
  UserCheck, 
  ArrowLeft,
  CheckCircle2,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Password Update States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function initProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Load theme preference on mount
      const savedTheme = localStorage.getItem('learnmaths_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
      }

      setLoading(false);
    }
    initProfile();
  }, [router, supabase]);

  const toggleTheme = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('learnmaths_theme', 'light');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('learnmaths_theme', 'dark');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (!newPassword || newPassword.length < 6) {
      setProfileMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsUpdatingPassword(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setIsUpdatingPassword(false);

    if (error) {
      setProfileMsg({ type: 'error', text: error.message });
    } else {
      setProfileMsg({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#121212] flex items-center justify-center text-[#1C1917] dark:text-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#486851] flex items-center justify-center text-white text-sm font-serif italic font-bold shadow-sm">
            ∫
          </div>
          <span className="text-sm font-semibold font-serif animate-pulse">Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#121212] text-[#1C1917] dark:text-stone-100 font-sans flex flex-col transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-3.5 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#486851] flex items-center justify-center text-white font-serif italic text-lg sm:text-xl font-bold leading-none select-none shadow-sm">
                ∫
              </div>
              <span className="font-serif tracking-wide text-stone-900 dark:text-stone-100">LearnMaths</span>
            </Link>

            {userRole === 'admin' ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-[#486851] dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Author Editor Mode
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-full">
                <BookOpen className="w-3.5 h-3.5 text-[#486851] dark:text-emerald-400" />
                Reader Edition
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Content Area */}
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 flex-1">
        <div className="bg-white dark:bg-[#1A1A1A] border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-8 transition-colors">
          <div className="flex items-center justify-between pb-6 border-b border-stone-100 dark:border-stone-800 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#486851] dark:text-emerald-400 flex items-center justify-center font-serif text-xl font-bold shadow-inner">
                {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">User Profile</h1>
                <p className="text-xs text-stone-500 dark:text-stone-400">Manage your account details and security settings.</p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          {profileMsg && (
            <div className={`p-4 rounded-2xl text-sm flex items-center gap-2.5 ${profileMsg.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
              {profileMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#486851] dark:text-emerald-400 shrink-0" /> : <X className="w-5 h-5 text-red-600 shrink-0" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          {/* Account Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">Full Name</span>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{user?.user_metadata?.full_name || 'Not specified'}</p>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">Email Address</span>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{user?.email}</p>
            </div>
          </div>

          {/* Password Change Form */}
          <form onSubmit={handlePasswordUpdate} className="space-y-5 pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#486851] dark:text-emerald-400" />
              <h2 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">Change Password</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 text-sm bg-stone-50/50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#486851] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 text-sm bg-stone-50/50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#486851] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-[#486851] hover:bg-[#3b5542] rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <UserCheck className="w-4 h-4" />
              {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}