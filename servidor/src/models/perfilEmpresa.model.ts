import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface PerfilEmpresa {
    id_empresa: Mixed;
    descripcion: string;
    mision: string;
    empleos: string;
    paginaoficial:string;
    redesSociales:string;
    fotoEmp: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const schemaPerfilEmpresa = new Schema<PerfilEmpresa>({
    descripcion:
    {
        type: String,
        trim: true
    },
    mision:
    {
        type: String,
        trim: true,
    },
    empleos:
    {
        type: String,
    },
    id_empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        requiere: true

    },
    paginaoficial:
    {
        type: String,
    },
    redesSociales:
    {
        type: String,
    },
    fotoEmp:
    {
        type:Boolean,
    }
},
    {
        timestamps: true
    }
)
export default mongoose.model('PerfilEmpresa', schemaPerfilEmpresa);