import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import Clients from "./Client.js"

const personneMoraleSchema = new Schema({
    raisonSociale: { type: String, required: true },
    activite: { type: String, required: true },
    matricule_fiscal: { type: String, required: true },
  });
  
  const PersonneMorale = Clients.discriminator('PersonneMorale', personneMoraleSchema);
  
  export default  PersonneMorale ;
  