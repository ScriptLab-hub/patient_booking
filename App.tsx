import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import BookPage from './components/BookPage';
import DepartmentsPage from './components/DepartmentsPage';
import MyAppointmentsPage from './components/MyAppointmentsPage';
import AboutPage from './components/AboutPage';
import TicketPage from './components/TicketPage';
import { AuthProvider, useAuth } from './components/AuthContext';

export type Page = 'home' | 'login' | 'register' | 'book' | 'departments' | 'my-appointments' | 'about' | 'ticket';

export type NavigateFunction = (page: Page, appointmentId?: number, prefillData?: { department: string; doctor: string }) => void;

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [bookingPrefill, setBookingPrefill] = useState<{ department: string; doctor: string } | null>(null);
  const { user, loading } = useAuth();

  const navigate: NavigateFunction = (page, appointmentId, prefillData) => {
    window.scrollTo(0, 0);
    if (appointmentId !== undefined) {
      setSelectedAppointmentId(appointmentId);
    }
    setBookingPrefill(prefillData || null);
    setCurrentPage(page);
  };
  
  // Protected route logic
  useEffect(() => {
    if (loading) return; // Wait for session check to complete
    const protectedPages: Page[] = ['book', 'my-appointments', 'ticket'];
    if (protectedPages.includes(currentPage) && !user) {
      setCurrentPage('login');
    }
  }, [currentPage, user, loading]);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    switch (currentPage) {
      case 'login':
        return <LoginPage navigate={navigate} />;
      case 'register':
        return <RegisterPage navigate={navigate} />;
      case 'book':
        return user ? <BookPage navigate={navigate} prefillData={bookingPrefill} /> : <LoginPage navigate={navigate} />;
      case 'departments':
        return <DepartmentsPage navigate={navigate} />;
      case 'my-appointments':
        return user ? <MyAppointmentsPage navigate={navigate} /> : <LoginPage navigate={navigate} />;
      case 'about':
        return <AboutPage />;
      case 'ticket':
        return user && selectedAppointmentId ? <TicketPage navigate={navigate} appointmentId={selectedAppointmentId} /> : <MyAppointmentsPage navigate={navigate} />;
      case 'home':
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header navigate={navigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;