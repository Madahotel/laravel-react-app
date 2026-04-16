import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Award, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const dogs = [
  {
    id: 1,
    name: 'CDH Oliver',
    role: 'male',
    roleLabel: 'Available Stud',
    description: 'Powerful, calm, proven producer. Son of international champion CDH Bullet. SABBS registered from South Africa.',
    image: '/images/dog_oliver.jpg',
    age: '1.5 years',
    color: 'Solid Black',
    achievements: ['SABBS Registered', 'From South Africa', 'Son of CDH Bullet'],
  },
  {
    id: 2,
    name: 'Iggy',
    role: 'female',
    roleLabel: 'Young Female',
    description: 'Puppy Champion of Madagascar. Promising structure with confident nature. Daughter of Iconic Jhon Wick and Shinai.',
    image: '/images/dog_iggy.jpg',
    age: '9 months',
    color: 'Fawn',
    achievements: ['Puppy Champion', 'Gold Medal 2025', 'Judged by Jhon Swart'],
  },
];

export default function MeetTheDogs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedDog, setSelectedDog] = useState<typeof dogs[0] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dog-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 50%',
            scrub: 0.4,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextDog = () => {
    setCurrentIndex((prev) => (prev + 1) % dogs.length);
  };

  const prevDog = () => {
    setCurrentIndex((prev) => (prev - 1 + dogs.length) % dogs.length);
  };

  return (
    <section
      ref={sectionRef}
      id="kennel"
      className="relative w-full bg-[#0B0B0C] py-20 lg:py-32 z-[70]"
    >
      <div className="w-full px-6 lg:px-[6vw]">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="section-label mb-4 block">{t('kennel.label')}</span>
          <h2 className="text-[clamp(32px,5vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.04em] mb-4">
            {t('kennel.heading')}
          </h2>
          <p className="text-base lg:text-lg text-[#B8B0A8] max-w-2xl mx-auto">
            {t('kennel.body')}
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-2 gap-8 max-w-5xl mx-auto">
          {dogs.map((dog) => (
            <div
              key={dog.id}
              className="dog-card glass-card rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedDog(dog)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dog.image}
                  alt={dog.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-[rgba(199,154,107,0.2)] text-[#C79A6B] text-xs font-semibold uppercase tracking-wider rounded-full">
                    {dog.roleLabel}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#F4F1EC] mb-2">{dog.name}</h3>
                <p className="text-[#B8B0A8] text-sm mb-4">{dog.description}</p>
                <div className="flex flex-wrap gap-2">
                  {dog.achievements.slice(0, 2).map((achievement, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 text-xs text-[#C79A6B]"
                    >
                      <Award className="w-3 h-3" />
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden max-w-md mx-auto">
          <div className="relative">
            <div
              className="dog-card glass-card rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedDog(dogs[currentIndex])}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dogs[currentIndex].image}
                  alt={dogs[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-[rgba(199,154,107,0.2)] text-[#C79A6B] text-xs font-semibold uppercase tracking-wider rounded-full">
                    {dogs[currentIndex].roleLabel}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#F4F1EC] mb-2">
                  {dogs[currentIndex].name}
                </h3>
                <p className="text-[#B8B0A8] text-sm mb-4">
                  {dogs[currentIndex].description}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prevDog}
                className="w-12 h-12 bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-full flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.25)] transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[#B8B0A8] text-sm">
                {currentIndex + 1} / {dogs.length}
              </span>
              <button
                onClick={nextDog}
                className="w-12 h-12 bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-full flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.25)] transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dog Detail Dialog */}
      <Dialog open={!!selectedDog} onOpenChange={() => setSelectedDog(null)}>
        <DialogContent className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] text-[#F4F1EC] max-w-lg mx-4">
          {selectedDog && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#C79A6B]">
                  {selectedDog.name}
                </DialogTitle>
                <DialogDescription className="text-[#B8B0A8]">
                  {selectedDog.roleLabel}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="aspect-[16/10] rounded-lg overflow-hidden mb-4">
                  <img
                    src={selectedDog.image}
                    alt={selectedDog.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[#B8B0A8] mb-4">{selectedDog.description}</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass-card p-3">
                    <p className="text-[#C79A6B] font-semibold">{selectedDog.age}</p>
                    <p className="text-xs text-[#B8B0A8]">Age</p>
                  </div>
                  <div className="glass-card p-3">
                    <p className="text-[#C79A6B] font-semibold">{selectedDog.color}</p>
                    <p className="text-xs text-[#B8B0A8]">Color</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDog.achievements.map((achievement, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 px-3 py-1 bg-[rgba(199,154,107,0.15)] text-[#C79A6B] text-xs rounded-full"
                    >
                      <Heart className="w-3 h-3" />
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
