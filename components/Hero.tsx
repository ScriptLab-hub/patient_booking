import React, { useState } from 'react';
import BookingModal from './BookingModal';

const Hero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white pt-20 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                Book Your Doctor Appointment in Minutes
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Find trusted doctors, choose your time, and confirm instantly.
                Your health is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Book Appointment
                </button>
                <button className="bg-transparent text-primary font-bold py-3 px-8 rounded-lg text-lg border-2 border-primary hover:bg-blue-50 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://picsum.photos/id/237/600/800" 
                alt="Doctor smiling" 
                className="rounded-lg shadow-2xl w-full max-w-sm md:max-w-md object-cover" 
                style={{aspectRatio: '3/4'}}
              />
            </div>
          </div>
        </div>
      </section>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Hero;
