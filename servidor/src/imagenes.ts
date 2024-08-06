import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database';
import PerfilUsuario from './models/perfilUsuario.model';
import fs from 'fs';
import path from 'path';

class Server {
    public app: Application;

    constructor() {
        connectDB();
        dotenv.config();
        this.app = express();
        this.config();
        this.routes();
        this.app.use('/img', express.static(path.join(__dirname, 'img')));
    }

    config(): void {
        this.app.use(express.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: false }));
        this.app.use(express.json({ limit: '50mb' }));
        this.app.set('port', process.env.PORT || 3002);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: false }));
    }

    routes(): void {
        this.app.post('/uploadImagen', async (req: Request, res: Response) => {
            console.log("upload image");
            const file = req.body.src;
            const name = 'peerfilUsuario';
            const id = req.body.id;
            const binaryData = Buffer.from(file.replace(/^data:image\/[a-z]+;base64,/, ""), 'base64').toString('binary');

            try {
                fs.writeFile(`${__dirname}/img/` + name + '/' + id + '.jpg', binaryData, "binary", async (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Error al guardar la imagen ", error: err });
                    }
                    try {
                        const perfil = await PerfilUsuario.findByIdAndUpdate(id, { foto: true }, { new: true });
                        if (!perfil) {
                            return res.status(404).json({ message: "Perfil no encontrado" });
                        }
                        res.json({ fileName: id + '.jpg', perfil });
                    } catch (updateError) {
                        console.log(updateError);
                        res.status(500).json({ message: "Error al guardar la imagen ", error: updateError });
                    }
                });
            } catch (writeError) {
                console.log(writeError);
                res.status(500).json({ message: "Error al procesar la imagen", error: writeError });
            }
        });

        this.app.delete('/deleteImagen/:tipo/:id', async (req: Request, res: Response) => {
            const { tipo, id } = req.params;
            const imagePath = `${__dirname}/img/${tipo}/${id}.jpg`;
        
            try {
                // Elimina el archivo de imagen
                fs.unlink(imagePath, async (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Error al eliminar la imagen", error: err });
                    }
                    
                    try {
                        // Actualiza el perfil del usuario para establecer el campo 'foto' a false
                        const perfil = await PerfilUsuario.findByIdAndUpdate(id, { foto: false }, { new: true });
                        if (!perfil) {
                            return res.status(404).json({ message: "Perfil no encontrado" });
                        }
                        
                        // Responde con un mensaje de éxito y el perfil actualizado
                        res.json({ message: "Imagen eliminada exitosamente", perfil });
                    } catch (updateError) {
                        console.log(updateError);
                        res.status(500).json({ message: "Error al actualizar el perfil", error: updateError });
                    }
                });
            } catch (deleteError) {
                console.log(deleteError);
                res.status(500).json({ message: "Error al procesar la eliminación", error: deleteError });
            }
        });
        
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor de imágenes en el puerto', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();
