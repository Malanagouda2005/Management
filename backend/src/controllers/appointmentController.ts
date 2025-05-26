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

  public async deleteAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointmentId = parseInt(req.params.id, 10);
      const deleted = await appointmentService.deleteAppointment(appointmentId);

      if (deleted) {
        res.status(200).json({ message: 'Appointment deleted successfully' }); // OK
      } else {
        res.status(404).json({ message: 'Appointment not found' }); // Not Found
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ message: 'Failed to delete appointment', error: (error as Error).message });
    }
  }

  public async updateAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointmentId = parseInt(req.params.id, 10);
      const updatedAppointment = await appointmentService.updateAppointment(appointmentId, req.body);

      if (updatedAppointment) {
        res.status(200).json(updatedAppointment); // OK
      } else {
        res.status(404).json({ message: 'Appointment not found' }); // Not Found
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ message: 'Failed to update appointment', error: (error as Error).message });
    }
  }
}


