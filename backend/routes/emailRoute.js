// routes/emailRoutes.js
import express from 'express';
import { sendContactEmail } from '../controllers/emailContoller.js';

const router = express.Router();

router.post('/send-email', sendContactEmail);

export default router;
