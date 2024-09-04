import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface Idioma {
    idioma: string;
}

const schemaIdioma = new Schema<Idioma>({
    idioma:
    {
        type: String,
        required: true,
        trim: true
    }
},

)
export default mongoose.model('Idioma', schemaIdioma);