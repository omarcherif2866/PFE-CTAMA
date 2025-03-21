import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const sinistreSchema = new Schema({
    date_survenance: { type: String },
    date_declaration: { type: String, },
    num_police: { type: String },
    objet_assure: { type: String },
    description: { type: String},
    status: { type: String, enum: ['déclaration', 'expertise', 'reglement '], default: 'déclaration' },
    reference: { type: String, required: true },
    documents: { type: Schema.Types.ObjectId, ref: 'Documents' },

});

export default model('Sinistres', sinistreSchema);
