import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, Phone, Check, Navigation, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Visit() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Coordonnées exactes - Polyclinique Ilafy (à ajuster)
  // Latitude: -18.8792, Longitude: 47.5079 (Antananarivo)
  const location = {
    lat: -18.8792,
    lng: 47.5079,
    address: "Polyclinique Ilafy, 100 m avant - Antananarivo, Madagascar",
    fullAddress: "RR Boerboels - 100 m avant Polyclinique Ilafy, Antananarivo, Madagascar"
  };

  // Google Maps URL pour directions
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&destination_place_id=${encodeURIComponent(location.fullAddress)}`;
  
  // Static map image URL (alternative si l'iframe ne charge pas)
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=600x400&markers=color:0xC79A6B%7C${location.lat},${location.lng}&key=YOUR_API_KEY`;

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
            <span className="section-label mb-4 block">{t('visit.label') || 'Visit Us'}</span>
            
            <h2 className="text-[clamp(32px,4vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.06em] mb-6">
              {t('visit.heading') || 'See Where They Raise'}
            </h2>
            
            <p className="text-base lg:text-lg text-[#B8B0A8] leading-relaxed mb-8">
              {t('visit.body') || "We're located near Antananarivo, Madagascar. Visitors are welcome by appointment—meet the dogs, see the setup, and ask questions."}
            </p>

            {/* Adresse précise */}
            <div className="bg-[rgba(199,154,107,0.1)] border border-[rgba(199,154,107,0.3)] rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C79A6B] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#F4F1EC] font-semibold mb-1">📍 Notre localisation</p>
                  <p className="text-sm text-[#B8B0A8]">
                    {language === 'fr' 
                      ? "Polyclinique Ilafy, 100 m avant - Antananarivo, Madagascar"
                      : "Polyclinique Ilafy, 100 m before - Antananarivo, Madagascar"}
                  </p>
                  <p className="text-xs text-[#C79A6B] mt-2 flex items-center gap-1">
                    <span>⬇️</span>
                    <span>{language === 'fr' ? 'Repère visible : Polyclinique Ilafy' : 'Landmark: Polyclinique Ilafy'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Features list */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#C79A6B]" />
                </div>
                <span className="text-[#F4F1EC]">{t('visit.appointment') || 'By appointment only'}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#C79A6B]" />
                </div>
                <span className="text-[#F4F1EC]">{t('visit.kennels') || 'Clean, spacious kennels'}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#C79A6B]" />
                </div>
                <span className="text-[#F4F1EC]">{t('visit.socialization') || 'Puppy socialization area'}</span>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary rounded-lg inline-flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                {t('visit.cta') || 'Get Directions'}
              </a>
              <a
                href="https://wa.me/261341234567"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary rounded-lg inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {language === 'fr' ? 'Appeler pour rendez-vous' : 'Call for appointment'}
              </a>
            </div>
          </div>

          {/* Right Content - Google Maps */}
          <div ref={rightRef} className="lg:w-[55%]">
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-[rgba(199,154,107,0.2)] shadow-xl">
              {/* Google Maps Iframe */}
              <iframe
                title="RR Boerboels Location"
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${location.lat},${location.lng}&zoom=15&language=${language === 'fr' ? 'fr' : 'en'}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
              />
              
              {/* Fallback si l'iframe ne charge pas */}
              {!mapLoaded && (
                <div className="absolute inset-0 bg-[#1a1a1a] flex flex-col items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-12 h-12 text-[#C79A6B] mx-auto mb-4" />
                    <p className="text-[#F4F1EC] font-semibold mb-2">RR Boerboels</p>
                    <p className="text-sm text-[#B8B0A8] mb-4">
                      {language === 'fr' 
                        ? "Polyclinique Ilafy, 100 m avant"
                        : "Polyclinique Ilafy, 100 m before"}
                    </p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#C79A6B] hover:text-[#D4AF37] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {language === 'fr' ? 'Ouvrir dans Google Maps' : 'Open in Google Maps'}
                    </a>
                  </div>
                </div>
              )}
              
              {/* Overlay avec le nom */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass-card p-3 bg-[rgba(11,11,12,0.9)] backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#C79A6B] rounded-full animate-pulse"></div>
                    <p className="text-[#C79A6B] font-semibold text-sm">RR Boerboels</p>
                  </div>
                  <p className="text-xs text-[#B8B0A8] mt-1">
                    {language === 'fr' 
                      ? "📍 Polyclinique Ilafy, 100 m avant"
                      : "📍 Polyclinique Ilafy, 100 m before"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Note d'orientation */}
            <div className="mt-4 text-center">
              <p className="text-xs text-[#B8B0A8] flex items-center justify-center gap-2">
                <span className="inline-block w-1 h-1 bg-[#C79A6B] rounded-full"></span>
                {language === 'fr' 
                  ? "Repère : Polyclinique Ilafy - Entrée 100 m avant sur la gauche"
                  : "Landmark: Polyclinique Ilafy - Entrance 100 m before on the left"}
                <span className="inline-block w-1 h-1 bg-[#C79A6B] rounded-full"></span>
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Location */}
          <div className="glass-card p-6 hover:border-[rgba(199,154,107,0.5)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[rgba(199,154,107,0.2)] rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#C79A6B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F1EC]">{t('visit.location') || 'Location'}</h3>
            </div>
            <p className="text-[#B8B0A8] text-sm">
              {language === 'fr' 
                ? "Polyclinique Ilafy, 100 m avant"
                : "Polyclinique Ilafy, 100 m before"}
            </p>
            <p className="text-xs text-[#6B6560] mt-2">Antananarivo, Madagascar</p>
          </div>

          {/* Hours */}
          <div className="glass-card p-6 hover:border-[rgba(199,154,107,0.5)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[rgba(199,154,107,0.2)] rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C79A6B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F1EC]">{t('visit.hours') || 'Hours'}</h3>
            </div>
            <p className="text-[#B8B0A8]">Mon – Sat: 9:00 – 17:00</p>
            <p className="text-sm text-[#6B6560]">{language === 'fr' ? 'Sur rendez-vous uniquement' : 'By appointment only'}</p>
          </div>

          {/* Contact */}
          <div className="glass-card p-6 hover:border-[rgba(199,154,107,0.5)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[rgba(199,154,107,0.2)] rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#C79A6B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F1EC]">{t('visit.contact') || 'Contact'}</h3>
            </div>
            <a href="tel:+261341234567" className="text-[#B8B0A8] hover:text-[#C79A6B] transition-colors block">
              +261 34 12 345 67
            </a>
            <a href="mailto:contact@rrboerboels.com" className="text-sm text-[#6B6560] hover:text-[#C79A6B] transition-colors mt-1 block">
              contact@rrboerboels.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}