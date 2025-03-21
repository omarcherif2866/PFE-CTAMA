import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const RDVSchema = new Schema(
    {
        description: {
            type: String,
        },
        date: {
            type: String,
        },
        heure: {
            type: String,
        },
        ownedBy: { 
            type: mongoose.Types.ObjectId, 
            ref: 'Experts' 
        },
        receiver: { 
            type: mongoose.Types.ObjectId, 
            ref: 'Clients' 
        },

    },
    {
        timestamps: true
    }
);

export default model('RDV', RDVSchema);