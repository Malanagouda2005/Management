import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';

class MedicalRecord extends Model {
  public id!: number;
  public patientId!: number;
  public diagnosis!: string;
  public symptoms!: string;
  public treatment!: string;
  public notes!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MedicalRecord.init(
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
    diagnosis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    symptoms: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'medical_records',
  }
);

export default MedicalRecord;