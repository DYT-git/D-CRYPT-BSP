// src/components/HeritageIcons.js
// Bespoke handcrafted vector motifs for Bansdroni Sonali Park portal.
// Replaces generic system emojis with authentic cultural, architectural, and civic iconography.

export function DiyaIcon({ className = "w-4 h-4 text-amber-500" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Flame glow */}
      <path
        d="M12 2C12 2 9.5 5.5 9.5 8C9.5 9.65685 10.6193 11 12 11C13.3807 11 14.5 9.65685 14.5 8C14.5 5.5 12 2 12 2Z"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="12" cy="7.5" r="1.2" fill="#FEF08A" />
      {/* Clay bowl / Pradeep base */}
      <path
        d="M3 13.5C3 17.5 7 20.5 12 20.5C17 20.5 21 17.5 21 13.5C21 13 20 12.5 18 12.5C14.5 12.5 14 13.5 12 13.5C10 13.5 9.5 12.5 6 12.5C4 12.5 3 13 3 13.5Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7 20.5L6.5 22H17.5L17 20.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShankhaIcon({ className = "w-4 h-4 text-amber-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M12 3C8 3 4.5 6 4 10.5C3.5 14.5 6 18 10 20C11.5 20.8 13.5 21 15 20C18 18 20 14.5 20 11C20 6.5 16.5 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M12 3C13.5 5 15 8 14.5 11.5C14 14.5 12 17 10 20"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M8 8C9.5 9.5 11 11.5 11 14C11 16 10 18 8.5 19.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

export function MandapIcon({ className = "w-5 h-5 text-rose-300" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Temple Kalash on top */}
      <path d="M12 2V4.5M10.5 4.5H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="3.5" r="0.8" fill="currentColor" />
      {/* Temple Shikhara arch */}
      <path
        d="M12 4.5C9 7.5 4 10 4 13H20C20 10 15 7.5 12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.2"
        strokeLinejoin="round"
      />
      {/* Inner sacred Toran arch */}
      <path
        d="M7 13V21M17 21V13M7 16.5C7 14 9.5 13.5 12 13.5C14.5 13.5 17 14 17 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Base plinth */}
      <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SculptorIcon({ className = "w-5 h-5 text-rose-300" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Maa Durga Divine Eye (Chokkhu Daan) */}
      <path
        d="M2.5 12C5.5 7 9.5 5 12 5C14.5 5 18.5 7 21.5 12C18.5 17 14.5 19 12 19C9.5 19 5.5 17 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Sacred pupil */}
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
      <circle cx="13" cy="11" r="1" fill="#FFF" />
      {/* Upper arched eyelid line & vermilion teardrop mark */}
      <path d="M7 6.5C9 5 11 4.5 12 4.5C13 4.5 15 5 17 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 1.5V3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IlluminationIcon({ className = "w-5 h-5 text-rose-300" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Ornate Chandannagar starburst / light spark */}
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      {/* Primary rays */}
      <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      {/* Diagonal rays */}
      <path d="M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

export function CalendarPlaqueIcon({ className = "w-4 h-4 text-amber-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      <path d="M8 2V5M16 2V5M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Small auspicious sun-dot inside */}
      <circle cx="8.5" cy="13.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="13.5" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="13.5" r="1.2" fill="currentColor" />
      <circle cx="8.5" cy="17" r="1.2" fill="currentColor" />
      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="17" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function MetroTransitIcon({ className = "w-4 h-4 text-stone-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="4" y="3" width="16" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      <path d="M4 11H20M9 15H15M7 18.5L5 21M17 18.5L19 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="7" r="1" fill="currentColor" />
      <circle cx="16" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

export function PandalWorkIcon({ className = "w-4 h-4 text-emerald-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3 21L12 4L21 21H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
      <path d="M12 4V21M7.5 13H16.5M5.5 17.5H18.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// 5 Sacred Tithi Motifs for Sharadiya Durga Puja
export function ShashtiBilvaIcon({ className = "w-4 h-4 text-brand-maroon" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Sacred three-leaf Bilva (বেলপাতা) for Bodhon */}
      <path d="M12 12C12 7 12 3 12 3C12 3 15.5 6 15.5 9C15.5 11 14 12 12 12Z" fill="currentColor" stroke="none" />
      <path d="M12 12C8 10 5 9 5 9C5 9 7.5 13 10 14C11.5 14.5 12 13.5 12 12Z" fill="currentColor" stroke="none" opacity="0.85" />
      <path d="M12 12C16 10 19 9 19 9C19 9 16.5 13 14 14C12.5 14.5 12 13.5 12 12Z" fill="currentColor" stroke="none" opacity="0.85" />
      <path d="M12 12V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SaptamiNabapatrikaIcon({ className = "w-4 h-4 text-emerald-700" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Sacred Nabapatrika / Kola Bou plantain leaf motif */}
      <path
        d="M12 2C7 6 5 12 5 18C5 20.5 7 22 12 22C17 22 19 20.5 19 18C19 12 17 6 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M12 2V22M7 9C9 10.5 11 11 12 11M17 9C15 10.5 13 11 12 11M6 14C8.5 15 10.5 15.5 12 15.5M18 14C15.5 15 13.5 15.5 12 15.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function AshtamiDhunuchiIcon({ className = "w-4 h-4 text-amber-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Dhunuchi flame curls */}
      <path d="M10 3C9 5 10 6 10.5 7M14 2C13 4 14 5.5 13.5 7M12 4.5C11.5 6 12 7 12 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* Dhunuchi earthenware bowl */}
      <path
        d="M5 8C5 12.5 8 14.5 11 15V18.5H9V21H15V18.5H13V15C16 14.5 19 12.5 19 8H5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.25"
        strokeLinejoin="round"
      />
      {/* Dhunuchi handle */}
      <path d="M15 11.5C17.5 11.5 19.5 13.5 19.5 16C19.5 18.5 17.5 20 15 19.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function NavamiHomaIcon({ className = "w-4 h-4 text-orange-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Sacred Homa Yajna Flame */}
      <path
        d="M12 2C12 2 8 6 8 10C8 13.5 10 15 12 15C14 15 16 13.5 16 10C16 6 12 2 12 2Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M12 6C12 6 10 8 10 10.5C10 12 11 13 12 13C13 13 14 12 14 10.5C14 8 12 6 12 6Z"
        fill="#FEF08A"
        stroke="none"
      />
      {/* Yajna Kunda (Homa altar) */}
      <path
        d="M4 16L6 21H18L20 16H4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.2"
        strokeLinejoin="round"
      />
      <path d="M2 16H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DashamiTrishulIcon({ className = "w-4 h-4 text-brand-maroon" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Sacred divine Trishul */}
      <path d="M12 2V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M12 3L10 6.5H14L12 3Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Left prong */}
      <path
        d="M6 5C6 10 8.5 13.5 12 13.5C15.5 13.5 18 10 18 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M6 5L5 7.5H7.5L6 5ZM18 5L17 7.5H19.5L18 5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.8" />
      {/* Crossbar */}
      <path d="M9.5 16H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ClubCrestIcon({ className = "w-6 h-6 text-amber-500" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Stately Athletic & Cultural Society Shield */}
      <path
        d="M12 2L4 5.5V11C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11V5.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.15"
        strokeLinejoin="round"
      />
      {/* Inner sports torch & star */}
      <circle cx="12" cy="9.5" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 6.5V12.5M9 9.5H15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 16C9 17.5 10.5 18 12 18C13.5 18 15 17.5 16 16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function SamitiEmblemIcon({ className = "w-6 h-6 text-emerald-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Stately Civic RWA Governance & Heritage Pillar Emblem */}
      <path d="M12 2L3 6.5V8.5H21V6.5L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
      <path d="M5.5 8.5V18.5M9.5 8.5V18.5M14.5 8.5V18.5M18.5 8.5V18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="2" y="18.5" width="20" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

export function NoticeScrollIcon({ className = "w-4 h-4 text-brand-maroon" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Heritage circular seal / royal decree stamp */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SportsBadgeIcon({ className = "w-3.5 h-3.5 text-stone-700" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3C8 6 8 18 12 21M12 3C16 6 16 18 12 21M3 12H21" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function BloodDonationBadgeIcon({ className = "w-3.5 h-3.5 text-rose-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M12 2.5C12 2.5 6 9.5 6 14C6 17.5 8.5 20.5 12 20.5C15.5 20.5 18 17.5 18 14C18 9.5 12 2.5 12 2.5Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M12 11V16M9.5 13.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CulturalStageBadgeIcon({ className = "w-3.5 h-3.5 text-amber-700" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M2 19V5C2 5 7 7 12 5C17 3 22 5 22 5V19C22 19 17 17 12 19C7 21 2 19 2 19Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 5V19" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function CivicShieldBadgeIcon({ className = "w-3.5 h-3.5 text-stone-700" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 2L4 5V11C4 16 7.5 20 12 21.5C16.5 20 20 16 20 11V5L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M9 11.5L11 13.5L15 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CivicLightBadgeIcon({ className = "w-3.5 h-3.5 text-amber-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M9 18H15M10 21H14M12 2C8.5 2 6 4.5 6 8C6 11 8 13 9 14.5V16H15V14.5C16 13 18 11 18 8C18 4.5 15.5 2 12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

export function CivicGreeneryBadgeIcon({ className = "w-3.5 h-3.5 text-emerald-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 21V12M12 12C12 7.5 8 5 4 6C4 10.5 7.5 13 12 12ZM12 12C12 8 16 6 20 7C20 11.5 16 13.5 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

// Decorative Corner Kolka for Heritage Invitation Cards
export function CornerKolka({ className = "w-3 h-3 text-brand-maroon/30" }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor">
      <path d="M1 1H8C8 1 8 8 1 8V1Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.2" />
      <circle cx="3.5" cy="3.5" r="1" fill="currentColor" />
    </svg>
  );
}

// ═════ NEW ELEMENTS INSPIRED BY USER DESIGN REFERENCES ═════

// 1. Festive Golden Wavy Squiggle (Inspired by Reference 2)
export function FestiveWaveAccent({ className = "w-16 h-2 text-amber-500" }) {
  return (
    <svg className={className} viewBox="0 0 64 8" fill="none" preserveAspectRatio="none">
      <path
        d="M 0 4 Q 8 0, 16 4 T 32 4 T 48 4 T 64 4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 2. Pinned Textured Washi Tape Header (Inspired by Reference 3)
export function WashiTapePin({ text = "শারদীয়া বুলেটিন", variant = "amber", className = "" }) {
  const themes = {
    amber: "from-amber-100 via-amber-200 to-amber-100 text-amber-950 border-amber-300/80 shadow-[0_2px_6px_rgba(180,83,9,0.12)]",
    emerald: "from-emerald-100 via-emerald-200 to-emerald-100 text-emerald-950 border-emerald-300/80 shadow-[0_2px_6px_rgba(5,150,105,0.12)]",
    rose: "from-rose-100 via-rose-200 to-rose-100 text-rose-950 border-rose-300/80 shadow-[0_2px_6px_rgba(225,29,72,0.12)]",
    blue: "from-sky-100 via-sky-200 to-sky-100 text-sky-950 border-sky-300/80 shadow-[0_2px_6px_rgba(2,132,199,0.12)]"
  };
  const themeClass = themes[variant] || themes.amber;
  return (
    <div className={`relative inline-flex items-center justify-center px-4 py-1 text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r border-t border-b -rotate-1 select-none before:absolute before:-left-1.5 before:inset-y-0 before:w-1.5 before:bg-inherit before:[clip-path:polygon(100%_0,0_50%,100%_100%)] after:absolute after:-right-1.5 after:inset-y-0 after:w-1.5 after:bg-inherit after:[clip-path:polygon(0_0,100%_50%,0_100%)] ${themeClass} ${className}`}>
      {text}
    </div>
  );
}

// 3. Perforated Spiral Notebook Binder Holes (Tactile 3D Punched Paper Holes)
export function BinderHoles({ count = 5, className = "" }) {
  return (
    <div className={`flex flex-col justify-around items-center select-none pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="relative flex items-center justify-center my-1"
        >
          {/* Realistic punched paper hole with physical depth and light rim */}
          <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-[#E5DEC9] border border-[#BDB094] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.85)] flex items-center justify-center">
            {/* Dark inner cavity showing through the hole */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#3D3325]/35 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 4. Torn Paper Deckle Bottom Edge (Inspired by Reference 3)
export function TornDeckleEdge({ className = "w-full text-stone-200" }) {
  return (
    <svg className={className} viewBox="0 0 100 6" preserveAspectRatio="none" fill="currentColor">
      <path d="M0,0 L0,3 Q5,6 10,2 Q15,5 20,2 Q25,6 30,3 Q35,1 40,4 Q45,6 50,2 Q55,5 60,3 Q65,6 70,2 Q75,4 80,1 Q85,5 90,3 Q95,6 100,2 L100,0 Z" />
    </svg>
  );
}

// 5. Divine Durga Devi Emblem (replaces raw flower emoji)
export function DurgaDeviEmblemIcon({ className = "w-4 h-4 text-rose-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M2.5 12C5.5 7 9.5 5 12 5C14.5 5 18.5 7 21.5 12C18.5 17 14.5 19 12 19C9.5 19 5.5 17 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" fill="currentColor" />
      <circle cx="13" cy="11" r="0.9" fill="#FFF" />
      <path d="M12 2V5M9.5 3.5C10.5 4.5 11.5 5 12 5C12.5 5 13.5 4.5 14.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// 6. Sacred Backlit Alpona Mandala (Authentic Concentric Bengal Kolka & Lotus Halo)
export function SacredAlponaMandala({ className = "w-96 h-96 text-amber-300/30" }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" stroke="currentColor">
      <defs>
        <radialGradient id="alponaGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#BE123C" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#BE123C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Radiant Ambient Core Halo */}
      <circle cx="200" cy="200" r="190" fill="url(#alponaGlowGrad)" stroke="none" />

      {/* Outer Concentric Beaded Halo Ring */}
      <circle cx="200" cy="200" r="185" strokeWidth="1.2" strokeDasharray="3 7" opacity="0.6" />
      <circle cx="200" cy="200" r="176" strokeWidth="1.5" opacity="0.45" />
      <circle cx="200" cy="200" r="168" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />

      {/* 24 Radiating Ray Flakes */}
      <g opacity="0.65" strokeWidth="1.4">
        {[...Array(24)].map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <g key={i} transform={`rotate(${angle} 200 200)`}>
              <line x1="200" y1="24" x2="200" y2="40" strokeLinecap="round" />
              <circle cx="200" cy="22" r="2" fill="currentColor" stroke="none" />
              <path d="M197 32 Q200 28 203 32 Q200 36 197 32 Z" fill="currentColor" stroke="none" />
            </g>
          );
        })}
      </g>

      {/* Secondary Ring with 16 Kolka Petals */}
      <circle cx="200" cy="200" r="140" strokeWidth="1.5" opacity="0.5" />
      <g opacity="0.75">
        {[...Array(16)].map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={i} transform={`rotate(${angle} 200 200)`}>
              <path
                d="M200 60 C192 78 188 95 200 110 C212 95 208 78 200 60 Z"
                strokeWidth="1.4"
                fill="currentColor"
                fillOpacity="0.12"
              />
              <circle cx="200" cy="85" r="2.2" fill="currentColor" stroke="none" />
            </g>
          );
        })}
      </g>

      {/* Middle Beaded Ring */}
      <circle cx="200" cy="200" r="110" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.65" />
      <circle cx="200" cy="200" r="98" strokeWidth="1.2" opacity="0.4" />

      {/* Inner 12 Sacred Padma (Lotus) Petals */}
      <g opacity="0.85">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <g key={i} transform={`rotate(${angle} 200 200)`}>
              <path
                d="M200 102 C188 122 184 140 200 155 C216 140 212 122 200 102 Z"
                strokeWidth="1.6"
                fill="currentColor"
                fillOpacity="0.18"
              />
              <circle cx="200" cy="128" r="2.5" fill="currentColor" stroke="none" />
              <line x1="200" y1="110" x2="200" y2="142" strokeWidth="1" strokeDasharray="1 3" opacity="0.8" />
            </g>
          );
        })}
      </g>

      {/* Central Sacred Core Lotus */}
      <circle cx="200" cy="200" r="45" strokeWidth="1.8" opacity="0.7" />
      <circle cx="200" cy="200" r="42" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      <g opacity="0.9">
        {[...Array(8)].map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <g key={i} transform={`rotate(${angle} 200 200)`}>
              <path
                d="M200 156 C194 168 193 180 200 190 C207 180 206 168 200 156 Z"
                strokeWidth="1.5"
                fill="currentColor"
                fillOpacity="0.25"
              />
            </g>
          );
        })}
      </g>
      <circle cx="200" cy="200" r="10" fill="currentColor" fillOpacity="0.3" strokeWidth="1.6" />
      <circle cx="200" cy="200" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 7. Panjika Astrological Almanac Seal (Auspicious Calendar Seal)
export function PanjikaSealBadge({ className = "w-6 h-6 text-amber-500" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Sun Ray Beaded Rim */}
      <circle cx="12" cy="12" r="10" strokeWidth="1.4" strokeDasharray="2 3" opacity="0.8" />
      <circle cx="12" cy="12" r="8.5" strokeWidth="1.2" />
      {/* Sacred Kalash & Coconut Crest */}
      <path d="M12 4.5V6.5M10.5 6.5H13.5" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M9 10C9 8.5 10.5 7.5 12 7.5C13.5 7.5 15 8.5 15 10C15 11.5 14 12 14 13.5H10C10 12 9 11.5 9 10Z"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M10 13.5H14V16.5C14 17.5 13 18 12 18C11 18 10 17.5 10 16.5V13.5Z" strokeWidth="1.2" />
      {/* Auspicious Base */}
      <path d="M9 18.5H15" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// 8. Temple Brass Filigree Corner Bracket (Antique Heritage Framing)
export function CornerFiligree({ className = "w-4 h-4 text-amber-400" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M2 2H14C14 2 14 6 10 6C6 6 6 10 6 14C6 14 2 14 2 2Z" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M2 2V22M2 2H22" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <path d="M10 2C10 6 6 10 2 10" strokeWidth="1.2" />
    </svg>
  );
}



