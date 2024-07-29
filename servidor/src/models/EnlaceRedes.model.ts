import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface EnlaceRedes {
    id_empresa: Mixed;
    link:string;
    id_redes: Mixed
    createdAt: Date;
    updatedAt: Date;
}
const schemaEnlaceRedes = new Schema<EnlaceRedes>({
    link:
    {
        type: String,
        required: true,
        trim: true
    },
    id_empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        requiere: true

    },
    id_redes: {
        type: Schema.Types.ObjectId,
        ref: 'NombreRedes',
        requiere: true

    },
},
    {
        timestamps: true
    }
)
export default mongoose.model('EnlaceRedes', schemaEnlaceRedes);