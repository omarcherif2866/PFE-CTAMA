import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const ActualiteSchema = new Schema(
    {
        nom: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export default model('Actualite', ActualiteSchema);