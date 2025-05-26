import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const appointmentController = new AppointmentController();

router.post('/', authenticate, appointmentController.createAppointment);
router.delete('/:id', authenticate, appointmentController.deleteAppointment); // Delete appointment
router.put('/:id', authenticate, appointmentController.updateAppointment); // Update appointment

export default router;