import {
  Clapperboard,
  Film,
  Flame,
  Heart,
  IndianRupee,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  BRAND_PROFILE,
  PRICE_CATEGORIES,
  PRICE_TERMS,
  buildWhatsAppUrl,
  type PriceAccent,
  type PriceCategory,
  type PricePackage,
} from '../utils/portfolioLogic';

interface PricingSectionProps {
  onPayPackage: (pkg: PricePackage) => void;
  onBookPackage: (pkg: PricePackage) => void;
}

const CATEGORY_STYLES: Record<
  PriceAccent,
  {
    ring: string;
    border: string;
    iconBox: string;
    priceText: string;
    rowHover: string;
    payBtn: string;
  }
> = {
  violet: {
    ring: 'bg-gradient-to-br from-violet-500/50 via-purple-500/20 to-fuchsia-500/35',
    border: 'border-white/12 hover:border-violet-400/50',
    iconBox: 'bg-violet-500/15 border-violet-400/35 text-violet-300',
    priceText: 'text-violet-300',
    rowHover: 'hover:bg-violet-500/8 hover:border-violet-400/35',
    payBtn: 'bg-violet-600/25 hover:bg-violet-600 border-violet-400/40 text-violet-100 hover:text-white',
  },
  crimson: {
    ring: 'bg-gradient-to-br from-rose-500/55 via-red-500/25 to-orange-500/35',
    border: 'border-white/12 hover:border-rose-400/50',
    iconBox: 'bg-rose-500/15 border-rose-400/35 text-rose-300',
    priceText: 'text-rose-300',
    rowHover: 'hover:bg-rose-500/8 hover:border-rose-400/35',
    payBtn: 'bg-rose-600/25 hover:bg-rose-600 border-rose-400/40 text-rose-100 hover:text-white',
  },
  electric: {
    ring: 'bg-gradient-to-br from-blue-500/50 via-sky-500/20 to-cyan-500/35',
    border: 'border-white/12 hover:border-blue-400/50',
    iconBox: 'bg-blue-500/15 border-blue-400/35 text-blue-300',
    priceText: 'text-blue-300',
    rowHover: 'hover:bg-blue-500/8 hover:border-blue-400/35',
    payBtn: 'bg-blue-600/25 hover:bg-blue-600 border-blue-400/40 text-blue-100 hover:text-white',
  },
  amber: {
    ring: 'bg-gradient-to-br from-amber-500/50 via-orange-500/20 to-rose-500/35',
    border: 'border-white/12 hover:border-amber-400/50',
    iconBox: 'bg-amber-500/15 border-amber-400/35 text-amber-300',
    priceText: 'text-amber-300',
    rowHover: 'hover:bg-amber-500/8 hover:border-amber-400/35',
    payBtn: 'bg-amber-600/25 hover:bg-amber-600 border-amber-400/40 text-amber-100 hover:text-white',
  },
};

function CategoryIcon({ id }: { id: PriceCategory['id'] }) {
  switch (id) {
    case 'typography-editing':
      return <Sparkles className="w-5 h-5" />;
    case 'anime-editing':
      return <Flame className="w-5 h-5" />;
    case 'reels-editing':
      return <Film className="w-5 h-5" />;
    default:
      return <Zap className="w-5 h-5" />;
  }
}

export function PricingSection({ onPayPackage, onBookPackage }: PricingSectionProps) {
  const buildPkg = (
    category: PriceCategory,
    item: PriceCategory['items'][number]
  ): PricePackage => ({
    id: item.id,
    categoryId: category.id,
    categoryTitle: category.title,
    title: item.title,
    fullTitle: `${category.title} — ${item.title}`,
    serviceType: category.serviceType,
    priceInr: item.priceInr,
    accent: category.accent,
  });

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-24 sm:py-32 bg-[#050508] border-t border-white/10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/3 w-[440px] h-[360px] rounded-full bg-violet-600/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/4 w-[400px] h-[360px] rounded-full bg-rose-600/10 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-rose-400 inline-flex items-center gap-2">
              <Clapperboard className="w-3.5 h-3.5" />
              <span>{BRAND_PROFILE.name}</span>
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight metallic-title text-balance">
              VIDEO EDITING PRICE LIST
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
              Typography, Anime, Reels, aur Special Editing ke clear rates. Kisi bhi plan par
              click karke direct UPI payment karein ya brief bhejein.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0d0f1c] border border-white/12 text-xs font-mono-tabular text-zinc-300 self-start md:self-auto shrink-0">
            <span>50% Advance · Custom Quotes Open</span>
          </div>
        </div>

        {/* 2x2 Category Grid matching SG EDITER's 4 official editing categories */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7">
          {PRICE_CATEGORIES.map((category) => {
            const style = CATEGORY_STYLES[category.accent];
            return (
              <article
                key={category.id}
                data-testid={`price-category-${category.id}`}
                className={`relative rounded-2xl p-[1px] ${style.ring}`}
              >
                <div
                  className={`relative h-full rounded-[15px] bg-gradient-to-br from-[#0e1224]/96 via-[#080a14]/98 to-[#05060b]/98 p-5 sm:p-7 border ${style.border} flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${style.iconBox}`}
                        >
                          <CategoryIcon id={category.id} />
                        </div>
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                            {category.emoji} {category.title}
                          </h3>
                          <p className="mt-0.5 text-xs sm:text-sm text-zinc-400">
                            {category.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-2.5">
                      {category.items.map((item) => {
                        const pkg = buildPkg(category, item);
                        return (
                          <li
                            key={item.id}
                            data-testid={`price-item-${item.id}`}
                            className={`p-3 sm:px-4 rounded-xl bg-[#090c18]/90 border border-white/8 transition-colors flex flex-wrap items-center justify-between gap-3 ${style.rowHover}`}
                          >
                            <div className="min-w-0">
                              <div className="text-sm sm:text-base font-semibold text-zinc-100">
                                {item.title}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto">
                              <span
                                className={`inline-flex items-center gap-0.5 font-display font-mono-tabular text-base sm:text-lg font-bold ${style.priceText} mr-1`}
                              >
                                <IndianRupee className="w-3.5 h-3.5" />
                                <span>{item.priceInr}</span>
                              </span>

                              <button
                                type="button"
                                data-testid={`price-pay-${item.id}`}
                                onClick={() => onPayPackage(pkg)}
                                className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${style.payBtn}`}
                              >
                                Pay ₹{item.priceInr}
                              </button>

                              <button
                                type="button"
                                data-testid={`price-book-${item.id}`}
                                onClick={() => onBookPackage(pkg)}
                                aria-label={`Book ${category.title} ${item.title}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0d1122] border border-white/15 hover:border-white/40 text-[11px] font-semibold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>Book</span>
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Terms & Conditions + Thank You Banner */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div
            data-testid="pricing-terms"
            className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#0a0c16] border border-white/12"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Terms &amp; Conditions</span>
            </div>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRICE_TERMS.map((term) => (
                <li
                  key={term}
                  className="flex items-start gap-2 text-xs sm:text-sm text-zinc-200"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#120d22] via-[#0a0d1a] to-[#080a12] border border-rose-500/25 flex flex-col justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
                <span>Thank You For Choosing SG EDITER!</span>
              </p>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Custom edit ya complexity confirmation ke liye payment se pehle WhatsApp{' '}
                <span className="text-white font-medium">{BRAND_PROFILE.whatsappNumber}</span> ya
                Telegram <span className="text-white font-medium">{BRAND_PROFILE.telegramHandle}</span>{' '}
                par message karein.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={buildWhatsAppUrl(
                  BRAND_PROFILE.whatsappDigits,
                  'Hi SG EDITER, I saw your Video Editing Price List and want to book an edit.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-400/45 hover:border-emerald-400 text-xs font-semibold uppercase tracking-wider text-emerald-300 hover:text-white transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Quote</span>
              </a>
              <a
                href={BRAND_PROFILE.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d142b] border border-sky-400/35 hover:border-sky-400/80 text-xs font-semibold uppercase tracking-wider text-sky-300 hover:text-white transition-colors whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                <span>DM {BRAND_PROFILE.telegramHandle}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
