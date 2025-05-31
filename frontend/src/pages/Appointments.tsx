import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Appointment {
  id: number;
  patientId: number;
  purpose: string;
  date: string;
  time: string;
  doctorName: string;
  status: string;
  notes?: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You are not logged in. Please log in and try again.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/appointments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data); // Set appointments from API response
      } catch (error) {
        console.error('Error fetching appointments:', error);
        alert('Failed to fetch appointments. Please try again.');
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <div className="bg-white shadow rounded-lg p-4">
        {appointments.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2 text-left">Purpose</th>
                <th className="border-b py-2 text-left">Date</th>
                <th className="border-b py-2 text-left">Time</th>
                <th className="border-b py-2 text-left">Doctor</th>
                <th className="border-b py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="border-b py-2">{appointment.purpose}</td>
                  <td className="border-b py-2">{appointment.date}</td>
                  <td className="border-b py-2">{appointment.time}</td>
                  <td className="border-b py-2">{appointment.doctorName}</td>
                  <td className="border-b py-2">{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Appointments;