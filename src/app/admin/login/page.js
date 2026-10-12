'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const getErrorMessage = () => {
    if (urlError === 'unauthorized_email') return 'এই গুগল অ্যাকাউন্টটি অনুমোদিত অ্যাডমিন তালিকায় নেই। শুধুমাত্র অনুমোদিত অ্যাডমিন (pdyutiranjan@gmail.com) প্রবেশ করতে পারবেন।';
    if (urlError === 'google_not_configured') return 'Google Login এখনো কনফিগার করা হয়নি।';
    if (urlError === 'google_failed') return 'গুগল সাইন-ইন প্রক্রিয়া বাতিল হয়েছে বা ব্যর্থ হয়েছে।';
    if (urlError === 'token_exchange_failed') return 'গুগল ভেরিফিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    if (urlError) return 'অথেন্টিকেশন এরর হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    return null;
  };

  const activeError = getErrorMessage();

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

      {/* ═══ Official Google Sign-In Only ═══ */}
      <div className="space-y-5">
        <a
          href="/api/auth/google"
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 shadow-sm hover:shadow text-sm font-bold text-stone-700 transition-all group"
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

        {/* Authorized Admin Notice */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-2.5 text-left">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed text-stone-600">
            <span className="font-bold text-stone-800 block">অনুমোদিত অ্যাডমিন অ্যাকাউন্ট:</span>
            <code className="text-brand-maroon font-mono font-semibold">pdyutiranjan@gmail.com</code>
            <p className="mt-1 text-stone-500">
              নিরাপত্তার স্বার্থে পাসওয়ার্ড ভিত্তিক লগইন বন্ধ করা হয়েছে। শুধুমাত্র উল্লেখিত গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন করে অ্যাডমিন পোর্টালে প্রবেশ করা যাবে।
            </p>
          </div>
        </div>
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
