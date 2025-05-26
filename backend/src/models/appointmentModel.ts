import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/db';

interface IAppointmentAttributes {
  id: number;
  patientId: number;
  purpose: string;
  date: string;
  time: string;
  doctorName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

type IAppointmentCreationAttributes = Optional<IAppointmentAttributes, 'id'>;

class Appointment extends Model<IAppointmentAttributes, IAppointmentCreationAttributes> implements IAppointmentAttributes {
  public id!: number;
  public patientId!: number;
  public purpose!: string;
  public date!: string;
  public time!: string;
  public doctorName!: string;
  public status!: 'scheduled' | 'completed' | 'cancelled';
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
      defaultValue: 'scheduled',
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'appointments',
  }
);

export default Appointment;