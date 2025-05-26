import React from 'react';
import { LayoutDashboard, Users, Calendar, BarChart, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="h-full px-3 py-4 flex flex-col justify-between">
        <nav className="space-y-1">
          <button
            onClick={() => onPageChange('dashboard')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
              currentPage === 'dashboard'
                ? 'bg-sky-100 text-sky-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </button>
          
          <button
            onClick={() => onPageChange('patients')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
              ['patients', 'patient-details', 'add-patient', 'edit-patient'].includes(currentPage)
                ? 'bg-sky-100 text-sky-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Patients
          </button>
          
          <button
            onClick={() => onPageChange('appointments')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
              currentPage === 'appointments'
                ? 'bg-sky-100 text-sky-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Appointments
          </button>
          
          <button
            onClick={() => onPageChange('reports')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
              currentPage === 'reports'
                ? 'bg-sky-100 text-sky-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <BarChart className="mr-3 h-5 w-5" />
            Reports
          </button>
          
         
        </nav>
        
        <div>
          <button
            className="flex items-center px-3 py-2 mt-2 text-sm font-medium rounded-md w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;