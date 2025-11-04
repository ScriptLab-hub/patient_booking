import React, { useState } from 'react';
import { Page, NavigateFunction } from '../App';
import { useAuth } from './AuthContext';

interface DepartmentsPageProps {
  navigate: NavigateFunction;
}

interface Doctor {
    name: string;
    experience: string;
    availability: string;
}

interface Department {
    name: string;
    description: string;
    icon: string;
    doctors: Doctor[];
}

const departmentsData: Department[] = [
  { 
    name: 'Cardiology', 
    description: 'Specializing in heart and blood vessel disorders.', 
    icon: '❤️',
    doctors: [
      { name: "Dr. Ayesha Malik", experience: "12 years", availability: "Mon–Fri" },
      { name: "Dr. Hamza Qureshi", experience: "8 years", availability: "Tue–Sat" }
    ]
  },
  { 
    name: 'Dermatology', 
    description: 'Focused on skin health, from cosmetic to surgical.', 
    icon: '✨',
    doctors: [
      { name: "Dr. Sana Tariq", experience: "10 years", availability: "Mon–Thu" }
    ]
  },
  { 
    name: 'General Medicine', 
    description: 'Comprehensive primary care for adults.', 
    icon: '🩺',
    doctors: [
      { name: "Dr. Bilal Ahmed", experience: "15 years", availability: "Mon–Fri" }
    ]
  },
  { 
    name: 'ENT', 
    description: 'Care for ear, nose, and throat conditions.', 
    icon: '👃',
    doctors: [
      { name: "Dr. Hira Nadeem", experience: "9 years", availability: "Wed–Sun" }
    ]
  },
  { 
    name: 'Pediatrics', 
    description: 'Dedicated healthcare for infants, children, and adolescents.', 
    icon: '👶',
    doctors: [
        { name: "Dr. Sameer Khan", experience: "7 years", availability: "Mon–Sat" }
    ]
   },
  { 
    name: 'Neurology', 
    description: 'Treatment of nervous system disorders.', 
    icon: '🧠',
    doctors: [
      { name: "Dr. Amna Rehman", experience: "11 years", availability: "Tue–Fri" }
    ]
  },
];

const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ navigate }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const { user } = useAuth();

  const handleBook = (doctor: Doctor) => {
    if (user) {
      navigate('book', undefined, { department: selectedDepartment!.name, doctor: doctor.name });
    } else {
      navigate('login');
    }
  };

  if (selectedDepartment) {
    return (
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <button onClick={() => setSelectedDepartment(null)} className="flex items-center text-primary mb-8 font-semibold hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Departments
          </button>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Doctors in {selectedDepartment.name}</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{selectedDepartment.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedDepartment.doctors.map((doctor, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                  <p className="text-primary my-1">{doctor.experience} of experience</p>
                  <p className="text-sm text-gray-500">Availability: {doctor.availability}</p>
                </div>
                <button onClick={() => handleBook(doctor)} className="mt-4 w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all">
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Departments</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We offer a wide range of specialized medical services. Click on a department to see our expert doctors.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {departmentsData.map((dept) => (
            <button key={dept.name} onClick={() => setSelectedDepartment(dept)} className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center">
              <div className="text-5xl mb-4">{dept.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{dept.name}</h3>
              <p className="text-gray-600 mt-2">{dept.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;