'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const urlError = searchParams.get('error');

  const getErrorMessage = () => {
    if (error) return error;
    if (urlError === 'unauthorized_email') return 'এই গুগল অ্যাকাউন্টটি অনুমোদিত অ্যাডমিন তালিকায় নেই। অনুগ্রহ করে অনুমোদিত ইমেইল ব্যবহার করুন।';
    if (urlError === 'google_not_configured') return 'Google Login এখনো কনফিগার করা হয়নি। আপনার .env.local ফাইলে GOOGLE_CLIENT_ID ও SECRET যোগ করুন, অথবা নিচের পাসওয়ার্ড দিয়ে লগইন করুন।';
    if (urlError === 'google_failed') return 'গুগল সাইন-ইন প্রক্রিয়া বাতিল হয়েছে বা ব্যর্থ হয়েছে।';
    if (urlError === 'token_exchange_failed') return 'গুগল ভেরিফিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    if (urlError) return 'অথেন্টিকেশন এরর হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    return null;
  };

  const activeError = getErrorMessage();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setError(data.error || 'লগইন ব্যর্থ হয়েছে। ইউজারনেম ও পাসওয়ার্ড চেক করুন।');
      }
    } catch (err) {
      setError('সার্ভারের সাথে সংযোগ বিচ্ছিন্ন। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-stone-200/80 relative overflow-hidden">
      {/* Top Accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-maroon" />

      {/* Back to website */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-brand-maroon transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> ওয়েবসাইটে ফিরে যান
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-brand-maroon text-white flex items-center justify-center mx-auto mb-3 shadow-md font-bold text-lg">
          ॐ
        </div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight uppercase">
          Bansdroni Sonali Park
        </h2>
        <p className="text-xs text-brand-maroon font-semibold tracking-wider uppercase mt-0.5">
          Club & Puja Committee • Admin Portal
        </p>
      </div>

      {activeError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-red-700 leading-relaxed">{activeError}</p>
        </div>
      )}

      {/* ═══ 1. Official Google Sign-In Button ═══ */}
      <div className="space-y-4">
        <a
          href="/api/auth/google"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 shadow-sm hover:shadow text-sm font-bold text-stone-700 transition-all group"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="group-hover:text-stone-900">Sign in with Google</span>
        </a>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="flex-grow border-t border-stone-200" />
          <span className="flex-shrink mx-4 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            অথবা পাসওয়ার্ড দিয়ে
          </span>
          <div className="flex-grow border-t border-stone-200" />
        </div>

        {/* ═══ 2. Emergency Password Fallback Form ═══ */}
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-maroon hover:bg-brand-dark text-white font-bold text-sm shadow-md shadow-brand-maroon/20 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            {loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 selection:bg-brand-maroon selection:text-white">
      <Suspense fallback={<div className="text-sm font-semibold text-stone-500">Loading portal...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
