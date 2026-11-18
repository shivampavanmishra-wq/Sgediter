import { Instagram, Mail, MessageCircle, Send } from 'lucide-react';
import { BRAND_PROFILE, buildMailtoUrl, buildWhatsAppUrl } from '../utils/portfolioLogic';

export function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  const mailHref = buildMailtoUrl(
    BRAND_PROFILE.email,
    'Project Inquiry — SG EDITER',
    'Hi SG EDITER,\n\nI would like to collaborate on:'
  );
  const whatsappHref = buildWhatsAppUrl(
    BRAND_PROFILE.whatsappDigits,
    'Hi SG EDITER, I want to discuss an edit.'
  );

  return (
    <footer className="bg-[#040407] border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('hero');
          }}
          className="flex flex-col items-center md:items-start focus-visible:outline-2 focus-visible:outline-rose-400 rounded-lg"
        >
          <img
            src={BRAND_PROFILE.logoUrl}
            alt={BRAND_PROFILE.name}
            className="h-16 w-auto object-contain -my-2 drop-shadow-[0_4px_14px_rgba(245,158,11,0.3)]"
          />
          <div className="mt-1.5 text-xs font-mono-tabular tracking-[0.2em] text-zinc-400">
            {BRAND_PROFILE.tagline}
          </div>
        </a>

        <div
          aria-label="Contact links"
          className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4"
        >
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0b0b12] border border-white/10 hover:border-emerald-400/50 text-xs text-zinc-200 hover:text-white transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{BRAND_PROFILE.whatsappNumber}</span>
          </a>

          <a
            href={BRAND_PROFILE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0b0b12] border border-white/10 hover:border-fuchsia-400/50 text-xs text-zinc-200 hover:text-white transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
            <span>{BRAND_PROFILE.instagramHandle}</span>
          </a>

          <a
            href={BRAND_PROFILE.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0b0b12] border border-white/10 hover:border-sky-400/50 text-xs text-zinc-200 hover:text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>TG: {BRAND_PROFILE.telegramHandle}</span>
          </a>

          <a
            href={mailHref}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0b0b12] border border-white/10 hover:border-indigo-400/50 text-xs text-zinc-200 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{BRAND_PROFILE.email}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
