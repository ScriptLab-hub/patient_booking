import React from 'react';
import { useAuth } from './AuthContext';
import { Page } from '../App';

interface TicketPageProps {
    navigate: (page: Page) => void;
    appointmentId: number;
}

const formatTimeForDisplay = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${period}`;
}


const TicketPage: React.FC<TicketPageProps> = ({ navigate, appointmentId }) => {
    const { appointments } = useAuth();
    const appointment = appointments.find(app => app.id === appointmentId);

    if (!appointment) {
        return (
            <div className="py-20 text-center">
                <h2 className="text-2xl font-bold">Appointment not found.</h2>
                <button onClick={() => navigate('my-appointments')} className="mt-4 text-primary hover:underline">
                    Back to My Appointments
                </button>
            </div>
        );
    }
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-8">
                     <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Appointment Ticket</h2>
                     <p className="text-gray-600 mt-2">Please keep a copy of this ticket for your reference.</p>
                </div>

                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                    <div className="flex justify-between items-start pb-6 border-b-2 border-dashed">
                        <div>
                            <h3 className="text-2xl font-bold text-primary">MedEase</h3>
                            <p className="text-sm text-gray-500">Your Health, Simplified.</p>
                        </div>
                        <div className="text-right">
                           <p className="font-mono text-lg font-bold text-gray-800">{appointment.ticket_no}</p>
                           <p className="text-sm text-gray-500">Ticket Number</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Patient Details</h4>
                            <p className="text-lg font-bold text-gray-800 mt-1">{appointment.patient_name}</p>
                            <p className="text-gray-600">{appointment.phone}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Appointment Details</h4>
                            {/* fix: Property 'doctor_name' does not exist on type 'Appointment'. Corrected to use `doctor_name`. */}
                            <p className="text-lg font-bold text-gray-800 mt-1">{appointment.doctor_name}</p>
                            <p className="text-gray-600">{appointment.department}</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-center">
                        <div>
                            <p className="text-sm font-semibold text-gray-500">Date</p>
                            <p className="font-bold text-lg text-gray-900">{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                         <div>
                            <p className="text-sm font-semibold text-gray-500">Time</p>
                            <p className="font-bold text-lg text-gray-900">{formatTimeForDisplay(appointment.time)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">Status</p>
                            <p className={`font-bold text-lg ${appointment.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}`}>{appointment.status}</p>
                        </div>
                    </div>
                    
                    {appointment.symptoms && (
                        <div className="mt-6 pt-6 border-t">
                             <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Symptoms / Notes</h4>
                             <p className="text-gray-700 mt-2 p-3 bg-gray-50 rounded-md">{appointment.symptoms}</p>
                        </div>
                    )}
                </div>

                 <div className="text-center mt-10 space-x-4">
                    <button onClick={() => navigate('my-appointments')} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all">
                        Back to Appointments
                    </button>
                    <button onClick={handlePrint} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all">
                        Print / Download Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketPage;
