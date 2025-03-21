import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const expertiseSchema = new Schema({
    montant: { type: Number, required: true },
    expert: { type: Schema.Types.ObjectId, ref: 'Experts' }

});

export default model('Expertises', expertiseSchema);
