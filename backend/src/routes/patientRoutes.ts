import { Router } from 'express';
import { PatientController } from '../controllers/patientController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const patientController = new PatientController();

router.get('/', authenticate, patientController.getPatients);
router.post('/', authenticate, patientController.addPatient);
router.get('/:id', authenticate, patientController.getPatientById);
router.put('/:id', authenticate, patientController.updatePatient);
router.delete('/:id', authenticate, patientController.deletePatient);

export default router;