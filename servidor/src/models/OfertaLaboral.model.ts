import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface OfertaLaboral {
    id_empresa: Mixed;
    titulo:string;
    puesto: string;
    sueldo: number;
    horario: string;
    modalidad:string;
    direccion:string;
    ciudad: string;
    estado:string;
    status:number;
    descripcion: string;
    requisitos:string;
    telefono:number;
    correo: string;
    educacion:string;
    idioma:string;
    createdAt: Date;
    updatedAt: Date;
}
const schemaOfertaLaboral = new Schema<OfertaLaboral>({
    id_empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        requiere: true

    },
    titulo:
    {
        type: String,
        required: true,
        trim: true
    },
    puesto:
    {
        type: String,
        required: true,
        trim: true
    },
    sueldo:
    {
        type: Number,
        required: true,
        trim: true,
    },
    horario:
    {
        type: String,
        required: true
    },
    modalidad:
    {
        type: String,
        required: true
    },
    direccion:
    {
        type: String,
        required: true
    },
    ciudad:
    {
        type: String,
        required: true
    },
    estado:
    {
        type: String,
        required: true
    },
    status:
    {
        type: Number,
        required: true
    },
    descripcion:
    {
        type: String,
        required: true
    },
    requisitos:
    {
        type: String,
        required: true
    },
    telefono:
    {
        type: Number,
        required: true
    },
    correo:
    {
        type: String,
        required: true
    },
    educacion:
    {
        type: String,
        required: true
    },
    idioma:
    {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    }
)
export default mongoose.model('OfertaLaboral', schemaOfertaLaboral);