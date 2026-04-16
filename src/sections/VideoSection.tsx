import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        videoContainerRef.current,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
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
      className="relative w-full bg-[#0B0B0C] py-20 lg:py-32 z-[25]"
    >
      <div className="w-full px-6 lg:px-[6vw]">
        <div ref={videoContainerRef} className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 lg:mb-12">
            <span className="section-label mb-4 block">Video</span>
            <h2 className="text-[clamp(28px,5vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.04em] mb-4">
              Discover our <span className="text-[#C79A6B]">Boerboels</span>
            </h2>
            <p className="text-base lg:text-lg text-[#B8B0A8] max-w-2xl mx-auto">
              A video presentation of our dogs and our breeding program in Madagascar
            </p>
          </div>

          {/* Video Thumbnail / Player */}
          <div className="relative aspect-video rounded-xl lg:rounded-2xl overflow-hidden bg-[#141414] border border-[rgba(199,154,107,0.2)]">
            {!isPlaying ? (
              <>
                <img
                  src="/images/hero_power.jpg"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[rgba(11,11,12,0.4)] flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-[#C79A6B] hover:bg-[#D4AA7A] rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#0B0B0C] ml-1" fill="#0B0B0C" />
                  </button>
                </div>
              </>
            ) : (
              <div className="relative w-full h-full">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="RR Boerboels Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-[rgba(11,11,12,0.8)] rounded-full flex items-center justify-center text-[#F4F1EC] hover:bg-[rgba(199,154,107,0.8)] transition-all z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
