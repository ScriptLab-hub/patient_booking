import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              About MedEase
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Simplifying healthcare, one appointment at a time.
            </p>
          </div>

          <div className="space-y-12 text-lg text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
              <p>
                At MedEase, our mission is to bridge the gap between patients and healthcare providers through technology. We believe that accessing medical care should be simple, transparent, and stress-free. We are committed to creating a platform that empowers patients to take control of their health journey with confidence and ease.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
              <p>
                We envision a future where booking a doctor's appointment is as easy as ordering a coffee. Our goal is to become the most trusted and user-friendly healthcare platform, recognized for our commitment to reliability, security, and exceptional user experience. We aim to innovate continuously, making healthcare more accessible for everyone, everywhere.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-primary mb-4">Our Values</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><span className="font-semibold">Patient-Centric:</span> We put our users at the heart of everything we do.</li>
                    <li><span className="font-semibold">Trust & Security:</span> We are dedicated to protecting your data and privacy.</li>
                    <li><span className="font-semibold">Simplicity:</span> We believe in clean, intuitive design and straightforward processes.</li>
                    <li><span className="font-semibold">Innovation:</span> We constantly seek better ways to improve the healthcare experience.</li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
