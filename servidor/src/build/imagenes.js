"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const perfilUsuario_model_1 = __importDefault(require("./models/perfilUsuario.model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Server {
    constructor() {
        (0, database_1.connectDB)();
        dotenv_1.default.config();
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.app.use('/img', express_1.default.static(path_1.default.join(__dirname, 'img')));
    }
    config() {
        this.app.use(express_1.default.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: false }));
        this.app.use(express_1.default.json({ limit: '50mb' }));
        this.app.set('port', process.env.PORT || 3002);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.post('/uploadImagen', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("upload image");
            const file = req.body.src;
            const name = 'peerfilUsuario';
            const id = req.body.id;
            const binaryData = Buffer.from(file.replace(/^data:image\/[a-z]+;base64,/, ""), 'base64').toString('binary');
            try {
                fs_1.default.writeFile(`${__dirname}/img/` + name + '/' + id + '.jpg', binaryData, "binary", (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Error al guardar la imagen ", error: err });
                    }
                    try {
                        const perfil = yield perfilUsuario_model_1.default.findByIdAndUpdate(id, { foto: true }, { new: true });
                        if (!perfil) {
                            return res.status(404).json({ message: "Perfil no encontrado" });
                        }
                        res.json({ fileName: id + '.jpg', perfil });
                    }
                    catch (updateError) {
                        console.log(updateError);
                        res.status(500).json({ message: "Error al guardar la imagen ", error: updateError });
                    }
                }));
            }
            catch (writeError) {
                console.log(writeError);
                res.status(500).json({ message: "Error al procesar la imagen", error: writeError });
            }
        }));
        this.app.delete('/deleteImagen/:tipo/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { tipo, id } = req.params;
            const imagePath = `${__dirname}/img/${tipo}/${id}.jpg`;
            try {
                // Elimina el archivo de imagen
                fs_1.default.unlink(imagePath, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Error al eliminar la imagen", error: err });
                    }
                    try {
                        // Actualiza el perfil del usuario para establecer el campo 'foto' a false
                        const perfil = yield perfilUsuario_model_1.default.findByIdAndUpdate(id, { foto: false }, { new: true });
                        if (!perfil) {
                            return res.status(404).json({ message: "Perfil no encontrado" });
                        }
                        // Responde con un mensaje de éxito y el perfil actualizado
                        res.json({ message: "Imagen eliminada exitosamente", perfil });
                    }
                    catch (updateError) {
                        console.log(updateError);
                        res.status(500).json({ message: "Error al actualizar el perfil", error: updateError });
                    }
                }));
            }
            catch (deleteError) {
                console.log(deleteError);
                res.status(500).json({ message: "Error al procesar la eliminación", error: deleteError });
            }
        }));
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor de imágenes en el puerto', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
