import React, { useState, useEffect } from 'react';
import { usePatients } from '../contexts/PatientsContext';
import { 
  Pencil, Trash2, Phone, Mail, User, Heart, 
  Calendar, PlusCircle, AlertCircle, ClipboardList 
} from 'lucide-react';
import { formatDate, calculateAge } from '../utils/helpers';
import { Patient, MedicalRecord, VitalSigns, Appointment } from '../types/types';

interface PatientDetailsProps {
  patientId: string;
  onPageChange: (page: any, patientId?: string) => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId, onPageChange }) => {
  const { 
    getPatient, 
    deletePatient, 
    getPatientMedicalRecords,
    getPatientVitalSigns,
    getPatientAppointments
  } = usePatients();

  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    purpose: '',
    date: '',
    time: '',
    doctorName: '',
    notes: '',
  });

  useEffect(() => {
    // Fetch patient and related data
    const patientData = getPatient(patientId);
    if (patientData) {
      setPatient(patientData);
      setMedicalRecords(getPatientMedicalRecords(patientId));
      setVitalSigns(getPatientVitalSigns(patientId));
      setAppointments(getPatientAppointments(patientId));
    }
  }, [patientId, getPatient, getPatientMedicalRecords, getPatientVitalSigns, getPatientAppointments]);

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800">Patient not found</h2>
        <button 
          onClick={() => onPageChange('patients')}
          className="mt-4 text-sky-600 hover:text-sky-800"
        >
          Return to Patient List
        </button>
      </div>
    );
  }

  const handleDeletePatient = () => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      deletePatient(patientId);
      onPageChange('patients');
    }
  };

  const handleScheduleAppointment = async () => {
    console.log('Scheduling appointment...'); // Debugging log
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is valid
        },
        body: JSON.stringify({
          ...appointmentData,
          patientId: patient?.id, // Ensure patient ID is passed
        }),
      });

      if (response.ok) {
        alert('Appointment scheduled successfully!');
        setShowAppointmentForm(false);
        setAppointments((prev) => [
          ...prev,
          { ...appointmentData, id: Date.now().toString(), status: 'scheduled', patientId: patientId },
        ]);
      } else {
        const error = await response.json();
        alert(`Failed to schedule appointment: ${error.message}`);
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('An error occurred while scheduling the appointment.');
    }
  };

  const handleReschedule = async (appointmentId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is valid
        },
        body: JSON.stringify(appointmentData), // Send updated appointment data
      });

      if (response.ok) {
        alert('Appointment rescheduled successfully!');
        const updatedAppointment = await response.json();
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === appointmentId ? updatedAppointment : appointment
          )
        );
        setShowAppointmentForm(false);
      } else {
        const error = await response.json();
        alert(`Failed to reschedule appointment: ${error.message}`);
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      alert('An error occurred while rescheduling the appointment.');
    }
  };

  const handleCheckIn = async (appointmentId: string) => {
    console.log('Checking in appointment with ID:', appointmentId); // Debugging log
    if (window.confirm('Are you sure you want to check in this appointment? This will remove it from the list.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is valid
          },
        });

        if (response.ok) {
          alert('Appointment checked in successfully!');
          setAppointments((prev) => prev.filter((appointment) => appointment.id !== appointmentId));
        } else {
          const error = await response.json();
          alert(`Failed to check in appointment: ${error.message}`);
        }
      } catch (error) {
        console.error('Error checking in appointment:', error);
        alert('An error occurred while checking in the appointment.');
      }
    }
  };

  // Sort records, vitals and appointments by date (newest first)
  const sortedMedicalRecords = [...medicalRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sortedVitalSigns = [...vitalSigns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <button
            onClick={() => onPageChange('patients')}
            className="mr-3 text-sky-600 hover:text-sky-800"
          >
            ← Back to List
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {patient.firstName} {patient.lastName}
          </h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange('edit-patient', patientId)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDeletePatient}
            className="flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Patient information card */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <div className="h-24 w-24 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-3xl font-bold mb-4 md:mb-0">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">Patient Information</span>
                  </div>
                  <p className="text-lg font-medium">{patient.firstName} {patient.lastName}</p>
                  <p className="text-gray-600 text-sm">
                    {calculateAge(patient.dateOfBirth)} years • {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">DOB: {formatDate(patient.dateOfBirth)}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">Contact</span>
                  </div>
                  <p className="text-gray-800">{patient.contactNumber}</p>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-gray-600 text-sm">{patient.email}</p>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{patient.address}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-gray-500 mb-1">
                    <Heart className="h-4 w-4 mr-2" />
                    <span className="text-sm">Medical Information</span>
                  </div>
                  <p className="text-gray-800">Blood Type: {patient.bloodType || 'Unknown'}</p>
                  <div className="flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-gray-600 text-sm">
                      Allergies: {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('medicalRecords')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'medicalRecords'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Medical Records
          </button>
          <button
            onClick={() => setActiveTab('vitalSigns')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vitalSigns'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vital Signs
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'appointments'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Appointments
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Patient Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Medical Records</h4>
                {sortedMedicalRecords.length > 0 ? (
                  <div className="space-y-3">
                    {sortedMedicalRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{record.diagnosis}</p>
                          <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">By Dr. {record.doctorName}</p>
                      </div>
                    ))}
                    {sortedMedicalRecords.length > 3 && (
                      <button 
                        onClick={() => setActiveTab('medicalRecords')}
                        className="text-sky-600 text-sm hover:text-sky-800"
                      >
                        View all {sortedMedicalRecords.length} records
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <ClipboardList className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No medical records found</p>
                    <button className="mt-2 text-sky-600 text-sm hover:text-sky-800">
                      Add Medical Record
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Upcoming Appointments</h4>
                {sortedAppointments.filter(a => a.status === 'scheduled').length > 0 ? (
                  <div className="space-y-3">
                    {sortedAppointments
                      .filter(a => a.status === 'scheduled')
                      .slice(0, 3)
                      .map((appointment) => (
                        <div key={appointment.id} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{appointment.purpose}</p>
                            <p className="text-xs text-gray-500">{formatDate(appointment.date)}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {appointment.time} with Dr. {appointment.doctorName}
                          </p>
                        </div>
                      ))}
                    <button 
                      onClick={() => setActiveTab('appointments')}
                      className="text-sky-600 text-sm hover:text-sky-800"
                    >
                      View all appointments
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No upcoming appointments</p>
                    <button className="mt-2 text-sky-600 text-sm hover:text-sky-800" onClick={() => setShowAppointmentForm(true)}>
                      Schedule Appointment
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Emergency Contact</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium">{patient.emergencyContact.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Relationship: {patient.emergencyContact.relationship}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Phone: {patient.emergencyContact.contactNumber}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Latest Vital Signs</h4>
                {sortedVitalSigns.length > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">Vitals Check</p>
                      <p className="text-xs text-gray-500">{formatDate(sortedVitalSigns[0].date)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Blood Pressure</p>
                        <p className="text-sm">{sortedVitalSigns[0].bloodPressure}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Heart Rate</p>
                        <p className="text-sm">{sortedVitalSigns[0].heartRate} bpm</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Temperature</p>
                        <p className="text-sm">{sortedVitalSigns[0].temperature}°C</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Oxygen Saturation</p>
                        <p className="text-sm">{sortedVitalSigns[0].oxygenSaturation}%</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('vitalSigns')}
                      className="mt-2 text-sky-600 text-sm hover:text-sky-800"
                    >
                      View all vitals
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <Heart className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No vital signs recorded</p>
                    <button className="mt-2 text-sky-600 text-sm hover:text-sky-800">
                      Add Vital Signs
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medicalRecords' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Medical Records</h3>
              <button className="flex items-center text-sm text-sky-600 hover:text-sky-800">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Record
              </button>
            </div>
            
            {sortedMedicalRecords.length > 0 ? (
              <div className="space-y-4">
                {sortedMedicalRecords.map((record) => (
                  <div key={record.id} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <div>
                        <h4 className="text-md font-medium">{record.diagnosis}</h4>
                        <p className="text-sm text-gray-500">Date: {formatDate(record.date)}</p>
                      </div>
                      <p className="text-sm text-gray-500">Dr. {record.doctorName}</p>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Symptoms:</span> {record.symptoms.join(', ')}</p>
                      <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Treatment:</span> {record.treatment}</p>
                      
                      {record.medications.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Medications:</p>
                          <ul className="mt-1 space-y-1">
                            {record.medications.map((medication, index) => (
                              <li key={index} className="text-sm text-gray-700 ml-4">
                                <span className="font-medium">{medication.name}</span> - {medication.dosage}, {medication.frequency}
                                <p className="text-xs text-gray-500">
                                  {formatDate(medication.startDate)} - {medication.endDate ? formatDate(medication.endDate) : 'Ongoing'}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {record.notes && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Notes:</p>
                          <p className="text-sm text-gray-700">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-md text-center">
                <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-gray-600 font-medium mb-1">No Medical Records</h3>
                <p className="text-gray-500 mb-4">This patient doesn't have any medical records yet.</p>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add First Record
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vitalSigns' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Vital Signs</h3>
              <button className="flex items-center text-sm text-sky-600 hover:text-sky-800">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Vitals
              </button>
            </div>
            
            {sortedVitalSigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Pressure</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respiratory Rate</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oxygen</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedVitalSigns.map((vitals) => (
                      <tr key={vitals.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(vitals.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vitals.bloodPressure}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vitals.heartRate} bpm</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vitals.respiratoryRate} /min</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vitals.temperature}°C</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vitals.oxygenSaturation}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-sky-600 hover:text-sky-900">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-md text-center">
                <Heart className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-gray-600 font-medium mb-1">No Vital Signs Recorded</h3>
                <p className="text-gray-500 mb-4">This patient doesn't have any vital signs recorded yet.</p>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Record Vitals
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Appointments</h3>
              <button className="flex items-center text-sm text-sky-600 hover:text-sky-800"
              onClick={() => setShowAppointmentForm(true)}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Schedule Appointment
              </button>
            </div>
            
            {sortedAppointments.length > 0 ? (
              <div className="space-y-4">
                {sortedAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-md font-medium">{appointment.purpose}</h4>
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              appointment.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          Date: {formatDate(appointment.date)} at {appointment.time}
                        </p>
                        <p className="text-sm text-gray-500">Dr. {appointment.doctorName}</p>
                      </div>
                      <div className="mt-2 md:mt-0 flex space-x-2">
                        {appointment.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => handleCheckIn(appointment.id)}
                              className="text-sm text-white bg-sky-600 hover:bg-sky-700 px-3 py-1 rounded-md"
                            >
                              Check In
                            </button>
                            <button
                              onClick={() => {
                                setAppointmentData({
                                  purpose: appointment.purpose,
                                  date: appointment.date,
                                  time: appointment.time,
                                  doctorName: appointment.doctorName,
                                  notes: appointment.notes || '', // Ensure notes is a string
                                }); // Pre-fill form with existing data
                                setShowAppointmentForm(true);
                              }}
                              className="text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md"
                            >
                              Reschedule
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-sm text-gray-500">Notes: {appointment.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-md text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-gray-600 font-medium mb-1">No Appointments</h3>
                <p className="text-gray-500 mb-4">This patient doesn't have any appointments scheduled.</p>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700"
                onClick={() => setShowAppointmentForm(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Schedule Appointment
                </button>
              </div>
            )}
          </div>
        )}
      </div>


    

      {/* Schedule Appointment Form */}
      {showAppointmentForm && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Schedule Appointment</h3>
          <form
        onSubmit={(e) => {
          e.preventDefault();
          handleScheduleAppointment();
        }}
        className="space-y-4"
          >
        <div>
          <label className="block text-sm font-medium text-gray-700">Purpose</label>
          <input
            type="text"
            placeholder="Purpose"
            value={appointmentData.purpose}
            onChange={(e) => setAppointmentData({ ...appointmentData, purpose: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={appointmentData.date}
            onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={appointmentData.time}
            onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
          <input
            type="text"
            placeholder="Doctor Name"
            value={appointmentData.doctorName}
            onChange={(e) => setAppointmentData({ ...appointmentData, doctorName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            placeholder="Notes"
            value={appointmentData.notes}
            onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setShowAppointmentForm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700"
          >
            Schedule
          </button>
        </div>
          </form>
        </div>
      


      )}
    </div>
  );
};

export default PatientDetails;