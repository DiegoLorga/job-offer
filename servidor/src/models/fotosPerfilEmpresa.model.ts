import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface fotosPerfilEmpresa {
    id_fotoEm: Mixed;
}
const schemafotosPerfilEmpresa = new Schema<fotosPerfilEmpresa>({
    id_fotoEm:{
        type: Schema.Types.ObjectId,
        ref: 'PerfilEmpresa',
        requiere: true
    },
},
    {
        timestamps: true
    }
)
export default mongoose.model('FotosPerfilEmpresa', schemafotosPerfilEmpresa);