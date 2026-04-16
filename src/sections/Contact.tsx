// src/sections/Contact.tsx - Version dynamisée
import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MessageCircle, Send, Phone, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { contactAPI } from '@/services/api';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error(t('contact.errors.name') || 'Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error(t('contact.errors.email') || 'Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t('contact.errors.emailInvalid') || 'Please enter a valid email address');
      return;
    }
    if (!formData.message.trim()) {
      toast.error(t('contact.errors.message') || 'Please enter your message');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await contactAPI.send(formData);
      
      if (response.data.success) {
        setSubmitStatus('success');
        toast.success(t('contact.success') || 'Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      const errorMsg = error.response?.data?.message || t('contact.errors.general') || 'Failed to send message. Please try again.';
      toast.error(errorMsg);
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Contact information
  const contactInfo = {
    email: 'contact@rrboerboels.com',
    phone: '+261 34 12 345 67',
    whatsapp: '+261 34 12 345 67',
    address: 'Antananarivo, Madagascar',
    hours: 'Mon - Sat: 9:00 - 17:00'
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
            <span className="section-label mb-4 block">{t('contact.label') || 'Contact'}</span>
            <h2 className="text-[clamp(32px,5vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.04em] mb-4">
              {t('contact.heading') || 'Get In Touch'}
            </h2>
            <p className="text-base lg:text-lg text-[#B8B0A8] max-w-2xl mx-auto">
              {t('contact.body') || 'Have questions about our Boerboels or stud services? We\'d love to hear from you.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="glass-card rounded-xl p-6 lg:p-8">
              {submitStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-[#C79A6B]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F4F1EC] mb-2">
                    {t('contact.successTitle') || 'Message Sent!'}
                  </h3>
                  <p className="text-[#B8B0A8]">
                    {t('contact.successMessage') || 'Thank you for contacting us. We\'ll get back to you within 24 hours.'}
                  </p>
                </div>
              ) : submitStatus === 'error' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F4F1EC] mb-2">
                    {t('contact.errorTitle') || 'Something went wrong'}
                  </h3>
                  <p className="text-[#B8B0A8]">
                    {t('contact.errorMessage') || 'Please try again later or contact us directly via email.'}
                  </p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="mt-4 px-4 py-2 bg-[#C79A6B] text-[#0B0B0C] rounded-lg text-sm hover:bg-[#D4AF37] transition-colors"
                  >
                    {t('contact.tryAgain') || 'Try Again'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-[#B8B0A8] mb-2 block">
                      {t('contact.form.name') || 'Name'} <span className="text-[#C79A6B]">*</span>
                    </label>
                    <Input
                      type="text"
                      name="name"
                      placeholder={t('contact.form.namePlaceholder') || 'Your name'}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(199,154,107,0.3)] text-[#F4F1EC] placeholder:text-[#666] focus:border-[#C79A6B] focus:ring-1 focus:ring-[#C79A6B]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#B8B0A8] mb-2 block">
                      {t('contact.form.email') || 'Email'} <span className="text-[#C79A6B]">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder={t('contact.form.emailPlaceholder') || 'your@email.com'}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(199,154,107,0.3)] text-[#F4F1EC] placeholder:text-[#666] focus:border-[#C79A6B] focus:ring-1 focus:ring-[#C79A6B]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#B8B0A8] mb-2 block">
                      {t('contact.form.message') || 'Message'} <span className="text-[#C79A6B]">*</span>
                    </label>
                    <Textarea
                      name="message"
                      placeholder={t('contact.form.messagePlaceholder') || 'Tell us about your interest...'}
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(199,154,107,0.3)] text-[#F4F1EC] placeholder:text-[#666] focus:border-[#C79A6B] focus:ring-1 focus:ring-[#C79A6B] resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C79A6B] text-[#0B0B0C] hover:bg-[#D4AF37] font-semibold transition-colors py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('contact.form.sending') || 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t('contact.form.submit') || 'Send Message'}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-center space-y-4">
              {/* Email */}
              <a
                href={`mailto:${contactInfo.email}?subject=RR%20Boerboels%20Inquiry&body=Hello%20RR%20Boerboels,%0A%0AI'm%20interested%20in%20learning%20more%20about%20your%20Boerboels.%0A%0A`}
                className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#C79A6B] transition-all group hover:scale-[1.02]"
              >
                <div className="w-12 h-12 bg-[rgba(199,154,107,0.15)] rounded-lg flex items-center justify-center group-hover:bg-[rgba(199,154,107,0.25)] transition-colors">
                  <Mail className="w-6 h-6 text-[#C79A6B]" />
                </div>
                <div>
                  <p className="text-sm text-[#B8B0A8]">{t('contact.email') || 'Email Us'}</p>
                  <p className="text-[#F4F1EC] font-medium group-hover:text-[#C79A6B] transition-colors">
                    {contactInfo.email}
                  </p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/\s/g, '')}?text=${encodeURIComponent(
                  'Hello RR Boerboels,\n\nI\'m interested in learning more about your Boerboels.\n\n'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#25D366] transition-all group hover:scale-[1.02]"
              >
                <div className="w-12 h-12 bg-[rgba(37,211,102,0.15)] rounded-lg flex items-center justify-center group-hover:bg-[rgba(37,211,102,0.25)] transition-colors">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm text-[#B8B0A8]">{t('contact.whatsapp') || 'WhatsApp'}</p>
                  <p className="text-[#F4F1EC] font-medium group-hover:text-[#25D366] transition-colors">
                    {contactInfo.whatsapp}
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#C79A6B] transition-all group hover:scale-[1.02]"
              >
                <div className="w-12 h-12 bg-[rgba(199,154,107,0.15)] rounded-lg flex items-center justify-center group-hover:bg-[rgba(199,154,107,0.25)] transition-colors">
                  <Phone className="w-6 h-6 text-[#C79A6B]" />
                </div>
                <div>
                  <p className="text-sm text-[#B8B0A8]">{t('contact.phone') || 'Call Us'}</p>
                  <p className="text-[#F4F1EC] font-medium group-hover:text-[#C79A6B] transition-colors">
                    {contactInfo.phone}
                  </p>
                </div>
              </a>

              {/* Address */}
              <div className="glass-card rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-[rgba(199,154,107,0.15)] rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#C79A6B]" />
                </div>
                <div>
                  <p className="text-sm text-[#B8B0A8]">{t('contact.address') || 'Location'}</p>
                  <p className="text-[#F4F1EC] font-medium">{contactInfo.address}</p>
                  <p className="text-xs text-[#666] mt-1">{contactInfo.hours}</p>
                </div>
              </div>

              {/* Response Time Note */}
              <div className="mt-4 p-3 bg-[rgba(199,154,107,0.1)] border border-[rgba(199,154,107,0.2)] rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C79A6B]" />
                  <p className="text-xs text-[#B8B0A8]">
                    {t('contact.responseTime') || 'We typically respond within 24 hours during business days.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}