// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

// Import des pages Admin
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import BookingsManagement from '@/components/admin/BookingsManagement';
import MessagesManagement from '@/components/admin/MessagesManagement';
import WaitlistManagement from '@/components/admin/WaitlistManagement';
import NewsManagement from '@/components/admin/NewsManagement';
import ProductsManagement from '@/components/admin/ProductsManagement';
import KennelManagement from '@/components/admin/KennelManagement';
import Settings from '@/components/admin/Settings';
import GalleryManagement from '@/components/admin/GalleryManagement';

// Composant pour la page d'accueil
function HomePage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
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
  );
}

// Composant pour les routes protégées
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('admin_token');
    return !!token && token !== 'undefined' && token !== 'null';
  };

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Layout pour les pages admin (avec sidebar et header)
function AdminLayout() {
  return <AdminDashboard />;
}

// Composant principal App
function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Route publique - Page d'accueil */}
          <Route path="/" element={<HomePage />} />
          
          {/* Routes d'authentification admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Routes admin protégées avec layout */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            {/* Dashboard principal */}
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            
            {/* Gestion des réservations */}
            <Route path="bookings" element={<BookingsManagement />} />
            
            {/* Gestion des messages */}
            <Route path="messages" element={<MessagesManagement />} />
            
            {/* Gestion de la liste d'attente */}
            <Route path="waitlist" element={<WaitlistManagement />} />
            
            {/* Gestion des actualités */}
            <Route path="news" element={<NewsManagement />} />
            
            {/* Gestion des produits */}
            <Route path="products" element={<ProductsManagement />} />
            
            {/* Gestion du chenil (chiens) */}
            <Route path="kennel" element={<KennelManagement />} />
            
            {/* Paramètres */}
            <Route path="settings" element={<Settings />} />
            <Route path="gallery" element={<GalleryManagement />} />
          </Route>
          
          {/* Redirection pour les routes non trouvées */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;