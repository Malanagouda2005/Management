import { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientDetails from './pages/PatientDetails';
import PatientForm from './pages/PatientForm';
import { PatientsProvider } from './contexts/PatientsContext';
import AuthPage from './pages/AuthPage';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';

type Page = 'dashboard' | 'patients' | 'patient-details' | 'add-patient' | 'edit-patient' | 'appointments' | 'reports';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const handlePageChange = (page: Page, patientId?: string) => {
    setCurrentPage(page);
    if (patientId) {
      setSelectedPatientId(patientId);
    }
  };

  const handleLogin = () => {
    setLoggedIn(true); // Update the loggedIn state to true
  };

  if (!loggedIn) {
    return <AuthPage onLogin={handleLogin} />; // Pass handleLogin to AuthPage
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={handlePageChange} />;
      case 'patients':
        return <PatientList onPageChange={handlePageChange} />;
      case 'patient-details':
        return selectedPatientId ? (
          <PatientDetails 
            patientId={selectedPatientId} 
            onPageChange={handlePageChange} 
          />
        ) : (
          <PatientList onPageChange={handlePageChange} />
        );
      case 'add-patient':
        return <PatientForm onPageChange={handlePageChange} />;
      case 'edit-patient':
        return selectedPatientId ? (
          <PatientForm 
            patientId={selectedPatientId} 
            onPageChange={handlePageChange} 
          />
        ) : (
          <PatientList onPageChange={handlePageChange} />
        );
      case 'appointments':
        return <Appointments />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <PatientsProvider>
      <Layout 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
      >
        {renderPage()}
      </Layout>
    </PatientsProvider>
  );
}

export default App;