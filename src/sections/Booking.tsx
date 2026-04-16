// src/sections/Booking.tsx - Version corrigée
import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Calendar, Check, ChevronLeft, ChevronRight, Mail, Phone, User, PawPrint, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { bookingAPI } from '@/services/api';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const monthNames = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
};

const weekDays = {
  en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  fr: ['L', 'M', 'M', 'J', 'V', 'S', 'D']
};

interface BookingFormData {
  owner_name: string;
  email: string;
  phone: string;
  bitch_reg_name: string;
  bitch_name: string;
  bitch_breed: string;
  bitch_age: string;
  previous_pregnancies: string;
  message: string;
}

// Données de fallback pour les studs
const fallbackStuds = [
  { id: 1, name: 'CDH Oliver', registration: 'SABBS', color: 'Solid Black' }
];

export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState<BookingFormData>({
    owner_name: '',
    email: '',
    phone: '',
    bitch_reg_name: '',
    bitch_name: '',
    bitch_breed: '',
    bitch_age: '',
    previous_pregnancies: '',
    message: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableStuds, setAvailableStuds] = useState<any[]>([]);
  const [selectedStud, setSelectedStud] = useState<any>(null);
  const [loadingStuds, setLoadingStuds] = useState(true);

  // Fetch available studs from API
  useEffect(() => {
    const fetchAvailableStuds = async () => {
      try {
        // Essayer d'abord la route admin (qui existe)
        let data = [];
        try {
          const response = await fetch('/api/admin/dogs');
          if (response.ok) {
            const allDogs = await response.json();
            // Filtrer les mâles
            data = allDogs.filter((dog: any) => dog.role === 'male');
          } else {
            throw new Error('Admin API not available');
          }
        } catch (error) {
          console.log('Admin API not available, trying public API');
          try {
            const publicResponse = await fetch('/api/public/dogs?role=male');
            if (publicResponse.ok) {
              data = await publicResponse.json();
            } else {
              throw new Error('Public API not available');
            }
          } catch (publicError) {
            console.log('Using fallback stud data');
            data = fallbackStuds;
          }
        }
        
        setAvailableStuds(data);
        if (data.length > 0) {
          setSelectedStud(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch studs:', error);
        setAvailableStuds(fallbackStuds);
        setSelectedStud(fallbackStuds[0]);
      } finally {
        setLoadingStuds(false);
      }
    };
    fetchAvailableStuds();
  }, []);

  // Fetch booked dates from API
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await bookingAPI.getAvailableDates();
        setBookedDates(response.data.booked_dates || []);
      } catch (error) {
        console.error('Failed to fetch booked dates:', error);
        setBookedDates([]);
      }
    };
    fetchBookedDates();
  }, []);

  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Ajuster pour que la semaine commence Lundi (1 = Lundi)
    let startOffset = firstDay - 1;
    if (firstDay === 0) startOffset = 6;
    
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isPast = date < today;
      const isBooked = bookedDates.includes(dateStr);
      const isAvailable = !isPast && !isBooked;
      
      days.push({
        day: i,
        dateStr,
        isPast,
        isBooked,
        isAvailable,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNamesList = monthNames[language as keyof typeof monthNames] || monthNames.en;
  const weekDaysList = weekDays[language as keyof typeof weekDays] || weekDays.en;

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedDate) {
      toast.error(t('booking.errors.noDate') || 'Please select a date');
      return;
    }
    if (!formData.owner_name) {
      toast.error(t('booking.errors.noOwner') || 'Please enter your name');
      return;
    }
    if (!formData.email) {
      toast.error(t('booking.errors.noEmail') || 'Please enter your email');
      return;
    }
    if (!formData.phone) {
      toast.error(t('booking.errors.noPhone') || 'Please enter your phone number');
      return;
    }
    if (!formData.bitch_reg_name) {
      toast.error(t('booking.errors.noRegName') || 'Please enter the female dog registration name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await bookingAPI.create({
        bitch_reg_name: formData.bitch_reg_name,
        owner_name: formData.owner_name,
        email: formData.email,
        phone: formData.phone,
        booking_date: selectedDate,
        message: `
          ${formData.message ? `Message: ${formData.message}\n\n` : ''}
          --- Additional Information ---
          Female Dog Name: ${formData.bitch_name || 'Not provided'}
          Breed: ${formData.bitch_breed || 'Not provided'}
          Age: ${formData.bitch_age || 'Not provided'}
          Previous Pregnancies: ${formData.previous_pregnancies || 'Not provided'}
          Selected Stud: ${selectedStud?.name || 'Not specified'}
        `
      });
      
      if (response.data.success) {
        toast.success(t('booking.success') || 'Booking request sent successfully!');
        setIsDialogOpen(true);
        
        // Reset form
        setFormData({
          owner_name: '',
          email: '',
          phone: '',
          bitch_reg_name: '',
          bitch_name: '',
          bitch_breed: '',
          bitch_age: '',
          previous_pregnancies: '',
          message: '',
        });
        setSelectedDate(null);
      }
    } catch (error: any) {
      console.error('Booking failed:', error);
      const errorMsg = error.response?.data?.message || t('booking.errors.general') || 'Failed to submit booking. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // WhatsApp link with pre-filled message
  const whatsappMessage = `Hello RR Boerboels,%0A%0AI'm interested in booking a stud service for my female dog.%0A%0A${selectedStud ? `Stud: ${selectedStud.name}%0A` : ''}${selectedDate ? `Preferred Date: ${new Date(selectedDate).toLocaleDateString()}%0A` : ''}%0AOwner: ${formData.owner_name || 'Not provided'}%0ABitch: ${formData.bitch_reg_name || 'Not provided'}%0A%0APlease contact me for more details.`;
  const whatsappLink = `https://wa.me/261341234567?text=${whatsappMessage}`;

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
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(11,11,12,0.95)] via-[rgba(11,11,12,0.8)] to-[rgba(11,11,12,0.85)] sm:from-[rgba(11,11,12,0.9)] sm:via-[rgba(11,11,12,0.6)] sm:to-[rgba(11,11,12,0.7)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-3 sm:px-6 lg:px-[6vw] py-16 sm:py-0">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 lg:gap-16 w-full max-w-7xl mx-auto">
            {/* Form Card */}
            <div
              ref={formRef}
              className="glass-card p-4 sm:p-6 lg:p-8 w-full lg:w-[50%] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg sm:text-xl font-bold text-[#F4F1EC] mb-4 sm:mb-6 flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-[#C79A6B]" />
                {t('booking.form.title') || 'Book a Stud Service'}
              </h3>

              {/* Select Stud */}
              {!loadingStuds && availableStuds.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <label className="text-xs sm:text-sm text-[#B8B0A8] mb-2 block">
                    {t('booking.form.selectStud') || 'Select Stud'} *
                  </label>
                  <select
                    value={selectedStud?.id || ''}
                    onChange={(e) => {
                      const stud = availableStuds.find(s => s.id === parseInt(e.target.value));
                      setSelectedStud(stud);
                    }}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B] transition-colors"
                  >
                    <option value="" className="bg-[#0B0B0C]">Select a stud</option>
                    {availableStuds.map((stud) => (
                      <option key={stud.id} value={stud.id} className="bg-[#0B0B0C]">
                        {stud.name} - {stud.registration || 'SABBS'} ({stud.color || 'Black'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Calendar */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <button 
                    onClick={prevMonth}
                    className="text-[#B8B0A8] hover:text-[#C79A6B] transition-colors p-1"
                    type="button"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <span className="text-sm sm:text-base text-[#F4F1EC] font-semibold">
                    {monthNamesList[currentMonth]} {currentYear}
                  </span>
                  <button 
                    onClick={nextMonth}
                    className="text-[#B8B0A8] hover:text-[#C79A6B] transition-colors p-1"
                    type="button"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  {weekDaysList.map((day, i) => (
                    <div key={i} className="text-center text-[10px] sm:text-xs text-[#B8B0A8] py-1 sm:py-2 font-semibold">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day ? (
                        <button
                          onClick={() => day.isAvailable && setSelectedDate(day.dateStr)}
                          disabled={!day.isAvailable}
                          type="button"
                          className={`w-full h-full rounded-md sm:rounded-lg text-[10px] sm:text-sm font-medium transition-all duration-200 ${
                            selectedDate === day.dateStr
                              ? 'bg-[#C79A6B] text-[#0B0B0C] ring-2 ring-[#C79A6B]/50 scale-95'
                              : day.isPast
                              ? 'text-[#555] cursor-not-allowed bg-[rgba(85,85,85,0.1)] line-through'
                              : day.isBooked
                              ? 'bg-[rgba(100,100,100,0.2)] text-[#666] cursor-not-allowed line-through'
                              : 'text-[#F4F1EC] hover:bg-[rgba(199,154,107,0.2)] hover:scale-95'
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
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded border border-[#555] bg-transparent" />
                    <span className="text-[#B8B0A8]">Available</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-[rgba(85,85,85,0.1)] border border-[#555]" />
                    <span className="text-[#B8B0A8]">Past</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Female Dog Registration Name (Bitch Reg Name) - REQUIRED */}
                <div>
                  <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">
                    {t('booking.form.bitchRegName') || 'Female Dog Registration Name'} <span className="text-[#C79A6B]">*</span>
                  </label>
                  <input
                    type="text"
                    name="bitch_reg_name"
                    value={formData.bitch_reg_name}
                    onChange={handleInputChange}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] focus:ring-1 focus:ring-[#C79A6B] transition-all"
                    placeholder="e.g., SABBS registered name"
                    required
                  />
                  <p className="text-[10px] text-[#666] mt-1">
                    {t('booking.form.bitchRegNameHelp') || 'Official registration name of your female dog'}
                  </p>
                </div>

                {/* Female Dog Name */}
                <div>
                  <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">
                    {t('booking.form.bitchName') || 'Female Dog Name'}
                  </label>
                  <input
                    type="text"
                    name="bitch_name"
                    value={formData.bitch_name}
                    onChange={handleInputChange}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors"
                    placeholder="e.g., Bella"
                  />
                </div>

                {/* Breed & Age Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">
                      {t('booking.form.bitchBreed') || 'Breed'}
                    </label>
                    <input
                      type="text"
                      name="bitch_breed"
                      value={formData.bitch_breed}
                      onChange={handleInputChange}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors"
                      placeholder="e.g., Boerboel"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">
                      {t('booking.form.bitchAge') || 'Age'}
                    </label>
                    <input
                      type="text"
                      name="bitch_age"
                      value={formData.bitch_age}
                      onChange={handleInputChange}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors"
                      placeholder="e.g., 2 years"
                    />
                  </div>
                </div>

                {/* Previous Pregnancies */}
<div>
  <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1.5 block font-medium">
    {t('booking.form.previousPregnancies') || 'Previous Pregnancies'}
  </label>
  <select
    name="previous_pregnancies"
    value={formData.previous_pregnancies}
    onChange={handleInputChange}
    className="w-full bg-[#1C1C1E] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] 
      focus:outline-none focus:border-[#C79A6B] focus:ring-2 focus:ring-[#C79A6B]/20 
      hover:border-[rgba(199,154,107,0.5)] transition-all duration-200
      cursor-pointer appearance-none
      bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23C79A6B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')]
      bg-no-repeat bg-right-1rem"
    style={{
      backgroundPosition: 'right 1rem center',
      backgroundSize: '1rem',
      WebkitAppearance: 'none',
      MozAppearance: 'none'
    }}
  >
    <option value="" className="bg-[#1C1C1E] text-[#B8B0A8]">
      {t('booking.form.selectOption') || '— Select an option —'}
    </option>
    <option value="0" className="bg-[#1C1C1E] text-[#F4F1EC]">
      {t('booking.form.firstTime') || '0 (First time)'}
    </option>
    <option value="1" className="bg-[#1C1C1E] text-[#F4F1EC]">1</option>
    <option value="2" className="bg-[#1C1C1E] text-[#F4F1EC]">2</option>
    <option value="3+" className="bg-[#1C1C1E] text-[#F4F1EC]">
      {t('booking.form.threeOrMore') || '3 or more'}
    </option>
  </select>
  
  {/* Indicateur visuel optionnel */}
  <p className="text-[10px] text-[#6B6560] mt-1 flex items-center gap-1">
    <span className="inline-block w-1 h-1 bg-[#C79A6B] rounded-full"></span>
    {t('booking.form.previousPregnanciesHelp') || 'Number of previous litters from this female'}
  </p>
</div>
                
                {/* Owner Info Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">
                      {t('booking.form.ownerName') || 'Owner Name'} <span className="text-[#C79A6B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="owner_name"
                      value={formData.owner_name}
                      onChange={handleInputChange}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">
                      {t('booking.form.email') || 'Email'} <span className="text-[#C79A6B]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">
                    {t('booking.form.phone') || 'Phone'} <span className="text-[#C79A6B]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors"
                    placeholder="+261 XX XXX XXXX"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm text-[#B8B0A8] mb-1 block">
                    {t('booking.form.message') || 'Message / Special Requests'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] transition-colors resize-none"
                    placeholder="Any special requests or questions..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary rounded-lg flex items-center justify-center gap-2 py-3 font-semibold"
                  disabled={!selectedDate || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('booking.form.sending') || 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      {t('booking.form.cta') || 'Request Booking'}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Content */}
            <div
              ref={contentRef}
              className="hidden lg:flex flex-col justify-center w-full lg:w-[45%]"
            >
              <span className="section-label mb-4">RR BOERBOELS</span>
              
              <h2 className="text-[clamp(24px,4vw,56px)] font-bold text-[#F4F1EC] uppercase leading-[1] tracking-[0.04em] sm:tracking-[0.06em] mb-4 sm:mb-6">
                {t('booking.headline') || 'Book a Stud'}
              </h2>
              
              <p className="text-sm sm:text-base lg:text-lg text-[#B8B0A8] leading-relaxed mb-6 sm:mb-8">
                {t('booking.body') || 'Reserve your preferred date for our champion stud dogs. We\'ll confirm your booking within 24 hours.'}
              </p>

              {/* Stud info */}
              {selectedStud && (
                <div className="glass-card p-4 sm:p-6 mb-6 sm:mb-8">
                  <h4 className="text-[#C79A6B] font-semibold mb-3 text-sm sm:text-base flex items-center gap-2">
                    <PawPrint className="w-4 h-4" />
                    {t('booking.availableStud') || 'Selected Stud'}
                  </h4>
                  <div className="flex items-center gap-3 sm:gap-4">
                    {selectedStud.image && (
                      <img
                        src={selectedStud.image.startsWith('http') ? selectedStud.image : `http://localhost:8000/storage/${selectedStud.image}`}
                        alt={selectedStud.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="text-[#F4F1EC] font-semibold text-sm sm:text-base">{selectedStud.name}</p>
                      <p className="text-xs sm:text-sm text-[#B8B0A8]">{selectedStud.registration || 'SABBS'} • {selectedStud.color || 'Solid Black'}</p>
                      <p className="text-xs sm:text-sm text-[#C79A6B]">{t('booking.contactForFee') || 'Contact for fee'}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* WhatsApp Contact */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C79A6B] hover:text-[#D4AF37] transition-colors text-sm sm:text-base mb-3 w-fit"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('booking.whatsapp') || 'Contact us on WhatsApp'}
              </a>

              {/* Email Contact */}
              <a
                href="mailto:info@rr-boerboels.com?subject=Stud%20Booking%20Inquiry&body=Hello%20RR%20Boerboels%2C%0A%0AI'm%20interested%20in%20booking%20a%20stud%20service."
                className="inline-flex items-center gap-2 text-[#B8B0A8] hover:text-[#C79A6B] transition-colors text-sm w-fit"
              >
                <Mail className="w-4 h-4" />
                info@rr-boerboels.com
              </a>

              {/* Phone Contact */}
              <a
                href="tel:+261341234567"
                className="inline-flex items-center gap-2 text-[#B8B0A8] hover:text-[#C79A6B] transition-colors text-sm mt-2 w-fit"
              >
                <Phone className="w-4 h-4" />
                +261 34 12 345 67
              </a>

              {/* Note about email confirmation */}
              <div className="mt-6 p-3 bg-[rgba(199,154,107,0.1)] border border-[rgba(199,154,107,0.2)] rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#C79A6B] mt-0.5" />
                  <p className="text-xs text-[#B8B0A8]">
                    {t('booking.emailNote') || 'A confirmation email will be sent to your email address after booking.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] text-[#F4F1EC] mx-4 max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-[#C79A6B]" />
              </div>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-[#C79A6B] text-center">
              {t('booking.confirmation.title') || 'Booking Request Received!'}
            </DialogTitle>
            <DialogDescription className="text-[#B8B0A8] text-sm sm:text-base text-center">
              {t('booking.confirmation.message') || 'Thank you for your interest in RR Boerboels stud service.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="glass-card p-3 sm:p-4 mb-4">
              <p className="text-xs sm:text-sm text-[#B8B0A8]">{t('booking.confirmation.selectedDate') || 'Selected Date'}:</p>
              <p className="text-sm sm:text-base text-[#F4F1EC] font-semibold">
                {selectedDate && new Date(selectedDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="glass-card p-3 sm:p-4 mb-4">
              <p className="text-xs sm:text-sm text-[#B8B0A8]">{t('booking.confirmation.stud') || 'Selected Stud'}:</p>
              <p className="text-sm sm:text-base text-[#F4F1EC] font-semibold">
                {selectedStud?.name || 'CDH Oliver'}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#B8B0A8] text-center">
              {t('booking.confirmation.emailSent') || `A confirmation has been sent to ${formData.email}. We'll review your request and get back to you within 24 hours.`}
            </p>
          </div>
          <button
            onClick={() => setIsDialogOpen(false)}
            className="w-full btn-primary rounded-lg py-2 mt-2"
          >
            {t('booking.confirmation.close') || 'Close'}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}