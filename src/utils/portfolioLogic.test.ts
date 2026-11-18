import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BRAND_PROFILE,
  PORTFOLIO_PROJECTS,
  PRICE_CATEGORIES,
  PRICE_LIST,
  PRICE_TERMS,
  SERVICE_OPTIONS,
  SKILLS_LIST,
  filterProjects,
  getAdjacentProjectId,
  clampTilt,
  computeIntroPhase,
  validateInquiryForm,
  validatePaymentAmount,
  buildTelegramUrl,
  buildWhatsAppUrl,
  buildMailtoUrl,
  buildUpiAppUrls,
  buildUpiPaymentUrl,
} from './portfolioLogic';

test('filterProjects returns only Anime Editing projects with real AMV videos', () => {
  const all = filterProjects(PORTFOLIO_PROJECTS, 'All');
  assert.equal(all.length, 6);

  const anime = filterProjects(PORTFOLIO_PROJECTS, 'Anime Editing');
  assert.equal(anime.length, 6);
  let hasExtendedCut = false;
  for (const proj of anime) {
    assert.equal(proj.category, 'Anime Editing');
    assert.equal(proj.videos.length, 1);
    assert.ok(proj.videos[0].videoUrl.startsWith('/assets/aistudio/'));
    assert.ok(proj.videos[0].videoUrl.endsWith('.mp4'));
    const [mins, secs] = proj.duration.split(':').map(Number);
    if (mins * 60 + secs >= 30) {
      hasExtendedCut = true;
    }
  }
  assert.equal(hasExtendedCut, true);
});

test('getAdjacentProjectId wraps cleanly in both directions', () => {
  const firstId = PORTFOLIO_PROJECTS[0].id;
  const lastId = PORTFOLIO_PROJECTS[PORTFOLIO_PROJECTS.length - 1].id;

  assert.equal(getAdjacentProjectId(PORTFOLIO_PROJECTS, lastId, 'next'), firstId);
  assert.equal(getAdjacentProjectId(PORTFOLIO_PROJECTS, firstId, 'prev'), lastId);
  assert.equal(getAdjacentProjectId([], firstId, 'next'), null);
});

test('clampTilt bounds normalized pointer offsets within maxDeg', () => {
  const neutral = clampTilt(0, 0, 12);
  assert.deepEqual(neutral, { rotateX: 0, rotateY: 0 });

  const clamped = clampTilt(5, -4, 10);
  assert.deepEqual(clamped, { rotateX: 10, rotateY: 10 });
});

test('computeIntroPhase progresses through all cinematic intro stages under 2 seconds', () => {
  assert.equal(computeIntroPhase(0).phase, 'void');
  assert.equal(computeIntroPhase(0.25).phase, 'particles');
  assert.equal(computeIntroPhase(0.55).phase, 'emerge');
  assert.equal(computeIntroPhase(0.9).phase, 'title');
  assert.equal(computeIntroPhase(1.3).phase, 'tagline');
  assert.equal(computeIntroPhase(1.7).phase, 'complete');
  assert.equal(computeIntroPhase(1.7).progress, 100);
});

test('validateInquiryForm rejects invalid inputs and accepts complete brief', () => {
  const invalid = validateInquiryForm({
    name: 'A',
    email: 'not-an-email',
    service: '',
    message: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.service);
  assert.ok(invalid.errors.message);

  const valid = validateInquiryForm({
    name: 'Kaito Studio',
    email: 'kaito@example.com',
    service: 'Anime Edits',
    message: 'Looking for a smooth 1080p 30fps anime action edit with clean beat transitions.',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('URL builders and BRAND_PROFILE encode Telegram and mailto safely with empty YouTube', () => {
  const tgDirect = buildTelegramUrl('https://t.me/sgediter');
  assert.equal(tgDirect, 'https://t.me/sgediter');

  const tgBrief = buildTelegramUrl('https://t.me/sgediter', 'Hi SG EDITER');
  assert.equal(tgBrief, 'https://t.me/sgediter?text=Hi%20SG%20EDITER');

  const mail = buildMailtoUrl('shivampavanmishra@gmail.com', 'Anime Edit', 'Project details');
  assert.equal(
    mail,
    'mailto:shivampavanmishra@gmail.com?subject=Anime%20Edit&body=Project%20details'
  );

  assert.equal(BRAND_PROFILE.youtubeUrl, '');
  assert.equal(BRAND_PROFILE.youtubeHandle, '');
  assert.equal(
    BRAND_PROFILE.instagramUrl,
    'https://www.instagram.com/__shivam__00013'
  );
  assert.equal(BRAND_PROFILE.telegramUrl, 'https://t.me/sgediter');
  assert.equal(BRAND_PROFILE.email, 'shivampavanmishra@gmail.com');
  assert.equal(BRAND_PROFILE.upiId, 'shivampavanmishra64@okicici');
  assert.equal(BRAND_PROFILE.upiQrImage, '/assets/aistudio/GooglePay_QR_7954109c.png');
  assert.equal(BRAND_PROFILE.whatsappNumber, '+91 72111 67583');
  assert.equal(BRAND_PROFILE.whatsappDigits, '917211167583');
  assert.equal(BRAND_PROFILE.whatsappUrl, 'https://wa.me/917211167583');
  assert.equal(buildWhatsAppUrl(BRAND_PROFILE.whatsappDigits), 'https://wa.me/917211167583');
  assert.equal(
    buildWhatsAppUrl(BRAND_PROFILE.whatsappDigits, 'Hi SG EDITER'),
    'https://wa.me/917211167583?text=Hi%20SG%20EDITER'
  );
});

test('validatePaymentAmount and buildUpiPaymentUrl validate INR amounts and build NPCI deep links', () => {
  assert.equal(validatePaymentAmount('').valid, false);
  assert.equal(validatePaymentAmount('0').valid, false);
  assert.equal(validatePaymentAmount('-250').valid, false);
  assert.equal(validatePaymentAmount('100001').valid, false);

  const valid = validatePaymentAmount('499.5');
  assert.equal(valid.valid, true);
  assert.equal(valid.amount, 499.5);

  const upiUrl = buildUpiPaymentUrl({
    pa: BRAND_PROFILE.upiId,
    pn: BRAND_PROFILE.upiPayeeName,
    am: 499.5,
    tn: 'Anime Editing',
  });
  assert.equal(
    upiUrl,
    'upi://pay?pa=shivampavanmishra64%40okicici&pn=Shivam%20Mishra&am=499.50&cu=INR&tn=Anime%20Editing'
  );

  const appUrls = buildUpiAppUrls({
    pa: BRAND_PROFILE.upiId,
    pn: BRAND_PROFILE.upiPayeeName,
    am: 499.5,
    tn: 'Anime Editing',
  });
  assert.equal(appUrls.upi, upiUrl);
  assert.ok(appUrls.gpay.startsWith('tez://upi/pay?'));
  assert.ok(appUrls.phonepe.startsWith('phonepe://pay?'));
  assert.ok(appUrls.paytm.startsWith('paytmmp://pay?'));
});

test('PRICE_CATEGORIES and PRICE_LIST match all 4 SG EDITER categories, rates, and terms', () => {
  assert.deepEqual(
    PRICE_CATEGORIES.map((c) => c.title),
    ['Typography Editing', 'Anime Editing', 'Reels Editing', 'Special Editing']
  );
  assert.equal(PRICE_LIST.length, 18);
  assert.deepEqual(PRICE_TERMS, [
    '50% advance payment.',
    'Extra revisions may cost extra.',
    'Prices depend on video complexity.',
    'Delivery time depends on project.',
  ]);
  for (const pkg of PRICE_LIST) {
    assert.ok(pkg.priceInr >= 99);
    assert.equal(validatePaymentAmount(String(pkg.priceInr)).valid, true);
    assert.ok(SERVICE_OPTIONS.includes(pkg.serviceType));
    assert.ok(pkg.fullTitle.includes(pkg.title));
  }
});

test('SKILLS_LIST contains only Anime Reel, Typography, and Normal Reel without percentage levels', () => {
  assert.deepEqual(
    SKILLS_LIST.map((s) => s.name),
    ['Anime Reel', 'Typography', 'Normal Reel']
  );
  for (const skill of SKILLS_LIST) {
    assert.equal('level' in skill, false);
    assert.doesNotMatch(skill.tools, /smooth better quality/i);
  }
});
