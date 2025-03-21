import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import cookieSession from 'cookie-session';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { notFoundError, errorHandler } from './middlewares/error-handler.js';
import bodyParser from 'body-parser';




import EmployeesRoutes from './routes/Employees.js';
import ExpertRoutes from './routes/ExpertRoute.js';
import clientsRoutes from './routes/Client.js';
import ActualiteRoutes from './routes/actualite.js';
import AgenceRoutes from './routes/Agences.js';
import DocumentRoutes from './routes/DocumentRoutes.js';

import UserRoutes from './routes/User.js';
import VoitureRoutes from './routes/Voiture.js';
import SinistreRoutes from './routes/Sinistre.js';
import RDVRoutes from './routes/RDV.js';




const app = express(); // creer l'instance de express a utiliser
const hostname = '127.0.0.1'; //l'@ du serveur
const port = process.env.PORT || 9090; //le port du serveur
const databaseName = 'CTAMA';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb://127.0.0.1:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });

app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/img', express.static('public/images'));
app.use('/pdf', express.static('public/pdfs'));

app.use(cookieSession({
  name: "projectPi-session",
  secret: process.env.SESSION_SECRET,
  httpOnly: true,
  sameSite: 'none', // Autorise les cookies dans les requêtes entre sites
  secure: true, // Requis pour sameSite: 'none'
  maxAge: 24 * 60 * 60 * 1000 // 24 heures
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true, // Requis pour sameSite: 'none'
    sameSite: 'none', // Autorise les cookies dans les requêtes entre sites
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

app.use('/employees', EmployeesRoutes);
app.use('/clients', clientsRoutes);
app.use('/user', UserRoutes);
app.use('/voiture', VoitureRoutes);
app.use('/Actualite', ActualiteRoutes);
app.use('/agence', AgenceRoutes);
app.use('/expert', ExpertRoutes);
app.use('/documents', DocumentRoutes);
app.use('/sinistre', SinistreRoutes);
app.use('/rendez-vous', RDVRoutes);





app.use(notFoundError);
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
