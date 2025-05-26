import React from 'react';
import { UserRound, Bell, Menu } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: any) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'patients':
        return 'Patient Directory';
      case 'patient-details':
        return 'Patient Details';
      case 'add-patient':
        return 'Add New Patient';
      case 'edit-patient':
        return 'Edit Patient';
      default:
        return 'MediTrack Clinic';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              className="md:hidden -ml-1 mr-2 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <span className="text-sky-600 text-xl font-bold">MediTrack</span>
            </div>
            <nav className="hidden md:flex md:ml-6 md:space-x-8">
              <button 
                onClick={() => onPageChange('dashboard')}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'dashboard' 
                    ? 'text-sky-600 border-b-2 border-sky-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => onPageChange('patients')}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'patients' || currentPage === 'patient-details' || currentPage === 'add-patient' || currentPage === 'edit-patient' 
                    ? 'text-sky-600 border-b-2 border-sky-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Patients
              </button>
            </nav>
          </div>
          <div className="flex items-center">
            <h1 className="hidden md:block text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                <Bell size={20} />
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button className="bg-gray-100 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-600">
                      <UserRound size={18} />
                    </div>
                  </button>
                  <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">Dr. Smith</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                onPageChange('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 text-base font-medium w-full text-left ${
                currentPage === 'dashboard' 
                  ? 'text-sky-600 bg-sky-50 border-l-4 border-sky-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                onPageChange('patients');
                setIsMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 text-base font-medium w-full text-left ${
                currentPage === 'patients' || currentPage === 'patient-details' || currentPage === 'add-patient' || currentPage === 'edit-patient' 
                  ? 'text-sky-600 bg-sky-50 border-l-4 border-sky-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Patients
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;