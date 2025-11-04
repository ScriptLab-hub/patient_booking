
import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: '📝',
      title: 'Register as Patient',
      description: 'Create your secure account in seconds to get started with our platform.'
    },
    {
      icon: '👨‍⚕️',
      title: 'Choose Doctor & Date',
      description: 'Browse our list of certified professionals and select a time that works for you.'
    },
    {
      icon: '✅',
      title: 'Get Confirmation Instantly',
      description: 'Receive an instant confirmation of your booking via email and SMS.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Booking an appointment is as easy as 1, 2, 3. We've simplified the process to save you time and effort.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
