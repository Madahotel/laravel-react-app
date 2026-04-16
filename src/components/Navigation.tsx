import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#breed', label: 'The Breed' },
    { href: '#about', label: 'About' },
    { href: '#dogs', label: 'Our Dogs' },
    { href: '#litters', label: 'Litters' },
    { href: '#health', label: 'Health' },
    { href: '#stud', label: 'Stud' },
    { href: '#contact', label: 'Contact' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#0B0B0C]/98 backdrop-blur-xl shadow-lg' 
          : 'bg-gradient-to-b from-[#0B0B0C]/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center" onClick={(e) => scrollToSection(e, '#home')}>
            <span className="text-2xl font-bold tracking-wider text-[#F4F1EC]">
              RR <span className="text-[#C79A6B]">BOERBOELS</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="nav-link"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <a
            href="https://wa.me/261341234567"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex btn-primary text-xs py-3 px-6"
          >
            WhatsApp Us
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-[#F4F1EC]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-[#0B0B0C]/98 backdrop-blur-xl transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-lg font-medium text-[#F4F1EC] py-2 border-b border-[rgba(199,154,107,0.2)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/261341234567"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center mt-4"
          >
            WhatsApp Us
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
