import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface fotosEmmpresa {
    id_empresa: Mixed;
}
const schemafotosEmpresa = new Schema<fotosEmmpresa>({
    id_empresa:{
        type: Schema.Types.ObjectId,
        ref: 'Empresa ',
        requiere: true
    },
},
    {
        timestamps: true
    }
)
export default mongoose.model('fotosEmpresa', schemafotosEmpresa);