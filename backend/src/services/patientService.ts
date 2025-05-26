import { query } from '../utils/db';
import bcrypt from 'bcrypt'; // Ensure bcrypt is installed and imported
import { PatientRequest, Patient } from '../types';

export class PatientService {
  // Create a new patient
  public async createPatient(patientData: PatientRequest): Promise<Patient> {
    try {
      console.log('Patient Data:', patientData); // Debugging log

      const result = await query(
        `INSERT INTO patients 
        (firstName, lastName, dateOfBirth, gender, contactNumber, email, address, emergencyContact, bloodType, allergies) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patientData.firstName,
          patientData.lastName,
          patientData.dateOfBirth,
          patientData.gender,
          patientData.contactNumber,
          patientData.email,
          patientData.address,
          JSON.stringify(patientData.emergencyContact),
          patientData.bloodType,
          JSON.stringify(patientData.allergies),
        ]
      );
      return { id: result.insertId, ...patientData };
    } catch (error) {
      console.error('Error creating patient:', error);
      throw new Error('Failed to create patient');
    }
  }

  // Get all patients
public async getAllPatients(): Promise<Patient[]> {
  try {
    const patients = await query('SELECT * FROM patients'); // Fetch all patients from the database
    console.log('Database Query Result:', patients); // Debugging log
    return patients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw new Error('Failed to fetch patients');
  }
}

  // Get a patient by ID
  public async getPatientById(id: string): Promise<Patient | null> {
    try {
      const patients = await query('SELECT * FROM patients WHERE id = ?', [id]);
      return patients.length > 0 ? patients[0] : null;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw new Error('Failed to fetch patient');
    }
  }

  // Update a patient
 public async updatePatient(id: string, patientData: PatientRequest): Promise<Patient | null> {
  try {
    const result = await query(
      `UPDATE patients 
      SET firstName = ?, lastName = ?, dateOfBirth = ?, gender = ?, contactNumber = ?, email = ?, 
      address = ?, emergencyContact = ?, bloodType = ?, allergies = ? 
      WHERE id = ?`,
      [
        patientData.firstName,
        patientData.lastName,
        patientData.dateOfBirth,
        patientData.gender,
        patientData.contactNumber,
        patientData.email,
        patientData.address,
        JSON.stringify(patientData.emergencyContact),
        patientData.bloodType,
        JSON.stringify(patientData.allergies),
        id,
      ]
    );
    if (result.affectedRows > 0) {
      return { id: parseInt(id, 10), ...patientData };
    }
    return null;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw new Error('Failed to update patient');
  }
}

  // Delete a patient
  public async deletePatient(id: string): Promise<boolean> {
    try {
      const result = await query('DELETE FROM patients WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw new Error('Failed to delete patient');
    }
  }

  // Validate user credentials
  static async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await query('SELECT * FROM users WHERE email = ?', [email]);
      if (user.length === 0) return null;

      const isPasswordValid = await bcrypt.compare(password, user[0].password);
      if (!isPasswordValid) return null;

      return { id: user[0].id, email: user[0].email };
    } catch (error) {
      console.error('Error validating user:', error);
      throw new Error('Failed to validate user');
    }
  }
}

export default PatientService;
