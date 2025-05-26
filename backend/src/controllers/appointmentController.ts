import { Request, Response } from 'express';
import AppointmentService from '../services/appointmentService';

const appointmentService = new AppointmentService();

export class AppointmentController {
  public async createAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      res.status(201).json(appointment); // Created
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ message: 'Failed to create appointment', error: (error as Error).message });
    }
  }
}
