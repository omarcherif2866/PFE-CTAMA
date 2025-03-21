import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import Clients from "./Client.js"

const personnePhysiqueSchema = new Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    birthDate: { type: String, required: true },
    numeroPermis: { type: String, required: true },
    identifiant_national: { type: String, required: true },
    CIN_Pass: { type: String, required: true },
    sex: { type: String, enum: ['homme', 'femme'], required: true },
    nationalite: { type: String, required: true },
    profession: { type: String, required: true },

  });
  
  const PersonnePhysique = Clients.discriminator('PersonnePhysique', personnePhysiqueSchema);
  
  export default  PersonnePhysique ;
  