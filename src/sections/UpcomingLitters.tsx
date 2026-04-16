import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bell, Calendar, Heart, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

// Puppy gallery photos
const puppyPhotos = [
  { src: '/images/litters_puppy.jpg', alt: 'Boerboel Puppy 1' },
  { src: '/images/dog_iggy.jpg', alt: 'Boerboel Puppy 2' },
  { src: '/images/hero_power.jpg', alt: 'Boerboel Puppy 3' },
  { src: '/images/breed_intro.jpg', alt: 'Boerboel Puppy 4' },
];

export default function UpcomingLitters() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
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
            start: 'top 75%',
            end: 'top 45%',
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    // Gallery animation
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

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsSubmitted(false);
        setEmail('');
      }, 2000);
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % puppyPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + puppyPhotos.length) % puppyPhotos.length);
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
            <span className="section-label mb-3 sm:mb-4 block">{t('litters.label')}</span>
            
            <h2 className="text-[clamp(24px,5vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.04em] sm:tracking-[0.06em] mb-4 sm:mb-6">
              {t('litters.headline1')}
              <br />
              <span className="text-[#C79A6B]">{t('litters.headline2')}</span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-[#B8B0A8] max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
              {t('litters.body')}
            </p>

            {/* Expected pairing card */}
            <div className="glass-card p-4 sm:p-6 mb-6 sm:mb-8 max-w-md mx-auto">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#C79A6B]" />
                <span className="text-sm sm:text-base text-[#F4F1EC] font-semibold">Expected Pairing</span>
              </div>
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <div className="text-center">
                  <p className="text-[#C79A6B] font-bold text-base sm:text-lg">CDH Oliver</p>
                  <p className="text-xs sm:text-sm text-[#B8B0A8]">Sire</p>
                </div>
                <div className="text-[#C79A6B] text-xl sm:text-2xl">×</div>
                <div className="text-center">
                  <p className="text-[#C79A6B] font-bold text-base sm:text-lg">Iggy</p>
                  <p className="text-xs sm:text-sm text-[#B8B0A8]">Dam</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[rgba(199,154,107,0.3)] flex items-center justify-center gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#C79A6B]" />
                <span className="text-xs sm:text-sm text-[#B8B0A8]">Expected: Late 2025</span>
              </div>
            </div>

            <button
              onClick={() => setIsDialogOpen(true)}
              className="btn-primary rounded-lg flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              {t('litters.cta')}
            </button>
          </div>
        </div>
      </section>

      {/* Puppy Gallery Section - Below */}
      <section ref={galleryRef} className="relative w-full bg-[#0B0B0C] py-16 sm:py-20 lg:py-24 z-[55]">
        <div className="w-full px-4 sm:px-6 lg:px-[6vw]">
          <div className="max-w-5xl mx-auto">
            {/* Gallery Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-full mb-4">
                <Camera className="w-4 h-4 text-[#C79A6B]" />
                <span className="text-sm text-[#C79A6B]">Puppy Gallery</span>
              </div>
              <h3 className="text-[clamp(20px,3vw,36px)] font-bold text-[#F4F1EC] uppercase tracking-[0.04em] mb-3">
                Previous <span className="text-[#C79A6B]">Litters</span>
              </h3>
              <p className="text-sm sm:text-base text-[#B8B0A8] max-w-2xl mx-auto">
                Take a look at our previous litters to see the quality and beauty 
                of RR Boerboel puppies. Each puppy is raised with love and care, 
                ensuring they grow into healthy, well-socialized adults.
              </p>
            </div>

            {/* Main Photo */}
            <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-[#141414] border border-[rgba(199,154,107,0.2)] mb-4 sm:mb-6">
              <img
                src={puppyPhotos[currentPhotoIndex].src}
                alt={puppyPhotos[currentPhotoIndex].alt}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Navigation */}
              <button
                onClick={prevPhoto}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[rgba(11,11,12,0.8)] border border-[rgba(199,154,107,0.4)] rounded-full flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.3)] transition-all"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[rgba(11,11,12,0.8)] border border-[rgba(199,154,107,0.4)] rounded-full flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.3)] transition-all"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[rgba(11,11,12,0.8)] rounded-full text-sm text-[#C79A6B]">
                {currentPhotoIndex + 1} / {puppyPhotos.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {puppyPhotos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentPhotoIndex
                      ? 'border-[#C79A6B] opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-75'
                  }`}
                >
                  <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] text-[#F4F1EC] mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-[#C79A6B]">
              Join the Waitlist
            </DialogTitle>
            <DialogDescription className="text-[#B8B0A8] text-sm sm:text-base">
              Be the first to know when reservations open for our upcoming litter.
            </DialogDescription>
          </DialogHeader>
          
          {isSubmitted ? (
            <div className="py-6 sm:py-8 text-center">
              <div className="w-14 h-14 sm:w-16 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-[#C79A6B]" />
              </div>
              <p className="text-[#F4F1EC] text-base sm:text-lg font-semibold">You&apos;re on the list!</p>
              <p className="text-[#B8B0A8] text-sm mt-2">We&apos;ll notify you when reservations open.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs sm:text-sm text-[#B8B0A8] mb-2 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(199,154,107,0.3)] text-[#F4F1EC] placeholder:text-[#666]"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#C79A6B] text-[#0B0B0C] hover:bg-[#D4AF37] font-semibold"
              >
                Join Waitlist
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
