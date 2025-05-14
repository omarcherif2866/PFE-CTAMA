import express from 'express';
import {getAllImageSinistres, } from '../controllers/Imagesinistres.js';


const router = express.Router();

router.route('/')
.get(getAllImageSinistres);

export default router;
