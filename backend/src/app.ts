import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connect as connectDB } from './utils/db';
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});