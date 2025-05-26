import React, { useState, useEffect } from 'react';
import { usePatients } from '../contexts/PatientsContext';
import { ChevronLeft, X, Plus } from 'lucide-react';
import { Patient } from '../types/types';
import axios from 'axios';

interface PatientFormProps {
  patientId?: string;
  onPageChange: (page: any, patientId?: string) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patientId, onPageChange }) => {
  const { getPatient } = usePatients();
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [formData, setFormData] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    contactNumber: '',
    email: '',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      contactNumber: ''
    } as { name: string; relationship: string; contactNumber: string },
    bloodType: '',
    allergies: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = Boolean(patientId);

  useEffect(() => {
    if (patientId) {
      const patient = getPatient(patientId);
      if (patient) {
        setFormData({
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          contactNumber: patient.contactNumber,
          email: patient.email,
          address: patient.address,
          emergencyContact: {
            name: patient.emergencyContact?.name || '',
            relationship: patient.emergencyContact?.relationship || '',
            contactNumber: patient.emergencyContact?.contactNumber || ''
          } as { name: string; relationship: string; contactNumber: string },
          bloodType: patient.bloodType || '',
          allergies: patient.allergies
        });
        setAllergies(patient.allergies);
      }
    }
  }, [patientId, getPatient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      if (name.startsWith('emergencyContact.')) {
        const field = name.split('.')[1];
        return {
          ...prevFormData,
          emergencyContact: {
            ...prevFormData.emergencyContact,
            [field]: value,
          } as { name: string; relationship: string; contactNumber: string },
        };
      }
      return {
        ...prevFormData,
        [name]: value,
      };
    });

    // Clear error when field is edited
    setErrors((prevErrors) => {
      if (prevErrors[name]) {
        const { [name]: _, ...restErrors } = prevErrors;
        return restErrors;
      }
      return prevErrors;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.contactNumber?.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.emergencyContact?.name?.trim()) newErrors['emergencyContact.name'] = 'Emergency contact name is required';
    if (!formData.emergencyContact?.contactNumber?.trim()) {
      newErrors['emergencyContact.contactNumber'] = 'Emergency contact number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const patientData = {
      ...formData,
      allergies,
    };

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      if (!token) {
        alert('You are not logged in. Please log in and try again.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token is prefixed with "Bearer"
        },
      };

      if (isEditMode && patientId) {
        // Update patient in the database
        await axios.put(`http://localhost:5000/api/patients/${patientId}`, patientData, config);
        onPageChange('patient-details', patientId);
      } else {
        // Add new patient to the database
        const response = await axios.post('http://localhost:5000/api/patients', patientData, config);
        onPageChange('patient-details', response.data.id);
      }
    } catch (error: any) {
      console.error('Error saving patient:', error);
      if (error.response?.status === 401) {
        alert('Unauthorized: Please log in again.');
      } else {
        alert('Failed to save patient. Please try again.');
      }
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => onPageChange(patientId ? 'patient-details' : 'patients', patientId)}
          className="flex items-center text-sky-600 hover:text-sky-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">
          {isEditMode ? 'Edit Patient' : 'Add New Patient'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
                    placeholder="(123) 456-7890"
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.contactNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContact.name"
                    value={formData.emergencyContact?.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.emergencyContactName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
                  />
                  {errors.emergencyContactName && (
                    <p className="mt-1 text-sm text-red-500">{errors.emergencyContactName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    id="emergencyContactRelationship"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact?.relationship}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactNumber"
                    name="emergencyContact.contactNumber"
                    value={formData.emergencyContact?.contactNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.emergencyContactNumber ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
                    placeholder="(123) 456-7890"
                  />
                  {errors.emergencyContactNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.emergencyContactNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Medical Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Type
                  </label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Add allergy"
                    />
                    <button
                      type="button"
                      onClick={addAllergy}
                      className="bg-sky-600 text-white px-3 py-2 rounded-r-md hover:bg-sky-700"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {allergies.map((allergy, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md"
                      >
                        {allergy}
                        <button 
                          type="button"
                          onClick={() => removeAllergy(index)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => onPageChange(patientId ? 'patient-details' : 'patients', patientId)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700"
              >
                {isEditMode ? 'Update Patient' : 'Add Patient'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;