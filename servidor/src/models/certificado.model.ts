import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface Certificado {
    nombre: string;
    descripcion: string;
    enlace: string;
    id_usuario: Mixed;
}

const schemaCertificado = new Schema<Certificado>({
    nombre:
    {
        type: String,
        required: true,
        trim: true
    },
    descripcion:
    {
        type: String,
        required: true,
        trim: true
    },
    enlace:
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
export default mongoose.model('Certificado', schemaCertificado);