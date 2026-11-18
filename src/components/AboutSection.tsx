import { useState } from 'react';
import { Clapperboard, Film, Sparkles } from 'lucide-react';
import { BRAND_PROFILE, clampTilt } from '../utils/portfolioLogic';

export function AboutSection() {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const next = clampTilt(nx, ny, 9);
    setTilt({
      rotateX: next.rotateX,
      rotateY: next.rotateY,
      glareX: Math.round(((nx + 1) / 2) * 100),
      glareY: Math.round(((ny + 1) / 2) * 100),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 bg-[#07070c] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Column: Animated 3D Profile Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1100px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              }}
              className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0c0c14] transition-transform duration-200 ease-out shadow-2xl shadow-black/80"
            >
              <div className="aspect-[3/4] w-full relative overflow-hidden bg-[#0e0e18]">
                {!imgError ? (
                  <img
                    src={BRAND_PROFILE.aboutPortrait}
                    alt="SG EDITER 3D anime creative director portrait"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#140d20] via-[#090910] to-[#0b162a]">
                    <Clapperboard className="w-10 h-10 text-rose-400 mb-3" />
                    <span className="font-display text-lg font-bold text-white">
                      {BRAND_PROFILE.name}
                    </span>
                  </div>
                )}

                {/* Specular mouse-follow sheen */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-45 mix-blend-screen"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(139,92,246,0.28), rgba(239,68,68,0.12) 35%, transparent 65%)`,
                  }}
                />

                {/* Contrast scrim */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050508] via-[#050508]/75 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-xl font-bold text-white">
                    {BRAND_PROFILE.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-300">
                    Anime Video Editor · AMV &amp; Beat-Sync Craft
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Introduction & Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-violet-400">
                Studio Profile
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
                ABOUT SG EDITER
              </h2>
              <p className="mt-5 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
                I am a creative anime video editor focused on clean rhythm, expressive glow, and
                sharp visual impact. Every cut, speed ramp, beat flash, and color tone is crafted
                so every scene hits right on beat.
              </p>

              <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
                <div className="py-5 flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-rose-500/12 border border-rose-500/25 text-rose-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      Anime Editing
                    </h3>
                    <p className="mt-1 text-sm text-zinc-300 leading-relaxed">
                      Precision beat-synced flow edits, velocity curves, glow &amp; flash
                      transitions, and impact cuts that amplify every strike and emotion.
                    </p>
                  </div>
                </div>

                <div className="py-5 flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-blue-500/12 border border-blue-500/25 text-blue-400 shrink-0">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      Clean Pacing &amp; Color Grading
                    </h3>
                    <p className="mt-1 text-sm text-zinc-300 leading-relaxed">
                      Tight timeline assembly, moody dual-tone color grading, balanced audio sync,
                      and soft bloom treatments built for clean playback.
                    </p>
                  </div>
                </div>

                <div className="py-5 flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-violet-500/12 border border-violet-500/25 text-violet-400 shrink-0">
                    <Clapperboard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      Creative Visual Storytelling
                    </h3>
                    <p className="mt-1 text-sm text-zinc-300 leading-relaxed">
                      Turning raw anime clips into cohesive edits where beat timing, motion blur,
                      and atmospheric lighting work together in every frame.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Studio Standards Strip — Single Crisp 1080p 30fps Place */}
            <div className="mt-8 grid grid-cols-3 gap-6 pt-2">
              <div>
                <div className="font-display font-mono-tabular text-2xl sm:text-3xl font-bold text-white">
                  16:9 / 3:4
                </div>
                <div className="mt-1 text-xs text-zinc-400">Widescreen &amp; Vertical AMVs</div>
              </div>
              <div>
                <div className="font-display font-mono-tabular text-2xl sm:text-3xl font-bold text-white">
                  Crisp 1080p 30fps
                </div>
                <div className="mt-1 text-xs text-zinc-400">Export Standard</div>
              </div>
              <div>
                <div className="font-display font-mono-tabular text-2xl sm:text-3xl font-bold text-white">
                  Glow &amp; Sync
                </div>
                <div className="mt-1 text-xs text-zinc-400">Beat-Matched Transitions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
