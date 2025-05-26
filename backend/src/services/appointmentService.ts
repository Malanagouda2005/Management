import Appointment from '../models/appointmentModel';

export class AppointmentService {
  public async createAppointment(appointmentData: {
    patientId: number;
    purpose: string;
    date: string;
    time: string;
    doctorName: string;
    status?: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
  }): Promise<Appointment> {
    const sanitizedAppointmentData = {
      ...appointmentData,
      status: appointmentData.status ?? 'scheduled',
    };
    return await Appointment.create(sanitizedAppointmentData);
  }
}

export default AppointmentService;