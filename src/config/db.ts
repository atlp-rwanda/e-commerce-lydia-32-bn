import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST!,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // This will force SSL usage
      rejectUnauthorized: false // Set this to true if you want to strictly enforce SSL certificate validation
    }
  },
});

export default db;
