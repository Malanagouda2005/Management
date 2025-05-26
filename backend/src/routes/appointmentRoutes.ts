import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const appointmentController = new AppointmentController();

router.post('/', authenticate, appointmentController.createAppointment);

export default router;