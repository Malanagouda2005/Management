

import { query } from '../utils/db'; // Adjust the import based on your project structure
import MedicalRecord from "../models/medicalRecordModel";

export class MedicalService {
  public async addMedicalRecord(recordData: {
    patientId: string;
    diagnosis: string;
    symptoms: string;
    treatment: string;
    notes?: string;
  }): Promise<{ id: number; patientId: string; diagnosis: string; symptoms: string; treatment: string; notes?: string }> {
    try {
      const { patientId, diagnosis, symptoms, treatment, notes } = recordData;

      // Debugging logs
      console.log('Record Data Received:', recordData);
      console.log('Query Parameters:', [patientId, diagnosis, symptoms, treatment, notes]);

      // Validate required fields
      if (!patientId || !diagnosis || !symptoms || !treatment) {
        throw new Error('Missing required fields for medical record');
      }

      const result = await query(
        `INSERT INTO medical_records (patientId, diagnosis, symptoms, treatment, notes) VALUES (?, ?, ?, ?, ?)`,
        [patientId, diagnosis, symptoms, treatment, notes]
      );

      return { id: result.insertId, ...recordData };
    } catch (error) {
      console.error('Error adding medical record:', error);
      throw new Error('Failed to add medical record');
    }
  }




  // Get all medical records
  public async getAllMedicalRecords(): Promise<any[]> {
    try {
      const records = await query('SELECT * FROM medical_records');
      return records;
    } catch (error) {
      console.error('Error fetching medical records:', error);
      throw new Error('Failed to fetch medical records');
    }
  }
}
