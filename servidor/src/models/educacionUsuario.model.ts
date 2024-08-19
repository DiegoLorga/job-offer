import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface EducacionUsuario {
    nombre: string;
    correo: string;
    id_rol: Mixed;
    contrasena: string;
    direccion: string;
    ciudad: string;
    estado: string;
    giro: string;
    foto: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const schemaEducacionUsuario = new Schema<EducacionUsuario>({
    nombre:
    {
        type: String,
        required: true,
        trim: true
    },
    correo:
    {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    contrasena:
    {
        type: String,
        required: true
    },
    id_rol: {
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        requiere: true

    },
    direccion:
    {
        type: String,
        required: true
    },
    estado:
    {
        type: String,
        required: true
    },
    ciudad:
    {
        type: String,
        required: true
    },
    giro:
    {
        type: String,
        required: true
    },
    foto:{
        type: Boolean,
    }
},
    {
        timestamps: true
    }
)
export default mongoose.model('EducacionUsuario', schemaEducacionUsuario);