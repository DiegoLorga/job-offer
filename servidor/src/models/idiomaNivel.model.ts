import mongoose, { Schema, Model, Mixed } from 'mongoose';

interface IdiomaNivel {
    nivel: string;
}

const schemaIdiomaNivel = new Schema<IdiomaNivel>({
    nivel:
    {
        type: String,
        required: true,
        trim: true
    },

},

)
export default mongoose.model('IdiomaNivel', schemaIdiomaNivel);