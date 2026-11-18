import { ArrowDownRight, Mail } from 'lucide-react';
import { BRAND_PROFILE } from '../utils/portfolioLogic';

interface HeroSectionProps {
  onExploreWork: () => void;
  onContactMe: () => void;
}

export function HeroSection({
  onExploreWork,
  onContactMe,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh)] pt-20 pb-16 sm:pb-24 flex flex-col justify-center pointer-events-none"
    >
      {/* Left contrast gradient scrim so hero typography reads cleanly over 3D particles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#050508]/92 via-[#050508]/68 to-transparent"
      />

      {/* Left/Center Editorial Hero Typography */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-5 sm:px-8 my-auto pt-6 sm:pt-12">
        <div className="max-w-xl bg-[#050508]/88 sm:bg-transparent p-5 sm:p-0 rounded-2xl border border-white/12 sm:border-0">
          <p className="hero-stagger text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-rose-400">
            {BRAND_PROFILE.heroKicker}
          </p>

          <div className="hero-stagger mt-3">
            <h1 className="sr-only">{BRAND_PROFILE.name}</h1>
            <img
              src={BRAND_PROFILE.logoUrl}
              alt="SG EDITER"
              className="w-60 sm:w-80 lg:w-[360px] h-auto object-contain -mt-6 -mb-5 sm:-mt-9 sm:-mb-7 drop-shadow-[0_12px_32px_rgba(245,158,11,0.3)]"
            />
          </div>

          <div className="hero-stagger mt-3 h-[2px] w-32 metallic-accent-line" />

          <p className="hero-stagger mt-5 text-xl sm:text-2xl font-medium text-zinc-100 text-balance">
            {BRAND_PROFILE.heroSubtitle}
          </p>

          <p className="hero-stagger mt-3 text-sm sm:text-base text-zinc-300 max-w-lg leading-relaxed">
            Anime AMVs, beat-synced reels, and kinetic typography crafted with glow FX and clean
            color grading.
          </p>

          <div className="hero-stagger mt-3 text-xs font-mono-tabular tracking-[0.2em] text-zinc-400">
            {BRAND_PROFILE.tagline}
          </div>

          <div className="hero-stagger mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4 pointer-events-auto">
            <button
              type="button"
              onClick={onExploreWork}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-rose-950/50 focus-visible:outline-2 focus-visible:outline-rose-400"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onContactMe}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-100 bg-[#0e0e16]/90 border border-white/20 hover:border-blue-400/70 hover:text-white rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>CONTACT ME</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
