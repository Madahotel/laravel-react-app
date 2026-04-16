import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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
            start: 'top 80%',
            end: 'top 50%',
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#0B0B0C] py-20 lg:py-32 z-[90]"
    >
      <div className="w-full px-6 lg:px-[6vw]">
        <div ref={contentRef} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <span className="section-label mb-4 block">Contact</span>
            <h2 className="text-[clamp(32px,5vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.04em] mb-4">
              {t('contact.heading')}
            </h2>
            <p className="text-base lg:text-lg text-[#B8B0A8] max-w-2xl mx-auto">
              {t('contact.body')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="glass-card rounded-xl p-6 lg:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-[#C79A6B]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F4F1EC] mb-2">Message Sent!</h3>
                  <p className="text-[#B8B0A8]">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-[#B8B0A8] mb-2 block">Name</label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(199,154,107,0.3)] text-[#F4F1EC] placeholder:text-[#666]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#B8B0A8] mb-2 block">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(199,154,107,0.3)] text-[#F4F1EC] placeholder:text-[#666]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#B8B0A8] mb-2 block">Message</label>
                    <Textarea
                      placeholder="Tell us about your interest..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(199,154,107,0.3)] text-[#F4F1EC] placeholder:text-[#666] min-h-[120px]"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#C79A6B] text-[#0B0B0C] hover:bg-[#D4AF37] font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-center space-y-6">
              <a
                href="mailto:contact@doublerboerboels.com"
                className="glass-card rounded-xl p-6 flex items-center gap-4 hover:border-[#C79A6B] transition-colors group"
              >
                <div className="w-12 h-12 bg-[rgba(199,154,107,0.15)] rounded-lg flex items-center justify-center group-hover:bg-[rgba(199,154,107,0.25)] transition-colors">
                  <Mail className="w-6 h-6 text-[#C79A6B]" />
                </div>
                <div>
                  <p className="text-sm text-[#B8B0A8]">{t('contact.email')}</p>
                  <p className="text-[#F4F1EC] font-medium">contact@doublerboerboels.com</p>
                </div>
              </a>

              <a
                href="https://wa.me/261XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-xl p-6 flex items-center gap-4 hover:border-[#C79A6B] transition-colors group"
              >
                <div className="w-12 h-12 bg-[rgba(37,211,102,0.15)] rounded-lg flex items-center justify-center group-hover:bg-[rgba(37,211,102,0.25)] transition-colors">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm text-[#B8B0A8]">{t('contact.whatsapp')}</p>
                  <p className="text-[#F4F1EC] font-medium">+261 XX XXX XXXX</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
