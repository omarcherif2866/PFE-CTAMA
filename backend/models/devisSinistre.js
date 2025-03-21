import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const devisSinistreSchema = new Schema({
  devis: [{ type: String, required: true }], // Liste d'URLs d'images
  dateAjout: { type: Date, default: Date.now }, // Date d'ajout
  expert: { type: Schema.Types.ObjectId, ref: 'Experts', required: true }, // Référence à l'expert
  client: { type: Schema.Types.ObjectId, ref: 'Clients', required: true }, // Référence au client
  documents: { type: Schema.Types.ObjectId, ref: 'Documents' }
});

export default model('DevisSinistres', devisSinistreSchema);
