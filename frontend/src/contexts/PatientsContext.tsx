import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Patient, MedicalRecord, VitalSigns, Appointment } from '../types/types';
import { generateId } from '../utils/helpers';

interface PatientsContextType {
  patients: Patient[];
  medicalRecords: MedicalRecord[];
  vitalSigns: VitalSigns[];
  appointments: Appointment[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  updateMedicalRecord: (id: string, record: Partial<MedicalRecord>) => void;
  deleteMedicalRecord: (id: string) => void;
  getPatientMedicalRecords: (patientId: string) => MedicalRecord[];
  addVitalSigns: (vitals: Omit<VitalSigns, 'id'>) => void;
  updateVitalSigns: (id: string, vitals: Partial<VitalSigns>) => void;
  deleteVitalSigns: (id: string) => void;
  getPatientVitalSigns: (patientId: string) => VitalSigns[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getPatientAppointments: (patientId: string) => Appointment[];
  getTodayAppointments: () => Appointment[];
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export const PatientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Fetch patients from the API
  useEffect(() => {
  const fetchPatients = async () => {
    try {
      // Retrieve the token from localStorage (or wherever it's stored)
      const token = localStorage.getItem('token');

      // Make the API request with the Authorization header
      const response = await axios.get('http://localhost:5000/api/patients', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
      });

      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  fetchPatients();
}, []);

  // Load data from localStorage on initial mount
  useEffect(() => {
    const storedPatients = localStorage.getItem('patients');
    const storedMedicalRecords = localStorage.getItem('medicalRecords');
    const storedVitalSigns = localStorage.getItem('vitalSigns');
    const storedAppointments = localStorage.getItem('appointments');

    if (storedPatients) setPatients(JSON.parse(storedPatients));
    if (storedMedicalRecords) setMedicalRecords(JSON.parse(storedMedicalRecords));
    if (storedVitalSigns) setVitalSigns(JSON.parse(storedVitalSigns));
    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('medicalRecords', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('vitalSigns', JSON.stringify(vitalSigns));
  }, [vitalSigns]);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Patient operations
  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPatient: Patient = {
      ...patientData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    setPatients(prev => [...prev, newPatient]);
    return newPatient.id;
  };

  const updatePatient = (id: string, patientData: Partial<Patient>) => {
    setPatients(prev => prev.map(patient => 
      patient.id === id ? { 
        ...patient, 
        ...patientData, 
        updatedAt: new Date().toISOString() 
      } : patient
    ));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
    // Also delete related records
    setMedicalRecords(prev => prev.filter(record => record.patientId !== id));
    setVitalSigns(prev => prev.filter(vitals => vitals.patientId !== id));
    setAppointments(prev => prev.filter(appointment => appointment.patientId !== id));
  };

  const getPatient = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  // Medical record operations
  const addMedicalRecord = (recordData: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: generateId()
    };
    setMedicalRecords(prev => [...prev, newRecord]);
  };

  const updateMedicalRecord = (id: string, recordData: Partial<MedicalRecord>) => {
    setMedicalRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...recordData } : record
    ));
  };

  const deleteMedicalRecord = (id: string) => {
    setMedicalRecords(prev => prev.filter(record => record.id !== id));
  };

  const getPatientMedicalRecords = (patientId: string) => {
    return medicalRecords.filter(record => record.patientId === patientId);
  };

  // Vital signs operations
  const addVitalSigns = (vitalsData: Omit<VitalSigns, 'id'>) => {
    const newVitals: VitalSigns = {
      ...vitalsData,
      id: generateId()
    };
    setVitalSigns(prev => [...prev, newVitals]);
  };

  const updateVitalSigns = (id: string, vitalsData: Partial<VitalSigns>) => {
    setVitalSigns(prev => prev.map(vitals => 
      vitals.id === id ? { ...vitals, ...vitalsData } : vitals
    ));
  };

  const deleteVitalSigns = (id: string) => {
    setVitalSigns(prev => prev.filter(vitals => vitals.id !== id));
  };

  const getPatientVitalSigns = (patientId: string) => {
    return vitalSigns.filter(vitals => vitals.patientId === patientId);
  };

  // Appointment operations
  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateId()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, appointmentData: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, ...appointmentData } : appointment
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter(appointment => appointment.patientId === patientId);
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.date === today);
  };

  return (
    <PatientsContext.Provider value={{
      patients,
      medicalRecords,
      vitalSigns,
      appointments,
      addPatient,
      updatePatient,
      deletePatient,
      getPatient,
      addMedicalRecord,
      updateMedicalRecord,
      deleteMedicalRecord,
      getPatientMedicalRecords,
      addVitalSigns,
      updateVitalSigns,
      deleteVitalSigns,
      getPatientVitalSigns,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      getPatientAppointments,
      getTodayAppointments
    }}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientsProvider');
  }
  return context;
};
