import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface Empresa {
    id_empresa: Mixed;
    descripcion: string;
    mision: string;
    empleos: string;
    link:string;
    redesSociales:string;
    createdAt: Date;
    updatedAt: Date;
}
const schemaEmpresa = new Schema<Empresa>({
    descripcion:
    {
        type: String,
        required: true,
        trim: true
    },
    mision:
    {
        type: String,
        required: true,
        trim: true,
    },
    empleos:
    {
        type: String,
        required: true
    },
    id_empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        requiere: true

    },
    link:
    {
        type: String,
        required: true
    },
    redesSociales:
    {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    }
)
export default mongoose.model('Empresa', schemaEmpresa);