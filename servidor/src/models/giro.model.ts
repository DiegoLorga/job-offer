
import mongoose, { Schema, Model } from 'mongoose';

interface Giro {
    giro: "string"
}
const schemaGiro = new Schema<Giro>({
    giro:
    {
        type: String,
        required: true,
        trim: true
    }
}
)
export default mongoose.model('Giro', schemaGiro);
