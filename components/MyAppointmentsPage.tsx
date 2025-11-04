import React from 'react';
import { useAuth } from './AuthContext';
import { Page } from '../App';

interface MyAppointmentsPageProps {
  navigate: (page: Page, appointmentId?: number) => void;
}

const StatusBadge: React.FC<{ status: 'Pending' | 'Cancelled' }> = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  const statusClasses = {
    Pending: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const formatTimeForDisplay = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${period}`;
}


const MyAppointmentsPage: React.FC<MyAppointmentsPageProps> = ({ navigate }) => {
  const { appointments, cancelAppointment, loading } = useAuth();
  
  const handleCancel = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(id);
    }
  };
  
  const handleViewTicket = (id: number) => {
    navigate('ticket', id);
  }

  if (loading) {
    return (
        <div className="py-20 text-center">
            <p>Loading appointments...</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16 min-h-[70vh]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">My Appointments</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Here are your scheduled appointments. You can manage them from this page.</p>
        </div>
        
        {appointments.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">No appointments yet.</h3>
            <p className="text-gray-500 mt-2 mb-6">It looks like you haven't booked any appointments.</p>
            <button 
              onClick={() => navigate('book')}
              className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {appointments.map(app => (
                <li key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center mb-2">
                        <button onClick={() => handleViewTicket(app.id)} className="text-sm font-semibold text-primary hover:underline">{app.ticket_no}</button>
                        <div className="ml-3">
                          <StatusBadge status={app.status} />
                        </div>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {/* fix: Property 'doctor_name' does not exist on type 'Appointment'. Corrected to use `doctor_name`. */}
                        {app.department} with {app.doctor_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(app.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {formatTimeForDisplay(app.time)}
                      </p>
                    </div>
                    <div className="flex items-center justify-end space-x-4">
                       <button 
                        onClick={() => alert('Edit functionality is not yet implemented.')}
                        className="text-sm font-medium text-gray-500 hover:text-primary transition-colors py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      {app.status === 'Pending' && (
                        <button 
                          onClick={() => handleCancel(app.id)}
                          className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors py-2 px-4 rounded-md"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
