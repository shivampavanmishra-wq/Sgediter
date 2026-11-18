import { useRef, useState } from 'react';
import { Maximize2, Play, Volume2, VolumeX } from 'lucide-react';
import {
  PORTFOLIO_PROJECTS,
  clampTilt,
  type PortfolioProject,
} from '../utils/portfolioLogic';

interface PortfolioSectionProps {
  onSelectProject: (project: PortfolioProject, initialVideoIndex?: number) => void;
}

export function Category3DStage({
  compact = true,
}: {
  style?: PortfolioProject['visualStyle'];
  compact?: boolean;
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#2a0b18_0%,#0c0714_56%,#04050a_100%)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 studio-hairline-grid opacity-70"
      />
      <div
        className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} rounded-full border-2 border-rose-500/60 flex items-center justify-center`}
      >
        <Play className="w-6 h-6 text-rose-400 fill-rose-400/30" />
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onSelect,
}: {
  project: PortfolioProject;
  onSelect: (project: PortfolioProject, initialVideoIndex?: number) => void;
}) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeVideo = project.videos[activeClipIndex] ?? project.videos[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt(clampTilt(nx, ny, 6));
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const toggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (videoRef.current.paused) {
        void videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleOpenModal = () => {
    if (videoRef.current && !videoRef.current.muted) {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
    onSelect(project, activeClipIndex);
  };

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
      }}
      className="group relative text-left rounded-2xl overflow-hidden bg-[#0c0c14] border border-white/12 hover:border-white/30 transition-all duration-200 ease-out flex flex-col"
    >
      {/* Glowing border accent on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{
          boxShadow: `inset 0 0 0 1px ${project.accentHex}88, 0 18px 40px -20px ${project.accentHex}66`,
        }}
      />

      {/* Real Video Showcase Stage (Zero Stock/Template Media) */}
      <div
        onClick={handleOpenModal}
        className="aspect-[4/3] w-full relative overflow-hidden bg-[#06060b] cursor-pointer"
      >
        {/* Ambient radial highlight matching category accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-45"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${project.accentHex}26 0%, transparent 72%)`,
          }}
        />

        {activeVideo ? (
          <video
            ref={videoRef}
            key={activeVideo.videoUrl}
            src={activeVideo.videoUrl}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="auto"
            aria-label={`${project.title} — ${activeVideo.title}`}
            className="relative z-0 w-full h-full object-contain bg-[#06060b] transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <Category3DStage style={project.visualStyle} />
        )}

        {/* Subtle bottom gradient for badge legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/35 to-transparent" />

        {/* Top-right Sound & Fullscreen Cinema Controls (only when video exists) */}
        {activeVideo ? (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? `Unmute ${project.title}` : `Mute ${project.title}`}
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
              className="w-8 h-8 rounded-lg bg-[#050508]/88 border border-white/15 flex items-center justify-center text-zinc-200 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal();
              }}
              aria-label={`Open full player for ${project.title}`}
              title="Watch in full player"
              className="w-8 h-8 rounded-lg bg-[#050508]/88 border border-white/15 flex items-center justify-center text-zinc-200 hover:text-white hover:border-rose-400/70 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-[#050508]/85 border border-white/12 text-[10px] font-mono-tabular text-zinc-400">
            No Videos Yet
          </div>
        )}

        {/* Multi-clip switcher if category has 2-3 edits */}
        {project.videos.length > 1 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2.5 left-3 z-10 flex items-center gap-1"
          >
            {project.videos.map((clip, idx) => {
              const selected = idx === activeClipIndex;
              return (
                <button
                  key={clip.id}
                  type="button"
                  onClick={() => setActiveClipIndex(idx)}
                  aria-label={`Play ${project.title} edit ${idx + 1}`}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-tabular transition-colors cursor-pointer ${
                    selected
                      ? 'bg-white text-zinc-950 font-semibold'
                      : 'bg-[#050508]/85 text-zinc-300 border border-white/15 hover:text-white'
                  }`}
                >
                  0{idx + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-400 font-mono-tabular whitespace-nowrap overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="shrink-0" style={{ color: project.accentHex }}>
                {project.category}
              </span>
              <span aria-hidden="true" className="shrink-0">·</span>
              <span className="truncate">{project.frameSpec}</span>
            </div>
            {activeVideo && (
              <span className="shrink-0 text-zinc-400">{activeVideo.duration}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="mt-2 text-left block w-full cursor-pointer group/title focus-visible:outline-2 focus-visible:outline-rose-500 rounded"
          >
            <h3 className="font-display text-xl font-bold text-white group-hover:text-rose-300 transition-colors">
              {project.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-zinc-300">
              {project.subtitle}
            </p>
          </button>

          <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {activeVideo ? activeVideo.notes : project.summary}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono-tabular text-zinc-500">
            {project.videos.length === 0
              ? 'Ready for Uploads'
              : `${project.videos.length} ${project.videos.length === 1 ? 'Original Edit' : 'Original Edits'}`}
          </span>
          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-rose-600 text-[11px] font-semibold tracking-wider uppercase text-zinc-100 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {activeVideo ? (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Watch</span>
              </>
            ) : (
              <span>Details</span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export function PortfolioSection({ onSelectProject }: PortfolioSectionProps) {
  return (
    <section
      id="portfolio"
      className="relative py-20 sm:py-28 bg-[#050508] border-t border-white/10 studio-hairline-grid"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-rose-400">
              Anime Editing Showreel
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
              FEATURED ANIME EDITS
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl">
              Watch original SG EDITER AMVs directly in the grid—unmute inline or open any edit for
              full-screen playback and timeline breakdown.
            </p>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0d0d16] border border-white/12 text-xs font-mono-tabular text-zinc-300 self-start md:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" aria-hidden="true" />
            <span>Anime Editing · {PORTFOLIO_PROJECTS.length} Original AMVs</span>
          </div>
        </div>

        <div
          data-testid="portfolio-grid"
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
        >
          {PORTFOLIO_PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
