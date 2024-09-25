import mongoose, { Schema, Mixed } from 'mongoose';

interface Notificacion {
    recipientId: Mixed;                 // ID de la empresa que recibe la notificación
    senderId: Mixed;                    // ID del usuario que se postula (quien envía la notificación)
    message: string;                    // Mensaje de la notificación
    link: string;                       // Enlace relacionado a la notificación (ej: oferta laboral)
    isRead: boolean;                    // Estado de lectura de la notificación
    createdAt: Date;
    updatedAt: Date;
}

const schemaNotificacion = new Schema<Notificacion>({
    recipientId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Empresa',  // La empresa que recibe la notificación
    },
    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario',  // El usuario que se postula
    },
    message: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

export default mongoose.model('Notificacion', schemaNotificacion);
