import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface NombreRedes {
    nombre:string;
    createdAt: Date;
    updatedAt: Date;
}
const schemaNombreRedes = new Schema<NombreRedes>({
    nombre:
    {
        type: String,
        required: true,
        trim: true
    },
},
    {
        timestamps: true
    }
)
export default mongoose.model('NombreRedes', schemaNombreRedes);