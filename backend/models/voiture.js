import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const voitureSchema = new Schema({

    puissance_fiscale: { type: Number },
    marque: { type: String },
    modele: { type: String, },
    nbr_portes: { type: Number,},
    num_chas: { type: String,},
});

export default model('Voitures', voitureSchema);
