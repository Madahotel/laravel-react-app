import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedFemale() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { x: '-10vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 45%',
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        imageRef.current,
        { x: '10vw', opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="females"
      className="relative w-full bg-[#0B0B0C] py-20 lg:py-32 z-[35]"
    >
      <div className="w-full px-6 lg:px-[6vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Content - Left on desktop */}
          <div ref={contentRef} className="lg:pr-8 order-2 lg:order-1">
            <span className="section-label mb-4 block">{t('female.label')}</span>
            <h2 className="text-[clamp(32px,4vw,48px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.04em] mb-6">
              <span className="text-[#C79A6B]">Iggy</span>
            </h2>
            <p className="text-base lg:text-lg text-[#B8B0A8] leading-relaxed mb-8">
              {t('female.body')}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-4">
                <p className="text-[#C79A6B] font-bold text-lg">9 mo</p>
                <p className="text-sm text-[#B8B0A8]">Age</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-[#C79A6B] font-bold text-lg">Fawn</p>
                <p className="text-sm text-[#B8B0A8]">Color</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-[#C79A6B] font-bold text-lg">52 kg</p>
                <p className="text-sm text-[#B8B0A8]">Weight</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-[#C79A6B] font-bold text-lg">Madagascar</p>
                <p className="text-sm text-[#B8B0A8]">Registered</p>
              </div>
            </div>

            <button className="btn-secondary rounded-lg flex items-center gap-2">
              {t('female.cta')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Image - Right on desktop */}
          <div ref={imageRef} className="relative order-1 lg:order-2">
            <div className="aspect-[3/4] rounded-xl overflow-hidden">
              <img
                src="/images/female_feature.jpg"
                alt="Featured Female"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#C79A6B] rounded-lg flex items-center justify-center">
              <span className="text-[#0B0B0C] font-bold text-sm uppercase tracking-wider text-center leading-tight">
                Future<br />Dam
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
