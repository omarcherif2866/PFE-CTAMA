import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const expertSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  confirmPassword: { type: String},
  phoneNumber: { type: String, required: true },
  region: { type: String, required: true },
  taux: { type: Number, required: true },
  documents: [{ type: Schema.Types.ObjectId, ref: 'Documents' }],
  clients: [{ type: Schema.Types.ObjectId, ref: 'Clients' }],
  // imageSinistre: [{ type: String }],

});

export default model('Experts', expertSchema); 
