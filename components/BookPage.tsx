import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Page, NavigateFunction } from '../App';

interface BookPageProps {
  navigate: NavigateFunction;
  prefillData: { department: string; doctor: string } | null;
}

const departmentDoctors: Record<string, string[]> = {
    'Cardiology': ['Dr. Ayesha Malik', 'Dr. Hamza Qureshi'],
    'Dermatology': ['Dr. Sana Tariq'],
    'General Medicine': ['Dr. Bilal Ahmed'],
    'ENT': ['Dr. Hira Nadeem'],
    'Pediatrics': ['Dr. Sameer Khan'],
    'Neurology': ['Dr. Amna Rehman'],
};
const departments = Object.keys(departmentDoctors);
const timeSlots = ['09:00:00', '10:00:00', '11:00:00', '14:00:00', '15:00:00', '16:00:00'];

const formatTimeForDisplay = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${period}`;
}


const BookPage: React.FC<BookPageProps> = ({ navigate, prefillData }) => {
  const { profile, bookAppointment } = useAuth();
  const [patientName, setPatientName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (profile) {
        setPatientName(profile.full_name);
        setPhone(profile.phone);
    }
  }, [profile]);

  useEffect(() => {
    if (prefillData) {
      setDepartment(prefillData.department);
      setDoctor(prefillData.doctor);
    }
  }, [prefillData]);
  
  useEffect(() => {
      if (department) {
          setAvailableDoctors(departmentDoctors[department] || []);
          if(doctor && !departmentDoctors[department]?.includes(doctor)) {
             setDoctor('');
          }
      } else {
          setAvailableDoctors([]);
      }
  }, [department, doctor]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (error) {
      timer = setTimeout(() => setError(''), 4000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!patientName || !phone || !department || !doctor || !date || !time) {
      setError('Please fill out all required fields to book your appointment.');
      return;
    }

    const [hours, minutes] = time.split(':');
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();

    if (selectedDateTime < now) {
      setError("You cannot book an appointment in the past. Please select a future date and time.");
      return;
    }
    
    setLoading(true);
    // fix: Changed `patientName` to `patient_name` and `doctor` to `doctor_name` to match the Appointment interface.
    const { error: bookError } = await bookAppointment({ patient_name: patientName, phone, department, doctor_name: doctor, date, time, symptoms });
    if (bookError) {
        setError(bookError.message);
        setLoading(false);
    } else {
        setSuccess(`Appointment booked successfully! Redirecting...`);
        setTimeout(() => {
            navigate('my-appointments');
        }, 2000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Book an Appointment
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome, {profile?.full_name}! Fill out the form below.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm transition-opacity duration-300">{error}</div>}
          {success && <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">{success}</div>}
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700">Patient Name</label>
                  <input id="patient-name" name="name" type="text" required value={patientName} onChange={e => setPatientName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input id="phone" name="phone" type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
            </div>
             <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <select id="department" value={department} onChange={e => setDepartment(e.target.value)} required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                    <option value="" disabled>Select a department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
            <div>
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">Doctor</label>
              <select id="doctor" value={doctor} onChange={e => setDoctor(e.target.value)} required disabled={!department}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100">
                <option value="" disabled>Select a doctor</option>
                {availableDoctors.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
            </div>

            {date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Time</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map(slot => (
                    <button key={slot} type="button" onClick={() => setTime(slot)} className={`px-2 py-2 text-sm rounded-md transition-colors ${time === slot ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                      {formatTimeForDisplay(slot)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">Symptoms / Notes (Optional)</label>
                <textarea id="symptoms" value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Briefly describe your symptoms..."
                ></textarea>
            </div>
          </div>

          <div>
            <button type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors mt-6 disabled:bg-blue-300 disabled:cursor-not-allowed">
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookPage;
