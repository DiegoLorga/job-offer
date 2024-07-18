import mongoose, { Schema, Model } from 'mongoose';

interface Estado {
    clave: "string",
    nombre: "string"
}
const schemaEstado = new Schema<Estado>({
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
export default mongoose.model('Estado', schemaEstado);