import { useEffect } from 'react';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Breed from './sections/Breed';
import FeaturedMale from './sections/FeaturedMale';
import FeaturedFemale from './sections/FeaturedFemale';
import UpcomingLitters from './sections/UpcomingLitters';
import PedigreeHealth from './sections/PedigreeHealth';
import Booking from './sections/Booking';
import Products from './sections/Products';
import News from './sections/News';
import MeetTheDogs from './sections/MeetTheDogs';
import VideoSection from './sections/VideoSection';
import Visit from './sections/Visit';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import Chatbot from './components/Chatbot';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0B0B0C] overflow-x-hidden">
        <Header />
        <main>
          <Hero />
          <VideoSection />
          <Breed />
          <FeaturedMale />
          <FeaturedFemale />
          <UpcomingLitters />
          <PedigreeHealth />
          <Booking />
          <Products />
          <News />
          <MeetTheDogs />
          <Visit />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </LanguageProvider>
  );
}

export default App;
