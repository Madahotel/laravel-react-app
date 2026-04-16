import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useLanguage, type Language } from '../context/LanguageContext';

const navItems = ['males', 'females', 'litters', 'products', 'news', 'book', 'contact'];
const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'mg', label: 'MG' },
  { code: 'es', label: 'ES' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-[rgba(11,11,12,0.98)] backdrop-blur-md border-b border-[rgba(199,154,107,0.2)]'
            : 'bg-[rgba(11,11,12,0.85)] backdrop-blur-sm'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center z-[110]"
            >
              <img
                src="/images/logo.png"
                alt="RR Boerboels"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-xs xl:text-sm font-semibold text-[#B8B0A8] hover:text-[#C79A6B] transition-colors duration-200 tracking-[0.15em] uppercase cursor-pointer"
                >
                  {t(`nav.${item}`)}
                </button>
              ))}
            </nav>

            {/* Right side: Language + WhatsApp (Desktop) */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {/* Language Switcher */}
              <div className="flex items-center gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`text-xs font-medium tracking-wider transition-colors duration-200 px-2 py-1 ${
                      language === lang.code
                        ? 'text-[#C79A6B]'
                        : 'text-[#B8B0A8] hover:text-[#F4F1EC]'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/261341234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#128C7E] transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-[110] w-10 h-10 flex items-center justify-center bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-lg text-[#F4F1EC] hover:bg-[rgba(199,154,107,0.25)] transition-all duration-200"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[rgba(11,11,12,0.98)] backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 pt-20 pb-8 overflow-y-auto">
          {/* Navigation Links */}
          <nav className="flex flex-col items-center gap-4 sm:gap-6 w-full">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-xl sm:text-2xl font-semibold text-[#F4F1EC] hover:text-[#C79A6B] transition-colors duration-200 uppercase tracking-wide py-2 cursor-pointer"
              >
                {t(`nav.${item}`)}
              </button>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-16 h-px bg-[rgba(199,154,107,0.3)] my-6 sm:my-8" />

          {/* Mobile Language Switcher */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-[#B8B0A8]">Langue:</span>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`text-base font-medium tracking-wider transition-colors duration-200 ${
                  language === lang.code
                    ? 'text-[#C79A6B] font-bold'
                    : 'text-[#B8B0A8] hover:text-[#F4F1EC]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Mobile WhatsApp */}
          <a
            href="https://wa.me/261346639119"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-[#128C7E] transition-colors duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
}
