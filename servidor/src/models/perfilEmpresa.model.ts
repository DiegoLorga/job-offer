import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface PerfilEmpresa {
    id_empresa: Mixed;
    descripcion: string;
    mision: string;
    empleos: string;
    paginaoficial:string;
    redesSociales:string;
    createdAt: Date;
    updatedAt: Date;
}
const schemaPerfilEmpresa = new Schema<PerfilEmpresa>({
    descripcion:
    {
        type: String,
        required: false,
        trim: true
    },
    mision:
    {
        type: String,
        required: false,
        trim: true,
    },
    empleos:
    {
        type: String,
        required: false
    },
    id_empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        requiere: true

    },
    paginaoficial:
    {
        type: String,
        required: false
    },
    redesSociales:
    {
        type: String,
        required: false
    },
},
    {
        timestamps: true
    }
)
export default mongoose.model('PerfilEmpresa', schemaPerfilEmpresa);