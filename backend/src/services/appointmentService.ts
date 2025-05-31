import Appointment from '../models/appointmentModel';

// Define the IAppointmentAttributes interface
interface IAppointmentAttributes {
  patientId?: number;
  purpose?: string;
  date?: string;
  time?: string;
  doctorName?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

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

  public async deleteAppointment(appointmentId: number): Promise<boolean> {
    try {
      const result = await Appointment.destroy({ where: { id: appointmentId } });
      return result > 0; // Returns true if an appointment was deleted
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw new Error('Failed to delete appointment');
    }
  }
  public async updateAppointment(appointmentId: number, appointmentData: Partial<IAppointmentAttributes>): Promise<Appointment | null> {
  try {
    const [updated] = await Appointment.update(appointmentData, { where: { id: appointmentId } });

    if (updated) {
      return await Appointment.findByPk(appointmentId); // Return the updated appointment
    }
    return null; // No appointment was updated
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw new Error('Failed to update appointment');
  }
}
public async getAppointments(): Promise<Appointment[]> {
  try {
    return await Appointment.findAll(); // Fetch all appointments
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error('Failed to fetch appointments');
  }
}

}

export default AppointmentService;