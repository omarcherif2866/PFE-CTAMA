import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const gouvernoratsTunisie = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kebili", "Kef", "Mahdia", "Manouba", "Médenine",
  "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine",
  "Tozeur", "Tunis", "Zaghouan"
];

const docSchema = new Schema({
    description: { type: String, required: true },
    doc: { type: String },
    type: { type: String, enum: ['sinistre ', 'expertise'] },
    client: { type: Schema.Types.ObjectId, ref: 'Clients' },
    expert: { type: Schema.Types.ObjectId, ref: 'Experts'},
    status: { type: String, enum: ['En attente', 'Validé', 'Non Validé'], default: 'En attente' },
    gouvernorat: { type: String, required: true, enum: gouvernoratsTunisie }

},
{
    timestamps: true
}
);

export default model('Documents', docSchema);
