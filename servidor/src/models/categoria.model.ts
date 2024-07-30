
import mongoose, { Schema, Model } from 'mongoose';

interface Categoria {
    nombre: "string"
}
const schemaCategoria = new Schema<Categoria>({
    nombre:
    {
        type: String,
        required: true,
        trim: true
    }
}
)
export default mongoose.model('Categoria', schemaCategoria);
