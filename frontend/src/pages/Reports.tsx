import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report.id} className="border-b pb-4">
              <h2 className="text-lg font-semibold">{report.title}</h2>
              <p className="text-gray-600">{report.description}</p>
              <p className="text-sm text-gray-400">Created At: {new Date(report.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;