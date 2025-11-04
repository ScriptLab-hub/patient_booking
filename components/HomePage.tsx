import React from 'react';
import { useAuth } from './AuthContext';
import { Page } from '../App';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';

interface HomePageProps {
  navigate: (page: Page) => void;
}

const HeroSection: React.FC<HomePageProps> = ({ navigate }) => {
  const { user } = useAuth();

  const handleBookAppointmentClick = () => {
    if (user) {
      navigate('book');
    } else {
      navigate('login');
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6 py-20 md:py-32">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              Your Health, Simplified.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Welcome to MedEase. Find trusted doctors, choose your time, and confirm instantly. Your health is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleBookAppointmentClick}
                className="bg-primary text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book Appointment
              </button>
               <button onClick={() => navigate('login')} className="bg-transparent text-primary font-bold py-3 px-8 rounded-lg text-lg border-2 border-primary hover:bg-blue-50 transition-all duration-300">
                  Login / Sign Up
                </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" 
              alt="Friendly doctor with a laptop" 
              className="rounded-lg shadow-2xl w-full max-w-sm md:max-w-md object-cover" 
              style={{ aspectRatio: '4/3' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <>
      <HeroSection navigate={navigate} />
      <Features />
      <HowItWorks />
      <Testimonials />
    </>
  );
};

export default HomePage;