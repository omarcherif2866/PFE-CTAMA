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

// Import des routes
import EmployeesRoutes from './routes/Employees.js';
import FournitureRoutes from './routes/fournitures.js';
import ExpertRoutes from './routes/ExpertRoute.js';
import ClientsRoutes from './routes/Client.js';
import ActualiteRoutes from './routes/actualite.js';
import AgenceRoutes from './routes/Agences.js';
import DocumentRoutes from './routes/DocumentRoutes.js';
import UserRoutes from './routes/User.js';
import VoitureRoutes from './routes/Voiture.js';
import SinistreRoutes from './routes/Sinistre.js';
import RDVRoutes from './routes/RDV.js';
import ImagesRoutes from './routes/Imagesinistres.js';
import DevisRoutes from './routes/Devis.js';
import ExpertiseRoutes from './routes/Expertise.js';
import FournitureEvalRoutes from './routes/evaluationFournitures.js';
import EmailRoutes from './routes/emailRoute.js';



// Configuration du serveur
const app = express();
const hostname = '127.0.0.1'; //l'@ du serveur
const port = process.env.PORT || 9090;
const databaseName = 'CTAMA';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Connexion à MongoDB
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb://127.0.0.1:27017/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`✅ Connecté à la base de données: ${databaseName}`))
  .catch(err => console.error(`❌ Erreur de connexion MongoDB:`, err));

// Configuration CORS
app.use(cors({
  origin: "*", // Autorise toutes les origines
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

// Middleware pour gérer les requêtes OPTIONS (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/img', express.static('public/images'));
app.use('/pdf', express.static('public/pdfs'));

// Configuration des sessions
app.use(cookieSession({
  name: "projectPi-session",
  secret: process.env.SESSION_SECRET || 'supersecret',
  httpOnly: true,
  sameSite: 'lax',
  secure: false, // Doit être `true` en production avec HTTPS
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // En local, sinon `true` en production
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Routes
app.use('/employees', EmployeesRoutes);
app.use('/clients', ClientsRoutes);
app.use('/user', UserRoutes);
app.use('/voiture', VoitureRoutes);
app.use('/Actualite', ActualiteRoutes);
app.use('/agence', AgenceRoutes);
app.use('/expert', ExpertRoutes);
app.use('/documents', DocumentRoutes);
app.use('/sinistre', SinistreRoutes);
app.use('/rendez-vous', RDVRoutes);
app.use('/imagessinistre', ImagesRoutes);
app.use('/devissinistre', DevisRoutes);
app.use('/pdf', ExpertiseRoutes);
app.use('/fourniture', FournitureRoutes);
app.use('/fournitureEval', FournitureEvalRoutes);
app.use('/mailing', EmailRoutes);



// Gestion des erreurs
app.use(notFoundError);
app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error("Erreur détectée :", err);
  res.status(500).json({ message: "Erreur interne du serveur", error: err });
});
app.use((req, res, next) => {
  console.log(`📡 Requête reçue: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Lancement du serveur
app.listen(port, hostname, () => {
  console.log(`🚀 Serveur démarré sur http://${hostname}:${port}/`);
});
