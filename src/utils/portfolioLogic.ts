export type ProjectCategory = 'All' | 'Anime Editing';

export interface PortfolioVideoItem {
  id: string;
  title: string;
  videoUrl: string;
  aspectLabel: string;
  duration: string;
  notes: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'All'>;
  deliverableType: string;
  frameSpec: string;
  duration: string;
  tools: string[];
  accentHex: string;
  visualStyle: 'anime';
  videos: PortfolioVideoItem[];
  summary: string;
  breakdown: {
    label: string;
    detail: string;
  }[];
  timelineTracks: {
    name: string;
    color: string;
    segments: [number, number][];
  }[];
}

export interface SkillMetric {
  id: string;
  name: string;
  specialty: string;
  accent: 'crimson' | 'violet' | 'electric';
  tools: string;
}

export interface InquiryPayload {
  name: string;
  email: string;
  service: string;
  message: string;
}

export const BRAND_PROFILE = {
  name: 'SG EDITER',
  tagline: 'CREATE • EDIT • INSPIRE',
  heroKicker: 'WELCOME TO MY CREATIVE WORLD',
  heroSubtitle: 'Turning Imagination Into Reality',
  logoUrl: '/assets/aistudio/SG_EDITER_transparent_cd30f378.png',
  aboutPortrait: '/assets/aistudio/b9192b9b5b3b52b2edfa0a58dacf55f6_d580fe35.jpg',
  email: 'shivampavanmishra@gmail.com',
  instagramUrl: 'https://www.instagram.com/__shivam__00013',
  instagramHandle: '@__shivam__00013',
  youtubeUrl: '',
  youtubeHandle: '',
  telegramUrl: 'https://t.me/sgediter',
  telegramHandle: '@sgediter',
  whatsappNumber: '+91 72111 67583',
  whatsappDigits: '917211167583',
  whatsappUrl: 'https://wa.me/917211167583',
  upiId: 'shivampavanmishra64@okicici',
  upiPayeeName: 'Shivam Mishra',
  upiQrImage: '/assets/aistudio/GooglePay_QR_7954109c.png',
} as const;

export const SERVICE_OPTIONS = ['AMV', 'Reel', 'Typography', 'Custom Edit'] as const;

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'wakari-amv-beatsync',
    title: 'Wakari AMV Beat Sync',
    subtitle: 'Soft Bloom, Velocity Flow & Emotional Sync',
    category: 'Anime Editing',
    deliverableType: 'Full HD Anime AMV',
    frameSpec: '16:9 · 1080p 30fps',
    duration: '0:16',
    tools: ['Beat Sync', 'Velocity Flow', 'Bloom FX', 'Color Grade'],
    accentHex: '#EF4444',
    visualStyle: 'anime',
    videos: [
      {
        id: 'wakari-amv-beatsync',
        title: 'Wakari AMV Beat Sync',
        videoUrl: '/assets/aistudio/wakari_amv_beatsync_350ed5ea.mp4',
        aspectLabel: '16:9 · 1080p 30fps',
        duration: '0:16',
        notes: 'Beat-synced anime AMV featuring soft bloom, emotional pacing, and clean velocity flow.',
      },
    ],
    summary:
      'Atmospheric anime AMV crafted around soft highlight bloom, velocity pacing, and beat-synced emotional cuts.',
    breakdown: [
      { label: 'Velocity Flow', detail: 'Fluid speed-ramp curves matched cleanly to rhythm cues' },
      { label: 'Glow & Bloom', detail: 'Dreamy highlight bloom and balanced anime skin-tone color grading' },
      { label: 'Beat Assembly', detail: 'Tight emotional storytelling synced frame-by-frame to vocal drops' },
    ],
    timelineTracks: [
      { name: 'V3 · Bloom & Glow FX', color: '#EF4444', segments: [[8, 42], [48, 84], [86, 98]] },
      { name: 'V2 · 1080p 30fps Cut', color: '#8B5CF6', segments: [[0, 100]] },
      { name: 'A1 · Music & SFX Sync', color: '#3B82F6', segments: [[0, 100]] },
    ],
  },
  {
    id: 'sg-editer-glow-amv',
    title: 'SG EDITER Glow AMV Reel',
    subtitle: 'Golden Flash Transitions & Vertical AMV',
    category: 'Anime Editing',
    deliverableType: 'Vertical Anime AMV',
    frameSpec: '3:4 · 1080p 30fps',
    duration: '0:14',
    tools: ['Flash FX', 'Glow Overlays', 'Motion Blur'],
    accentHex: '#F59E0B',
    visualStyle: 'anime',
    videos: [
      {
        id: 'anime-glow-amv-reel',
        title: 'SG EDITER Glow AMV Reel',
        videoUrl: '/assets/aistudio/lv_0_20261101231034_667e8cb7.mp4',
        aspectLabel: '3:4 Vertical · 30fps',
        duration: '0:14',
        notes: 'High-energy vertical anime AMV reel with golden luminance flashes and beat-locked character transitions.',
      },
    ],
    summary:
      'Smooth vertical AMV showcasing golden flash transitions, directional motion blur, and crisp beat-locked anime character cuts in clean quality.',
    breakdown: [
      { label: 'Luminance Flashes', detail: 'Custom golden highlight bursts synced directly to percussion hits' },
      { label: 'Rhythm Pacing', detail: 'Smooth whip-pan motion and clean transition curves between scenes' },
      { label: 'Mobile Framing', detail: '3:4 vertical framing engineered for sharp mobile playback' },
    ],
    timelineTracks: [
      { name: 'V3 · Flash & Glow FX', color: '#F59E0B', segments: [[12, 38], [44, 72], [78, 96]] },
      { name: 'V2 · Vertical AMV Cut', color: '#8B5CF6', segments: [[0, 100]] },
      { name: 'A1 · Bass & Risers', color: '#EF4444', segments: [[0, 100]] },
    ],
  },
  {
    id: 'sung-jinwoo-amv',
    title: 'Sung Jin-Woo AMV Edit',
    subtitle: 'Crimson Split-Frames, Kanji & Impact Cuts',
    category: 'Anime Editing',
    deliverableType: 'Widescreen Action AMV',
    frameSpec: '16:9 · 1080p 30fps',
    duration: '0:12',
    tools: ['Split Frames', 'Shake FX', 'Kanji Overlays', 'Dark Grade'],
    accentHex: '#8B5CF6',
    visualStyle: 'anime',
    videos: [
      {
        id: 'jinwoo-amv-edit',
        title: 'Sung Jin-Woo AMV Edit',
        videoUrl: '/assets/aistudio/lv_0_20261019225732_86a9f863.mp4',
        aspectLabel: '16:9 · 1080p 30fps',
        duration: '0:12',
        notes: 'Solo Leveling AMV with crimson split-frame intros, kanji overlays, and smooth hard beat drops.',
      },
    ],
    summary:
      'Dark Solo Leveling AMV combining crimson split-screen intros, framed card transitions, kanji overlays, and bass-synced camera shakes at 1080p 30fps.',
    breakdown: [
      { label: 'Split-Frame Intro', detail: 'Sharp crimson visual rhythm paired with graphic kanji callouts' },
      { label: 'Impact & Shake', detail: 'Directional camera shakes and glowing aura contrast' },
      { label: 'Dark Grade', detail: 'Deep shadow contrast with electric blue and crimson highlights' },
    ],
    timelineTracks: [
      { name: 'V3 · Split Frames & FX', color: '#8B5CF6', segments: [[4, 46], [50, 95]] },
      { name: 'V2 · Solo Leveling Clips', color: '#EF4444', segments: [[0, 100]] },
      { name: 'A1 · Impact & Drop Sync', color: '#3B82F6', segments: [[0, 98]] },
    ],
  },
  {
    id: 'kaoruko-rintaro-extended-amv',
    title: 'Kaoruko & Rintaro AMV',
    subtitle: 'Dialogue Story Intro, Red Frame Glow & Beat Flow',
    category: 'Anime Editing',
    deliverableType: 'Extended Romance AMV',
    frameSpec: '16:9 · Extended Cut',
    duration: '0:35',
    tools: ['Scene Dialogue', 'Red Border Glow', 'Whip Transitions', 'Soft Bloom'],
    accentHex: '#EC4899',
    visualStyle: 'anime',
    videos: [
      {
        id: 'kaoruko-rintaro-amv',
        title: 'Kaoruko & Rintaro AMV',
        videoUrl: '/assets/aistudio/lv_0_20260911153457_8cd34327.mp4',
        aspectLabel: '16:9 Widescreen · 25fps',
        duration: '0:35',
        notes: '35-second extended anime AMV opening with Japanese dialogue pacing before hitting red-framed glow transitions and beat-synced cuts.',
      },
    ],
    summary:
      'Extended 35-second story AMV opening with original anime dialogue before transitioning into crimson-bordered glow bursts, soft bloom, and rhythmic beat cuts.',
    breakdown: [
      { label: 'Story Intro', detail: 'Timed dialogue build-up setting emotional context before the musical drop' },
      { label: 'Crimson Frame Glow', detail: 'Pulsing red border glow overlays paired with fast zoom & whip transitions' },
      { label: 'Warm Bloom Grade', detail: 'Soft pastel highlights and bright emotional flash transitions across scenes' },
    ],
    timelineTracks: [
      { name: 'V3 · Glow & Frame FX', color: '#EC4899', segments: [[32, 65], [68, 98]] },
      { name: 'V2 · Story & Beat Cut', color: '#8B5CF6', segments: [[0, 100]] },
      { name: 'A1 · Dialogue & Track', color: '#3B82F6', segments: [[0, 100]] },
    ],
  },
  {
    id: 'midnight-glow-card-amv',
    title: 'Midnight Glow Card AMV',
    subtitle: 'Multi-Card Intro, Edge Glow & Emerald Particles',
    category: 'Anime Editing',
    deliverableType: 'Full HD Stylized AMV',
    frameSpec: '16:9 · 1080p',
    duration: '0:18',
    tools: ['Card Layout', 'Edge Glow', 'Particle Trails', 'Beat Cuts'],
    accentHex: '#10B981',
    visualStyle: 'anime',
    videos: [
      {
        id: 'midnight-glow-card',
        title: 'Midnight Glow Card AMV',
        videoUrl: '/assets/aistudio/lv_0_20260901141410_251af1b3.mp4',
        aspectLabel: '16:9 Full HD · 25fps',
        duration: '0:18',
        notes: 'Full HD anime reel starting with layered card frames, crisp white edge glow, and emerald particle overlays synced to Hindi beats.',
      },
    ],
    summary:
      'Stylized 1080p widescreen edit featuring a layered multi-card opening, high-contrast white edge highlights, and floating emerald particles.',
    breakdown: [
      { label: 'Multi-Card Opening', detail: 'Layered tilted video cards transitioning cleanly into full-screen playback' },
      { label: 'Silhouette Edge Glow', detail: 'High-contrast white rim glow paired with animated teal/emerald particle trails' },
      { label: 'Tempo Lock', detail: 'Sharp vocal and percussion cuts timed cleanly across every pose change' },
    ],
    timelineTracks: [
      { name: 'V3 · Glow & Particles', color: '#10B981', segments: [[14, 48], [52, 92]] },
      { name: 'V2 · 1080p Card Edit', color: '#8B5CF6', segments: [[0, 100]] },
      { name: 'A1 · Beat Sync Audio', color: '#EF4444', segments: [[0, 100]] },
    ],
  },
  {
    id: 'mikasa-ackerman-amv',
    title: 'Mikasa Ackerman AMV Reel',
    subtitle: 'Glass Shatter Intro, Morph Cuts & Zoom Blur',
    category: 'Anime Editing',
    deliverableType: 'Vertical Tribute AMV',
    frameSpec: '3:4 · Vertical',
    duration: '0:14',
    tools: ['Glass Shatter', 'Morph Cuts', 'Glitch FX', 'Zoom Blur'],
    accentHex: '#3B82F6',
    visualStyle: 'anime',
    videos: [
      {
        id: 'mikasa-tribute-reel',
        title: 'Mikasa Ackerman AMV Reel',
        videoUrl: '/assets/aistudio/lv_0_20260827231548_d2a9ae2d.mp4',
        aspectLabel: '3:4 Vertical · 25fps',
        duration: '0:14',
        notes: 'Attack on Titan Mikasa vertical reel opening with glass-shatter transition, character outfit morphs, glitch bursts, and radial zoom blurs.',
      },
    ],
    summary:
      'Vertical 3:4 Mikasa tribute edit blending a glass-shatter transition, beat-timed character pose morphs, RGB glitch hits, and radial zoom blur.',
    breakdown: [
      { label: 'Shatter & Morph Intro', detail: '3D glass shatter reveal followed by aligned character pose switches' },
      { label: 'Glitch & Flash Hits', detail: 'Brief RGB split-frame glitches and film exposure flashes on percussion' },
      { label: 'Radial Zoom Blur', detail: 'Dynamic radial motion blur transitions connecting Attack on Titan eras' },
    ],
    timelineTracks: [
      { name: 'V3 · Shatter & Glitch', color: '#3B82F6', segments: [[0, 35], [40, 88]] },
      { name: 'V2 · 3:4 Vertical Cut', color: '#8B5CF6', segments: [[0, 100]] },
      { name: 'A1 · Punjabi Beat Sync', color: '#EC4899', segments: [[0, 100]] },
    ],
  },
];

export const SKILLS_LIST: SkillMetric[] = [
  {
    id: 'anime-reel',
    name: 'Anime Reel',
    specialty:
      'Beat-synced anime AMV reels with velocity curves, glow overlays, flash transitions, and impact cuts.',
    accent: 'crimson',
    tools: 'Beat Sync · Velocity · Glow & Flash FX',
  },
  {
    id: 'typography',
    name: 'Typography',
    specialty:
      'Clean kinetic lyric overlays, beat-matched text styling, kanji callouts, and sharp on-screen captions.',
    accent: 'violet',
    tools: 'Kinetic Lyrics · Kanji · Beat Captions',
  },
  {
    id: 'normal-reel',
    name: 'Normal Reel',
    specialty:
      'Clean social & short-form reel pacing with crisp cuts, balanced color grading, and music sync.',
    accent: 'electric',
    tools: 'Clean Cuts · Audio Sync · Color Balance',
  },
];

export type PriceAccent = 'violet' | 'crimson' | 'electric' | 'amber';

export interface PricePackage {
  id: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  fullTitle: string;
  serviceType: (typeof SERVICE_OPTIONS)[number];
  priceInr: number;
  accent: PriceAccent;
}

export interface PriceCategory {
  id: string;
  title: string;
  emoji: string;
  subtitle: string;
  serviceType: (typeof SERVICE_OPTIONS)[number];
  accent: PriceAccent;
  items: {
    id: string;
    title: string;
    priceInr: number;
  }[];
}

export const PRICE_CATEGORIES: PriceCategory[] = [
  {
    id: 'typography-editing',
    title: 'Typography Editing',
    emoji: '✨',
    subtitle: 'Clean kinetic lyrics, beat captions & smooth text flow reels',
    serviceType: 'Typography',
    accent: 'violet',
    items: [
      { id: 'typo-basic-reel', title: 'Basic Reel', priceInr: 99 },
      { id: 'typo-smooth-reel', title: 'Smooth Reel', priceInr: 149 },
      { id: 'typo-cinematic-reel', title: 'Cinematic Reel', priceInr: 199 },
      { id: 'typo-advanced-reel', title: 'Advanced Reel', priceInr: 249 },
    ],
  },
  {
    id: 'anime-editing',
    title: 'Anime Editing',
    emoji: '🔥',
    subtitle: 'Beat-locked AMVs, velocity curves, glow bursts & cinematic cuts',
    serviceType: 'AMV',
    accent: 'crimson',
    items: [
      { id: 'anime-basic-edit', title: 'Basic Anime Edit', priceInr: 149 },
      { id: 'anime-amv-edit', title: 'AMV Edit', priceInr: 199 },
      { id: 'anime-velocity-edit', title: 'Velocity Edit', priceInr: 249 },
      { id: 'anime-cinematic-edit', title: 'Cinematic Anime Edit', priceInr: 299 },
      { id: 'anime-advanced-edit', title: 'Advanced Anime Edit', priceInr: 399 },
    ],
  },
  {
    id: 'reels-editing',
    title: 'Reels Editing',
    emoji: '🎥',
    subtitle: 'Social, trending, professional & cinematic short-form reels',
    serviceType: 'Reel',
    accent: 'electric',
    items: [
      { id: 'reels-basic', title: 'Basic Reel', priceInr: 199 },
      { id: 'reels-trending', title: 'Trending Reel', priceInr: 349 },
      { id: 'reels-professional', title: 'Professional Reel', priceInr: 499 },
      { id: 'reels-cinematic', title: 'Cinematic Reel', priceInr: 599 },
    ],
  },
  {
    id: 'special-editing',
    title: 'Special Editing',
    emoji: '⚡',
    subtitle: 'Focused lyrics, beat sync, shake FX, 3D & premium custom edits',
    serviceType: 'Custom Edit',
    accent: 'amber',
    items: [
      { id: 'special-lyrics', title: 'Lyrics Editing', priceInr: 149 },
      { id: 'special-beat-sync', title: 'Beat Sync Editing', priceInr: 199 },
      { id: 'special-shake-effect', title: 'Shake Effect Editing', priceInr: 199 },
      { id: 'special-3d-editing', title: '3D Editing', priceInr: 299 },
      { id: 'special-premium', title: 'Premium Editing', priceInr: 499 },
    ],
  },
];

export const PRICE_TERMS: string[] = [
  '50% advance payment.',
  'Extra revisions may cost extra.',
  'Prices depend on video complexity.',
  'Delivery time depends on project.',
];

export const PRICE_LIST: PricePackage[] = PRICE_CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({
    id: item.id,
    categoryId: category.id,
    categoryTitle: category.title,
    title: item.title,
    fullTitle: `${category.title} — ${item.title}`,
    serviceType: category.serviceType,
    priceInr: item.priceInr,
    accent: category.accent,
  }))
);

export function filterProjects(
  projects: readonly PortfolioProject[],
  category: ProjectCategory
): PortfolioProject[] {
  if (category === 'All') {
    return [...projects];
  }
  return projects.filter((project) => project.category === category);
}

export function getAdjacentProjectId(
  projects: readonly PortfolioProject[],
  currentId: string,
  direction: 'prev' | 'next'
): string | null {
  if (projects.length === 0) return null;
  const idx = projects.findIndex((p) => p.id === currentId);
  if (idx === -1) return projects[0].id;
  const offset = direction === 'next' ? 1 : -1;
  const nextIdx = (idx + offset + projects.length) % projects.length;
  return projects[nextIdx].id;
}

export function clampTilt(nx: number, ny: number, maxDeg = 10): { rotateX: number; rotateY: number } {
  const clampedX = Math.max(-1, Math.min(1, nx));
  const clampedY = Math.max(-1, Math.min(1, ny));
  return {
    rotateX: Number((-clampedY * maxDeg).toFixed(2)) + 0,
    rotateY: Number((clampedX * maxDeg).toFixed(2)) + 0,
  };
}

export interface IntroPhaseState {
  phase: 'void' | 'particles' | 'emerge' | 'title' | 'tagline' | 'complete';
  progress: number;
}

export function computeIntroPhase(elapsedSeconds: number): IntroPhaseState {
  const total = 1.55;
  const clamped = Math.max(0, Math.min(total, elapsedSeconds));
  const progress = Math.round((clamped / total) * 100);

  if (clamped < 0.15) return { phase: 'void', progress };
  if (clamped < 0.4) return { phase: 'particles', progress };
  if (clamped < 0.7) return { phase: 'emerge', progress };
  if (clamped < 1.15) return { phase: 'title', progress };
  if (clamped < total) return { phase: 'tagline', progress };
  return { phase: 'complete', progress: 100 };
}

export function validateInquiryForm(payload: InquiryPayload): {
  valid: boolean;
  errors: Partial<Record<keyof InquiryPayload, string>>;
} {
  const errors: Partial<Record<keyof InquiryPayload, string>> = {};
  if (!payload.name.trim() || payload.name.trim().length < 2) {
    errors.name = 'Please enter your name or studio.';
  }
  const emailTrimmed = payload.email.trim();
  if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!payload.service.trim()) {
    errors.service = 'Please select an editing service.';
  }
  if (!payload.message.trim() || payload.message.trim().length < 10) {
    errors.message = 'Please share a few details about your project (at least 10 characters).';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildTelegramUrl(baseUrl: string, text?: string): string {
  const trimmed = baseUrl.trim();
  if (!trimmed) return '';
  if (!text || !text.trim()) return trimmed;
  const separator = trimmed.includes('?') ? '&' : '?';
  return `${trimmed}${separator}text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppUrl(phoneDigits: string, text?: string): string {
  const digits = phoneDigits.replace(/\D/g, '');
  if (!digits) return '';
  const base = `https://wa.me/${digits}`;
  if (!text || !text.trim()) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function buildMailtoUrl(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function validatePaymentAmount(rawAmount: string): {
  valid: boolean;
  amount?: number;
  error?: string;
} {
  const trimmed = rawAmount.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter a payment amount in INR (₹).' };
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return { valid: false, error: 'Enter a valid amount greater than ₹0.' };
  }
  if (parsed > 100000) {
    return { valid: false, error: 'UPI transfers are limited to ₹1,00,000 per transaction.' };
  }
  return {
    valid: true,
    amount: Number(parsed.toFixed(2)),
  };
}

export function buildUpiAppUrls(params: {
  pa: string;
  pn: string;
  am: number;
  tn?: string;
}): {
  upi: string;
  gpay: string;
  phonepe: string;
  paytm: string;
} {
  const query = [
    `pa=${encodeURIComponent(params.pa.trim())}`,
    `pn=${encodeURIComponent(params.pn.trim())}`,
    `am=${params.am.toFixed(2)}`,
    'cu=INR',
  ];
  if (params.tn && params.tn.trim()) {
    query.push(`tn=${encodeURIComponent(params.tn.trim())}`);
  }
  const qs = query.join('&');
  return {
    upi: `upi://pay?${qs}`,
    gpay: `tez://upi/pay?${qs}`,
    phonepe: `phonepe://pay?${qs}`,
    paytm: `paytmmp://pay?${qs}`,
  };
}

export function buildUpiPaymentUrl(params: {
  pa: string;
  pn: string;
  am: number;
  tn?: string;
}): string {
  return buildUpiAppUrls(params).upi;
}
