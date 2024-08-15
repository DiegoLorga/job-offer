
import mongoose, { Schema, Model } from 'mongoose';

interface Educacion {
    nivel: "string"
}
const schemaEducacion = new Schema<Educacion>({
    nivel:
    {
        type: String,
        required: true,
        trim: true
    }
}
)
export default mongoose.model('Educacion', schemaEducacion);
