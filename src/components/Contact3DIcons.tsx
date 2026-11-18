export function Instagram3DIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-12 h-12 drop-shadow-[0_10px_18px_rgba(168,85,247,0.5)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ig-extrude" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b0764" />
          <stop offset="50%" stopColor="#6b21a8" />
          <stop offset="100%" stopColor="#831843" />
        </linearGradient>
        <linearGradient id="ig-body" x1="12%" y1="0%" x2="88%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="42%" stopColor="#a855f7" />
          <stop offset="76%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="ig-glass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="ig-lens" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fdf4ff" />
          <stop offset="35%" stopColor="#e879f9" />
          <stop offset="75%" stopColor="#581c87" />
          <stop offset="100%" stopColor="#090414" />
        </radialGradient>
      </defs>

      {/* Extruded 3D chassis */}
      <rect x="10" y="13" width="46" height="46" rx="14" fill="url(#ig-extrude)" />
      {/* Front metallic prism */}
      <rect x="8" y="8" width="46" height="46" rx="14" fill="url(#ig-body)" />
      {/* Specular glass bevel */}
      <rect
        x="8.75"
        y="8.75"
        width="44.5"
        height="44.5"
        rx="13.25"
        fill="url(#ig-glass)"
        stroke="#fbcfe8"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      {/* Recessed dark inner camera well */}
      <rect
        x="15"
        y="15"
        width="32"
        height="32"
        rx="9"
        fill="#0d0618"
        fillOpacity="0.72"
        stroke="#f5d0fe"
        strokeOpacity="0.75"
        strokeWidth="2.2"
      />
      {/* 3D sculpted lens */}
      <circle cx="31" cy="31" r="9.2" fill="#090312" stroke="#f0abfc" strokeWidth="2.4" />
      <circle cx="31" cy="31" r="6" fill="url(#ig-lens)" />
      <ellipse cx="28.5" cy="28.3" rx="2.4" ry="1.5" transform="rotate(-25 28.5 28.3)" fill="#ffffff" fillOpacity="0.85" />
      {/* Top-right flash jewel */}
      <circle cx="40.5" cy="21.5" r="2.3" fill="#fdf2f8" />
    </svg>
  );
}

export function YouTube3DIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-12 h-12 drop-shadow-[0_10px_18px_rgba(239,68,68,0.5)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="yt-extrude" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#450a0a" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="yt-metal" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="35%" stopColor="#ef4444" />
          <stop offset="72%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="yt-rim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fecaca" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#ef4444" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#450a0a" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="yt-play" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#e4e4e7" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      {/* Extruded metallic shadow block */}
      <rect x="8" y="18" width="50" height="34" rx="11" fill="url(#yt-extrude)" />
      {/* Front brushed crimson metallic slab */}
      <rect x="6" y="13" width="50" height="34" rx="11" fill="url(#yt-metal)" />
      {/* Glass sheen & beveled rim */}
      <rect
        x="6.75"
        y="13.75"
        width="48.5"
        height="32.5"
        rx="10.25"
        fill="none"
        stroke="url(#yt-rim)"
        strokeWidth="1.5"
      />
      <path
        d="M14 15.5H48C51.5 15.5 53.5 17.5 53.5 21V24C42 27.5 20 27.5 8.5 24V21C8.5 17.5 10.5 15.5 14 15.5Z"
        fill="#ffffff"
        fillOpacity="0.22"
      />
      {/* Recessed play bevel shadow */}
      <polygon points="26,22.5 26,39.5 41.5,31" fill="#450a0a" fillOpacity="0.7" />
      {/* Brushed silver 3D play prism */}
      <polygon points="25,21 25,38 40.5,29.5" fill="url(#yt-play)" />
    </svg>
  );
}

export function Telegram3DIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-12 h-12 drop-shadow-[0_10px_18px_rgba(56,189,248,0.48)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tg-orb-back" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0c4a6e" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="tg-orb" x1="15%" y1="5%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="tg-wing-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
        <linearGradient id="tg-wing-fold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* 3D extruded orb depth */}
      <circle cx="33" cy="34" r="24" fill="url(#tg-orb-back)" />
      {/* Front glass-metallic sphere */}
      <circle cx="31" cy="30" r="24" fill="url(#tg-orb)" />
      <circle
        cx="31"
        cy="30"
        r="23.2"
        fill="none"
        stroke="#bae6fd"
        strokeOpacity="0.6"
        strokeWidth="1.4"
      />
      {/* Top specular dome highlight */}
      <ellipse cx="26" cy="16" rx="13" ry="6" fill="#ffffff" fillOpacity="0.22" />
      {/* Drop shadow under paper plane */}
      <polygon points="15,31.5 44.5,19.5 38.5,43.5 29,36.5 25,40.5 24,33.5" fill="#082f49" fillOpacity="0.45" />
      {/* Sculpted 3D Telegram paper plane */}
      <polygon points="14,29.5 44,17.5 37.5,42 27.5,34.5" fill="url(#tg-wing-top)" />
      <polygon points="44,17.5 24.5,32.2 27.5,34.5 25,40.2" fill="url(#tg-wing-fold)" />
      <polygon points="27.5,34.5 24.5,32.2 25,40.2 31.2,37.2" fill="#60a5fa" />
    </svg>
  );
}

export function Email3DIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-12 h-12 drop-shadow-[0_10px_18px_rgba(59,130,246,0.48)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mail-extrude" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <linearGradient id="mail-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="48%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="mail-flap" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eff6ff" />
          <stop offset="55%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      {/* Extruded 3D housing */}
      <rect x="9" y="18" width="48" height="33" rx="9" fill="url(#mail-extrude)" />
      {/* Front metallic prism */}
      <rect x="7" y="14" width="48" height="33" rx="9" fill="url(#mail-body)" />
      <rect
        x="7.75"
        y="14.75"
        width="46.5"
        height="31.5"
        rx="8.25"
        fill="none"
        stroke="#bfdbfe"
        strokeOpacity="0.65"
        strokeWidth="1.4"
      />
      {/* Inner recessed envelope shadow */}
      <path d="M10 18.5L31 33.5L52 18.5" fill="none" stroke="#1e1b4b" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sculpted metallic top flap */}
      <path
        d="M11 16.2H51C52.2 16.2 53 17.6 52.1 18.4L32.8 32.1C31.7 32.9 30.3 32.9 29.2 32.1L9.9 18.4C9 17.6 9.8 16.2 11 16.2Z"
        fill="url(#mail-flap)"
      />
      {/* Bottom glass highlight bar */}
      <path d="M13 43L23 33.5M49 43L39 33.5" stroke="#dbeafe" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function WhatsApp3DIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-12 h-12 drop-shadow-[0_10px_18px_rgba(34,197,94,0.48)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wa-extrude" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#052e16" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        <linearGradient id="wa-body" x1="12%" y1="4%" x2="88%" y2="96%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="wa-glass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#022c22" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Extruded 3D chassis */}
      <rect x="10" y="13" width="46" height="46" rx="14" fill="url(#wa-extrude)" />
      {/* Front emerald prism */}
      <rect x="8" y="8" width="46" height="46" rx="14" fill="url(#wa-body)" />
      <rect
        x="8.75"
        y="8.75"
        width="44.5"
        height="44.5"
        rx="13.25"
        fill="url(#wa-glass)"
        stroke="#bbf7d0"
        strokeOpacity="0.6"
        strokeWidth="1.2"
      />
      {/* Speech bubble outline */}
      <path
        d="M31 18.5C24.1 18.5 18.5 24 18.5 30.8C18.5 33.2 19.2 35.5 20.5 37.4L19 42.8L24.6 41.3C26.5 42.4 28.7 43 31 43C37.9 43 43.5 37.5 43.5 30.8C43.5 24 37.9 18.5 31 18.5Z"
        fill="#052e16"
        fillOpacity="0.32"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Sculpted handset */}
      <path
        d="M26.8 26.2C26.4 25.5 26 25.5 25.5 25.5C25.1 25.5 24.4 25.9 24.1 26.5C23.8 27.1 23.6 28.3 24.4 29.8C25.2 31.3 26.8 33.5 29.4 34.9C32 36.3 33.2 36.2 34.1 36C35 35.8 36 35 36.2 34.3C36.4 33.6 36.3 33.2 35.8 32.9C35.3 32.6 34 31.9 33.5 31.7C33.1 31.5 32.8 31.7 32.5 32.1C32.2 32.5 31.7 33 31.3 33C30.9 33 29.9 32.6 29 31.7C28.1 30.8 27.7 29.9 27.7 29.5C27.7 29.2 28.1 28.8 28.4 28.4C28.7 28 28.6 27.7 28.4 27.3L26.8 26.2Z"
        fill="#ffffff"
      />
    </svg>
  );
}
