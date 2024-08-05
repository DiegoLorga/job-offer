import mongoose, { Schema, Document, Model } from 'mongoose';

// Definir una interfaz para el esquema de la imagen
interface IImagen extends Document {
    filename: string;
    urlFile: string;
    dateUpload: Date;
}

// Definir el esquema de la imagen
const ImagenSchema: Schema = new Schema({
    filename: { type: String, required: true },
    urlFile: { type: String, required: true },
    dateUpload: { type: Date, default: Date.now }
});

// Crear y exportar el modelo
const Imagen: Model<IImagen> = mongoose.model<IImagen>('Imagen', ImagenSchema);
export default Imagen;
