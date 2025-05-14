import express from 'express';
import {getAllDevisSinistres, } from '../controllers/Devis.js';


const router = express.Router();

router.route('/')
.get(getAllDevisSinistres);

export default router;
