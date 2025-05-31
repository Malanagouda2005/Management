import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace 'any' with a specific type if you know the structure of 'decoded'
    }
  }
}
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { PatientController } from '../controllers/patientController'; // Use named export

const patientController = new PatientController();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // For now, bypass authentication
  next();
};

const router = Router();

router.post('/', authenticate, patientController.addPatient);

export default router;