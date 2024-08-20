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
exports.perfilUsuarioController = void 0;
const experiencia_model_1 = __importDefault(require("../models/experiencia.model"));
const jsonResponse_1 = require("../lib/jsonResponse");
const perfilUsuario_model_1 = __importDefault(require("../models/perfilUsuario.model"));
const habilidades_model_1 = __importDefault(require("../models/habilidades.model"));
const educacionUsuario_model_1 = __importDefault(require("../models/educacionUsuario.model"));
class PerfilUsuarioController {
    actualizarExperiencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa, puesto, descripcion } = req.body;
            const { id_usuario } = req.params;
            try {
                const experiencia = yield experiencia_model_1.default.findOneAndUpdate({ id_usuario }, { empresa, puesto, descripcion }, { new: true, runValidators: true });
                if (!experiencia) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        Error: "No se encontró la experiencia para el usuario dado"
                    }));
                    return;
                }
                const perfil = yield perfilUsuario_model_1.default.findOneAndUpdate({ id_usuario }, { experiencia: true }, { new: true });
                // Devuelve la experiencia actualizada
                res.json((0, jsonResponse_1.jsonResponse)(200, experiencia));
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al actualizar la experiencia"
                }));
            }
        });
    }
    buscarExperiencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            try {
                const experiencia = yield experiencia_model_1.default.findOne({ id_usuario });
                if (!experiencia) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        Error: "No se encontró la experiencia para el usuario dado"
                    }));
                    return;
                }
                // Devuelve la experiencia encontrada
                res.json({
                    id: experiencia._id,
                    empresa: experiencia.empresa,
                    puesto: experiencia.puesto,
                    descripcion: experiencia.descripcion
                });
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al buscar la experiencia"
                }));
            }
        });
    }
    actualizarHabilidades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const habilidades = req.body; // Se espera que sea un array de habilidades
            const { id_usuario } = req.params;
            try {
                if (!Array.isArray(habilidades)) {
                    res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                        Error: "No hay habilidades para mostrar"
                    }));
                    return;
                }
                const actualizaciones = habilidades.map((habilidad) => habilidades_model_1.default.findOneAndUpdate({ id_usuario, _id: habilidad._id }, { descripcion: habilidad.descripcion }, { new: true, runValidators: true }));
                const habilidadesActualizadas = yield Promise.all(actualizaciones);
                if (habilidadesActualizadas.includes(null)) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        Error: "Una o más habilidades no se encontraron para el usuario dado"
                    }));
                    return;
                }
                res.json((0, jsonResponse_1.jsonResponse)(200, habilidadesActualizadas));
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al actualizar las habilidades"
                }));
            }
        });
    }
    buscarHabilidades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            try {
                const habilidades = yield habilidades_model_1.default.find({ id_usuario });
                if (!habilidades || habilidades.length === 0) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        Error: "No se encontraron habilidades para el usuario dado"
                    }));
                    return;
                }
                //console.log(habilidades)
                const habilidadesFormateadas = habilidades.map(habilidad => ({
                    _id: habilidad._id.toString(),
                    descripcion: habilidad.descripcion,
                    id_usuario: habilidad.id_usuario.toString()
                }));
                console.log(habilidadesFormateadas);
                res.status(200).json(habilidadesFormateadas);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al buscar las habilidades"
                }));
            }
        });
    }
    crearHabilidades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const habilidades = req.body; // Array de habilidades a agregar
            const { id_usuario } = req.params;
            try {
                if (!Array.isArray(habilidades)) {
                    res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                        Error: "El cuerpo de la solicitud debe ser un array de habilidades"
                    }));
                    return;
                }
                // Verifica que cada habilidad tenga una descripción válida
                for (const habilidad of habilidades) {
                    if (!habilidad.descripcion || typeof habilidad.descripcion !== 'string') {
                        res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                            Error: "Cada habilidad debe tener una descripción válida"
                        }));
                        return;
                    }
                }
                // Filtra las habilidades que ya existen en la base de datos
                const habilidadesExistentes = yield habilidades_model_1.default.find({
                    id_usuario,
                    descripcion: { $in: habilidades.map(h => h.descripcion) }
                }).exec();
                const descripcionesExistentes = habilidadesExistentes.map(h => h.descripcion);
                // Filtra las habilidades nuevas que no están en la base de datos
                const habilidadesNuevas = habilidades.filter(h => !descripcionesExistentes.includes(h.descripcion));
                if (habilidadesNuevas.length > 0) {
                    // Crear nuevas habilidades
                    const nuevasHabilidades = yield habilidades_model_1.default.insertMany(habilidadesNuevas.map(habilidad => (Object.assign(Object.assign({}, habilidad), { id_usuario }))));
                    // Actualizar el perfil del usuario con los IDs de las nuevas habilidades
                    yield perfilUsuario_model_1.default.findOneAndUpdate({ id_usuario }, { $addToSet: { habilidades_ids: { $each: nuevasHabilidades.map(h => h._id) } } } // Usa $addToSet para agregar solo los nuevos IDs
                    );
                    res.status(201).json((0, jsonResponse_1.jsonResponse)(201, nuevasHabilidades));
                }
                else {
                    res.status(200).json((0, jsonResponse_1.jsonResponse)(200, { Message: "No hay nuevas habilidades para agregar" }));
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error al crear habilidades:', error.message);
                    res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                        Error: "Error al crear las habilidades"
                    }));
                }
                else {
                    console.error('Error desconocido:', error);
                    res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                        Error: "Error desconocido al crear las habilidades"
                    }));
                }
            }
        });
    }
    eliminarHabilidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_habilidad } = req.params; // _id de la habilidad a eliminar
            const { id_usuario } = req.body; // id_usuario del usuario
            try {
                // Elimina la habilidad específica basada en _id
                const habilidadEliminada = yield habilidades_model_1.default.findOneAndDelete({
                    _id: id_habilidad,
                    id_usuario
                });
                if (!habilidadEliminada) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        Error: "Habilidad no encontrada para el usuario dado"
                    }));
                    return;
                }
                // Actualiza el perfil del usuario para eliminar la habilidad
                yield perfilUsuario_model_1.default.findOneAndUpdate({ id_usuario }, { $pull: { habilidadesIds: id_habilidad } } // Usa $pull para eliminar el ID de las habilidades
                );
                res.status(200).json((0, jsonResponse_1.jsonResponse)(200, {
                    Message: "Habilidad eliminada correctamente"
                }));
            }
            catch (error) {
                console.error('Error al eliminar la habilidad:', error.message);
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al eliminar la habilidad"
                }));
            }
        });
    }
    actualizarEducacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nivel, institucion, carrera } = req.body;
            const { id_usuario } = req.params;
            try {
                const educacionUsuario = yield educacionUsuario_model_1.default.findOneAndUpdate({ id_usuario }, { nivel, institucion, carrera }, { new: true, runValidators: true });
                if (!educacionUsuario) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        Error: "No se encontró la educación para el usuario dado"
                    }));
                    return;
                }
                const perfil = yield perfilUsuario_model_1.default.findOneAndUpdate({ id_usuario }, { educacion: true }, { new: true });
                // Devuelve la experiencia actualizada
                res.json((0, jsonResponse_1.jsonResponse)(200, educacionUsuario));
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al actualizar educacion"
                }));
            }
        });
    }
}
exports.perfilUsuarioController = new PerfilUsuarioController();
