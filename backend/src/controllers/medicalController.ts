import { Request, Response } from 'express';
import { MedicalService } from '../services/medicalService';

const medicalService = new MedicalService();

class MedicalController {
  public async addMedicalRecord(req: Request, res: Response): Promise<void> {
    try {
      const newRecord = await medicalService.addMedicalRecord(req.body);
      res.status(201).json(newRecord);
    } catch (error) {
      console.error('Error adding medical record:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to add medical record', error: errorMessage });
      }
    }
  }

  public async getAllMedicalRecords(req: Request, res: Response): Promise<void> {
    try {
      const records = await medicalService.getAllMedicalRecords();
      res.status(200).json(records);
    } catch (error) {
      console.error('Error fetching all medical records:', error);
      res.status(500).json({ message: 'Failed to fetch medical records', error: (error as Error).message });
    }
  }
}

export default new MedicalController();