import { Patient } from '../types/types';

// Generate a unique ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

// Format date to display in a readable format
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format date in YYYY-MM-DD format for input fields
export const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Filter patients by search query
export const filterPatients = (patients: Patient[], searchQuery: string) => {
  if (!searchQuery) return patients;
  
  const query = searchQuery.toLowerCase();
  
  return patients.filter(patient => {
    return (
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.contactNumber.includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query)
    );
  });
};

// Sort patients by field
export const sortPatients = (patients: Patient[], field: keyof Patient, direction: 'asc' | 'desc') => {
  return [...patients].sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];
    
    // Handle nested fields like 'emergencyContact.name'
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.') as [keyof Patient, string];
      valueA = a[parentField][childField];
      valueB = b[parentField][childField];
    }
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Format phone number as (XXX) XXX-XXXX
export const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return '';
  
  // Strip all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the number is valid
  if (cleaned.length !== 10) return phoneNumber;
  
  // Format as (XXX) XXX-XXXX
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

// Generate a sample of demo patients for testing
export const generateDemoPatients = (): Patient[] => {
  return [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-05-15',
      gender: 'male',
      contactNumber: '(555) 123-4567',
      email: 'john.doe@example.com',
      address: '123 Main St, Anytown, CA 12345',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        contactNumber: '(555) 987-6543'
      },
      bloodType: 'A+',
      allergies: ['Penicillin', 'Peanuts'],
      createdAt: '2023-01-15T12:00:00Z',
      updatedAt: '2023-06-20T14:30:00Z'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '1992-11-23',
      gender: 'female',
      contactNumber: '(555) 234-5678',
      email: 'sarah.j@example.com',
      address: '456 Oak Ave, Springfield, IL 67890',
      emergencyContact: {
        name: 'Robert Johnson',
        relationship: 'Father',
        contactNumber: '(555) 876-5432'
      },
      bloodType: 'O-',
      allergies: ['Sulfa', 'Latex'],
      createdAt: '2023-02-10T09:15:00Z',
      updatedAt: '2023-07-05T11:45:00Z'
    }
  ];
};