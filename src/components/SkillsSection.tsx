import { useState } from 'react';
import { Film, Sparkles, Type } from 'lucide-react';
import { SKILLS_LIST, type SkillMetric } from '../utils/portfolioLogic';

const ACCENT_STYLES: Record<
  SkillMetric['accent'],
  { iconBg: string; text: string; border: string }
> = {
  crimson: {
    iconBg: 'bg-rose-500/12 border-rose-500/25 text-rose-400',
    text: 'text-rose-400',
    border: 'hover:border-rose-500/45',
  },
  violet: {
    iconBg: 'bg-violet-500/12 border-violet-500/25 text-violet-400',
    text: 'text-violet-400',
    border: 'hover:border-violet-500/45',
  },
  electric: {
    iconBg: 'bg-blue-500/12 border-blue-500/25 text-blue-400',
    text: 'text-blue-400',
    border: 'hover:border-blue-500/45',
  },
};

function SkillIcon({ id }: { id: string }) {
  if (id === 'typography') return <Type className="w-5 h-5" />;
  if (id === 'normal-reel') return <Film className="w-5 h-5" />;
  return <Sparkles className="w-5 h-5" />;
}

export function SkillsSection() {
  const [activeSkillId, setActiveSkillId] = useState<string>(SKILLS_LIST[0].id);

  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32 bg-[#07070c] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-blue-400">
            Editing Services
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
            STUDIO CAPABILITIES
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            Focused editing styles built around clean beat sync, sharp typography, and balanced
            color grading.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {SKILLS_LIST.map((skill) => {
            const style = ACCENT_STYLES[skill.accent];
            const isSelected = activeSkillId === skill.id;
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => setActiveSkillId(skill.id)}
                className={`skill-card-item text-left p-6 rounded-2xl bg-[#0c0c14] border transition-all duration-200 flex flex-col justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400 ${
                  isSelected ? 'border-white/30 bg-[#10101c]' : `border-white/10 ${style.border}`
                }`}
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-lg border shrink-0 ${style.iconBg}`}>
                      <SkillIcon id={skill.id} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {skill.name}
                    </h3>
                  </div>

                  <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                    {skill.specialty}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/8 text-xs font-mono-tabular text-zinc-400">
                  {skill.tools}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
