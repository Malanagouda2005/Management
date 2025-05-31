import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const appointmentController = new AppointmentController();

router.post('/', authenticate, appointmentController.createAppointment);
router.delete('/:id', authenticate, appointmentController.deleteAppointment);
router.put('/:id', authenticate, appointmentController.updateAppointment);
router.get('/', authenticate, appointmentController.getAppointments); // Fetch all appointments

export default router;