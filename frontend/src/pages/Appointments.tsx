import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2 text-left">Patient Name</th>
              <th className="border-b py-2 text-left">Date</th>
              <th className="border-b py-2 text-left">Time</th>
              <th className="border-b py-2 text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="border-b py-2">{appointment.patientName}</td>
                <td className="border-b py-2">{appointment.date}</td>
                <td className="border-b py-2">{appointment.time}</td>
                <td className="border-b py-2">{appointment.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;