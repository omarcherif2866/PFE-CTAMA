
import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const FournituresEvalSchema = new Schema(
    {
    fourniture: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Fournitures' 
    },
    prix : {
            type: String,
    },
    },
    {
        timestamps: true
    }
);

export default model('FournituresEval', FournituresEvalSchema);