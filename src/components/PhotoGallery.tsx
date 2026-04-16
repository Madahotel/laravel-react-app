import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  src: string;
  alt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
}

export default function PhotoGallery({ photos, className = '' }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setTranslateX(0);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (translateX > 50) {
      goToPrev();
    } else if (translateX < -50) {
      goToNext();
    }
    setTranslateX(0);
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        goToNext();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isDragging, photos.length]);

  if (photos.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl bg-[#141414] aspect-[4/3] cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out h-full"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
          }}
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Desktop only */}
        {photos.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[rgba(11,11,12,0.7)] border border-[rgba(199,154,107,0.4)] rounded-full items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.2)] transition-all z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[rgba(11,11,12,0.7)] border border-[rgba(199,154,107,0.4)] rounded-full items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.2)] transition-all z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Photo Counter */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-[rgba(11,11,12,0.7)] rounded-full text-xs text-[#C79A6B]">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-2 mt-3 overflow-x-auto pb-2 hide-scrollbar">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-[#C79A6B] opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-75'
              }`}
            >
              <img
                src={photo.src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Swipe hint on mobile */}
      <p className="sm:hidden text-center text-xs text-[#666] mt-2">
        Glissez pour voir plus de photos
      </p>
    </div>
  );
}
