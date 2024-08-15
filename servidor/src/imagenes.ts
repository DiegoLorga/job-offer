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
        this.app.use('/doc', express.static(path.join(__dirname, 'doc'))); 
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
            const file = req.body.src;
            const name = 'perfilUsuario';
            const id = req.body.id;
            const binaryData = Buffer.from(file.replace(/^data:image\/[a-z]+;base64,/, ""), 'base64').toString('binary');

            try {
                fs.writeFile(`${__dirname}/img/` + name + '/' + id + '.jpg', binaryData, "binary", async (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error al guardar la imagen ", error: err });
                    }
                    try {
                        // Buscar el perfil basado en id_usuario y actualizar el campo foto a true
                        const perfil = await PerfilUsuario.findOneAndUpdate({ id_usuario: id }, { foto: true }, { new: true });
                       
                        res.json({ fileName: id + '.jpg', perfil });
                    } catch (updateError) {
                        res.status(500).json({ message: "Error al guardar la imagen ", error: updateError });
                    }
                });
            } catch (writeError) {
                console.log(writeError);
                res.status(500).json({ message: "Error al procesar la imagen", error: writeError });
            }
        });

        this.app.post('/uploadCv', async (req: Request, res: Response) => {
            const file = req.body.src;
            const name = 'cvUsuario';
            const id = req.body.id;
            const binaryData = Buffer.from(file.replace(/^data:application\/pdf;base64,/, ""), 'base64').toString('binary');
        
            // Usa un bloque try-catch para manejar errores generales
            try {
                // Usa fs.promises para trabajar con promesas y evitar callbacks anidados
                await fs.promises.writeFile(`${__dirname}/doc/` + name + '/' + id + '.pdf', binaryData, "binary");
                
                // Actualiza el perfil en la base de datos
                const perfil = await PerfilUsuario.findOneAndUpdate({ id_usuario: id }, { cv: true }, { new: true });
                if (!perfil) {
                    return res.status(404).json({ message: "Perfil no encontrado" });
                }
                
                // Responde con éxito
                res.json({ fileName: id + '.pdf', perfil });
            } catch (error) {
                // Maneja errores en un solo lugar
                if (error instanceof Error) {
                    console.error('Error:', error.message);
                    res.status(500).json({ message: "Error al procesar el archivo", error: error.message });
                } else {
                    res.status(500).json({ message: "Error" });
                }
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

                        res.status(500).json({ message: "Error al actualizar el perfil", error: updateError });
                    }
                });
            } catch (deleteError) {
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
