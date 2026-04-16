import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'The Breed', href: '#breed' },
    { label: 'About Us', href: '#about' },
    { label: 'Our Dogs', href: '#dogs' },
    { label: 'Litters', href: '#litters' },
    { label: 'Health', href: '#health' },
    { label: 'Stud Services', href: '#stud' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#141415] border-t border-[rgba(199,154,107,0.1)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-wider text-[#F4F1EC]">
                RR <span className="text-[#C79A6B]">BOERBOELS</span>
              </span>
            </a>
            <p className="text-[#B8B0A8] mb-6">
              Elite Boerboel breeding in Madagascar. Champion bloodlines, health-tested, SABBS registered.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-[#1C1C1E] border border-[rgba(199,154,107,0.2)] rounded-lg flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.1)] transition-all"
                aria-label="Facebook"
              >
                f
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#1C1C1E] border border-[rgba(199,154,107,0.2)] rounded-lg flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.1)] transition-all"
                aria-label="Instagram"
              >
                📷
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#1C1C1E] border border-[rgba(199,154,107,0.2)] rounded-lg flex items-center justify-center text-[#C79A6B] hover:bg-[rgba(199,154,107,0.1)] transition-all"
                aria-label="YouTube"
              >
                ▶
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-[#F4F1EC] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-[#B8B0A8] hover:text-[#C79A6B] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-[#F4F1EC] mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:contact@rrboerboels.com"
                  className="text-[#B8B0A8] hover:text-[#C79A6B] transition-colors"
                >
                  contact@rrboerboels.com
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/261341234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B8B0A8] hover:text-[#C79A6B] transition-colors"
                >
                  +261 34 12 345 67
                </a>
              </li>
              <li className="text-[#B8B0A8]">
                Antananarivo, Madagascar
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[rgba(199,154,107,0.1)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-[#6B6560] text-sm flex items-center justify-center gap-1">
            © {currentYear} RR Boerboels. Made with <Heart size={14} className="text-[#C79A6B]" /> in Madagascar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
