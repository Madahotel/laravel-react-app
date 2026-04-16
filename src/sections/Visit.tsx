import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, Phone, Check, Navigation } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Visit() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Left content animation
      gsap.fromTo(
        leftRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.4,
          },
        }
      );

      // Right content (map) animation
      gsap.fromTo(
        rightRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.4,
          },
        }
      );

      // Bottom cards animation
      gsap.fromTo(
        cardsRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 0.4,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#3A1F1B] py-20 lg:py-32 z-[90]"
    >
      <div className="w-full px-6 lg:px-[6vw]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16">
          {/* Left Content */}
          <div ref={leftRef} className="lg:w-[45%]">
            <span className="section-label mb-4 block">{t('visit.label')}</span>
            
            <h2 className="text-[clamp(32px,4vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.06em] mb-6">
              {t('visit.heading')}
            </h2>
            
            <p className="text-base lg:text-lg text-[#B8B0A8] leading-relaxed mb-8">
              {t('visit.body')}
            </p>

            {/* Features list */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#C79A6B]" />
                </div>
                <span className="text-[#F4F1EC]">{t('visit.appointment')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#C79A6B]" />
                </div>
                <span className="text-[#F4F1EC]">{t('visit.kennels')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#C79A6B]" />
                </div>
                <span className="text-[#F4F1EC]">{t('visit.socialization')}</span>
              </li>
            </ul>

            {/* CTA */}
            <a
              href="https://maps.google.com/?q=Antananarivo,Madagascar"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary rounded-lg inline-flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              {t('visit.cta')}
            </a>
          </div>

          {/* Right Content - Map */}
          <div ref={rightRef} className="lg:w-[55%]">
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-[rgba(199,154,107,0.2)]">
              {/* Static map representation */}
              <div className="absolute inset-0 bg-[#1a1a1a]">
                {/* Map background pattern */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C79A6B' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                
                {/* Center marker */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Pulse effect */}
                    <div className="absolute inset-0 w-20 h-20 -m-10 bg-[rgba(199,154,107,0.3)] rounded-full animate-ping" />
                    
                    {/* Marker */}
                    <div className="relative w-10 h-10 bg-[#C79A6B] rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-5 h-5 text-[#0B0B0C]" />
                    </div>
                  </div>
                </div>
                
                {/* Location label */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-card p-4">
                    <p className="text-[#C79A6B] font-semibold mb-1">Double R Boerboels</p>
                    <p className="text-sm text-[#B8B0A8]">Antananarivo, Madagascar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Location */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[rgba(199,154,107,0.2)] rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#C79A6B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F1EC]">{t('visit.location')}</h3>
            </div>
            <p className="text-[#B8B0A8]">Antananarivo, Madagascar</p>
          </div>

          {/* Hours */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[rgba(199,154,107,0.2)] rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C79A6B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F1EC]">{t('visit.hours')}</h3>
            </div>
            <p className="text-[#B8B0A8]">Mon – Sat: 9:00 – 17:00</p>
            <p className="text-sm text-[#666]">By appointment only</p>
          </div>

          {/* Contact */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[rgba(199,154,107,0.2)] rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#C79A6B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F1EC]">{t('visit.contact')}</h3>
            </div>
            <p className="text-[#B8B0A8]">+261 XX XXX XXXX</p>
            <p className="text-sm text-[#666]">info@doublerboerboels.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
