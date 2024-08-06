import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface Administrador {
    nombre: string;
    correo: string;
    id_rol: Mixed;
    contrasena: string;
    createdAt: Date;
    updatedAt: Date;
}
const schemaAdministrador = new Schema<Administrador>({
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
},
    {
        timestamps: true
    }
)
export default mongoose.model('Admiistrador', schemaAdministrador);