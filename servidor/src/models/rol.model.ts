import mongoose, { Schema, Model } from 'mongoose';

interface Rol {
    tipo: "string"
}
const schemaRol = new Schema<Rol>({
    tipo:
    {
        type: String,
        required: true,
        trim: true
    }
},
    {
        timestamps: true
    }
)
export default mongoose.model('Rol', schemaRol);