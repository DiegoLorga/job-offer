interface NotificacionProps {
    _id: string;
    recipientId: string;
    senderId: string;
    message: string;
}

const PostulanteCard: React.FC<NotificacionProps> = ({ _id, recipientId, senderId, message }) => {
    return (
        <div className="card">
            <div className="card-content">
                <span className="card-title">Notificación</span>
                <p><strong>De:</strong> {senderId}</p>
                <p><strong>Para:</strong> {recipientId}</p>
                <p><strong>Mensaje:</strong> {message}</p>
            </div>
        </div>
    );
};
export default PostulanteCard;
