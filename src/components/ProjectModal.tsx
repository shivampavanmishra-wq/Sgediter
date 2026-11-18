import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Film, Upload, X } from 'lucide-react';
import type { PortfolioProject } from '../utils/portfolioLogic';
import { Category3DStage } from './PortfolioSection';

interface ProjectModalProps {
  project: PortfolioProject | null;
  initialVideoIndex?: number;
  onClose: () => void;
  onStep: (direction: 'prev' | 'next') => void;
  onBookProject: (serviceTitle: string) => void;
}

export function ProjectModal({
  project,
  initialVideoIndex = 0,
  onClose,
  onStep,
  onBookProject,
}: ProjectModalProps) {
  const [selectedClipIdx, setSelectedClipIdx] = useState(initialVideoIndex);
  const [localMedia, setLocalMedia] = useState<{
    url: string;
    kind: 'video' | 'image';
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedClipIdx(initialVideoIndex);
    setLocalMedia((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, [project?.id, initialVideoIndex]);

  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep('next');
      if (e.key === 'ArrowLeft') onStep('prev');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose, onStep]);

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalMedia((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return {
        url: objectUrl,
        kind: isVideo ? 'video' : 'image',
        name: file.name,
      };
    });
  };

  if (!project) return null;

  const activeClip = project.videos[selectedClipIdx] ?? project.videos[0] ?? null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/88"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0b0b12] border border-white/15 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 sm:px-7 py-4 bg-[#0b0b12]/96 border-b border-white/10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono-tabular text-zinc-400">
              <span style={{ color: project.accentHex }}>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.deliverableType}</span>
              <span aria-hidden="true">·</span>
              <span>{activeClip ? activeClip.duration : project.duration}</span>
            </div>
            <h3
              id="project-modal-title"
              className="mt-1 font-display text-lg sm:text-2xl font-bold text-white truncate"
            >
              {activeClip ? `${project.title} — ${activeClip.title}` : `${project.title} — ${project.subtitle}`}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onStep('prev')}
              aria-label="Previous project"
              className="w-9 h-9 rounded-lg border border-white/15 bg-[#12121d] text-zinc-200 hover:text-white hover:border-white/35 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onStep('next')}
              aria-label="Next project"
              className="w-9 h-9 rounded-lg border border-white/15 bg-[#12121d] text-zinc-200 hover:text-white hover:border-white/35 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project preview"
              className="w-9 h-9 rounded-lg border border-white/15 bg-[#12121d] text-zinc-200 hover:text-white hover:border-rose-500/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real Cinema Video Player + Optional Local Original Media Previewer */}
        <div className="p-5 sm:p-7 space-y-6">
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/12 bg-black">
            {localMedia ? (
              localMedia.kind === 'video' ? (
                <video
                  src={localMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <img
                  src={localMedia.url}
                  alt={localMedia.name}
                  className="w-full h-full object-contain bg-black"
                />
              )
            ) : activeClip ? (
              <video
                key={activeClip.videoUrl}
                src={activeClip.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <Category3DStage style={project.visualStyle} compact={false} />
            )}
          </div>

          {/* Clip Switcher + Local Test Preview Action */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {project.videos.length > 0 ? (
                project.videos.map((clip, idx) => {
                  const isSelected = !localMedia && idx === selectedClipIdx;
                  return (
                    <button
                      key={clip.id}
                      type="button"
                      onClick={() => {
                        setLocalMedia(null);
                        setSelectedClipIdx(idx);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-rose-600/20 border-rose-500/60 text-white'
                          : 'bg-[#11111b] border-white/12 text-zinc-300 hover:text-white hover:border-white/30'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5 text-rose-400" />
                      <span>
                        0{idx + 1} · {clip.title}
                      </span>
                    </button>
                  );
                })
              ) : (
                <span className="text-xs font-mono-tabular text-zinc-400">
                  No videos added in {project.category} yet — upload a local edit to preview.
                </span>
              )}
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,image/*"
                onChange={handleLocalFileChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1222] border border-white/18 hover:border-purple-400/70 text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-purple-300" />
                <span>{localMedia ? `Playing: ${localMedia.name}` : 'Preview Another Local File'}</span>
              </button>
            </div>
          </div>

          {/* Description + Multi-Track Timeline Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400">
                  Editing Approach
                </h4>
                <p className="mt-2 text-sm sm:text-base text-zinc-200 leading-relaxed">
                  {activeClip ? activeClip.notes : project.summary}
                </p>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{project.summary}</p>
              </div>

              <div className="divide-y divide-white/10 border-y border-white/10">
                {project.breakdown.map((item) => (
                  <div
                    key={item.label}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                  >
                    <span className="text-xs font-semibold text-white">{item.label}</span>
                    <span className="text-xs text-zinc-400">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Editing Timeline Visualization */}
            <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-xl bg-[#0e0e18] border border-white/10">
              <div>
                <div className="flex items-center justify-between gap-3 text-[11px] font-mono-tabular text-zinc-400 mb-3 whitespace-nowrap">
                  <span className="shrink-0">NLE TIMELINE</span>
                  <span className="truncate">{project.frameSpec}</span>
                </div>
                <div className="space-y-3">
                  {project.timelineTracks.map((track) => (
                    <div key={track.name}>
                      <div className="text-[11px] font-mono-tabular text-zinc-300 mb-1">
                        {track.name}
                      </div>
                      <div className="relative h-5 rounded bg-white/5 overflow-hidden">
                        {track.segments.map(([start, end], sIdx) => (
                          <div
                            key={sIdx}
                            style={{
                              left: `${start}%`,
                              width: `${end - start}%`,
                              backgroundColor: track.color,
                            }}
                            className="absolute inset-y-0.5 rounded-sm opacity-85"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3">
                <div className="text-xs text-zinc-400 font-mono-tabular">
                  {project.tools.join(' · ')}
                </div>
                <button
                  type="button"
                  onClick={() => onBookProject(project.title)}
                  className="w-full py-2.5 px-4 text-xs font-semibold tracking-wider uppercase text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
                >
                  Request {project.title}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
