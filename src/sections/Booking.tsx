import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Calendar, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

// Generate calendar days
const generateCalendarDays = () => {
  const days = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const isPast = date < new Date(today.setHours(0, 0, 0, 0));
    const isBooked = [5, 12, 18, 25].includes(i);
    const isAvailable = !isPast && !isBooked;
    
    days.push({
      day: i,
      isPast,
      isBooked,
      isAvailable,
    });
  }
  
  return days;
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bitchName: '',
    message: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const calendarDays = generateCalendarDays();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.12, opacity: 0.7 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        formRef.current,
        { x: '-50vw', opacity: 0, rotateY: 18 },
        { x: 0, opacity: 1, rotateY: 0, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(
        contentRef.current,
        { x: '12vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.08
      );

      scrollTl.fromTo(
        formRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        contentRef.current,
        { x: 0, opacity: 1 },
        { x: '10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, x: 0 },
        { scale: 1.05, x: '6vw', ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && formData.name && formData.email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsDialogOpen(true);
      }, 500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="book"
        className="relative w-full h-screen overflow-hidden z-[70]"
      >
        {/* Background Image */}
        <div ref={bgRef} className="absolute inset-0 w-full h-full">
          <img
            src="/images/booking_stance.jpg"
            alt="Book a stud date"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay - stronger on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(11,11,12,0.95)] via-[rgba(11,11,12,0.8)] to-[rgba(11,11,12,0.85)] sm:from-[rgba(11,11,12,0.9)] sm:via-[rgba(11,11,12,0.6)] sm:to-[rgba(11,11,12,0.7)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-3 sm:px-6 lg:px-[6vw] py-16 sm:py-0">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 lg:gap-16 w-full max-w-7xl mx-auto">
            {/* Form Card */}
            <div
              ref={formRef}
              className="glass-card p-4 sm:p-6 lg:p-8 w-full lg:w-[45%] max-h-[75vh] sm:max-h-[85vh] overflow-y-auto"
            >
              <h3 className="text-lg sm:text-xl font-bold text-[#F4F1EC] mb-4 sm:mb-6">
                {t('booking.form.title')}
              </h3>

              {/* Calendar */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <button className="text-[#B8B0A8] hover:text-[#C79A6B] transition-colors p-1">
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <span className="text-sm sm:text-base text-[#F4F1EC] font-semibold">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <button className="text-[#B8B0A8] hover:text-[#C79A6B] transition-colors p-1">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-[10px] sm:text-xs text-[#B8B0A8] py-1 sm:py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day ? (
                        <button
                          onClick={() => day.isAvailable && setSelectedDate(day.day)}
                          disabled={!day.isAvailable}
                          className={`w-full h-full rounded-md sm:rounded-lg text-[10px] sm:text-sm font-medium transition-all duration-200 ${
                            selectedDate === day.day
                              ? 'bg-[#C79A6B] text-[#0B0B0C]'
                              : day.isPast
                              ? 'text-[#555] cursor-not-allowed'
                              : day.isBooked
                              ? 'bg-[rgba(100,100,100,0.2)] text-[#666] cursor-not-allowed'
                              : 'text-[#F4F1EC] hover:bg-[rgba(199,154,107,0.2)]'
                          }`}
                        >
                          {day.day}
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-[#C79A6B]" />
                    <span className="text-[#B8B0A8]">Selected</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-[rgba(100,100,100,0.3)]" />
                    <span className="text-[#B8B0A8]">Booked</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded border border-[#555]" />
                    <span className="text-[#B8B0A8]">Free</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">{t('booking.form.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">{t('booking.form.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors"
                      placeholder="email@..."
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">{t('booking.form.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors"
                      placeholder="+261..."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">{t('booking.form.bitch')}</label>
                  <input
                    type="text"
                    name="bitchName"
                    value={formData.bitchName}
                    onChange={handleInputChange}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors"
                    placeholder="Registered name"
                  />
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">{t('booking.form.message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors resize-none"
                    placeholder="Message..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary rounded-lg flex items-center justify-center gap-2"
                  disabled={!selectedDate}
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-4 h-4" />
                      Sent
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      {t('booking.form.cta')}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Content - hidden on small mobile */}
            <div
              ref={contentRef}
              className="hidden sm:flex flex-col justify-center w-full lg:w-[45%]"
            >
              <span className="section-label mb-4">{t('booking.label')}</span>
              
              <h2 className="text-[clamp(24px,4vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.04em] sm:tracking-[0.06em] mb-4 sm:mb-6">
                {t('booking.headline')}
              </h2>
              
              <p className="text-sm sm:text-base lg:text-lg text-[#B8B0A8] leading-relaxed mb-6 sm:mb-8">
                {t('booking.body')}
              </p>

              {/* Stud info */}
              <div className="glass-card p-4 sm:p-6 mb-6 sm:mb-8">
                <h4 className="text-[#C79A6B] font-semibold mb-3 text-sm sm:text-base">Available Stud</h4>
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src="/images/dog_oliver.jpg"
                    alt="CDH Oliver"
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-[#F4F1EC] font-semibold text-sm sm:text-base">CDH Oliver</p>
                    <p className="text-xs sm:text-sm text-[#B8B0A8]">SABBS • Solid Black</p>
                    <p className="text-xs sm:text-sm text-[#C79A6B]">Contact for fee</p>
                  </div>
                </div>
              </div>
              
              <a
                href="https://wa.me/261XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#C79A6B] hover:text-[#D4AF37] transition-colors text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('booking.whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] text-[#F4F1EC] mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-[#C79A6B]">
              Request Received!
            </DialogTitle>
            <DialogDescription className="text-[#B8B0A8] text-sm sm:text-base">
              We&apos;ll review your request and confirm within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="glass-card p-3 sm:p-4 mb-4">
              <p className="text-xs sm:text-sm text-[#B8B0A8]">Selected Date:</p>
              <p className="text-sm sm:text-base text-[#F4F1EC] font-semibold">
                {selectedDate} {monthNames[currentMonth]} {currentYear}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#B8B0A8]">
              Confirmation sent to {formData.email}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
