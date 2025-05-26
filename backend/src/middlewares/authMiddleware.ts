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
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MALLU'); // Ensure the secret matches
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

const router = Router();

router.post('/', authenticate, patientController.addPatient);

export default router;