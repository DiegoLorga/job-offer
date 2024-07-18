import mongoose, { Schema, Model } from 'mongoose';

interface Ciudad {
    clave: "string",
    nombre: "string"
}
const schemaCiudad = new Schema<Ciudad>({
    clave:
    {
        type: String,
        required: true,
        trim: true
    },
    nombre:
    {
        type: String,
        required: true,
        trim: true
    }
}
)
export default mongoose.model('Ciudad', schemaCiudad);