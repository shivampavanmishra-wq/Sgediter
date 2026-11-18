import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  ExternalLink,
  IndianRupee,
  Maximize2,
  MessageCircle,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  BRAND_PROFILE,
  PORTFOLIO_PROJECTS,
  PRICE_LIST,
  buildUpiAppUrls,
  buildWhatsAppUrl,
  clampTilt,
  validatePaymentAmount,
} from '../utils/portfolioLogic';

interface PaymentSectionProps {
  preselectedService?: string;
  preselectedAmount?: number;
}

function GooglePayMark() {
  return (
    <svg
      viewBox="0 0 48 24"
      className="w-12 h-6 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M19.2 12.2c0-.7-.1-1.4-.2-2H10v3.8h5.2c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 2.8-4.3 2.8-7.3Z"
        fill="#4285F4"
      />
      <path
        d="M10 21.5c2.6 0 4.8-.9 6.4-2.3l-3.2-2.5c-.9.6-2 .9-3.2.9-2.5 0-4.6-1.7-5.3-3.9H1.4v2.6c1.6 3.2 4.9 5.2 8.6 5.2Z"
        fill="#34A853"
      />
      <path
        d="M4.7 13.7c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.5H1.4C.5 9.2 0 11.1 0 13s.5 3.8 1.4 5.5l3.3-2.6Z"
        fill="#FBBC05"
      />
      <path
        d="M10 6.2c1.4 0 2.7.5 3.7 1.4l2.8-2.8C14.8 3.2 12.6 2.3 10 2.3c-3.7 0-7 2-8.6 5.2l3.3 2.6c.7-2.2 2.8-3.9 5.3-3.9Z"
        fill="#EA4335"
      />
      <text
        x="22"
        y="16.2"
        fill="#F4F4F5"
        fontSize="11.5"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

async function copyTextSafe(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall through to legacy textarea fallback
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function PaymentSection({
  preselectedService,
  preselectedAmount,
}: PaymentSectionProps) {
  const [amountInput, setAmountInput] = useState(
    preselectedAmount ? String(preselectedAmount) : ''
  );
  const [noteInput, setNoteInput] = useState(preselectedService || '');
  const [amountError, setAmountError] = useState<string | null>(null);
  const [upiLaunchedInfo, setUpiLaunchedInfo] = useState<{
    amount: number;
    urls: ReturnType<typeof buildUpiAppUrls>;
  } | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 30, active: false });

  useEffect(() => {
    if (preselectedService) {
      setNoteInput(preselectedService);
    }
  }, [preselectedService]);

  useEffect(() => {
    if (typeof preselectedAmount === 'number' && preselectedAmount > 0) {
      setAmountInput(String(preselectedAmount));
      setAmountError(null);
    }
  }, [preselectedAmount]);

  useEffect(() => {
    if (!scanModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setScanModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [scanModalOpen]);

  const handleCopyUpi = async () => {
    const ok = await copyTextSafe(BRAND_PROFILE.upiId);
    if (ok) {
      setCopiedUpi(true);
      window.setTimeout(() => setCopiedUpi(false), 2400);
    }
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePaymentAmount(amountInput);
    if (!validation.valid || validation.amount === undefined) {
      setAmountError(validation.error || 'Please enter a valid amount.');
      setUpiLaunchedInfo(null);
      return;
    }

    setAmountError(null);
    const urls = buildUpiAppUrls({
      pa: BRAND_PROFILE.upiId,
      pn: BRAND_PROFILE.upiPayeeName,
      am: validation.amount,
      tn: noteInput || 'SG EDITER Studio Service',
    });

    setUpiLaunchedInfo({ amount: validation.amount, urls });

    // Use top-level navigation when possible so iframe / WebView containers
    // don't silently drop custom `upi://` intent schemes.
    try {
      const targetWindow = window.top && window.top !== window ? window.top : window;
      targetWindow.location.href = urls.upi;
    } catch {
      window.location.href = urls.upi;
    }
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt(clampTilt(nx, ny, 4.5));
    setSpotlight({ x: px, y: py, active: true });
  };

  const handleCardPointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  const parsedPreview = validatePaymentAmount(amountInput);

  return (
    <section
      id="payment"
      className="relative overflow-hidden py-24 sm:py-32 bg-[radial-gradient(ellipse_at_bottom,#0a122a_0%,#050711_52%,#040508_100%)] border-t border-white/10"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-hairline-grid opacity-75" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 w-[420px] h-[420px] rounded-full bg-blue-600/16 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/16 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-blue-400">
            Studio Payments
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight metallic-title text-balance">
            GOOGLE PAY &amp; UPI CHECKOUT
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            Scan the official Google Pay QR code directly or enter your project amount to launch
            any UPI app on mobile.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Interactive 3D Glassmorphism Scannable QR Display */}
          <div className="lg:col-span-5 flex">
            <div
              onPointerMove={handleCardPointerMove}
              onPointerLeave={handleCardPointerLeave}
              style={{
                transform: `perspective(1100px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                transition: spotlight.active
                  ? 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative w-full rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/60 via-purple-500/45 to-rose-500/55 shadow-[0_24px_60px_-20px_rgba(59,130,246,0.45)]"
            >
              <div className="relative h-full rounded-[15px] bg-gradient-to-br from-[#0e152d]/95 via-[#070b18]/97 to-[#05060d]/98 p-6 sm:p-7 flex flex-col items-center justify-between overflow-hidden">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 transition-opacity duration-200"
                  style={{
                    opacity: spotlight.active ? 1 : 0,
                    background: `radial-gradient(280px circle at ${spotlight.x}% ${spotlight.y}%, rgba(59,130,246,0.16), transparent 72%)`,
                  }}
                />

                {/* Google Pay Branding Header */}
                <div className="relative z-10 w-full flex items-center justify-between gap-4 pb-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <GooglePayMark />
                    <div>
                      <div className="text-sm font-semibold text-white">Google Pay / UPI</div>
                      <div className="text-xs text-zinc-400">{BRAND_PROFILE.upiPayeeName}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScanModalOpen(true)}
                    aria-label="Enlarge QR code for scanning"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d142a] border border-white/15 hover:border-blue-400/60 text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Scan &amp; Pay</span>
                  </button>
                </div>

                {/* Exact Unmodified Scannable Uploaded QR Code */}
                <div className="relative z-10 my-5 w-full flex flex-col items-center">
                  <img
                    src={BRAND_PROFILE.upiQrImage}
                    alt={`Google Pay UPI QR Code for ${BRAND_PROFILE.upiId}`}
                    className="block w-full max-w-[240px] sm:max-w-[260px] h-auto object-contain rounded-xl shadow-2xl shadow-black/70"
                  />
                </div>

                <div className="relative z-10 w-full pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>Scan with any UPI app</span>
                  </span>
                  <a
                    href={BRAND_PROFILE.upiQrImage}
                    download="SG-EDITER-GPay-QR.png"
                    data-testid="download-qr-btn"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0d142a] border border-white/15 hover:border-blue-400/60 text-[11px] font-medium text-zinc-200 hover:text-white transition-colors"
                  >
                    <Download className="w-3 h-3 text-blue-400" />
                    <span>Save QR</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Glassmorphism UPI Checkout Card */}
          <div className="lg:col-span-7 flex">
            <div className="relative w-full rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/45 via-blue-500/35 to-rose-500/45 shadow-[0_24px_60px_-20px_rgba(139,92,246,0.35)]">
              <div className="relative h-full rounded-[15px] bg-gradient-to-br from-[#0c1228]/95 via-[#070b18]/97 to-[#05060d]/98 p-6 sm:p-8 flex flex-col justify-between">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                        Direct UPI Transfer
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                        Payment Method: Google Pay / UPI
                      </p>
                    </div>
                    <GooglePayMark />
                  </div>

                  {/* UPI ID Display + Copy UPI ID Button */}
                  <div className="mt-6 p-4 rounded-xl bg-[#060916] border border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                        Verified UPI ID
                      </div>
                      <div
                        data-testid="upi-id-value"
                        className="mt-1 font-mono-tabular text-sm sm:text-base font-semibold text-white break-all"
                      >
                        {BRAND_PROFILE.upiId}
                      </div>
                    </div>

                    <button
                      type="button"
                      data-testid="copy-upi-btn"
                      onClick={handleCopyUpi}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#0f1733] border border-blue-400/35 hover:border-blue-400/80 text-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">UPI ID Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-blue-400" />
                          <span>Copy UPI ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Payment Amount Form */}
                  <form onSubmit={handlePayNow} noValidate className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="upi-amount"
                          className="block text-xs font-medium text-zinc-300 mb-1.5"
                        >
                          Payment Amount (INR)
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-zinc-400">
                            <IndianRupee className="w-4 h-4" />
                          </span>
                          <input
                            id="upi-amount"
                            type="number"
                            inputMode="decimal"
                            min="1"
                            step="any"
                            value={amountInput}
                            onChange={(e) => {
                              setAmountInput(e.target.value);
                              if (amountError) setAmountError(null);
                            }}
                            placeholder="Enter amount (e.g. 500)"
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm font-mono-tabular text-white bg-[#050814] border border-white/15 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                          />
                        </div>
                        {amountError && (
                          <p role="alert" className="mt-1.5 text-xs text-rose-400">
                            {amountError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="upi-note"
                          className="block text-xs font-medium text-zinc-300 mb-1.5"
                        >
                          Editing Reference (Optional)
                        </label>
                        <select
                          id="upi-note"
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm text-white bg-[#050814] border border-white/15 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
                        >
                          <option value="">General Studio Payment</option>
                          {PRICE_LIST.map((pkg) => (
                            <option key={pkg.id} value={pkg.fullTitle}>
                              {pkg.fullTitle} (₹{pkg.priceInr})
                            </option>
                          ))}
                          {PORTFOLIO_PROJECTS.map((project) => (
                            <option key={project.id} value={project.title}>
                              {project.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {typeof preselectedAmount === 'number' && preselectedAmount > 0 && (
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                        <span className="text-zinc-400">Quick select (50% advance rule):</span>
                        <button
                          type="button"
                          data-testid="pay-half-advance-btn"
                          onClick={() => {
                            setAmountInput(String(Math.ceil(preselectedAmount / 2)));
                            setAmountError(null);
                          }}
                          className="px-2.5 py-1 rounded-md bg-[#0d142b] border border-amber-400/35 hover:border-amber-400 text-amber-200 hover:text-white transition-colors cursor-pointer"
                        >
                          50% Advance (₹{Math.ceil(preselectedAmount / 2)})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAmountInput(String(preselectedAmount));
                            setAmountError(null);
                          }}
                          className="px-2.5 py-1 rounded-md bg-[#0d142b] border border-white/15 hover:border-blue-400/60 text-zinc-200 hover:text-white transition-colors cursor-pointer"
                        >
                          Full (₹{preselectedAmount})
                        </button>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        data-testid="pay-now-btn"
                        className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 hover:from-blue-500 hover:via-purple-500 hover:to-rose-500 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-blue-950/50 focus-visible:outline-2 focus-visible:outline-blue-400"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>
                          {parsedPreview.valid && parsedPreview.amount
                            ? `Pay ₹${parsedPreview.amount} Now`
                            : 'Pay Now'}
                        </span>
                      </button>

                      <button
                        type="button"
                        data-testid="scan-pay-btn"
                        onClick={() => setScanModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold tracking-wider uppercase text-zinc-100 bg-[#0d142b] border border-white/15 hover:border-blue-400/70 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400"
                      >
                        <QrCode className="w-3.5 h-3.5 text-blue-400" />
                        <span>Scan &amp; Pay</span>
                      </button>

                      <a
                        href={BRAND_PROFILE.upiQrImage}
                        download="SG-EDITER-GPay-QR.png"
                        className="inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold tracking-wider uppercase text-zinc-100 bg-[#0d142b] border border-white/15 hover:border-emerald-400/70 rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Save QR</span>
                      </a>
                    </div>

                    {upiLaunchedInfo && (
                      <div
                        role="status"
                        data-testid="upi-launch-notice"
                        className="mt-3 p-4 rounded-xl bg-blue-500/12 border border-blue-400/35 text-xs text-zinc-200 leading-relaxed space-y-3"
                      >
                        <div>
                          UPI request ready for{' '}
                          <span className="font-mono-tabular font-semibold text-white">
                            ₹{upiLaunchedInfo.amount.toFixed(2)}
                          </span>{' '}
                          to{' '}
                          <span className="font-mono-tabular text-blue-300">
                            {BRAND_PROFILE.upiId}
                          </span>
                          . Tap your app below:
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={upiLaunchedInfo.urls.gpay}
                            target="_top"
                            data-testid="upi-link-gpay"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d152c] border border-blue-400/40 hover:border-blue-300 text-xs font-semibold text-white transition-colors"
                          >
                            <span>Google Pay</span>
                          </a>
                          <a
                            href={upiLaunchedInfo.urls.phonepe}
                            target="_top"
                            data-testid="upi-link-phonepe"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d152c] border border-purple-400/40 hover:border-purple-300 text-xs font-semibold text-white transition-colors"
                          >
                            <span>PhonePe</span>
                          </a>
                          <a
                            href={upiLaunchedInfo.urls.paytm}
                            target="_top"
                            data-testid="upi-link-paytm"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d152c] border border-sky-400/40 hover:border-sky-300 text-xs font-semibold text-white transition-colors"
                          >
                            <span>Paytm</span>
                          </a>
                          <a
                            href={upiLaunchedInfo.urls.upi}
                            target="_top"
                            data-testid="upi-link-any"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d152c] border border-white/25 hover:border-white text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
                          >
                            <span>Any UPI App</span>
                          </a>
                        </div>

                        <div className="pt-2.5 border-t border-white/10 flex items-start gap-2 text-[11.5px] text-amber-200/95">
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="space-y-2">
                            <p>
                              <strong>App link blocked / payment declined?</strong> Personal UPI IDs
                              sometimes block direct web links under NPCI rules (or on Desktop /
                              Instagram browser). Instead: <strong>Save QR</strong> &amp; scan from
                              Gallery in GPay/PhonePe, or <strong>Copy UPI ID</strong> and pay
                              directly.
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={handleCopyUpi}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1022] border border-white/15 hover:border-blue-400/60 text-xs font-medium text-white cursor-pointer"
                              >
                                <Copy className="w-3 h-3 text-blue-400" />
                                <span>{copiedUpi ? 'Copied!' : 'Copy UPI ID'}</span>
                              </button>
                              <a
                                href={buildWhatsAppUrl(
                                  BRAND_PROFILE.whatsappDigits,
                                  `Hi SG EDITER, I paid ₹${upiLaunchedInfo.amount.toFixed(0)} via UPI (${noteInput || 'Edit Booking'}). Sharing screenshot.`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-400/45 hover:border-emerald-300 text-xs font-medium text-emerald-200 hover:text-white"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Send Screenshot on WhatsApp</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Works with Google Pay, PhonePe, Paytm &amp; BHIM UPI</span>
                  </span>
                  <span className="font-mono-tabular">{BRAND_PROFILE.tagline}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High-Contrast Scannable QR Lightbox Modal */}
      {scanModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="scan-pay-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setScanModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-[#0b0f1e] border border-white/15 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <GooglePayMark />
                <h3 id="scan-pay-modal-title" className="font-display text-lg font-bold text-white">
                  Scan &amp; Pay via UPI
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setScanModalOpen(false)}
                aria-label="Close Scan and Pay QR modal"
                className="w-9 h-9 rounded-lg border border-white/15 bg-[#121830] text-zinc-200 hover:text-white hover:border-rose-500/60 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 flex flex-col items-center">
              <img
                src={BRAND_PROFILE.upiQrImage}
                alt={`Google Pay UPI QR Code for ${BRAND_PROFILE.upiId}`}
                className="block w-full max-w-[320px] h-auto object-contain rounded-xl"
              />

              <div className="mt-4 w-full p-3 rounded-xl bg-[#060916] border border-white/12 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] text-zinc-400">UPI ID</div>
                  <div className="font-mono-tabular text-xs sm:text-sm font-semibold text-white truncate">
                    {BRAND_PROFILE.upiId}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#111936] border border-blue-400/35 hover:border-blue-400/80 text-zinc-100 whitespace-nowrap cursor-pointer"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-blue-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <a
                    href={BRAND_PROFILE.upiQrImage}
                    download="SG-EDITER-GPay-QR.png"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#111936] border border-emerald-400/35 hover:border-emerald-400/80 text-emerald-200 hover:text-white whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save QR</span>
                  </a>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-zinc-400 text-center">
                On the same phone? Tap <strong className="text-zinc-200">Save QR</strong> and select{' '}
                <strong className="text-zinc-200">Upload from Gallery</strong> inside Google Pay,
                PhonePe, or Paytm.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
