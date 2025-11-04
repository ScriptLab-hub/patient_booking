import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const doctorsData = {
  'General Physician': ['Dr. John Doe', 'Dr. Sarah Smith'],
  'Dermatologist': ['Dr. Emily White', 'Dr. Michael Brown'],
  'Cardiologist': ['Dr. Lisa Ray', 'Dr. James Chen'],
};

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [specialization, setSpecialization] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  const resetState = () => {
    setStep(1);
    setSpecialization('');
    setDoctor('');
    setDate('');
    setTime('');
    setIsBooking(false);
    setBookingConfirmed(false);
  }

  const handleClose = () => {
    resetState();
    onClose();
  }

  const handleConfirmBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookingConfirmed(true);
      setStep(2);
    }, 2000);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <CloseIcon />
          </button>
          
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Appointment</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <select id="specialization" value={specialization} onChange={(e) => { setSpecialization(e.target.value); setDoctor(''); }} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                    <option value="" disabled>Select a specialization</option>
                    {Object.keys(doctorsData).map(spec => <option key={spec} value={spec}>{spec}</option>)}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <select id="doctor" value={doctor} onChange={(e) => setDoctor(e.target.value)} disabled={!specialization} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary disabled:bg-gray-100">
                    <option value="" disabled>Select a doctor</option>
                    {specialization && doctorsData[specialization].map(doc => <option key={doc} value={doc}>{doc}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                </div>
                
                {date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Time</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map(slot => (
                        <button key={slot} onClick={() => setTime(slot)} className={`px-2 py-2 text-sm rounded-md transition-colors ${time === slot ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleConfirmBooking}
                  disabled={!specialization || !doctor || !date || !time || isBooking}
                  className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isBooking ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Booking...
                    </>
                  ) : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && bookingConfirmed && (
             <div className="text-center py-8">
                <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-4">Your appointment with <span className="font-semibold">{doctor}</span> is set for <span className="font-semibold">{time} on {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>.</p>
                <p className="text-sm text-gray-500">A confirmation email and SMS have been sent to you.</p>
                 <div className="mt-8">
                     <button onClick={handleClose} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all">
                         Done
                     </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
