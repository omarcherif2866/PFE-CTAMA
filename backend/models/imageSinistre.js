import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const imageSinistreSchema = new Schema({
  image: [{ type: String, required: true }],
  dateAjout: { type: Date, default: Date.now }, // Date d'ajout
  expert: { type: Schema.Types.ObjectId, ref: 'Experts', required: true }, // Référence à l'expert
  client: { type: Schema.Types.ObjectId, ref: 'Clients', required: true }, // Référence au client
  documents: { type: Schema.Types.ObjectId, ref: 'Documents' },
  imageAfterAccident: [{ type: String }],

});

export default model('ImageSinistres', imageSinistreSchema);
