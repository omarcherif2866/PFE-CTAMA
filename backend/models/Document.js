import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const docSchema = new Schema({
    description: { type: String, required: true },
    doc: { type: String },
    type: { type: String, enum: ['sinistre ', 'expertise'] },
    client: { type: Schema.Types.ObjectId, ref: 'Clients' },
    expert: { type: Schema.Types.ObjectId, ref: 'Experts'},
    status: { type: String, enum: ['En attente', 'Validé', 'Non Validé'], default: 'En attente' },

},
{
    timestamps: true
}
);

export default model('Documents', docSchema);
