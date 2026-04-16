// src/sections/UpcomingLitters.tsx - Version ULTIME corrigée
import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bell, Calendar, Heart, ChevronLeft, ChevronRight, Camera, Loader2, PawPrint } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { waitlistAPI } from '@/services/api';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

interface LitterInfo {
  id: number;
  sire_name: string;
  sire_image?: string;
  dam_name: string;
  dam_image?: string;
  expected_date: string;
  status: 'planned' | 'confirmed' | 'born';
  description_en?: string;
  description_fr?: string;
}

interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
  title?: string;
}

// Données de fallback
const fallbackLitters: LitterInfo[] = [{
  id: 1,
  sire_name: 'CDH Oliver',
  dam_name: 'Iggy',
  expected_date: '2025-12-01',
  status: 'planned'
}];

export default function UpcomingLitters() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [litters, setLitters] = useState<LitterInfo[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  // Fonction CORRIGÉE pour construire l'URL de l'image
  const getImageUrl = (path: string | undefined) => {
    if (!path) {
      return 'https://placehold.co/800x500/141414/666?text=No+image';
    }
    
    // Si c'est déjà une URL complète
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Si le chemin commence par /storage/
    if (path.startsWith('/storage/')) {
      return `http://localhost:8000${path}`;
    }
    
    // Si le chemin contient déjà 'storage/'
    if (path.includes('storage/')) {
      return `http://localhost:8000/${path}`;
    }
    
    // Pour les images de la galerie - le chemin est comme 'gallery/filename.jpg' ou 'filename.jpg'
    let cleanPath = path;
    
    // Enlever le préfixe 'gallery/' s'il existe
    if (cleanPath.startsWith('gallery/')) {
      cleanPath = cleanPath.substring(8);
    }
    
    // S'assurer qu'il n'y a pas de double slash
    cleanPath = cleanPath.replace(/\/+/g, '/');
    
    // Retourner l'URL complète
    return `http://localhost:8000/storage/gallery/${cleanPath}`;
  };

  // Fetch litters and gallery from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setApiError(null);
        
        // Fetch upcoming litters
        let littersData = [];
        try {
          const littersResponse = await fetch('/api/public/litters');
          if (littersResponse.ok) {
            littersData = await littersResponse.json();
            console.log('Litters data received:', littersData);
          } else {
            console.log('Litters API returned status:', littersResponse.status);
          }
        } catch (error) {
          console.log('Litters API error:', error);
        }
        
        setLitters(littersData.length > 0 ? littersData : fallbackLitters);
        
        // Fetch gallery photos - VERSION CORRIGÉE
        try {
          console.log('Fetching gallery from: /api/public/gallery');
          const galleryResponse = await fetch('http://127.0.0.1:8000/api/public/gallery');
          console.log('Gallery response status:', galleryResponse.status);
          
          if (!galleryResponse.ok) {
            throw new Error(`HTTP ${galleryResponse.status}: ${galleryResponse.statusText}`);
          }
          
          const galleryData = await galleryResponse.json();
          console.log('RAW Gallery Data Type:', typeof galleryData);
          console.log('RAW Gallery Data:', galleryData);
          console.log('Is array?', Array.isArray(galleryData));
          console.log('Length:', galleryData?.length);
          
          // Vérifier si galleryData est un tableau
          if (!Array.isArray(galleryData)) {
            console.error('Gallery data is not an array:', galleryData);
            setApiError('Invalid data format from API');
            setGalleryPhotos([]);
          } else if (galleryData.length === 0) {
            console.warn('No gallery photos found in database');
            setApiError('No photos available');
            setGalleryPhotos([]);
          } else {
            // Formater les photos
            const formattedPhotos = galleryData.map((photo: any, index: number) => {
              console.log(`Processing photo ${index + 1}:`, photo);
              return {
                id: photo.id || index,
                src: photo.src || photo.image || '',
                alt: photo.alt || photo.title_en || 'Gallery image',
                title: photo.title || photo.title_en || ''
              };
            }).filter(photo => photo.src); // Filtrer les photos sans source
            
            console.log('Formatted photos:', formattedPhotos);
            console.log('Formatted photos count:', formattedPhotos.length);
            setGalleryPhotos(formattedPhotos);
            
            if (formattedPhotos.length === 0) {
              setApiError('No valid photos found');
            }
          }
        } catch (error: any) {
          console.error('Gallery API fetch error:', error);
          setApiError(error.message || 'Failed to fetch gallery');
          setGalleryPhotos([]);
        }
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLitters(fallbackLitters);
        setApiError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
            start: 'top 75%',
            end: 'top 45%',
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    if (galleryRef.current && !loading && galleryPhotos.length > 0) {
      gsap.fromTo(
        galleryRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 0.4,
          },
        }
      );
    }

    return () => ctx.revert();
  }, [loading, galleryPhotos.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('waitlist.errors.noEmail') || 'Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('waitlist.errors.invalidEmail') || 'Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await waitlistAPI.create({
        email,
        name: name || null,
        phone: phone || null,
        source: 'upcoming_litters'
      });
      
      if (response.data.success) {
        setIsSubmitted(true);
        toast.success(t('waitlist.success') || 'You have been added to the waitlist!');
        setEmail('');
        setName('');
        setPhone('');
        
        setTimeout(() => {
          setIsDialogOpen(false);
          setIsSubmitted(false);
        }, 3000);
      }
    } catch (error: any) {
      console.error('Waitlist submission error:', error);
      const errorMsg = error.response?.data?.message || t('waitlist.errors.general') || 'Failed to join waitlist. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextPhoto = () => {
    if (galleryPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % galleryPhotos.length);
    }
  };

  const prevPhoto = () => {
    if (galleryPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
    }
  };

  const formatExpectedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getStatusText = (status: string) => {
    if (language === 'fr') {
      switch (status) {
        case 'planned': return 'Prévue';
        case 'confirmed': return 'Confirmée';
        case 'born': return 'Née';
        default: return 'Prévue';
      }
    }
    switch (status) {
      case 'planned': return 'Planned';
      case 'confirmed': return 'Confirmed';
      case 'born': return 'Born';
      default: return 'Planned';
    }
  };

  const currentPhoto = galleryPhotos[currentPhotoIndex];

  const galleryText = {
    label: t('gallery.label') || 'Puppy Gallery',
    title: t('gallery.title') || 'Previous',
    subtitle: t('gallery.subtitle') || 'Litters',
    description: t('gallery.description') || 'Take a look at our previous litters to see the quality and beauty of RR Boerboel puppies.',
    empty: t('gallery.empty') || 'No photos available yet'
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="litters"
        className="relative w-full bg-[#0B0B0C] py-20 lg:py-32 z-50"
      >
        <div className="w-full px-4 sm:px-6 lg:px-[6vw]">
          <div
            ref={contentRef}
            className="relative z-10 flex flex-col justify-center items-center text-center"
          >
            <span className="section-label mb-3 sm:mb-4 block">{t('litters.label') || 'Upcoming Litters'}</span>
            
            <h2 className="text-[clamp(24px,5vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.04em] sm:tracking-[0.06em] mb-4 sm:mb-6">
              {t('litters.headline1') || 'Future'}
              <br />
              <span className="text-[#C79A6B]">{t('litters.headline2') || 'Champions'}</span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-[#B8B0A8] max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
              {t('litters.body') || 'Join our waitlist to secure a spot for our upcoming champion bloodline litters.'}
            </p>

            {!loading && litters.length > 0 && (
              <div className="glass-card p-4 sm:p-6 mb-6 sm:mb-8 max-w-md mx-auto">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#C79A6B]" />
                  <span className="text-sm sm:text-base text-[#F4F1EC] font-semibold">
                    {t('litters.expectedPairing') || 'Expected Pairing'}
                  </span>
                </div>
                
                {litters.map((litter) => (
                  <div key={litter.id}>
                    <div className="flex items-center justify-center gap-4 sm:gap-8">
                      <div className="text-center">
                        {litter.sire_image && (
                          <img 
                            src={getImageUrl(litter.sire_image)}
                            alt={litter.sire_name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mx-auto mb-2 border-2 border-[#C79A6B]"
                            onError={(e) => {
                              console.error('Sire image failed to load');
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <p className="text-[#C79A6B] font-bold text-base sm:text-lg">{litter.sire_name}</p>
                        <p className="text-xs sm:text-sm text-[#B8B0A8]">{t('litters.sire') || 'Sire'}</p>
                      </div>
                      <div className="text-[#C79A6B] text-xl sm:text-2xl">×</div>
                      <div className="text-center">
                        {litter.dam_image && (
                          <img 
                            src={getImageUrl(litter.dam_image)}
                            alt={litter.dam_name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mx-auto mb-2 border-2 border-[#C79A6B]"
                            onError={(e) => {
                              console.error('Dam image failed to load');
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <p className="text-[#C79A6B] font-bold text-base sm:text-lg">{litter.dam_name}</p>
                        <p className="text-xs sm:text-sm text-[#B8B0A8]">{t('litters.dam') || 'Dam'}</p>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[rgba(199,154,107,0.3)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#C79A6B]" />
                        <span className="text-xs sm:text-sm text-[#B8B0A8]">
                          {t('litters.expected') || 'Expected'}: {formatExpectedDate(litter.expected_date)}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-[rgba(199,154,107,0.2)] text-[#C79A6B] rounded-full">
                        {getStatusText(litter.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsDialogOpen(true)}
              className="btn-primary rounded-lg flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              {t('litters.cta') || 'Join Waitlist'}
            </button>
          </div>
        </div>
      </section>

      <section ref={galleryRef} className="relative w-full bg-[#0B0B0C] py-16 sm:py-20 lg:py-24 z-[55]">
        <div className="w-full px-4 sm:px-6 lg:px-[6vw]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-full mb-4">
                <Camera className="w-4 h-4 text-[#C79A6B]" />
                <span className="text-sm text-[#C79A6B]">{galleryText.label}</span>
              </div>
              <h3 className="text-[clamp(20px,3vw,36px)] font-bold text-[#F4F1EC] uppercase tracking-[0.04em] mb-3">
                {galleryText.title} <span className="text-[#C79A6B]">{galleryText.subtitle}</span>
              </h3>
              <p className="text-sm sm:text-base text-[#B8B0A8] max-w-2xl mx-auto">
                {galleryText.description}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-[#C79A6B] animate-spin" />
              </div>
            ) : galleryPhotos.length === 0 ? (
              <div className="text-center py-12">
                <PawPrint className="w-16 h-16 text-[#666] mx-auto mb-4" />
                <p className="text-[#B8B0A8]">{galleryText.empty}</p>
                {apiError && (
                  <p className="text-xs text-red-400 mt-2">Debug: {apiError}</p>
                )}
              </div>
            ) : (
              <>
                <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-[#141414] border border-[rgba(199,154,107,0.2)] mb-4 sm:mb-6">
                  <img
                    src={getImageUrl(currentPhoto?.src)}
                    alt={currentPhoto?.alt || 'Puppy gallery'}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={(e) => {
                      console.error('Failed to load image:', getImageUrl(currentPhoto?.src));
                      e.currentTarget.src = 'https://placehold.co/800x500/141414/666?text=Image+not+found';
                    }}
                  />
                  
                  {galleryPhotos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[rgba(11,11,12,0.8)] border border-[rgba(199,154,107,0.4)] rounded-full flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.3)] transition-all z-10"
                      >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[rgba(11,11,12,0.8)] border border-[rgba(199,154,107,0.4)] rounded-full flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.3)] transition-all z-10"
                      >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[rgba(11,11,12,0.8)] rounded-full text-sm text-[#C79A6B] z-10">
                    {currentPhotoIndex + 1} / {galleryPhotos.length}
                  </div>
                </div>

                <div className="flex justify-center gap-2 sm:gap-3 overflow-x-auto pb-2">
                  {galleryPhotos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        index === currentPhotoIndex
                          ? 'border-[#C79A6B] opacity-100'
                          : 'border-transparent opacity-50 hover:opacity-75'
                      }`}
                    >
                      <img 
                        src={getImageUrl(photo.src)}
                        alt={photo.alt} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Thumbnail failed to load:', getImageUrl(photo.src));
                          e.currentTarget.src = 'https://placehold.co/80x80/141414/666?text=No+image';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] text-[#F4F1EC] mx-4 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-[#C79A6B]">
              {t('waitlist.title') || 'Join the Waitlist'}
            </DialogTitle>
            <DialogDescription className="text-[#B8B0A8] text-sm sm:text-base">
              {t('waitlist.description') || 'Be the first to know when reservations open for our upcoming litter.'}
            </DialogDescription>
          </DialogHeader>
          
          {isSubmitted ? (
            <div className="py-6 sm:py-8 text-center">
              <div className="w-14 h-14 sm:w-16 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-[#C79A6B]" />
              </div>
              <p className="text-[#F4F1EC] text-base sm:text-lg font-semibold">
                {t('waitlist.successTitle') || 'You\'re on the list!'}
              </p>
              <p className="text-[#B8B0A8] text-sm mt-2">
                {t('waitlist.successMessage') || 'We\'ll notify you when reservations open.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs sm:text-sm text-[#B8B0A8] mb-2 block">
                  {t('waitlist.name') || 'Name (optional)'}
                </label>
                <Input
                  type="text"
                  placeholder={t('waitlist.namePlaceholder') || 'Your name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(199,154,107,0.3)] text-[#F4F1EC] placeholder:text-[#666] focus:border-[#C79A6B] focus:ring-1 focus:ring-[#C79A6B]"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-[#B8B0A8] mb-2 block">
                  {t('waitlist.email') || 'Email Address'} <span className="text-[#C79A6B]">*</span>
                </label>
                <Input
                  type="email"
                  placeholder={t('waitlist.emailPlaceholder') || 'your@email.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(199,154,107,0.3)] text-[#F4F1EC] placeholder:text-[#666] focus:border-[#C79A6B] focus:ring-1 focus:ring-[#C79A6B]"
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-[#B8B0A8] mb-2 block">
                  {t('waitlist.phone') || 'Phone (optional)'}
                </label>
                <Input
                  type="tel"
                  placeholder={t('waitlist.phonePlaceholder') || '+261 XX XXX XXXX'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(199,154,107,0.3)] text-[#F4F1EC] placeholder:text-[#666] focus:border-[#C79A6B] focus:ring-1 focus:ring-[#C79A6B]"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C79A6B] text-[#0B0B0C] hover:bg-[#D4AF37] font-semibold transition-colors py-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('waitlist.submitting') || 'Joining...'}
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    {t('waitlist.submit') || 'Join Waitlist'}
                  </>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}