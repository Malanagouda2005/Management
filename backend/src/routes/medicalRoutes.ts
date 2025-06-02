import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import medicalController from '../controllers/medicalController';

const router = Router();

router.post('/', authenticate, medicalController.addMedicalRecord);
router.get('/', authenticate, medicalController.getAllMedicalRecords);

export default router;