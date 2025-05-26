import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/db'; // Import the Sequelize instance

interface IPatientAttributes {
  id: number;
  name: string;
  age: number;
  gender: string;
  medicalHistory: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
}

type IPatientCreationAttributes = Optional<IPatientAttributes, 'id'>;

class Patient extends Model<IPatientAttributes, IPatientCreationAttributes> implements IPatientAttributes {
  public id!: number;
  public name!: string;
  public age!: number;
  public gender!: string;
  public medicalHistory!: string[];
  public contactInfo!: {
    phone: string;
    email: string;
  };

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Patient.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    medicalHistory: {
      type: DataTypes.JSON, // Storing as JSON for simplicity
      allowNull: false,
      defaultValue: [],
    },
    contactInfo: {
      type: DataTypes.JSON, // Storing as JSON for simplicity
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'patients',
  }
);

export default Patient;