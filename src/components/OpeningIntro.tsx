import { computeIntroPhase, BRAND_PROFILE } from '../utils/portfolioLogic';

interface OpeningIntroProps {
  elapsedSeconds: number;
  visible: boolean;
  onSkip: () => void;
}

export function OpeningIntro({
  elapsedSeconds,
  visible,
  onSkip,
}: OpeningIntroProps) {
  if (!visible) return null;

  const { phase } = computeIntroPhase(elapsedSeconds);
  const showLogo = phase !== 'void';
  const showTagline = phase === 'emerge' || phase === 'title' || phase === 'tagline' || phase === 'complete';
  const isFadingOut = phase === 'complete';

  const backdropOpacity =
    phase === 'void'
      ? 'bg-[#050508]'
      : phase === 'particles'
        ? 'bg-[#050508]/88'
        : phase === 'emerge'
          ? 'bg-[#050508]/68'
          : 'bg-[#050508]/45';

  return (
    <div
      data-testid="opening-intro"
      data-phase={phase}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-300 ${backdropOpacity} ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top-right Skip control */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={onSkip}
          className="px-3.5 py-1.5 text-xs font-medium tracking-wider uppercase text-zinc-200 bg-[#0d0d14]/90 border border-white/15 rounded-lg hover:border-rose-500/60 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-500"
        >
          Skip
        </button>
      </div>

      {/* Fast Brand Reveal (Zero slow loading bars) */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-8 max-w-2xl">
        <div
          className={`transition-all duration-300 ${
            showLogo ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
          }`}
        >
          <h1 className="sr-only">{BRAND_PROFILE.name}</h1>
          <img
            src={BRAND_PROFILE.logoUrl}
            alt="SG EDITER"
            className="w-56 sm:w-72 md:w-80 h-auto object-contain -mt-4 -mb-2 drop-shadow-[0_10px_28px_rgba(245,158,11,0.35)]"
          />
        </div>

        <div
          className={`mt-3 h-[2px] w-36 sm:w-52 metallic-accent-line transition-all duration-300 ${
            showLogo ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
        />

        <p
          className={`mt-4 font-display text-xs sm:text-sm tracking-[0.28em] text-zinc-200 transition-all duration-300 ${
            showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {BRAND_PROFILE.tagline}
        </p>
      </div>
    </div>
  );
}
