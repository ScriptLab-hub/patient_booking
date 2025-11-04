
import React from 'react';

const TestimonialCard: React.FC<{ quote: string; name: string; location: string; avatar: string }> = ({ quote, name, location, avatar }) => (
  <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
    <img src={avatar} alt={name} className="w-20 h-20 rounded-full mb-4 object-cover" />
    <p className="text-gray-600 italic mb-4">"{quote}"</p>
    <div className="font-semibold text-gray-800">{name}</div>
    <div className="text-sm text-gray-500">{location}</div>
  </div>
);

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: 'Booking a doctor has never been this easy! The system is intuitive and saved me so much time.',
      name: 'Sara K.',
      location: 'Lahore',
      avatar: 'https://picsum.photos/seed/sara/100/100'
    },
    {
      quote: 'I love the instant confirmation and reminders. It\'s a very professional and reliable service.',
      name: 'Ahmed R.',
      location: 'Karachi',
      avatar: 'https://picsum.photos/seed/ahmed/100/100'
    },
     {
      quote: 'Finally, a modern solution for healthcare appointments. Highly recommended for its simplicity and design!',
      name: 'Fatima A.',
      location: 'Islamabad',
      avatar: 'https://picsum.photos/seed/fatima/100/100'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Patients Say</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Real stories from our users who love our platform.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
