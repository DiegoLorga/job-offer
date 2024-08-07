import mongoose, { Schema, Model } from 'mongoose';

const schemaLogin = new Schema({
    
    correo:
    {
        type: String,
        required: true,
        trim: true
    },
    contrasena:
    {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)
export default mongoose.model('Login', schemaLogin);