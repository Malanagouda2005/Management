import { Router } from 'express';
import { PatientController } from '../controllers/patientController';
import { authenticate } from '../middlewares/authMiddleware';
import { PatientService } from '../services/patientService';


const router = Router();
const patientController = new PatientController();

router.get('/', authenticate, patientController.getPatients);
router.post('/', authenticate, patientController.addPatient);
router.get('/:id', authenticate, patientController.getPatientById);
router.put('/:id', authenticate, patientController.updatePatient);
router.delete('/:id', authenticate, patientController.deletePatient);
router.get('/', authenticate, patientController.getPatients);  // Fetch all medical records 
export default router;