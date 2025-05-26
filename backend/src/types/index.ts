export interface PatientRequest {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medicalHistory: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
}

export interface PatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email: string;
  address: string;
  emergencyContact: any; // Replace 'any' with a specific type if known
  bloodType: string;
  allergies: any[]; // Replace 'any[]' with a specific type if known
}
export interface Patient extends PatientRequest {
  id: number;
}
