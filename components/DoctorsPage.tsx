import React from 'react';
import { Page } from '../App';

interface DoctorsPageProps {
  navigate: (page: Page) => void;
}

const doctors = [
  { name: 'Dr. Evelyn Reed', specialty: 'Cardiologist', bio: 'Expert in heart-related diseases with over 15 years of experience.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Dr. Marcus Thorne', specialty: 'Dermatologist', bio: 'Specializing in skin health and cosmetic dermatology.', image: 'https://images.unsplash.com/photo-1622253692010-333f2da60710?q=80&w=1964&auto=format&fit=crop' },
  { name: 'Dr. Lena Petrova', specialty: 'Pediatrician', bio: 'Dedicated to providing comprehensive healthcare for children.', image: 'https://images.unsplash.com/photo-1612349316228-5942a9b489c2?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Dr. Samuel Chen', specialty: 'Neurologist', bio: 'Focused on disorders of the nervous system.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop' },
];

const DoctorsPage: React.FC<DoctorsPageProps> = ({ navigate }) => {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Certified Professionals</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Meet our team of experienced and dedicated doctors, ready to provide you with the best care.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center transform hover:-translate-y-2">
              <img src={doctor.image} alt={doctor.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
              <p className="text-primary font-semibold mb-2">{doctor.specialty}</p>
              <p className="text-gray-600 text-sm">{doctor.bio}</p>
            </div>
          ))}
        </div>
         <div className="text-center mt-12">
            <button onClick={() => navigate('book')} className="bg-accent text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-teal-600 transition-all">
                Book an Appointment Now
            </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
