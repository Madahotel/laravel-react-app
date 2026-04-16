import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Heart, Dna, ClipboardCheck, FileText, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const healthCards = [
  { key: 'hips', icon: Activity },
  { key: 'cardiac', icon: Heart },
  { key: 'dna', icon: Dna },
  { key: 'temperament', icon: ClipboardCheck },
  { key: 'docs', icon: FileText },
];

export default function PedigreeHealth() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 0.4,
          },
        }
      );

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { x: 80, opacity: 0, rotateZ: 2 },
            {
              x: 0,
              opacity: 1,
              rotateZ: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 0.4,
              },
              delay: index * 0.1,
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#0B0B0C] py-20 lg:py-32 z-[60]"
    >
      <div className="w-full px-6 lg:px-[6vw]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left column - Sticky heading */}
          <div className="lg:w-[40%] lg:sticky lg:top-32 lg:self-start">
            <div ref={headingRef}>
              <h2 className="text-[clamp(32px,4vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.06em] mb-6">
                {t('pedigree.heading')}
              </h2>
              <p className="text-base lg:text-lg text-[#B8B0A8] leading-relaxed mb-8">
                {t('pedigree.intro')}
              </p>
              <button className="btn-secondary rounded-lg flex items-center gap-2">
                <Download className="w-4 h-4" />
                {t('pedigree.cta')}
              </button>
            </div>
          </div>

          {/* Right column - Cards */}
          <div className="lg:w-[60%] space-y-6">
            {healthCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  className="glass-card p-6 lg:p-8 hover:border-[rgba(199,154,107,0.5)] transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[rgba(199,154,107,0.15)] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(199,154,107,0.25)] transition-colors duration-300">
                      <Icon className="w-6 h-6 text-[#C79A6B]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#F4F1EC] mb-2">
                        {t(`pedigree.${card.key}`)}
                      </h3>
                      <p className="text-[#B8B0A8] leading-relaxed">
                        {t(`pedigree.${card.key}.desc`)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
