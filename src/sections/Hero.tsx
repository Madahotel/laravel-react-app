import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax (no pin)
      gsap.fromTo(
        bgRef.current,
        { scale: 1.1 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        }
      );

      // Content fade out on scroll
      gsap.fromTo(
        contentRef.current,
        { y: 0, opacity: 1 },
        {
          y: -50,
          opacity: 0,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '50% top',
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const keywords = [
    'Boerboel Madagascar',
    'SABBS Registered',
    'Stud Service',
    'Chiots Boerboel',
  ];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full min-h-screen overflow-hidden z-10"
    >
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full bg-[#0B0B0C]">
        <img
          src="/images/hero_power.jpg"
          alt="Boerboel"
          className="w-full h-full object-contain"
        />
        {/* Original overlay - semi-transparent */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,11,12,0.85)] via-[rgba(11,11,12,0.4)] to-[rgba(11,11,12,0.3)]" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-[6vw] text-center py-20"
      >
        {/* Title with transparent/glass effect */}
        <h1 className="text-[clamp(48px,10vw,120px)] font-bold uppercase leading-[0.85] tracking-[0.06em] mb-2 sm:mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(199,154,107,0.9) 0%, rgba(244,241,236,0.7) 50%, rgba(199,154,107,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          RR
        </h1>
        <h1 className="text-[clamp(36px,7vw,84px)] font-bold uppercase leading-[0.9] tracking-[0.08em] mb-4 sm:mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(244,241,236,0.95) 0%, rgba(199,154,107,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          BOERBOELS
        </h1>

        <p className="text-[clamp(16px,2.5vw,24px)] font-medium uppercase tracking-[0.2em] mb-6 sm:mb-8"
          style={{
            color: 'rgba(199,154,107,0.9)',
          }}
        >
          Bred to Bond
        </p>

        <p className="text-sm sm:text-base lg:text-lg text-[#B8B0A8] max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
          {t('hero.tagline')}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-full text-xs sm:text-sm text-[#C79A6B] font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <button
            onClick={() => scrollToSection('book')}
            className="btn-primary rounded-lg"
          >
            {t('hero.cta.primary')}
          </button>
          <button
            onClick={() => scrollToSection('males')}
            className="btn-secondary rounded-lg"
          >
            {t('hero.cta.secondary')}
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => scrollToSection('video')}
          className="flex flex-col items-center gap-2 text-[#B8B0A8] hover:text-[#C79A6B] transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">{t('hero.scroll')}</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
