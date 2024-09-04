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
const idioma_model_1 = __importDefault(require("../models/idioma.model"));
const idiomaNivel_model_1 = __importDefault(require("../models/idiomaNivel.model"));
const idiomaUsuario_model_1 = __importDefault(require("../models/idiomaUsuario.model"));
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
            try {
                const habilidadId = req.params.id_habilidad;
                // Verifica si es un UUID o ObjectId
                const resultado = yield habilidades_model_1.default.findByIdAndDelete(habilidadId);
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
    createIdioma(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creado un idioma");
            const { idioma } = req.body;
            try {
                const nuevoIdioma = new idioma_model_1.default({
                    idioma
                });
                const IdiomaGuardado = yield nuevoIdioma.save();
                res.json({
                    nombre: IdiomaGuardado.idioma
                });
            }
            catch (_a) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear la red social"
                }));
            }
        });
    }
    listIdiomas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Listando idiomas");
            try {
                const idiomas = yield idioma_model_1.default.find();
                res.json(idiomas);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Hubo un error al obtener los idiomas"
                }));
            }
        });
    }
    createNivelIdioma(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creando un enlace a una red social");
            const { nivel } = req.body;
            try {
                const nuevoNivelIdioma = new idiomaNivel_model_1.default({
                    nivel
                });
                const NivelIdiomaGuardado = yield nuevoNivelIdioma.save();
                res.json({
                    nivel: NivelIdiomaGuardado.nivel,
                });
            }
            catch (_a) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear el enlace"
                }));
            }
        });
    }
    listNivelIdiomas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Listando niveles de idioma");
            try {
                const niveles = yield idiomaNivel_model_1.default.find();
                res.json(niveles);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Hubo un error al obtener los niveles de idioma"
                }));
            }
        });
    }
    agregarIdiomasNiveles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idiomasNiveles = req.body; // Array de idiomas con niveles a agregar
            const { id_usuario } = req.params; // ID del usuario
            try {
                if (!Array.isArray(idiomasNiveles)) {
                    res.status(400).json({ message: "El cuerpo de la solicitud debe ser un array de idiomas y niveles" });
                    return;
                }
                // Verificar que cada entrada tenga un idioma y nivel válido
                for (const item of idiomasNiveles) {
                    if (!item.id_idioma || !item.id_nivel) {
                        res.status(400).json({ message: "Cada entrada debe tener un id_idioma y un id_nivel válidos" });
                        return;
                    }
                }
                // Filtrar las combinaciones de idioma y nivel que ya existen para el usuario
                const combinacionesExistentes = yield idiomaUsuario_model_1.default.find({
                    id_usuario,
                    id_idioma: { $in: idiomasNiveles.map((item) => item.id_idioma) }
                }).exec();
                const combinacionesExistentesIds = combinacionesExistentes.map(item => item.id_idioma.toString() + item.id_nivel.toString());
                // Filtrar las nuevas combinaciones que no están en la base de datos
                const nuevasCombinaciones = idiomasNiveles.filter(item => !combinacionesExistentesIds.includes(item.id_idioma.toString() + item.id_nivel.toString()));
                if (nuevasCombinaciones.length > 0) {
                    // Crear nuevas combinaciones
                    const nuevasRelaciones = yield idiomaUsuario_model_1.default.insertMany(nuevasCombinaciones.map(item => ({
                        id_usuario,
                        id_idioma: item.id_idioma,
                        id_nivel: item.id_nivel
                    })));
                    // Actualizar el campo "idioma" en el modelo de usuario
                    yield perfilUsuario_model_1.default.findByIdAndUpdate(id_usuario, { idioma: true });
                    res.status(201).json({ message: "Idiomas y niveles agregados exitosamente", datos: nuevasRelaciones });
                }
                else {
                    res.status(200).json({ message: "No hay nuevos idiomas o niveles para agregar" });
                }
            }
            catch (error) {
                console.error('Error al agregar idiomas y niveles:', error);
                res.status(500).json({ message: "Error al agregar idiomas y niveles", error });
            }
        });
    }
    eliminarUsuarioIdioma(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioIdiomaId = req.params.id;
                // Verifica si es un UUID o ObjectId
                const resultado = yield idiomaUsuario_model_1.default.findByIdAndDelete(usuarioIdiomaId);
                if (!resultado) {
                    res.status(404).json({ message: 'Idioma no encontrado' });
                }
                res.status(200).json({ message: 'Idioma eliminado correctamente' });
            }
            catch (error) {
                console.error('Error al eliminar idioma:', error);
                res.status(500).json({ message: 'Error al eliminar idioma' });
            }
        });
    }
    ;
}
exports.perfilUsuarioController = new PerfilUsuarioController();
