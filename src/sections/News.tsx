// src/components/News.tsx
import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, ArrowRight, Trophy, Users, Star, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

interface NewsItem {
  id: number;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  image: string | null;
  type: 'event' | 'achievement' | 'announcement';
  event_date: string | null;
  location: string | null;
  is_highlight: boolean;
  created_at: string;
  updated_at: string;
}

// Map des icônes par type
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'event':
      return Trophy;
    case 'achievement':
      return Trophy;
    default:
      return Users;
  }
};

// Formater la date
const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function News() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  // Charger les actualités depuis l'API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.get('/public/news');
        setNewsItems(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useLayoutEffect(() => {
    if (loading) return;
    
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
  }, [loading, newsItems]);

  const getNewsTitle = (item: NewsItem) => {
    return language === 'fr' ? item.title_fr : item.title_en;
  };

  const getNewsContent = (item: NewsItem) => {
    return language === 'fr' ? item.content_fr : item.content_en;
  };

  const getNewsDate = (item: NewsItem) => {
    return item.event_date ? formatDate(item.event_date) : formatDate(item.created_at);
  };

  if (loading) {
    return (
      <section
        ref={sectionRef}
        id="news"
        className="relative w-full bg-[#0B0B0C] py-20 lg:py-32 z-[78]"
      >
        <div className="w-full px-6 lg:px-[6vw]">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#C79A6B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        ref={sectionRef}
        id="news"
        className="relative w-full bg-[#0B0B0C] py-20 lg:py-32 z-[78]"
      >
        <div className="w-full px-6 lg:px-[6vw]">
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

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
          {newsItems.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-[#666] mx-auto mb-4" />
              <p className="text-[#B8B0A8]">No news available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {newsItems.map((item, index) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <div
                    key={item.id}
                    ref={(el) => { cardsRef.current[index] = el; }}
                    onClick={() => setSelectedNews(item)}
                    className="group cursor-pointer"
                  >
                    <div className={`relative overflow-hidden rounded-xl border transition-all duration-300 h-full ${
                      item.is_highlight 
                        ? 'bg-gradient-to-br from-[rgba(199,154,107,0.15)] to-[rgba(199,154,107,0.05)] border-[rgba(199,154,107,0.4)]' 
                        : 'bg-[#141414] border-[rgba(199,154,107,0.15)] hover:border-[rgba(199,154,107,0.4)]'
                    }`}>
                      {/* Image d'arrière-plan optionnelle */}
                      {item.image && (
                        <div className="absolute inset-0 opacity-10">
                          <img
                            src={`http://localhost:8000/storage/${item.image}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Highlight badge */}
                      {item.is_highlight && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-[#C79A6B] text-[#0B0B0C] text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1 z-10">
                          <Star className="w-3 h-3 fill-[#0B0B0C]" />
                          {t('news.featured')}
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="relative z-10 p-6">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                          item.is_highlight ? 'bg-[rgba(199,154,107,0.3)]' : 'bg-[rgba(199,154,107,0.15)]'
                        }`}>
                          <Icon className="w-6 h-6 text-[#C79A6B]" />
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xl font-bold text-[#F4F1EC] mb-3 group-hover:text-[#C79A6B] transition-colors line-clamp-2">
                          {getNewsTitle(item)}
                        </h3>
                        
                        {/* Meta */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-[#B8B0A8]">
                            <Calendar className="w-4 h-4 text-[#C79A6B]" />
                            <span>{getNewsDate(item)}</span>
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-2 text-sm text-[#B8B0A8]">
                              <MapPin className="w-4 h-4 text-[#C79A6B]" />
                              <span className="line-clamp-1">{item.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Content preview */}
                        <p className="text-sm text-[#B8B0A8] line-clamp-3">
                          {getNewsContent(item)}
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
          )}
        </div>
      </section>

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] text-[#F4F1EC] max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedNews && (
            <>
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-[rgba(11,11,12,0.8)] rounded-full flex items-center justify-center text-[#F4F1EC] hover:bg-[rgba(199,154,107,0.3)] transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Image en haut du modal si disponible */}
              {selectedNews.image && (
                <div className="rounded-lg overflow-hidden mb-4 -mt-2">
                  <img
                    src={`http://localhost:8000/storage/${selectedNews.image}`}
                    alt={getNewsTitle(selectedNews)}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <DialogHeader className="mb-4">
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${
                  selectedNews.is_highlight ? 'bg-[rgba(199,154,107,0.3)]' : 'bg-[rgba(199,154,107,0.15)]'
                }`}>
                  {(() => {
                    const Icon = getTypeIcon(selectedNews.type);
                    return <Icon className="w-7 h-7 text-[#C79A6B]" />;
                  })()}
                </div>
                <DialogTitle className="text-2xl font-bold text-[#C79A6B]">
                  {getNewsTitle(selectedNews)}
                </DialogTitle>
                <DialogDescription className="text-[#B8B0A8]">
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-[#C79A6B]" />
                    <span>{getNewsDate(selectedNews)}</span>
                  </div>
                  {selectedNews.location && (
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-[#C79A6B]" />
                      <span>{selectedNews.location}</span>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <p className="text-[#F4F1EC] leading-relaxed whitespace-pre-wrap">
                  {getNewsContent(selectedNews)}
                </p>
                
                {/* CTA for events */}
                {selectedNews.type === 'event' && (
                  <div className="mt-6 p-4 bg-[rgba(199,154,107,0.1)] border border-[rgba(199,154,107,0.2)] rounded-lg">
                    <p className="text-sm text-[#B8B0A8] mb-3">{t('news.interested')}</p>
                    <a 
                      href="/contact" 
                      className="btn-primary rounded-lg w-full text-center block"
                    >
                      {t('news.contactUs')}
                    </a>
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