import mongoose, { Schema, Model } from 'mongoose';

const schemaToken = new Schema({
    id:
    {
        type: Object,
    },
    token:
    {
        type: Object,
        required:true
    }
},
    {
        timestamps: true
    }
)
export default mongoose.model('Token', schemaToken);