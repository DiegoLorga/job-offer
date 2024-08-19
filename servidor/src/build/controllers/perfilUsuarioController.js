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
                res.json({
                    statusCode: 200,
                    data: habilidadesFormateadas
                });
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
            const habilidades = req.body; // Se espera que sea un array de habilidades
            const { id_usuario } = req.params;
            try {
                // Verifica que req.body sea un array
                if (!Array.isArray(habilidades)) {
                    res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                        Error: "El cuerpo de la solicitud debe ser un array de habilidades"
                    }));
                    return;
                }
                // Verifica que cada habilidad tenga una descripción
                for (const habilidad of habilidades) {
                    if (!habilidad.descripcion || typeof habilidad.descripcion !== 'string') {
                        res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                            Error: "Cada habilidad debe tener una descripción válida"
                        }));
                        return;
                    }
                }
                // Añadir el id_usuario a cada habilidad
                const habilidadesConUsuario = habilidades.map(habilidad => (Object.assign(Object.assign({}, habilidad), { id_usuario })));
                yield perfilUsuario_model_1.default.findOneAndUpdate({ id_usuario }, { habilidades: true }, { new: true });
                console.log(habilidades);
                console.log(habilidadesConUsuario);
                // Crear las nuevas habilidades
                const nuevasHabilidades = yield habilidades_model_1.default.insertMany(habilidadesConUsuario);
                res.status(201).json((0, jsonResponse_1.jsonResponse)(201, nuevasHabilidades));
            }
            catch (error) {
                console.error('Error al crear habilidades:', error); // Para depuración
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al crear las habilidades"
                }));
            }
        });
    }
}
exports.perfilUsuarioController = new PerfilUsuarioController();
