// src/components/Products.tsx
import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Store, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: number;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  price: number | null;
  currency: string;
  image: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t, language } = useLanguage();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Utiliser la route publique pour les produits
        const response = await api.get('/public/products');
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useLayoutEffect(() => {
    // Re-run animations when products are loaded
    if (loading) return;
    
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
  }, [loading, products]);

  const getProductName = (product: Product) => {
    return language === 'fr' ? product.name_fr : product.name_en;
  };

  const getProductDesc = (product: Product) => {
    return language === 'fr' ? product.description_fr : product.description_en;
  };

  // Filtrer pour n'afficher que les produits disponibles
  const availableProducts = products.filter(product => product.is_available);

  if (loading) {
    return (
      <section
        ref={sectionRef}
        id="products"
        className="relative w-full bg-[#0B0B0C] py-16 sm:py-20 lg:py-32 z-[75]"
      >
        <div className="w-full px-4 sm:px-6 lg:px-[6vw]">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#C79A6B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

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
        {availableProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-[#666] mx-auto mb-4" />
            <p className="text-[#B8B0A8]">No products available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {availableProducts.map((product, index) => (
              <div
                key={product.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-[#141414] border border-[rgba(199,154,107,0.15)] hover:border-[rgba(199,154,107,0.4)] transition-all duration-300 h-full">
                  {/* Product Image or Placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-[rgba(199,154,107,0.05)] to-[rgba(199,154,107,0.15)] flex flex-col items-center justify-center relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={`http://localhost:8000/storage/${product.image}`}
                        alt={getProductName(product)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {/* Pattern background */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="w-full h-full" style={{
                            backgroundImage: `repeating-linear-gradient(45deg, #C79A6B 0, #C79A6B 1px, transparent 0, transparent 50%)`,
                            backgroundSize: '20px 20px'
                          }} />
                        </div>
                        
                        {/* Icon */}
                        <div className="relative w-14 h-14 sm:w-20 sm:h-20 bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                          <Package className="w-7 h-7 sm:w-10 sm:h-10 text-[#C79A6B]" />
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-3 sm:p-5">
                    <h3 className="text-sm sm:text-lg font-bold text-[#F4F1EC] mb-1">
                      {getProductName(product)}
                    </h3>
                    <p className="text-[10px] sm:text-sm text-[#B8B0A8] mb-2 sm:mb-3 line-clamp-2">
                      {getProductDesc(product)}
                    </p>
                    
                    {/* Price or Contact */}
                    <div className="flex items-center justify-between">
                      {product.price ? (
                        <span className="text-xs sm:text-sm font-semibold text-[#C79A6B]">
                          {Number(product.price).toLocaleString()} {product.currency}
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm text-[#C79A6B]">
                          Contact for price
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}