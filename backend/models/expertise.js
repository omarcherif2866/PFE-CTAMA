import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const expertiseSchema = new Schema({
    montant: { type: Number, required: true },
    expert: { type: Schema.Types.ObjectId, ref: 'Experts' },
    rapport: [{ type: String, required: true }], // le pdf generé

    // sinistre: { type: Schema.Types.ObjectId, ref: 'Sinistres' },

});

export default model('Expertises', expertiseSchema);
