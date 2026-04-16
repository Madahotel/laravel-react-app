import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Store, Pill, Droplets, Sparkles, Bone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    key: 'multivitamins',
    name: 'Multivitamines 15 en 1',
    nameFr: 'Multivitamines 15 en 1',
    description: 'Pour chiens et chats',
    descriptionFr: 'Pour chiens et chats',
    currency: 'Ariary',
    icon: Pill,
  },
  {
    id: 2,
    key: 'calcium',
    name: 'Calcium',
    nameFr: 'Calcium',
    description: 'Pour chiens',
    descriptionFr: 'Pour chiens',
    currency: 'Ariary',
    icon: Bone,
  },
  {
    id: 3,
    key: 'shampoo',
    name: 'Shampoing',
    nameFr: 'Shampoing',
    description: 'Pour animaux',
    descriptionFr: 'Pour animaux',
    currency: 'Ariary',
    icon: Droplets,
  },
  {
    id: 4,
    key: 'salmonOil',
    name: 'Huile de Saumon',
    nameFr: 'Huile de Saumon',
    description: 'Omega-3 pour chiens',
    descriptionFr: 'Omega-3 pour chiens',
    currency: 'Ariary',
    icon: Sparkles,
  },
];

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t, language } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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

  const getProductName = (item: typeof products[0]) => {
    return language === 'fr' ? item.nameFr : item.name;
  };

  const getProductDesc = (item: typeof products[0]) => {
    return language === 'fr' ? item.descriptionFr : item.description;
  };

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative w-full bg-[#0B0B0C] py-16 sm:py-20 lg:py-32 z-[75]"
    >
      <div className="w-full px-4 sm:px-6 lg:px-[6vw]">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-10 sm:mb-16">
          <span className="section-label mb-3 sm:mb-4 block">{t('products.label')}</span>
          <h2 className="text-[clamp(24px,4vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.06em] mb-3 sm:mb-4">
            {t('products.heading')}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#B8B0A8] max-w-xl mx-auto">
            {t('products.body')}
          </p>
          
          {/* In-store notice */}
          <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-lg">
            <Store className="w-4 h-4 text-[#C79A6B]" />
            <span className="text-xs sm:text-sm text-[#C79A6B] font-medium">{t('products.instore')}</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-[#141414] border border-[rgba(199,154,107,0.15)] hover:border-[rgba(199,154,107,0.4)] transition-all duration-300 h-full">
                  {/* Coming Soon Placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-[rgba(199,154,107,0.05)] to-[rgba(199,154,107,0.15)] flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Pattern background */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="w-full h-full" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, #C79A6B 0, #C79A6B 1px, transparent 0, transparent 50%)`,
                        backgroundSize: '20px 20px'
                      }} />
                    </div>
                    
                    {/* Icon */}
                    <div className="relative w-14 h-14 sm:w-20 sm:h-20 bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                      <Icon className="w-7 h-7 sm:w-10 sm:h-10 text-[#C79A6B]" />
                    </div>
                    
                    {/* Coming Soon Badge */}
                    <div className="relative px-3 sm:px-4 py-1.5 sm:py-2 bg-[rgba(199,154,107,0.2)] border border-[rgba(199,154,107,0.4)] rounded-full">
                      <span className="text-[10px] sm:text-xs font-bold text-[#C79A6B] uppercase tracking-wider">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-3 sm:p-5">
                    <h3 className="text-sm sm:text-lg font-bold text-[#F4F1EC] mb-1">
                      {getProductName(product)}
                    </h3>
                    <p className="text-[10px] sm:text-sm text-[#B8B0A8] mb-2 sm:mb-3">
                      {getProductDesc(product)}
                    </p>
                    
                    {/* Currency only */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-[#C79A6B]">
                        {product.currency}
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
  );
}
