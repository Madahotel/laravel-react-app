import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative w-full bg-[#0B0B0C] border-t border-[rgba(199,154,107,0.15)] z-[80]">
      <div className="w-full px-6 lg:px-[6vw] py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block mb-6"
            >
<span className="text-2xl font-bold tracking-wider text-[#F4F1EC]">
  RR <span className="text-[#C79A6B]">Boerboels</span>
</span>
            </a>
            <p className="text-[#B8B0A8] max-w-md mb-6">
              Elite Boerboel breeding in Madagascar. Champion bloodlines, health-tested, SABBS registered.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://wa.me/261346639119"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-lg flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.25)] transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@rrboerboels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[rgba(199,154,107,0.15)] border border-[rgba(199,154,107,0.3)] rounded-lg flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.25)] transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#F4F1EC] uppercase tracking-wider mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {['males', 'females', 'litters', 'products', 'book', 'contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item)}
                    className="text-[#B8B0A8] hover:text-[#C79A6B] transition-colors text-sm"
                  >
                    {t(`nav.${item}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[#F4F1EC] uppercase tracking-wider mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C79A6B] mt-0.5 flex-shrink-0" />
                <span className="text-[#B8B0A8] text-sm">Antananarivo, Madagascar</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C79A6B] mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@rrboerboels.com" className="text-[#B8B0A8] text-sm hover:text-[#C79A6B] transition-colors">
                  contact@doublerboerboels.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#C79A6B] mt-0.5 flex-shrink-0" />
                <a href="https://wa.me/261346639119" className="text-[#B8B0A8] text-sm hover:text-[#C79A6B] transition-colors">
                  +261 34 66 391 19
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[rgba(199,154,107,0.1)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B6560]">
            {t('footer.copyright')} {currentYear}
          </p>
          <div className="flex items-center gap-6">
            <button className="text-sm text-[#6B6560] hover:text-[#B8B0A8] transition-colors">
              {t('footer.privacy')}
            </button>
            <button className="text-sm text-[#6B6560] hover:text-[#B8B0A8] transition-colors">
              {t('footer.terms')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
