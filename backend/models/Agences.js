import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const gouvernoratsTunisie = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba", "Médenine",
  "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine",
  "Tozeur", "Tunis", "Zaghouan"
];

const agenceSchema = new Schema({
  nom: { type: String, required: true },
  chefAgence: { type: String, required: true },
  email: { type: String, required: true },
  numero: { type: String, required: true },
  adresse: { type: String, required: true },
  gouvernorat: { type: String, required: true, enum: gouvernoratsTunisie }
});

export default model('Agences', agenceSchema);
