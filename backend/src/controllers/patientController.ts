import { Request, Response } from 'express';
import { PatientService } from '../services/patientService';

const patientService = new PatientService();

export class PatientController {
 public async addPatient(req: Request, res: Response): Promise<void> {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      address,
      emergencyContact,
      bloodType,
      allergies,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !gender || !contactNumber || !email || !address || !emergencyContact) {
      res.status(400).json({ message: 'Missing required fields' });
    }

    const newPatient = await patientService.createPatient(req.body);
    res.status(201).json(newPatient); // Created
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).json({ message: 'Failed to add patient', error: (error as Error).message });
  }
}

  public async getPatients(req: Request, res: Response): Promise<void> {
    try {
      const patients = await patientService.getAllPatients();
      res.status(200).json(patients); // OK
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ message: 'Failed to fetch patients', error: (error as Error).message });
    }
  }

  public async getPatientById(req: Request, res: Response): Promise<void> {
    try {
      const patient = await patientService.getPatientById(req.params.id);
      if (patient) {
        res.status(200).json(patient); // OK
      } else {
        res.status(404).json({ message: 'Patient not found' }); // Not Found
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ message: 'Failed to fetch patient', error: (error as Error).message });
    }
  }
public async updatePatient(req: Request, res: Response): Promise<void> {
  try {
    const updatedPatient = await patientService.updatePatient(req.params.id, req.body);
    if (updatedPatient) {
      res.status(200).json(updatedPatient); // OK
    } else {
      res.status(404).json({ message: 'Patient not found' }); // Not Found
    }
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Failed to update patient', error: (error as Error).message });
  }
}

  public async deletePatient(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await patientService.deletePatient(req.params.id);
      if (deleted) {
        res.status(200).json({ message: 'Patient deleted successfully' }); // OK
      } else {
        res.status(404).json({ message: 'Patient not found' }); // Not Found
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ message: 'Failed to delete patient', error: (error as Error).message });
    }
  }
}
