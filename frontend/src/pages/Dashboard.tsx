import React, { useState, useEffect } from 'react';
import { usePatients } from '../contexts/PatientsContext';
import { Activity, CalendarClock, UserPlus, Users } from 'lucide-react';
import { calculateAge, formatDate } from '../utils/helpers';
import { Patient, Appointment, StatsData } from '../types/types';

interface DashboardProps {
  onPageChange: (page: any, patientId?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const { 
    patients, 
    appointments,
    getTodayAppointments
  } = usePatients();

  const [stats, setStats] = useState<StatsData>({
    totalPatients: 0,
    appointmentsToday: 0,
    newPatientsThisWeek: 0,
    appointmentsThisWeek: 0
  });

  useEffect(() => {
    // Calculate dashboard statistics
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekISO = lastWeek.toISOString();

    const todayAppointments = appointments.filter(a => a.date === today);
    
    const newPatientsThisWeek = patients.filter(
      p => new Date(p.createdAt) >= lastWeek
    ).length;
    
    const appointmentsThisWeek = appointments.filter(
      a => new Date(a.date + 'T00:00:00') >= lastWeek
    ).length;

    setStats({
      totalPatients: patients.length,
      appointmentsToday: todayAppointments.length,
      newPatientsThisWeek,
      appointmentsThisWeek
    });
  }, [patients, appointments]);

  // Get recent patients (last 5)
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get today's appointments
  const todayAppointments = getTodayAppointments();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalPatients}</p>
            </div>
            <div className="bg-sky-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-sky-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Today's Appointments</p>
              <p className="text-3xl font-bold text-gray-800">{stats.appointmentsToday}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <CalendarClock className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">New Patients (Week)</p>
              <p className="text-3xl font-bold text-gray-800">{stats.newPatientsThisWeek}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Weekly Activity</p>
              <p className="text-3xl font-bold text-gray-800">{stats.appointmentsThisWeek}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Patients</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient: Patient) => (
                <div key={patient.id} 
                  className="p-4 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => onPageChange('patient-details', patient.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{patient.firstName} {patient.lastName}</p>
                        <p className="text-xs text-gray-500">
                          {calculateAge(patient.dateOfBirth)} yrs • {patient.gender}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Added on</p>
                      <p className="text-sm text-gray-700">{formatDate(patient.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No patients added yet</div>
            )}
          </div>
          {patients.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={() => onPageChange('patients')}
                className="text-sky-600 hover:text-sky-700 text-sm font-medium"
              >
                View All Patients
              </button>
            </div>
          )}
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Today's Appointments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment: Appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                if (!patient) return null;
                
                return (
                  <div key={appointment.id} 
                    className="p-4 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => onPageChange('patient-details', patient.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">{patient.firstName} {patient.lastName}</p>
                          <p className="text-xs text-gray-500">{appointment.time} • {appointment.purpose}</p>
                        </div>
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">No appointments scheduled for today</div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="text-sky-600 hover:text-sky-700 text-sm font-medium">
              View All Appointments
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onPageChange('add-patient')}
          className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-md transition shadow-sm"
        >
          Add New Patient
        </button>
        <button
          className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition shadow-sm"
        >
          Schedule Appointment
        </button>
      </div>
    </div>
  );
};

export default Dashboard;