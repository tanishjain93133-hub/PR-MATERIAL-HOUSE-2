import React, { useRef, useState, useEffect } from 'react';

// -------------------------------------------------------------
// 1. CEMENT ICON (Floating bag, powder pour & dust particles)
// -------------------------------------------------------------
const CementIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-14 h-2.5 bg-black/10 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''} ${isClicked ? 'scale-90 opacity-40' : ''}`} />
      <svg viewBox="0 0 100 100" className={`w-18 h-18 relative z-10 transition-all duration-500 ${isClicked ? 'rotate-[-12deg] translate-y-[-6px]' : 'animate-float'}`} style={{ animationDuration: '4s' }}>
        <defs>
          <linearGradient id="cementBag" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
        <path d="M 25 15 L 75 15 C 80 15, 82 18, 80 25 L 72 80 C 70 85, 65 88, 50 88 C 35 88, 30 85, 28 80 L 20 25 C 18 18, 20 15, 25 15 Z" fill="url(#cementBag)" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.15))" />
        <path d="M 28 20 Q 50 25 72 20" stroke="#ca8a04" strokeWidth="2" fill="none" />
        <path d="M 25 45 Q 50 50 75 45" stroke="#ca8a04" strokeWidth="2" fill="none" strokeOpacity="0.6" />
        <path d="M 27 70 Q 50 72 73 70" stroke="#ca8a04" strokeWidth="2" fill="none" strokeOpacity="0.6" />
        <rect x="23" y="32" width="54" height="24" rx="3" fill="#1e293b" />
        <text x="50" y="44" fill="#ffffff" fontSize="6.5" fontWeight="black" textAnchor="middle" letterSpacing="0.5">PR CEMENT</text>
        <text x="50" y="52" fill="#facc15" fontSize="5" fontWeight="bold" textAnchor="middle">SUPER EXTRA</text>
        <polygon points="12,78 18,74 24,78 18,82" fill="#94a3b8" />
        <polygon points="12,78 18,82 18,88 12,84" fill="#64748b" />
        <polygon points="18,82 24,78 24,84 18,88" fill="#475569" />
      </svg>
      {isHovered && !isClicked && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute w-1.5 h-1.5 bg-gray-400/60 rounded-full animate-ping top-4 left-6" />
          <div className="absolute w-1 h-1 bg-gray-300/80 rounded-full animate-bounce top-12 right-6" style={{ animationDelay: '0.2s' }} />
        </div>
      )}
      {isClicked && (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-end pb-3">
          <div className="w-2.5 h-10 bg-gradient-to-b from-gray-400 to-gray-300/20 rounded-full animate-pulse blur-[1px]" />
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. HARDWARE ICON (Gold-plated handle)
// -------------------------------------------------------------
const HardwareIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-12 h-2.5 bg-black/10 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''}`} />
      <svg viewBox="0 0 100 100" className="w-18 h-18 relative z-10 animate-float" style={{ animationDuration: '4.5s' }}>
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <rect x="38" y="15" width="24" height="70" rx="4" fill="url(#goldGrad)" stroke="#854d0e" strokeWidth="1" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.2))" />
        <circle cx="50" cy="70" r="4" fill="#1e293b" />
        <polygon points="48,70 52,70 53,78 47,78" fill="#1e293b" />
        <circle cx="50" cy="35" r="7" fill="url(#goldGrad)" stroke="#854d0e" strokeWidth="1" />
        <g transform={`rotate(${isClicked ? '24' : '0'} 50 35)`} className="transition-transform duration-500 origin-[50px_35px] ease-out">
          <path d="M 50 30 L 88 24 C 92 23, 94 28, 91 32 L 86 38 C 84 40, 50 40, 50 30 Z" fill="url(#goldGrad)" stroke="#854d0e" strokeWidth="1" />
          <path d="M 52 31 L 86 26 L 82 34 L 52 35 Z" fill="url(#chromeGrad)" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
};

// -------------------------------------------------------------
// 3. CONSTRUCTION CHEMICALS
// -------------------------------------------------------------
const ChemicalsIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-13 h-2.5 bg-black/10 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''}`} />
      <svg viewBox="0 0 100 100" className={`w-18 h-18 relative z-10 transition-all duration-500 ${isClicked ? 'rotate-[40deg] translate-y-[-8px] translate-x-[4px]' : 'animate-float'}`} style={{ animationDuration: '4.2s' }}>
        <defs>
          <linearGradient id="canisterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="labelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
        </defs>
        <path d="M 32 30 C 32 25, 36 22, 42 22 L 58 22 C 64 22, 68 25, 68 30 L 68 76 C 68 81, 63 84, 58 84 L 42 84 C 37 84, 32 81, 32 76 Z" fill="url(#canisterGrad)" stroke="#94a3b8" strokeWidth="1" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.12))" />
        <rect x="44" y="14" width="12" height="8" rx="1.5" fill="#ea580c" />
        <rect x="33" y="38" width="34" height="28" fill="url(#labelGrad)" />
        <text x="50" y="48" fill="#ffffff" fontSize="4.5" fontWeight="bold" textAnchor="middle">WATERBAR</text>
        <text x="50" y="55" fill="#fef08a" fontSize="3.5" fontWeight="bold" textAnchor="middle">SHIELD PRO</text>
      </svg>
    </div>
  );
};

// -------------------------------------------------------------
// 4. CP FITTINGS
// -------------------------------------------------------------
const CPFittingsIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-13 h-2.5 bg-black/10 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''}`} />
      <svg viewBox="0 0 100 100" className="w-18 h-18 relative z-10 animate-float" style={{ animationDuration: '4.8s' }}>
        <defs>
          <linearGradient id="chromePlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="75%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        <circle cx="30" cy="50" r="12" fill="url(#chromePlate)" stroke="#64748b" strokeWidth="0.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" />
        <rect x="30" y="44" width="30" height="12" fill="url(#chromePlate)" stroke="#64748b" strokeWidth="0.5" />
        <path d="M 52 44 L 74 44 C 78 44, 82 48, 82 54 L 82 66 C 82 68, 79 70, 77 68 L 76 66 L 76 54 C 76 52, 74 50, 70 50 L 52 50 Z" fill="url(#chromePlate)" stroke="#475569" strokeWidth="0.5" />
        <g transform={`rotate(${isClicked ? '-30' : '0'} 50 36)`} className="transition-transform duration-300 origin-[50px_36px] ease-in-out">
          <rect x="44" y="32" width="12" height="8" rx="1.5" fill="url(#chromePlate)" stroke="#475569" strokeWidth="0.5" />
          <path d="M 50 32 L 50 18 C 50 16, 48 15, 46 17 L 38 24 Z" fill="url(#chromePlate)" stroke="#475569" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
};

// -------------------------------------------------------------
// 5. TMT STEEL
// -------------------------------------------------------------
const TMTSteelIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-13 h-2.5 bg-black/10 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''}`} />
      <svg viewBox="0 0 100 100" className={`w-18 h-18 relative z-10 transition-all duration-500 ${isClicked ? 'scale-105 translate-x-2' : 'animate-float'}`} style={{ animationDuration: '4.4s' }}>
        <defs>
          <linearGradient id="steelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="30%" stopColor="#475569" />
            <stop offset="70%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="goldRib" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <g transform="rotate(-35 50 50)">
          <rect x="10" y="32" width="80" height="8" rx="1.5" fill="url(#steelGrad)" stroke="#0f172a" strokeWidth="0.5" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.2))" />
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={i} x1={15 + i * 5} y1="32" x2={18 + i * 5} y2="40" stroke="#f1f5f9" strokeWidth="1" strokeOpacity="0.5" />
          ))}
          <rect x="10" y="44" width="80" height="8" rx="1.5" fill="url(#steelGrad)" stroke="#0f172a" strokeWidth="0.5" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.2))" />
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={i} x1={12 + i * 5} y1="44" x2={15 + i * 5} y2="52" stroke="#f1f5f9" strokeWidth="1" strokeOpacity="0.5" />
          ))}
          <rect x="10" y="56" width="80" height="8" rx="1.5" fill="url(#steelGrad)" stroke="#0f172a" strokeWidth="0.5" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.2))" />
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={i} x1={14 + i * 5} y1="56" x2={17 + i * 5} y2="64" stroke="#f1f5f9" strokeWidth="1" strokeOpacity="0.5" />
          ))}
          <rect x="42" y="30" width="10" height="36" rx="1" fill="url(#goldRib)" stroke="#854d0e" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
};

// -------------------------------------------------------------
// 6. PLUMBING MATERIALS
// -------------------------------------------------------------
const PlumbingIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-13 h-2.5 bg-black/10 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''}`} />
      <svg viewBox="0 0 100 100" className="w-18 h-18 relative z-10 animate-float" style={{ animationDuration: '4.6s' }}>
        <defs>
          <linearGradient id="pvcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <path d="M 24 56 C 24 38, 38 24, 56 24 L 56 36 C 45 36, 36 45, 36 56 Z" fill="url(#pvcGrad)" stroke="#0284c7" strokeWidth="0.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" />
        <rect x="56" y="20" width="8" height="20" rx="1" fill="url(#pvcGrad)" stroke="#0284c7" strokeWidth="0.5" />
        <rect x="20" y="56" width="20" height="8" rx="1" fill="url(#pvcGrad)" stroke="#0284c7" strokeWidth="0.5" />
        <circle cx="68" cy="30" r="8" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
        <circle cx="68" cy="30" r="2.5" fill="#facc15" />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------
// 7. ELECTRICAL MATERIALS
// -------------------------------------------------------------
const ElectricalIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-13 h-2.5 bg-black/10 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''}`} />
      <svg viewBox="0 0 100 100" className="w-18 h-18 relative z-10 animate-float" style={{ animationDuration: '4.3s' }}>
        <defs>
          <linearGradient id="switchPlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        <rect x="25" y="25" width="50" height="50" rx="6" fill="url(#switchPlate)" stroke="#cbd5e1" strokeWidth="1" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.15))" />
        <rect x="30" y="30" width="40" height="40" rx="3" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />
        <g transform={isClicked ? 'translate(0, 8)' : 'translate(0, 0)'} className="transition-transform duration-200 ease-out">
          <rect x="42" y="36" width="16" height="20" rx="2" fill="#cbd5e1" />
          <rect x="44" y="38" width="12" height="12" rx="1.5" fill={isClicked ? '#f97316' : '#ffffff'} stroke={isClicked ? '#ea580c' : '#94a3b8'} strokeWidth="0.5" />
          <circle cx="50" cy="52" r="1.2" fill={isClicked ? '#22c55e' : '#ef4444'} />
        </g>
        <path d="M 12 50 Q 25 35 30 50 T 40 50" fill="none" stroke="#ea580c" strokeWidth="2.5" />
        <path d="M 70 50 Q 75 65 88 50" fill="none" stroke="#ea580c" strokeWidth="2.5" />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------
// 8. PAINTS ICON
// -------------------------------------------------------------
const PaintsIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-13 h-2.5 bg-black/10 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''}`} />
      <svg viewBox="0 0 100 100" className="w-18 h-18 relative z-10 animate-float" style={{ animationDuration: '4.1s' }}>
        <defs>
          <linearGradient id="bucketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="handleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        <path d="M 30 50 Q 50 18 70 50" fill="none" stroke="url(#handleGrad)" strokeWidth="1.5" />
        <path d="M 30 50 L 70 50 L 64 84 C 63 88, 37 88, 36 84 Z" fill="url(#bucketGrad)" stroke="#1d4ed8" strokeWidth="0.5" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.15))" />
        <ellipse cx="50" cy="50" rx="20" ry="4" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="0.5" />
        <path d="M 36 50 Q 38 62 42 60 T 48 50" fill="#facc15" />
        <path d="M 52 50 Q 55 68 59 66 T 64 50" fill="#facc15" />
        <g transform="translate(10, -8) rotate(15 50 50)">
          <path d="M 54 48 L 54 62" stroke="#475569" strokeWidth="2" />
          <rect x="52" y="62" width="4" height="12" rx="1" fill="#854d0e" />
          <path d="M 54 48 L 74 48 L 74 38" fill="none" stroke="#475569" strokeWidth="2" />
          <rect x="68" y="24" width="12" height="24" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
};

// -------------------------------------------------------------
// 9. TILES ICON
// -------------------------------------------------------------
const TilesIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-14 h-2 bg-black/15 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''}`} />
      <div className={`relative w-18 h-18 transition-transform duration-700 preserve-3d ${isClicked ? 'rotate-y-180' : 'animate-float'}`} style={{ animationDuration: '4.7s' }}>
        <div className="absolute inset-0 backface-hidden flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="marbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
            </defs>
            <polygon points="50,15 90,40 50,65 10,40" fill="url(#marbleGrad)" stroke="#cbd5e1" strokeWidth="1" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.15))" />
            <polygon points="50,65 90,40 90,48 50,73" fill="#cbd5e1" />
            <polygon points="10,40 50,65 50,73 10,48" fill="#94a3b8" />
            <path d="M 30 35 Q 44 48 64 35" stroke="#94a3b8" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 40 25 Q 52 40 70 30" stroke="#cbd5e1" strokeWidth="1.2" fill="none" opacity="0.8" />
          </svg>
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            <polygon points="50,15 90,40 50,65 10,40" fill="url(#woodGrad)" stroke="#78350f" strokeWidth="1" />
            <polygon points="50,65 90,40 90,48 50,73" fill="#78350f" />
            <polygon points="10,40 50,65 50,73 10,48" fill="#451a03" />
            <path d="M 20 38 Q 50 48 80 38" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 10. SANITARYWARE
// -------------------------------------------------------------
const SanitarywareIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-14 h-2 bg-black/10 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''}`} />
      <svg viewBox="0 0 100 100" className="w-18 h-18 relative z-10 animate-float" style={{ animationDuration: '4.5s' }}>
        <defs>
          <linearGradient id="ceramicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="80%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        <path d="M 15 48 C 15 38, 85 38, 85 48 C 85 64, 75 76, 50 76 C 25 76, 15 64, 15 48 Z" fill="url(#ceramicGrad)" stroke="#cbd5e1" strokeWidth="1" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.15))" />
        <ellipse cx="50" cy="46" rx="31" ry="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
        <ellipse cx="50" cy="47" rx="27" ry="6" fill="#f1f5f9" />
        <circle cx="50" cy="48" r="3.5" fill="#94a3b8" />
        <circle cx="50" cy="48" r="2" fill="#475569" />
        <rect x="47" y="24" width="6" height="14" rx="1" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
        <path d="M 50 24 L 50 18 Q 50 14 54 15 L 56 16" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------
// 11. TOOLS & ACCESSORIES
// -------------------------------------------------------------
const ToolsIcon = ({ isHovered, isClicked }) => {
  return (
    <div className={`relative w-[90px] h-[90px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
      <div className={`absolute bottom-1 w-13 h-2.5 bg-black/10 rounded-full blur-xs transition-all duration-500 ${isHovered ? 'scale-110 opacity-75' : ''}`} />
      <svg viewBox="0 0 100 100" className={`w-18 h-18 relative z-10 ${isClicked ? 'animate-shake' : 'animate-float'}`} style={{ animationDuration: isClicked ? '0.1s' : '4.2s' }}>
        <defs>
          <linearGradient id="drillBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        <rect x="42" y="48" width="12" height="26" rx="2" fill="url(#drillBody)" stroke="#991b1b" strokeWidth="0.5" transform="rotate(-15 48 60)" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" />
        <rect x="42" y="72" width="18" height="8" rx="1.5" fill="#1e293b" />
        <rect x="25" y="28" width="38" height="20" rx="3" fill="url(#drillBody)" stroke="#991b1b" strokeWidth="0.5" />
        <rect x="30" y="32" width="3" height="12" fill="#1e293b" />
        <rect x="36" y="32" width="3" height="12" fill="#1e293b" />
        <rect x="15" y="33" width="10" height="10" rx="1" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
        <rect x="2" y="36" width="13" height="4" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
        <circle cx="39" cy="49" r="2.5" fill="#fbbf24" />
      </svg>
    </div>
  );
};

// -------------------------------------------------------------
// 12. MAIN SLIDER & GLOBAL INTERACTIVE CANVAS OVERLAY (NO REDIRECT)
// -------------------------------------------------------------
const InteractiveCategorySlider = ({ categories }) => {
  const scrollRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [hoveredCat, setHoveredCat] = useState(null);
  const [clickedCat, setClickedCat] = useState(null);
  const [globalAnim, setGlobalAnim] = useState(null); // 'cement', 'hardware', etc.

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth * 0.6
        : scrollLeft + clientWidth * 0.6;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (e, catId, slug) => {
    e.preventDefault();
    if (clickedCat) return; // Prevent double trigger
    
    setClickedCat(catId);
    setGlobalAnim(slug);

    // Apply global shake/vibration screen classes if needed
    if (slug === 'cement' || slug === 'tools' || slug === 'tmt-steel') {
      document.body.classList.add('animate-global-shake');
    }

    // Smooth delay (3.8 seconds) to play full screen canvas animations and then reset back to normal
    setTimeout(() => {
      document.body.classList.remove('animate-global-shake');
      setClickedCat(null);
      setGlobalAnim(null);
    }, 3800);
  };

  // Canvas particle engine loop hook
  useEffect(() => {
    if (!globalAnim || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set viewport dimensions
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles Array
    let particles = [];
    let startTime = Date.now();
    let duration = 3800; // ms

    // Initialize particles based on selected category type
    if (globalAnim === 'cement') {
      // 250 heavy, highly visible cement dust particles billowing up from bottom
      for (let i = 0; i < 250; i++) {
        particles.push({
          x: Math.random() * w,
          y: h + Math.random() * 120,
          vx: (Math.random() - 0.5) * 5,
          vy: -Math.random() * 6 - 3,
          radius: Math.random() * 14 + 4, // Large thick dust clouds
          colorVal: Math.random() * 30 + 130, // Grayscale cement values
          alpha: Math.random() * 0.7 + 0.3,
          growth: Math.random() * 0.05 + 0.02,
          wobbleSpeed: Math.random() * 0.03,
          wobbleDist: Math.random() * 3
        });
      }
    } else if (globalAnim === 'hardware') {
      // Diagonal chrome/golden metallic shine rays and key structures
      particles = {
        progress: 0,
        speed: 0.012,
        keys: Array.from({ length: 8 }).map(() => ({
          x: Math.random() * w,
          y: -100 - Math.random() * 200,
          vy: Math.random() * 4 + 2,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.04,
          size: Math.random() * 25 + 15
        }))
      };
    } else if (globalAnim === 'chemicals') {
      // Glossy waterproofing layer coating screen with beads sliding away
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 6 + 3,
          vy: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 1,
          alpha: Math.random() * 0.5 + 0.3
        });
      }
    } else if (globalAnim === 'cp-fittings' || globalAnim === 'sanitaryware') {
      // Realistic water droplets flowing naturally down page hitting virtual UI boundaries
      // We simulate splashing at three common Y heights (e.g. Header, Hero bottom, features cards)
      for (let i = 0; i < 300; i++) {
        particles.push({
          x: Math.random() * w,
          y: -Math.random() * 400,
          vy: Math.random() * 14 + 8,
          vx: 0,
          radius: Math.random() * 3.5 + 1.2,
          splashed: false,
          color: 'rgba(56, 189, 248, 0.65)'
        });
      }
    } else if (globalAnim === 'tmt-steel') {
      // Dramatic steel rod assembly sliding in from corners with sparks
      particles = {
        rods: [
          { startX: -200, startY: -200, targetX: w * 0.25, targetY: h * 0.25, progress: 0 },
          { startX: w + 200, startY: -200, targetX: w * 0.75, targetY: h * 0.25, progress: 0 },
          { startX: -200, startY: h + 200, targetX: w * 0.25, targetY: h * 0.75, progress: 0 },
          { startX: w + 200, startY: h + 200, targetX: w * 0.75, targetY: h * 0.75, progress: 0 }
        ],
        sparks: []
      };
      // Pre-populate 200 sparks
      for (let i = 0; i < 200; i++) {
        particles.sparks.push({
          x: w / 2,
          y: h / 2,
          vx: (Math.random() - 0.5) * 25,
          vy: (Math.random() - 0.6) * 22,
          gravity: 0.35,
          radius: Math.random() * 3.5 + 1,
          life: 1.0,
          decay: Math.random() * 0.02 + 0.008
        });
      }
    } else if (globalAnim === 'plumbing') {
      // Transparent water flowing through neon glowing pipe systems overlaying page
      particles = {
        waterNodes: Array.from({ length: 40 }).map(() => ({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 15 + 8,
          vx: Math.random() * 6 + 4,
          alpha: Math.random() * 0.35 + 0.15
        }))
      };
    } else if (globalAnim === 'electrical') {
      // Glowing switch flash, neon sparks, golden rays sweeping entire UI
      particles = {
        glowScale: 0,
        flashAlpha: 0.85,
        lightning: []
      };
    } else if (globalAnim === 'paints') {
      // Roller entering and sweeping colorful paint across screen
      particles = {
        rollerX: -150,
        speed: w / 80,
        splatters: []
      };
    } else if (globalAnim === 'tiles') {
      // Luxury isometric marble tiles assembling from bottom
      for (let i = 0; i < 35; i++) {
        particles.push({
          startX: Math.random() * w,
          startY: h + 200,
          x: Math.random() * w,
          y: h - Math.random() * (h * 0.65),
          size: Math.random() * 160 + 100,
          rotation: Math.random() * 0.4 - 0.2,
          slideProgress: 0,
          speed: Math.random() * 0.02 + 0.015
        });
      }
    } else if (globalAnim === 'tools') {
      // Massive drill rotation, vibration sparks, toolboxes
      for (let i = 0; i < 220; i++) {
        particles.push({
          x: w / 2,
          y: h / 2,
          vx: (Math.random() - 0.5) * 24,
          vy: (Math.random() - 0.5) * 24,
          radius: Math.random() * 3 + 1,
          life: 1.0,
          decay: Math.random() * 0.025 + 0.008
        });
      }
    }

    let frameId;
    const render = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      // Calculate smooth fade multiplier at end of duration
      let fadeAlpha = 1.0;
      if (progress > 0.8) {
        fadeAlpha = (1.0 - progress) / 0.2;
      }
      if (fadeAlpha < 0) fadeAlpha = 0;

      ctx.clearRect(0, 0, w, h);

      if (globalAnim === 'cement') {
        // Dim the background to make cement dust highly visible
        ctx.fillStyle = `rgba(30, 28, 25, ${0.4 * fadeAlpha})`;
        ctx.fillRect(0, 0, w, h);

        // Billow dust clouds
        particles.forEach(p => {
          p.x += p.vx + Math.sin(elapsed * p.wobbleSpeed) * p.wobbleDist;
          p.y += p.vy;
          p.radius += p.growth;
          p.alpha = Math.max(0, p.alpha - 0.001);
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.colorVal}, ${p.colorVal - 5}, ${p.colorVal - 15}, ${p.alpha * fadeAlpha})`;
          ctx.fill();
        });
      } else if (globalAnim === 'hardware') {
        // Metallic shine sweep
        particles.progress += particles.speed;
        const xSweep = particles.progress * (w + 800) - 400;
        
        const grad = ctx.createLinearGradient(xSweep - 200, 0, xSweep + 200, h);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.5, `rgba(253, 224, 71, ${0.35 * fadeAlpha})`); // Gold shine sweep
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(xSweep - 200, 0);
        ctx.lineTo(xSweep + 100, 0);
        ctx.lineTo(xSweep + 200, h);
        ctx.lineTo(xSweep - 100, h);
        ctx.closePath();
        ctx.fill();

        // Falling/rotating keys
        particles.keys.forEach(k => {
          k.y += k.vy;
          k.rot += k.rotSpeed;
          ctx.save();
          ctx.translate(k.x, k.y);
          ctx.rotate(k.rot);
          
          // Draw key outline in Gold
          ctx.strokeStyle = `rgba(234, 179, 8, ${0.75 * fadeAlpha})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, -k.size / 2, k.size / 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(234, 179, 8, ${0.35 * fadeAlpha})`;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, -k.size / 6);
          ctx.lineTo(0, k.size / 2);
          ctx.lineTo(k.size / 4, k.size / 2);
          ctx.moveTo(0, k.size / 3);
          ctx.lineTo(k.size / 4, k.size / 3);
          ctx.stroke();
          ctx.restore();
        });
      } else if (globalAnim === 'chemicals') {
        // Waterproof fluid coating screen
        ctx.fillStyle = `rgba(56, 189, 248, ${0.1 * fadeAlpha})`;
        ctx.fillRect(0, 0, w, h);

        // Water beads sliding
        particles.forEach(p => {
          p.y += p.vy;
          p.x += p.vx;
          
          // Glass specular reflection highlight on bead
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * fadeAlpha})`;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * fadeAlpha})`;
          ctx.fill();
        });
      } else if (globalAnim === 'cp-fittings' || globalAnim === 'sanitaryware') {
        // Cascading water droplets hitting boundaries
        particles.forEach(p => {
          if (!p.splashed) {
            p.y += p.vy;
            
            // Check splash at vertical heights (virtual shelves / UI elements)
            if (p.y > h * 0.3 && !p.splashed && Math.random() < 0.015) {
              p.splashed = true;
              p.splashTimer = 15;
            } else if (p.y > h) {
              p.y = -20;
              p.x = Math.random() * w;
            }

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + 16);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.5 * fadeAlpha})`;
            ctx.lineWidth = p.radius;
            ctx.stroke();
          } else {
            // Splash ripple circles
            ctx.beginPath();
            ctx.arc(p.x, p.y, (15 - p.splashTimer) * 2.5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(186, 230, 253, ${p.splashTimer / 15 * fadeAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            p.splashTimer--;
            if (p.splashTimer <= 0) {
              p.splashed = false;
              p.y = -20;
              p.x = Math.random() * w;
            }
          }
        });
      } else if (globalAnim === 'tmt-steel') {
        // Render sliding rods
        ctx.lineWidth = 16;
        ctx.strokeStyle = `rgba(71, 85, 105, ${fadeAlpha})`;
        
        particles.rods.forEach(r => {
          if (r.progress < 1.0) r.progress += 0.05;
          const currX = r.startX + (r.targetX - r.startX) * r.progress;
          const currY = r.startY + (r.targetY - r.startY) * r.progress;
          
          ctx.beginPath();
          ctx.moveTo(r.startX, r.startY);
          ctx.lineTo(currX, currY);
          ctx.stroke();
        });

        // Sparks blast
        particles.sparks.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.life -= p.decay;
          if (p.life > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(251, 191, 36, ${p.life * fadeAlpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#f59e0b';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      } else if (globalAnim === 'plumbing') {
        // Draw pipe grid system
        ctx.strokeStyle = `rgba(14, 165, 233, ${0.2 * fadeAlpha})`;
        ctx.lineWidth = 8;
        
        ctx.beginPath();
        for (let i = 1; i < 6; i++) {
          ctx.moveTo(0, (h / 6) * i);
          ctx.lineTo(w, (h / 6) * i);
          ctx.moveTo((w / 6) * i, 0);
          ctx.lineTo((w / 6) * i, h);
        }
        ctx.stroke();

        // Water blobs inside pipes
        particles.waterNodes.forEach(node => {
          node.x += node.vx;
          if (node.x > w + 50) node.x = -50;
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${node.alpha * fadeAlpha})`;
          ctx.fill();
        });
      } else if (globalAnim === 'electrical') {
        // Bright golden flash sweep overlay
        particles.glowScale += 0.05;
        if (particles.flashAlpha > 0) particles.flashAlpha -= 0.015;

        // Illumination color dodge effect
        const grad = ctx.createRadialGradient(w/2, h/2, 20, w/2, h/2, w);
        grad.addColorStop(0, `rgba(254, 240, 138, ${(0.45 - Math.sin(progress * Math.PI)*0.2) * fadeAlpha})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Flash
        if (particles.flashAlpha > 0) {
          ctx.fillStyle = `rgba(254, 240, 138, ${particles.flashAlpha * fadeAlpha})`;
          ctx.fillRect(0, 0, w, h);
        }

        // Lightning paths
        if (Math.random() < 0.18) {
          ctx.strokeStyle = `rgba(251, 146, 60, ${0.7 * fadeAlpha})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          let startX = Math.random() * w;
          ctx.moveTo(startX, 0);
          for (let step = 0; step < 10; step++) {
            startX += (Math.random() - 0.5) * 110;
            ctx.lineTo(startX, (h / 10) * step);
          }
          ctx.stroke();
        }
      } else if (globalAnim === 'paints') {
        // Paint roller horizontal sweep
        particles.rollerX += particles.speed;
        const rx = particles.rollerX;

        // Draw solid colorful paint coat behind roller
        if (rx > 0) {
          ctx.fillStyle = `rgba(249, 115, 22, ${fadeAlpha})`;
          ctx.fillRect(0, 0, rx, h * 0.35);

          ctx.fillStyle = `rgba(234, 179, 8, ${fadeAlpha})`;
          ctx.fillRect(0, h * 0.35, rx, h * 0.3);

          ctx.fillStyle = `rgba(236, 72, 153, ${fadeAlpha})`;
          ctx.fillRect(0, h * 0.65, rx, h * 0.35);
        }

        // Draw paint roller roller cylinder head
        ctx.fillStyle = `rgba(244, 63, 94, ${fadeAlpha})`;
        ctx.fillRect(rx - 25, 0, 50, h);
        
        ctx.strokeStyle = `rgba(71, 85, 105, ${fadeAlpha})`;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(rx, h/2);
        ctx.lineTo(rx - 80, h/2);
        ctx.lineTo(rx - 120, h/2 + 100);
        ctx.stroke();
      } else if (globalAnim === 'tiles') {
        // Slide isometric tiles from bottom
        particles.forEach(p => {
          if (p.slideProgress < 1.0) p.slideProgress += p.speed;
          
          const cy = p.startY + (p.y - p.startY) * p.slideProgress;
          
          ctx.save();
          ctx.translate(p.x, cy);
          ctx.rotate(p.rotation);
          
          // Draw luxury marbled squares
          ctx.fillStyle = `rgba(241, 245, 249, ${0.4 * fadeAlpha})`;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * fadeAlpha})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.rect(-p.size/2, -p.size/2, p.size, p.size);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        });
      } else if (globalAnim === 'tools') {
        // Friction metal sparks shooting everywhere
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          if (p.life > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(239, 68, 68, ${p.life * fadeAlpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ef4444';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }

      if (progress < 1.0) {
        frameId = requestAnimationFrame(render);
      }
    };
    
    frameId = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, [globalAnim]);

  const renderIcon = (slug, isHovered, isClicked) => {
    switch (slug) {
      case 'cement': return <CementIcon isHovered={isHovered} isClicked={isClicked} />;
      case 'hardware': return <HardwareIcon isHovered={isHovered} isClicked={isClicked} />;
      case 'chemicals': return <ChemicalsIcon isHovered={isHovered} isClicked={isClicked} />;
      case 'cp-fittings': return <CPFittingsIcon isHovered={isHovered} isClicked={isClicked} />;
      case 'tmt-steel': return <TMTSteelIcon isHovered={isHovered} isClicked={isClicked} />;
      case 'plumbing': return <PlumbingIcon isHovered={isHovered} isClicked={isClicked} />;
      case 'electrical': return <ElectricalIcon isHovered={isHovered} isClicked={isClicked} />;
      case 'paints': return <PaintsIcon isHovered={isHovered} isClicked={isClicked} />;
      case 'tiles': return <TilesIcon isHovered={isHovered} isClicked={isClicked} />;
      case 'sanitaryware': return <SanitarywareIcon isHovered={isHovered} isClicked={isClicked} />;
      case 'tools': return <ToolsIcon isHovered={isHovered} isClicked={isClicked} />;
      default: return <CementIcon isHovered={isHovered} isClicked={isClicked} />;
    }
  };

  return (
    <>
      <section className="bg-white border-b border-gray-100 py-8 relative shadow-xs z-25 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative group">
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-2 top-[36%] -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white border border-gray-250 shadow-md flex items-center justify-center text-gray-700 hover:text-orange-500 hover:border-orange-500 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 hidden md:flex font-bold text-lg cursor-pointer"
            aria-label="Scroll Left"
          >
            ‹
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-2 top-[36%] -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white border border-gray-250 shadow-md flex items-center justify-center text-gray-700 hover:text-orange-500 hover:border-orange-500 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 hidden md:flex font-bold text-lg cursor-pointer"
            aria-label="Scroll Right"
          >
            ›
          </button>

          <div 
            ref={scrollRef}
            className="flex items-start gap-5 md:gap-7 overflow-x-auto scrollbar-none py-3 px-1 scroll-smooth"
          >
            {categories.map((cat) => {
              const isHovered = hoveredCat === cat._id;
              const isClicked = clickedCat === cat._id;
              
              return (
                <button
                  key={cat._id}
                  onClick={(e) => handleCategoryClick(e, cat._id, cat.slug)}
                  onMouseEnter={() => setHoveredCat(cat._id)}
                  onMouseLeave={() => setHoveredCat(null)}
                  className="flex flex-col items-center gap-2 min-w-[95px] md:min-w-[105px] max-w-[120px] shrink-0 group/card cursor-pointer text-center relative focus:outline-none"
                >
                  <div className="relative w-[95px] h-[95px] md:w-[105px] md:h-[105px] flex items-center justify-center bg-transparent">
                    {renderIcon(cat.slug, isHovered, isClicked)}
                  </div>
                  
                  <span className="text-[11px] font-extrabold tracking-wide uppercase text-gray-800 group-hover/card:text-orange-500 transition-colors duration-300 line-clamp-2 max-w-[90px] leading-tight select-none">
                    {cat.name}
                  </span>

                  {isClicked && (
                    <div className="absolute inset-0 bg-orange-500/5 rounded-full animate-ping pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Animation Fullscreen Canvas Overlay */}
      {globalAnim && (
        <canvas 
          ref={canvasRef} 
          className="fixed inset-0 z-[9999] pointer-events-none w-screen h-screen"
        />
      )}
    </>
  );
};

export default InteractiveCategorySlider;
