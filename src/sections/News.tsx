import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, ArrowRight, Trophy, Users, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const newsItems = [
  {
    id: 1,
    title: 'Boerboel Day Madagascar 2025',
    titleFr: 'Boerboel Day Madagascar 2025',
    date: '24 Octobre 2025',
    location: 'Antananarivo, Madagascar',
    description: 'Le plus grand événement Boerboel de Madagascar. Concours, évaluations, et rencontre avec les éleveurs.',
    descriptionFr: 'Le plus grand événement Boerboel de Madagascar. Concours, évaluations, et rencontre avec les éleveurs.',
    type: 'event',
    icon: Trophy,
    highlight: true,
  },
  {
    id: 2,
    title: 'Iggy - Puppy Champion 2025',
    titleFr: 'Iggy - Championne Puppy 2025',
    date: 'Octobre 2025',
    location: 'Antananarivo, Madagascar',
    description: 'Notre Iggy a remporté le titre de Puppy Champion of Madagascar, jugée par Jhon Swart.',
    descriptionFr: 'Notre Iggy a remporté le titre de Puppy Champion of Madagascar, jugée par Jhon Swart.',
    type: 'achievement',
    icon: Trophy,
    highlight: false,
  },
  {
    id: 3,
    title: 'New Litter Expected',
    titleFr: 'Nouvelle Portée Prévue',
    date: 'Fin 2025',
    location: 'Double R Boerboels',
    description: 'Accouplement prévu entre CDH Oliver et Iggy. Liste d\'attente ouverte.',
    descriptionFr: 'Accouplement prévu entre CDH Oliver et Iggy. Liste d\'attente ouverte.',
    type: 'announcement',
    icon: Users,
    highlight: false,
  },
];

export default function News() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedNews, setSelectedNews] = useState<typeof newsItems[0] | null>(null);
  const { t, language } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.4,
          },
        }
      );

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { y: 60, opacity: 0, scale: 0.98 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 65%',
                scrub: 0.5,
              },
              delay: index * 0.1,
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getNewsTitle = (item: typeof newsItems[0]) => {
    if (language === 'fr') return item.titleFr;
    return item.title;
  };

  const getNewsDesc = (item: typeof newsItems[0]) => {
    if (language === 'fr') return item.descriptionFr;
    return item.description;
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="news"
        className="relative w-full bg-[#0B0B0C] py-20 lg:py-32 z-[78]"
      >
        <div className="w-full px-6 lg:px-[6vw]">
          {/* Heading */}
          <div ref={headingRef} className="text-center mb-16">
            <span className="section-label mb-4 block">{t('news.label')}</span>
            <h2 className="text-[clamp(32px,4vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.06em] mb-4">
              {t('news.heading')}
            </h2>
            <p className="text-base lg:text-lg text-[#B8B0A8] max-w-xl mx-auto">
              {t('news.body')}
            </p>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {newsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  onClick={() => setSelectedNews(item)}
                  className="group cursor-pointer"
                >
                  <div className={`relative overflow-hidden rounded-xl border transition-all duration-300 h-full ${
                    item.highlight 
                      ? 'bg-gradient-to-br from-[rgba(199,154,107,0.15)] to-[rgba(199,154,107,0.05)] border-[rgba(199,154,107,0.4)]' 
                      : 'bg-[#141414] border-[rgba(199,154,107,0.15)] hover:border-[rgba(199,154,107,0.4)]'
                  }`}>
                    {/* Highlight badge */}
                    {item.highlight && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-[#C79A6B] text-[#0B0B0C] text-xs font-bold uppercase tracking-wider rounded-full">
                        {t('news.featured')}
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                        item.highlight ? 'bg-[rgba(199,154,107,0.3)]' : 'bg-[rgba(199,154,107,0.15)]'
                      }`}>
                        <Icon className="w-6 h-6 text-[#C79A6B]" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#F4F1EC] mb-3 group-hover:text-[#C79A6B] transition-colors">
                        {getNewsTitle(item)}
                      </h3>
                      
                      {/* Meta */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[#B8B0A8]">
                          <Calendar className="w-4 h-4 text-[#C79A6B]" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#B8B0A8]">
                          <MapPin className="w-4 h-4 text-[#C79A6B]" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-[#B8B0A8] line-clamp-3">
                        {getNewsDesc(item)}
                      </p>
                      
                      {/* Read more */}
                      <div className="mt-4 pt-4 border-t border-[rgba(199,154,107,0.1)]">
                        <span className="text-sm text-[#C79A6B] flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {t('news.readMore')}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] text-[#F4F1EC] max-w-lg">
          {selectedNews && (
            <>
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-[rgba(11,11,12,0.8)] rounded-full flex items-center justify-center text-[#F4F1EC] hover:bg-[rgba(199,154,107,0.3)] transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <DialogHeader className="mb-4">
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${
                  selectedNews.highlight ? 'bg-[rgba(199,154,107,0.3)]' : 'bg-[rgba(199,154,107,0.15)]'
                }`}>
                  {(() => {
                    const Icon = selectedNews.icon;
                    return <Icon className="w-7 h-7 text-[#C79A6B]" />;
                  })()}
                </div>
                <DialogTitle className="text-2xl font-bold text-[#C79A6B]">
                  {getNewsTitle(selectedNews)}
                </DialogTitle>
                <DialogDescription className="text-[#B8B0A8]">
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-[#C79A6B]" />
                    <span>{selectedNews.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-[#C79A6B]" />
                    <span>{selectedNews.location}</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <p className="text-[#F4F1EC] leading-relaxed">
                  {getNewsDesc(selectedNews)}
                </p>
                
                {/* CTA for events */}
                {selectedNews.type === 'event' && (
                  <div className="mt-6 p-4 bg-[rgba(199,154,107,0.1)] border border-[rgba(199,154,107,0.2)] rounded-lg">
                    <p className="text-sm text-[#B8B0A8] mb-3">{t('news.interested')}</p>
                    <button className="btn-primary rounded-lg w-full">
                      {t('news.contactUs')}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
