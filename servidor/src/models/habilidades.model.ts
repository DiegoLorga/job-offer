import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface Habilidad {
    descripcion: string;
    id_usuario: Mixed;
}

const schemaHabilidad = new Schema<Habilidad>({
    descripcion:
    {
        type: String,
        required: true,
        trim: true
    },
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
},

)
export default mongoose.model('Habilidad', schemaHabilidad);