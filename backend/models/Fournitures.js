import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const FournituresSchema = new Schema(
    {
        nom: {
            type: String,
        },
        type: { type: String, required: true, enum: ['Pieces', 'MainsDoeuvre'] }, // Type de client


    },
    {
        timestamps: true
    }
);

export default model('Fournitures', FournituresSchema);