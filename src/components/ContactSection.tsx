import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, Check, Copy, MessageCircle, Send } from 'lucide-react';
import {
  BRAND_PROFILE,
  SERVICE_OPTIONS,
  buildMailtoUrl,
  buildTelegramUrl,
  buildWhatsAppUrl,
  clampTilt,
  validateInquiryForm,
  type InquiryPayload,
} from '../utils/portfolioLogic';
import {
  Email3DIcon,
  Instagram3DIcon,
  Telegram3DIcon,
  WhatsApp3DIcon,
} from './Contact3DIcons';

interface ContactSectionProps {
  preselectedService?: string;
}

interface AmbientParticle {
  id: number;
  left: string;
  top: string;
  size: number;
  color: string;
  glow: string;
  duration: string;
  delay: string;
  driftX: string;
  driftY: string;
}

const CONTACT_PARTICLES: AmbientParticle[] = [
  { id: 1, left: '6%', top: '14%', size: 4, color: '#a855f7', glow: 'rgba(168,85,247,0.85)', duration: '7.5s', delay: '0s', driftX: '14px', driftY: '-24px' },
  { id: 2, left: '14%', top: '68%', size: 3, color: '#ef4444', glow: 'rgba(239,68,68,0.85)', duration: '8.2s', delay: '-1.5s', driftX: '-10px', driftY: '-28px' },
  { id: 3, left: '24%', top: '28%', size: 5, color: '#3b82f6', glow: 'rgba(59,130,246,0.85)', duration: '9.4s', delay: '-3.1s', driftX: '16px', driftY: '-20px' },
  { id: 4, left: '35%', top: '82%', size: 3, color: '#ec4899', glow: 'rgba(236,72,153,0.85)', duration: '6.8s', delay: '-2.2s', driftX: '-12px', driftY: '-22px' },
  { id: 5, left: '48%', top: '12%', size: 4, color: '#38bdf8', glow: 'rgba(56,189,248,0.85)', duration: '8.6s', delay: '-4.0s', driftX: '10px', driftY: '-26px' },
  { id: 6, left: '56%', top: '52%', size: 3, color: '#8b5cf6', glow: 'rgba(139,92,246,0.85)', duration: '7.1s', delay: '-0.8s', driftX: '-14px', driftY: '-18px' },
  { id: 7, left: '68%', top: '22%', size: 5, color: '#ef4444', glow: 'rgba(239,68,68,0.8)', duration: '9.0s', delay: '-2.7s', driftX: '12px', driftY: '-30px' },
  { id: 8, left: '78%', top: '74%', size: 4, color: '#a855f7', glow: 'rgba(168,85,247,0.85)', duration: '7.8s', delay: '-5.1s', driftX: '-16px', driftY: '-24px' },
  { id: 9, left: '88%', top: '34%', size: 3, color: '#3b82f6', glow: 'rgba(59,130,246,0.85)', duration: '8.4s', delay: '-1.9s', driftX: '11px', driftY: '-21px' },
  { id: 10, left: '93%', top: '62%', size: 4, color: '#ec4899', glow: 'rgba(236,72,153,0.85)', duration: '6.9s', delay: '-3.6s', driftX: '-13px', driftY: '-25px' },
  { id: 11, left: '41%', top: '42%', size: 3, color: '#3b82f6', glow: 'rgba(59,130,246,0.75)', duration: '10.2s', delay: '-4.4s', driftX: '15px', driftY: '-19px' },
  { id: 12, left: '19%', top: '48%', size: 4, color: '#8b5cf6', glow: 'rgba(139,92,246,0.8)', duration: '8.9s', delay: '-0.4s', driftX: '-9px', driftY: '-27px' },
];

interface ContactTiltCardProps {
  title: string;
  subtitle?: string;
  href?: string;
  external?: boolean;
  icon: ReactNode;
  accentGradient: string;
  borderGlowClass: string;
  spotlightRgba: string;
  iconGlowShadow: string;
  ariaLabel: string;
  testId: string;
}

function ContactTiltCard({
  title,
  subtitle,
  href,
  external,
  icon,
  accentGradient,
  borderGlowClass,
  spotlightRgba,
  iconGlowShadow,
  ariaLabel,
  testId,
}: ContactTiltCardProps) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 30, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt(clampTilt(nx, ny, 9));
    setSpotlight({ x: px, y: py, active: true });
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  const innerContent = (
    <div
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${
          spotlight.active ? '1.02, 1.02, 1.02' : '1, 1, 1'
        })`,
        transformStyle: 'preserve-3d',
        transition: spotlight.active
          ? 'transform 140ms cubic-bezier(0.16, 1, 0.3, 1)'
          : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative h-full rounded-2xl p-[1px] ${accentGradient} ${borderGlowClass} transition-shadow duration-300`}
    >
      {/* Realistic glass card body */}
      <div className="relative h-full min-h-[112px] rounded-[15px] bg-gradient-to-br from-[#0e152b]/95 via-[#070b18]/96 to-[#04060d]/98 px-3.5 py-4 flex items-center gap-3.5 overflow-hidden">
        {/* Top glass specular highlight edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
        />

        {/* Interactive pointer spotlight reflection */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            opacity: spotlight.active ? 1 : 0,
            background: `radial-gradient(220px circle at ${spotlight.x}% ${spotlight.y}%, ${spotlightRgba}, transparent 72%)`,
          }}
        />

        {/* Floating 3D Icon Chamber */}
        <div
          style={{
            transform: spotlight.active ? 'translateZ(26px) scale(1.06)' : 'translateZ(14px)',
            transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: iconGlowShadow,
          }}
          className="relative z-10 w-13 h-13 rounded-xl bg-[#070a17]/90 border border-white/15 flex items-center justify-center shrink-0"
        >
          {icon}
        </div>

        {/* Crisp 3D-Elevated Typography & Handle */}
        <div
          style={{
            transform: spotlight.active ? 'translateZ(16px)' : 'translateZ(6px)',
            transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative z-10 min-w-0 flex-1"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-base font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              {title}
            </span>
            {href && (
              <ArrowUpRight
                className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                aria-hidden="true"
              />
            )}
          </div>
          {subtitle && (
            <div className="mt-1 text-[11.5px] sm:text-xs text-zinc-300 truncate">{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        data-testid={testId}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
      >
        {innerContent}
      </a>
    );
  }

  return (
    <div
      data-testid={testId}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
    >
      {innerContent}
    </div>
  );
}

export function ContactSection({ preselectedService }: ContactSectionProps) {
  const [form, setForm] = useState<InquiryPayload>({
    name: '',
    email: '',
    service: preselectedService || SERVICE_OPTIONS[0],
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryPayload, string>>>({});
  const [submittedState, setSubmittedState] = useState<'idle' | 'sent-email' | 'sent-telegram' | 'sent-whatsapp'>('idle');
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setForm((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(BRAND_PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleSubmit = (channel: 'email' | 'telegram' | 'whatsapp') => {
    const result = validateInquiryForm(form);
    if (!result.valid) {
      setErrors(result.errors);
      setSubmittedState('idle');
      return;
    }
    setErrors({});
    const summaryText = `Project Inquiry from ${form.name} (${form.email})\nService: ${form.service}\n\n${form.message}`;

    if (channel === 'whatsapp') {
      setSubmittedState('sent-whatsapp');
      const url = buildWhatsAppUrl(BRAND_PROFILE.whatsappDigits, summaryText);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    } else if (channel === 'telegram') {
      setSubmittedState('sent-telegram');
      const url = buildTelegramUrl(BRAND_PROFILE.telegramUrl, summaryText);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    } else {
      setSubmittedState('sent-email');
      const mailUrl = buildMailtoUrl(
        BRAND_PROFILE.email,
        `[${form.service}] Creative Project Brief — ${form.name}`,
        summaryText
      );
      window.location.href = mailUrl;
    }
  };

  const whatsappDirectHref = buildWhatsAppUrl(
    BRAND_PROFILE.whatsappDigits,
    'Hi SG EDITER, I want to discuss an anime / reel edit.'
  );

  const mailHref = buildMailtoUrl(
    BRAND_PROFILE.email,
    'Project Inquiry — SG EDITER',
    'Hi SG EDITER,\n\nI would like to collaborate on:'
  );

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 sm:py-32 bg-[radial-gradient(ellipse_at_top,#0a1026_0%,#050712_52%,#040508_100%)] border-t border-white/10"
    >
      {/* Subtle studio grid + tri-tone purple, blue & red volumetric neon glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-hairline-grid opacity-80" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -left-24 w-[420px] h-[420px] rounded-full bg-purple-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[360px] rounded-full bg-blue-600/14 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-20 w-[420px] h-[420px] rounded-full bg-red-600/18 blur-3xl"
      />

      {/* Animated Floating Neon Particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {CONTACT_PARTICLES.map((particle) => (
          <span
            key={particle.id}
            className="contact-particle absolute rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 14px 2px ${particle.glow}`,
              ['--dur' as string]: particle.duration,
              ['--delay' as string]: particle.delay,
              ['--drift-x' as string]: particle.driftX,
              ['--drift-y' as string]: particle.driftY,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: 3D Metallic Typography & Interactive 3D Contact Cards */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-purple-300">
              Bookings &amp; Collaborations
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight metallic-title text-balance">
              LET&apos;S CREATE SOMETHING EPIC
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
              Available for custom Anime AMVs, Reels, and Typography edits tailored to your track.
            </p>

            {/* Interactive 3D Contact Cards (2x2 grid: WhatsApp, Instagram, Telegram, Email) */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. WHATSAPP */}
              <ContactTiltCard
                testId="contact-card-whatsapp"
                title="WhatsApp"
                subtitle={BRAND_PROFILE.whatsappNumber}
                href={whatsappDirectHref}
                external
                ariaLabel={`WhatsApp ${BRAND_PROFILE.whatsappNumber}`}
                icon={<WhatsApp3DIcon />}
                accentGradient="bg-gradient-to-br from-emerald-400/75 via-green-500/55 to-teal-500/75"
                borderGlowClass="shadow-[0_0_28px_-6px_rgba(34,197,94,0.52)] hover:shadow-[0_0_40px_-2px_rgba(52,211,153,0.72)]"
                spotlightRgba="rgba(34, 197, 94, 0.24)"
                iconGlowShadow="0 10px 26px -4px rgba(34, 197, 94, 0.52), inset 0 1px 0 rgba(255,255,255,0.2)"
              />

              {/* 2. INSTAGRAM */}
              <ContactTiltCard
                testId="contact-card-instagram"
                title="Instagram"
                subtitle={BRAND_PROFILE.instagramHandle}
                href={BRAND_PROFILE.instagramUrl}
                external
                ariaLabel={`Instagram ${BRAND_PROFILE.instagramHandle}`}
                icon={<Instagram3DIcon />}
                accentGradient="bg-gradient-to-br from-purple-500/75 via-fuchsia-500/55 to-pink-500/70"
                borderGlowClass="shadow-[0_0_28px_-6px_rgba(168,85,247,0.55)] hover:shadow-[0_0_40px_-2px_rgba(236,72,153,0.72)]"
                spotlightRgba="rgba(217, 70, 239, 0.24)"
                iconGlowShadow="0 10px 26px -4px rgba(168, 85, 247, 0.55), inset 0 1px 0 rgba(255,255,255,0.2)"
              />

              {/* 3. TELEGRAM (TG) */}
              <ContactTiltCard
                testId="contact-card-telegram"
                title="Telegram (TG)"
                subtitle={BRAND_PROFILE.telegramHandle}
                href={BRAND_PROFILE.telegramUrl}
                external
                ariaLabel={`Telegram ${BRAND_PROFILE.telegramHandle}`}
                icon={<Telegram3DIcon />}
                accentGradient="bg-gradient-to-br from-sky-400/75 via-blue-500/55 to-violet-500/75"
                borderGlowClass="shadow-[0_0_28px_-6px_rgba(56,189,248,0.5)] hover:shadow-[0_0_40px_-2px_rgba(96,165,250,0.72)]"
                spotlightRgba="rgba(56, 189, 248, 0.24)"
                iconGlowShadow="0 10px 26px -4px rgba(59, 130, 246, 0.55), inset 0 1px 0 rgba(255,255,255,0.2)"
              />

              {/* 4. EMAIL */}
              <ContactTiltCard
                testId="contact-card-email"
                title="Email"
                subtitle={BRAND_PROFILE.email}
                href={mailHref}
                ariaLabel={`Email ${BRAND_PROFILE.email}`}
                icon={<Email3DIcon />}
                accentGradient="bg-gradient-to-br from-blue-500/75 via-indigo-500/55 to-purple-500/75"
                borderGlowClass="shadow-[0_0_28px_-6px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_-2px_rgba(139,92,246,0.72)]"
                spotlightRgba="rgba(99, 102, 241, 0.24)"
                iconGlowShadow="0 10px 26px -4px rgba(99, 102, 241, 0.55), inset 0 1px 0 rgba(255,255,255,0.2)"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-zinc-200 bg-[#0b1022]/90 border border-blue-400/25 hover:border-purple-400/60 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Email copied to clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-300" />
                    <span>Copy {BRAND_PROFILE.email}</span>
                  </>
                )}
              </button>

              <span className="text-[11px] font-mono-tabular tracking-[0.2em] text-zinc-400">
                {BRAND_PROFILE.tagline}
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Glassmorphism 3D-Rimmed Project Brief Form */}
          <div className="lg:col-span-6 relative rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/45 via-blue-500/30 to-red-500/45 shadow-[0_24px_60px_-20px_rgba(37,99,235,0.35)]">
            <div className="relative p-6 sm:p-8 rounded-[15px] bg-gradient-to-br from-[#0c1228]/95 via-[#070b18]/97 to-[#05060d]/98">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />

              <h3 className="font-display text-xl sm:text-2xl font-bold metallic-title">
                Send a Project Brief
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Share your footage style, pacing references, and target delivery date.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit('email');
                }}
                noValidate
                className="mt-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Alex Rivera"
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-[#050814] border border-white/15 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-rose-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@studio.com"
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-[#050814] border border-white/15 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-rose-400">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-service" className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Editing Discipline
                  </label>
                  <select
                    id="contact-service"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm text-white bg-[#050814] border border-white/15 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    {SERVICE_OPTIONS.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p className="mt-1 text-xs text-rose-400">{errors.service}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Project Details &amp; Vision
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about the track, anime or footage references, target aspect ratio, and timeline..."
                    className="w-full px-3.5 py-2.5 text-sm text-white bg-[#050814] border border-white/15 rounded-lg focus:outline-none focus:border-red-400 transition-colors resize-y"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-rose-400">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    data-testid="contact-submit-whatsapp"
                    onClick={() => handleSubmit('whatsapp')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-emerald-950/50 focus-visible:outline-2 focus-visible:outline-emerald-400"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 hover:from-rose-500 hover:via-purple-500 hover:to-blue-500 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-purple-950/50 focus-visible:outline-2 focus-visible:outline-purple-400"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send via Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmit('telegram')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-zinc-100 bg-[#0d142b] border border-sky-400/35 hover:border-sky-400/80 hover:bg-[#111b38] rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Send via Telegram</span>
                  </button>
                </div>

                {submittedState !== 'idle' && (
                  <div
                    role="status"
                    className="mt-3 p-3 rounded-lg bg-emerald-500/12 border border-emerald-500/30 text-xs text-emerald-200"
                  >
                    {submittedState === 'sent-whatsapp'
                      ? 'Brief formatted and opened in WhatsApp. Thank you for reaching out to SG EDITER.'
                      : submittedState === 'sent-telegram'
                        ? 'Brief formatted and opened in Telegram. Thank you for reaching out to SG EDITER.'
                        : 'Brief validated and opened in your email client. Thank you for reaching out to SG EDITER.'}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
