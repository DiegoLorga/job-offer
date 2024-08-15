import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface Experiencia {
    id_usuario: Mixed;
    empresa: string;
    puesto: string;
    descripcion: string;
}
const schemaExperiencia = new Schema<Experiencia>({
    empresa:
    {
        type: String,
        trim: true
    },
    puesto:
    {
        type: String,
        trim: true
    },
    descripcion :
    {
        type: String,
        trim: true
    },
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        requiere: true

    },
},
    {
        timestamps: true
    }
)
export default mongoose.model('Experencia', schemaExperiencia);