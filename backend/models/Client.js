import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const clientSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  confirmPassword: { type: String },
  phoneNumber: { type: String, required: true },
  adresse: { type: String, required: true },
  typeClient: { type: String, required: true, enum: ['PersonnePhysique', 'PersonneMorale'] }, // Type de client
  documents: [{ type: Schema.Types.ObjectId, ref: 'Documents' }],
  experts: [{ type: Schema.Types.ObjectId, ref: 'Experts' }],
  devis: [{ type: String }],

}, { discriminatorKey: 'typeClient', timestamps: true }); // Utilisation du discriminatorKey

const Client = model('Clients', clientSchema);

export default Client;
