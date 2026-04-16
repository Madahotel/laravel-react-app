import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0B0B0C] py-20 lg:py-32 z-[85]"
    >
      <div className="w-full px-6 lg:px-[6vw]">
        <div ref={contentRef} className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Quote className="w-12 h-12 text-[#C79A6B] mx-auto opacity-50" />
          </div>
          
          <blockquote className="text-[clamp(20px,3vw,32px)] font-medium text-[#F4F1EC] leading-relaxed mb-8">
            "{t('testimonials.quote')}"
          </blockquote>
          
          <cite className="text-base lg:text-lg text-[#B8B0A8] not-italic">
            {t('testimonials.attribution')}
          </cite>
        </div>
      </div>
    </section>
  );
}
