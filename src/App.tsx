import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { OpeningIntro } from './components/OpeningIntro';
import { PaymentSection } from './components/PaymentSection';
import { PortfolioSection } from './components/PortfolioSection';
import { PricingSection } from './components/PricingSection';
import { ProjectModal } from './components/ProjectModal';
import { SkillsSection } from './components/SkillsSection';
import { StudioCanvas } from './components/three/StudioCanvas';
import {
  PORTFOLIO_PROJECTS,
  getAdjacentProjectId,
  type PortfolioProject,
  type PricePackage,
} from './utils/portfolioLogic';

function shouldAutostart(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('autostart') === '1';
}

export default function App() {
  const autostart = useMemo(() => shouldAutostart(), []);
  const [introVisible, setIntroVisible] = useState(!autostart);
  const [introElapsed, setIntroElapsed] = useState(autostart ? 5.0 : 0);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(
    undefined
  );
  const [preselectedAmount, setPreselectedAmount] = useState<number | undefined>(
    undefined
  );

  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const appRootRef = useRef<HTMLDivElement>(null);

  // Snappy sub-2-second opening reveal with hard safety timeout for low-end devices
  useEffect(() => {
    if (!introVisible) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIntroElapsed(1.8);
      setIntroVisible(false);
      return;
    }

    const startTime = performance.now();
    let rafId = 0;

    const hardCapTimer = window.setTimeout(() => {
      setIntroElapsed(1.8);
      setIntroVisible(false);
    }, 1850);

    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      setIntroElapsed(elapsed);
      if (elapsed >= 1.75) {
        setIntroVisible(false);
        return;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(hardCapTimer);
    };
  }, [introVisible]);

  // GSAP entrance choreography once intro completes
  useEffect(() => {
    if (introVisible || !appRootRef.current) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, appRootRef);

    return () => ctx.revert();
  }, [introVisible]);

  // Global mouse move parallax for the 3D scene (zero React state re-renders)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    const ny = (e.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
    pointerRef.current.x = nx;
    pointerRef.current.y = ny;
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSkipIntro = useCallback(() => {
    setIntroElapsed(1.8);
    setIntroVisible(false);
  }, []);

  const selectedProject: PortfolioProject | null = useMemo(() => {
    if (!selectedProjectId) return null;
    return PORTFOLIO_PROJECTS.find((p) => p.id === selectedProjectId) ?? null;
  }, [selectedProjectId]);

  const handleStepProject = useCallback(
    (direction: 'prev' | 'next') => {
      if (!selectedProjectId) return;
      const nextId = getAdjacentProjectId(
        PORTFOLIO_PROJECTS,
        selectedProjectId,
        direction
      );
      if (nextId) {
        setSelectedProjectId(nextId);
        setSelectedVideoIndex(0);
      }
    },
    [selectedProjectId]
  );

  const handleBookProject = useCallback(
    (_serviceTitle: string) => {
      setPreselectedService('AMV');
      setSelectedProjectId(null);
      window.setTimeout(() => {
        scrollToSection('contact');
      }, 60);
    },
    [scrollToSection]
  );

  const handlePayPackage = useCallback(
    (pkg: PricePackage) => {
      setPreselectedService(pkg.fullTitle);
      setPreselectedAmount(pkg.priceInr);
      window.setTimeout(() => {
        scrollToSection('payment');
      }, 60);
    },
    [scrollToSection]
  );

  const handleBookPackage = useCallback(
    (pkg: PricePackage) => {
      setPreselectedService(pkg.serviceType);
      setPreselectedAmount(pkg.priceInr);
      window.setTimeout(() => {
        scrollToSection('contact');
      }, 60);
    },
    [scrollToSection]
  );

  const introProgressNormalized = Math.min(1, introElapsed / 1.45);

  return (
    <div
      ref={appRootRef}
      data-state={introVisible ? 'intro' : 'portfolio'}
      onPointerMove={handlePointerMove}
      className="relative min-h-screen bg-[#050508] text-zinc-100"
    >
      <OpeningIntro
        elapsedSeconds={introElapsed}
        visible={introVisible}
        onSkip={handleSkipIntro}
      />

      <div
        className={`transition-opacity duration-700 ${
          introVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Navbar onNavigate={scrollToSection} />
      </div>

      <main>
        {/* Hero Stage with Live Interactive 3D Environment */}
        <div className="relative min-h-screen overflow-hidden bg-[#050508]">
          <div className="absolute inset-0 z-0">
            <StudioCanvas
              introActive={introVisible}
              introProgress={introProgressNormalized}
              cameraPreset="sentinel"
              pointerRef={pointerRef}
            />
          </div>

          <div
            className={`relative z-10 transition-opacity duration-700 ${
              introVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <HeroSection
              onExploreWork={() => scrollToSection('portfolio')}
              onContactMe={() => scrollToSection('contact')}
            />
          </div>
        </div>

        <PortfolioSection
          onSelectProject={(project, clipIndex = 0) => {
            setSelectedProjectId(project.id);
            setSelectedVideoIndex(clipIndex);
          }}
        />

        <SkillsSection />

        <PricingSection
          onPayPackage={handlePayPackage}
          onBookPackage={handleBookPackage}
        />

        <AboutSection />

        <ContactSection preselectedService={preselectedService} />

        <PaymentSection
          preselectedService={preselectedService}
          preselectedAmount={preselectedAmount}
        />
      </main>

      <Footer onNavigate={scrollToSection} />

      <ProjectModal
        project={selectedProject}
        initialVideoIndex={selectedVideoIndex}
        onClose={() => setSelectedProjectId(null)}
        onStep={handleStepProject}
        onBookProject={handleBookProject}
      />
    </div>
  );
}
