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
const certificado_model_1 = __importDefault(require("../models/certificado.model"));
const validator_1 = __importDefault(require("validator"));
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
                    return;
                }
                const actualizaciones = habilidades.map((habilidad) => habilidades_model_1.default.findOneAndUpdate({ id_usuario, _id: habilidad._id }, { descripcion: habilidad.descripcion }, { new: true, runValidators: true }));
                const habilidadesActualizadas = yield Promise.all(actualizaciones);
                if (habilidadesActualizadas.includes(null)) {
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
    buscarHabilidades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            try {
                const habilidades = yield habilidades_model_1.default.find({ id_usuario });
                if (!habilidades || habilidades.length === 0) {
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
    eliminarHabilidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const habilidadId = req.params.id_habilidad;
                // Verifica si es un UUID o ObjectId
                const resultado = yield habilidades_model_1.default.findByIdAndDelete(habilidadId);
                const id_usuario = resultado === null || resultado === void 0 ? void 0 : resultado.id_usuario;
                const habilidades = yield habilidades_model_1.default.find({ id_usuario });
                if (!habilidades || habilidades.length === 0) {
                    yield perfilUsuario_model_1.default.findOneAndUpdate({ id_usuario }, { habilidades: false }, { new: true });
                }
                if (!resultado) {
                    res.status(404).json({ message: 'Habilidad no encontrada' });
                }
                res.status(200).json({ message: 'Habilidad eliminada correctamente' });
            }
            catch (error) {
                console.error('Error al eliminar habilidad:', error);
                res.status(500).json({ message: 'Error al eliminar habilidad' });
            }
        });
    }
    ;
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
    buscarEduUsu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            try {
                const eduUsu = yield educacionUsuario_model_1.default.findOne({ id_usuario });
                if (!eduUsu) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        Error: "No se encontró educacionUsuario para el usuario dado"
                    }));
                    return;
                }
                // Devuelve la experiencia encontrada
                res.json({
                    id: eduUsu._id,
                    nivel: eduUsu.nivel,
                    institucion: eduUsu.institucion,
                    carrera: eduUsu.carrera
                });
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al buscar la experiencia"
                }));
            }
        });
    }
    agregarCertificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, enlace, descripcion } = req.body;
            const { id_usuario } = req.params;
            try {
                // Verificar si el enlace es una URL válida
                if (!validator_1.default.isURL(enlace, { protocols: ['http', 'https'], require_protocol: true })) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        Error: "Enlace no válido"
                    }));
                    return;
                }
                const certificado = new certificado_model_1.default({
                    id_usuario: id_usuario,
                    nombre: nombre,
                    descripcion: descripcion,
                    enlace: enlace
                });
                const CertificadoGuardado = yield certificado.save();
                yield perfilUsuario_model_1.default.findOneAndUpdate({ id_usuario }, { certificaciones: true }, { new: true });
                res.json({
                    id: CertificadoGuardado._id,
                    nombre: CertificadoGuardado.nombre,
                    descripcion: CertificadoGuardado.descripcion,
                    enlace: CertificadoGuardado.enlace
                });
            }
            catch (error) {
                res.status(400).json({ error: "No se pudo crear el certificado" });
            }
        });
    }
    eliminarCertificado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const certificadoId = req.params.id_certificado;
                // Buscar y eliminar el certificado por su ID
                const resultado = yield certificado_model_1.default.findByIdAndDelete(certificadoId);
                if (!resultado) {
                    return res.status(404).json({ message: 'Certificado no encontrado' });
                }
                else {
                    const id_usuario = resultado === null || resultado === void 0 ? void 0 : resultado.id_usuario;
                    const certificaciones = yield certificado_model_1.default.find({ id_usuario });
                    if (!certificaciones || certificaciones.length === 0) {
                        yield perfilUsuario_model_1.default.findOneAndUpdate({ id_usuario }, { certificaciones: false }, { new: true });
                    }
                }
                return res.status(200).json({ message: 'Certificado eliminado correctamente' });
            }
            catch (error) {
                console.error('Error al eliminar certificado:', error);
                return res.status(500).json({ message: 'Error al eliminar certificado' });
            }
        });
    }
    buscarCertificaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            try {
                const certificaciones = yield certificado_model_1.default.find({ id_usuario });
                const certificacionesFormateadas = certificaciones.map(certificado => ({
                    _id: certificado._id.toString(),
                    nombre: certificado.nombre,
                    descripcion: certificado.descripcion,
                    enlace: certificado.enlace,
                }));
                console.log(certificacionesFormateadas);
                return res.status(200).json(certificacionesFormateadas);
            }
            catch (error) {
                return res.status(500).json({
                    Error: "Error al buscar las certificaciones"
                });
            }
        });
    }
    actualizarCertificado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, descripcion, enlace, _id } = req.body;
            try {
                const certificado = yield certificado_model_1.default.findByIdAndUpdate(_id, { nombre, descripcion, enlace }, { new: true, runValidators: true });
                if (!certificado) {
                    res.status(404).json({ Error: "No se encontró la certificación con el ID proporcionado" });
                    return;
                }
                res.json({ mensaje: "Certificación actualizada correctamente", certificado });
            }
            catch (error) {
                res.status(500).json({ Error: "Error al actualizar la certificación" });
            }
        });
    }
    buscarCertificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            try {
                const certificado = yield certificado_model_1.default.findOne({ id_usuario });
                if (!certificado) {
                    return;
                }
                // Devuelve la experiencia encontrada
                res.json({
                    id: certificado._id,
                    nombre: certificado.nombre,
                    descripcion: certificado.descripcion,
                    enlace: certificado.enlace
                });
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al buscar la experiencia"
                }));
            }
        });
    }
}
exports.perfilUsuarioController = new PerfilUsuarioController();
