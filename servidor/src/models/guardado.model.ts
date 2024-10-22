import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface guardado {
    id_oferta: Mixed;
    id_usuario: Mixed;
    createdAt: Date;
    updatedAt: Date;
}
const schemaguardado = new Schema<guardado>({
    id_oferta: {
        type: Schema.Types.ObjectId,
        ref: 'Oferta',
        requiere: true

    },
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        requiere: true

    },
},
    {
        timestamps: true
    }
)
export default mongoose.model('guardado', schemaguardado); 