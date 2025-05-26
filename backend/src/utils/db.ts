import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false, // Disable logging; set to true for debugging
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connected successfully');
  
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Add and export the connect function
export const connect = async () => {
  await testConnection();
};

// Export the query function
export async function query(sql: string, params?: any[]): Promise<any> {
  try {
    const [results] = await sequelize.query(sql, { replacements: params });
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

export { sequelize, testConnection };