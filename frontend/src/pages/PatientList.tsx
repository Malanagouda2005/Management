import React, { useState, useEffect } from 'react';
import { usePatients } from '../contexts/PatientsContext';
import { Search, Plus, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateAge, filterPatients, sortPatients } from '../utils/helpers';
import { Patient } from '../types/types';

interface PatientListProps {
  onPageChange: (page: any, patientId?: string) => void;
}

const PatientList: React.FC<PatientListProps> = ({ onPageChange }) => {
  const { patients } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [sortField, setSortField] = useState<keyof Patient>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Apply search filter and sorting
    let result = filterPatients(patients, searchQuery);
    result = sortPatients(result, sortField, sortDirection);
    setFilteredPatients(result);
  }, [patients, searchQuery, sortField, sortDirection]);

  const handleSort = (field: keyof Patient) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: keyof Patient) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Patient Directory</h1>
        <button
          onClick={() => onPageChange('add-patient')}
          className="flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-md transition shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Patient</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search patients by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        {/* Filter button */}
        <button className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition shadow-sm">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Patient list */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Patient Name</span>
                      {renderSortIcon('lastName')}
                    </div>
                  </th>
                  <th scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('dateOfBirth')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Age/Gender</span>
                      {renderSortIcon('dateOfBirth')}
                    </div>
                  </th>
                  <th scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span>Contact</span>
                  </th>
                  <th scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span>Medical ID</span>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id.toString()} // Ensure id is a string
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onPageChange('patient-details', patient.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.bloodType ? `Blood Type: ${patient.bloodType}` : 'No blood type on record'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{calculateAge(patient.dateOfBirth)} years</div>
                      <div className="text-sm text-gray-500">
                        {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.contactNumber}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">#{patient.id.substring(0, 6)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPageChange('patient-details', patient.id);
                        }}
                        className="text-sky-600 hover:text-sky-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No patients found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding a new patient'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => onPageChange('add-patient')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add New Patient
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;