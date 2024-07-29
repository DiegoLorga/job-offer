import mongoose, { Schema, Model, Document, Mixed } from 'mongoose';

// Definición de la interfaz para el perfil de usuario
interface perfilUsuario extends Document {
  id_usuario: Mixed;
  cv: boolean;
  experiencia: string;
  especialidad: string;
  habilidades: string;
  educacion: string;
  idiomas: string;
  certificaciones: boolean;
  repositorio: string;
  status: boolean;
  foto: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Esquema de Mongoose para el perfil de usuario
const schemaperfilUsuario = new Schema<perfilUsuario>({
  cv: {
    type: Boolean,
    //required: true,
  },
  experiencia: {
    type: String,
    //required: true,
  },
  especialidad: {
    type: String,
    //required: true,
  },
  habilidades: {
    type: String,
    //required: true,
  },
  educacion: {
    type: String,
    //required: true,
  },
  idiomas: {
    type: String,
    //required: true,
  },
  certificaciones: {
    type: Boolean,
    //required: true,
  },
  repositorio: {
    type: String,
    //required: true,
  },
  status: {
    type: Boolean,
    //required: true,
  },
  foto: {
    type: Boolean,
    //required: true,
  },
  id_usuario:{
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    requiere: true

},
}, {
  timestamps: true
});

export default mongoose.model<perfilUsuario>('perfilUsuario', schemaperfilUsuario);
