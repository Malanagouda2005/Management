import { Request, Response } from 'express';
import AppointmentService from '../services/appointmentService';

const appointmentService = new AppointmentService();

export class AppointmentController {
  public async createAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      res.status(201).json(appointment);
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
        res.status(200).json({ message: 'Appointment deleted successfully' });
      } else {
        res.status(404).json({ message: 'Appointment not found' });
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
        res.status(200).json(updatedAppointment);
      } else {
        res.status(404).json({ message: 'Appointment not found' });
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ message: 'Failed to update appointment', error: (error as Error).message });
    }
  }

  public async getAppointments(req: Request, res: Response): Promise<void> {
    try {
      const appointments = await appointmentService.getAppointments();
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Failed to fetch appointments', error: (error as Error).message });
    }
  }
  
}