'use client';
import { MapPin, Phone, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { lang, b } = useLanguage();

  return (
    <footer className="bg-[#11192E] text-stone-300 pt-16 pb-8 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
        
        {/* Official Club Branding */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-base shadow-md">
              <span>ॐ</span>
            </div>
            <div>
              <strong className="text-lg font-bold text-white block leading-tight">
                {b('বাঁশদ্রোণী সোনালী পার্ক', 'Bansdroni Sonali Park')}
              </strong>
              <span className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase">
                {b('সার্বজনীন দুর্গোৎসব ও ক্লাব', 'Club & Puja Committee')}
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-stone-400 mb-5">
            {b(
              'বাঁশদ্রোণী সোনালী পার্ক — ঐতিহ্য, সংস্কৃতি ও সেবামূলক কর্মকাণ্ডের মিলনমেলা। সার্বজনীন দুর্গোৎসব, সমাজকল্যাণ ও পাড়ার সার্বিক উন্নয়নে আমরা সর্বদা নিবেদিত।',
              'A premier cultural and community welfare organization in Bansdroni, Kolkata. Dedicated to heritage preservation, organizing the grand Durga Puja, and neighborhood civic welfare.'
            )}
          </p>
          <Link
            href="/committee"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-white transition-colors"
          >
            <span>{b('কমিটির কর্মকর্তাদের পরিচিতি', 'Meet Club Leadership')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* Contact Information */}
        <div>
          <strong className="text-xs font-bold text-white block mb-4 uppercase tracking-widest text-amber-400">
            {b('অফিসিয়াল যোগাযোগ', 'Official Contact')}
          </strong>
          <ul className="space-y-3 text-xs text-stone-300">
            <li className="flex items-start gap-3">
              <MapPin className="text-amber-400 w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {b(
                  'বাঁশদ্রোণী সোনালী পার্ক, পোঃ বাঁশদ্রোণী, কলকাতা - ৭০০০৭০, পশ্চিমবঙ্গ',
                  'Bansdroni Sonali Park, P.O. Bansdroni, Kolkata - 700070, West Bengal'
                )}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-amber-400 w-4 h-4 shrink-0" />
              <span className="font-mono">+91 98300 XXXXX</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-amber-400 w-4 h-4 shrink-0" />
              <span className="font-mono">contact@bansdronisonalipark.org</span>
            </li>
          </ul>
        </div>

        {/* Social Media Connect */}
        <div>
          <strong className="text-xs font-bold text-white block mb-4 uppercase tracking-widest text-amber-400">
            {b('ডিজিটাল সংযোগ', 'Official Channels')}
          </strong>
          <p className="text-xs text-stone-400 mb-5">
            {b(
              'পূজার সমস্ত নোটিশ, লাইভ আপডেট এবং ছবি পেতে আমাদের অফিসিয়াল পেজগুলোতে যুক্ত থাকুন।',
              'Follow our official community channels for real-time announcements, gallery archives, and event streams.'
            )}
          </p>
          
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-all group" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current text-white transition-colors" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] flex items-center justify-center transition-all group" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/919830000000" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-all group" aria-label="WhatsApp">
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-center text-xs text-stone-500 flex flex-col md:flex-row justify-between items-center gap-3">
        <p>© {new Date().getFullYear()} Bansdroni Sonali Park. {b('সর্বস্বত্ব সংরক্ষিত।', 'All rights reserved.')}</p>
        <p className="flex items-center gap-1.5 font-mono text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>{b('রেজিস্টার্ড সোসাইটি • পশ্চিমবঙ্গ সরকার', 'Registered Society • Govt. of West Bengal')}</span>
        </p>
      </div>
    </footer>
  );
}
