export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    contactNumber: string;
  };
  bloodType?: string;
  allergies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  date: string;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  medications: Medication[];
  notes?: string;
  doctorName: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  doctorName: string;
}

export interface StatsData {
  totalPatients: number;
  appointmentsToday: number;
  newPatientsThisWeek: number;
  appointmentsThisWeek: number;
}