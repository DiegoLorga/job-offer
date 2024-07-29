import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface fotosPerfilUsuario {
    id_fotoUs: Mixed;
}
const schemafotosPerfilUsuario = new Schema<fotosPerfilUsuario>({
    id_fotoUs:{
        type: Schema.Types.ObjectId,
        ref: 'PerfilUsuario',
        requiere: true
    },
},
    {
        timestamps: true
    }
)
export default mongoose.model('fotosPerfilUsuario', schemafotosPerfilUsuario);