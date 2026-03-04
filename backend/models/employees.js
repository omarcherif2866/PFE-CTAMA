import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const employeesSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  confirmPassword: { type: String},
  phoneNumber: { type: String, required: true },
  poste: { type: String, required: true },
  departement: { type: String, required: true },
});

export default model('Employees', employeesSchema);
