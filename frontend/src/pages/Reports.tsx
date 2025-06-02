import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Report {
  id: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes: string;
  createdAt: string;
  patient?: {
    firstName: string;
    lastName: string;
  };
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/medical-records');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Medical Reports</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report.id} className="border-b pb-4">
              <h2 className="text-lg font-semibold">{report.diagnosis}</h2>
              {/* Display patient name if available */}
              {report.patient && (
                <p className="text-gray-700 font-medium">
                  Patient: {report.patient.firstName} {report.patient.lastName}
                </p>
              )}
              <p className="text-gray-600">Symptoms: {report.symptoms}</p>
              <p className="text-gray-600">Treatment: {report.treatment}</p>
              <p className="text-gray-600">Notes: {report.notes}</p>
              <p className="text-sm text-gray-400">Created At: {new Date(report.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;