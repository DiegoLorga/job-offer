import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface EducacionUsuario {
    nivel: string;
    institucion: string;
    id_usuario: Mixed;
    carrera: string;
}

const schemaEducacionUsuario = new Schema<EducacionUsuario>({
    nivel:
    {
        type: String,
        //required: true,
        //trim: true
    },
    institucion:
    {
        type: String,
        //required: true,
        //trim: true,
        
    },
    carrera:
    {
        type: String,
        //required: true
    },
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        requiere: true
    }
},
    {
        timestamps: true
    }
)
export default mongoose.model('EducacionUsuario', schemaEducacionUsuario);