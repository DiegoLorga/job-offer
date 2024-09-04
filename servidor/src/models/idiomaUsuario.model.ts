import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface IdiomaUsuario {
    id_usuario: Mixed;
    id_idioma: Mixed
    id_nivel: Mixed
}

const schemaIdiomaUsuario = new Schema<IdiomaUsuario>({
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    id_idioma: {
        type: Schema.Types.ObjectId,
        ref: 'Idioma',
        required: true
    },
    id_nivel: {
        type: Schema.Types.ObjectId,
        ref: 'IdiomaNivel',
        required: true
    }
},

)
export default mongoose.model('IdiomaUsuario', schemaIdiomaUsuario);