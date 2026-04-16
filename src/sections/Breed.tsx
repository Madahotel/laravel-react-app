import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Breed() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { x: '-8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { x: '8vw', opacity: 0 },
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="breed"
      className="relative w-full bg-[#0B0B0C] py-20 lg:py-32 z-[20]"
    >
      <div className="w-full px-6 lg:px-[6vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Image */}
          <div ref={imageRef} className="relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden">
              <img
                src="/images/breed_intro.jpg"
                alt="Boerboel"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-[#C79A6B] rounded-xl" />
          </div>

          {/* Content */}
          <div ref={contentRef} className="lg:pl-8">
            <span className="section-label mb-4 block">{t('breed.label')}</span>
            <h2 className="text-[clamp(32px,4vw,48px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.04em] mb-6">
              {t('breed.headline1')}
              <br />
              <span className="text-[#C79A6B]">{t('breed.headline2')}</span>
            </h2>
            <p className="text-base lg:text-lg text-[#B8B0A8] leading-relaxed mb-8">
              {t('breed.body')}
            </p>
            <button className="btn-primary rounded-lg flex items-center gap-2">
              {t('breed.cta')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
