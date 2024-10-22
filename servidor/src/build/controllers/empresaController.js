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
exports.empresaController = void 0;
const empresa_model_1 = __importDefault(require("../models/empresa.model"));
const jsonResponse_1 = require("../lib/jsonResponse");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../libs/jwt");
const rol_model_1 = __importDefault(require("../models/rol.model"));
const perfilEmpresa_model_1 = __importDefault(require("../models/perfilEmpresa.model"));
const OfertaLaboral_model_1 = __importDefault(require("../models/OfertaLaboral.model"));
const fotosEmpresa_model_1 = __importDefault(require("../models/fotosEmpresa.model"));
const fotosPerfilEmpresa_model_1 = __importDefault(require("../models/fotosPerfilEmpresa.model"));
const giro_model_1 = __importDefault(require("../models/giro.model"));
const notificacionEmpresa_model_1 = __importDefault(require("../models/notificacionEmpresa.model"));
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
class EmpresaController {
    constructor() {
    }
    createEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, correo, contrasena, direccion, ciudad, estado, giro, foto, descripcion, mision, empleos, paginaoficial, redesSociales, fotoEmp } = req.body;
            try {
                const rol = yield rol_model_1.default.findOne({ tipo: "Empresa" }); // Cambia "TipoDeseado" por el tipo que buscas
                if (!rol) {
                    res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                        error: "Rol no encontrado"
                    }));
                    return;
                }
                const tipoRol = rol._id; // Obtener el ID del rol encontrado
                const hashedPassword = yield bcryptjs_1.default.hash(contrasena, 10);
                const nuevaEmpresa = new empresa_model_1.default({
                    nombre,
                    correo,
                    contrasena: hashedPassword,
                    direccion,
                    ciudad,
                    estado,
                    giro,
                    id_rol: tipoRol,
                    foto: false
                });
                const EmpresaGuardado = yield nuevaEmpresa.save();
                const nuevaFotoEmpresa = new fotosEmpresa_model_1.default({
                    id_empresa: EmpresaGuardado._id
                });
                yield nuevaFotoEmpresa.save();
                console.log("Empresaaaaa");
                const nuevoPerfilEmpresa = new perfilEmpresa_model_1.default({
                    id_empresa: EmpresaGuardado._id,
                    descripcion,
                    mision,
                    empleos,
                    paginaoficial,
                    redesSociales,
                    fotoEmp: false
                });
                const PerfilGuardado = yield nuevoPerfilEmpresa.save();
                const token = yield (0, jwt_1.createAccesToken)({ id: EmpresaGuardado._id });
                res.cookie('token', token);
                console.log(res.cookie);
                const nuevaFotoPerfil = new fotosPerfilEmpresa_model_1.default({
                    id_fotoEm: PerfilGuardado._id
                });
                yield nuevaFotoPerfil.save();
                res.cookie('token', token);
                console.log(res.cookie);
                res.json({
                    idRol: EmpresaGuardado.id_rol,
                    nombre: EmpresaGuardado.nombre,
                    correo: EmpresaGuardado.correo,
                    direccion: EmpresaGuardado.direccion,
                    ciudad: EmpresaGuardado.ciudad,
                    estado: EmpresaGuardado.estado,
                    giro: EmpresaGuardado.giro,
                    foto: EmpresaGuardado.foto,
                    descripcion: PerfilGuardado.descripcion,
                    mision: PerfilGuardado.mision,
                    empleos: PerfilGuardado.empleos,
                    paginaoficial: PerfilGuardado.paginaoficial,
                    redesSociales: PerfilGuardado.redesSociales,
                    FotoEmp: PerfilGuardado.fotoEmp
                });
            }
            catch (error) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear el empresa"
                }));
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Mostrando todas las empresas");
                const empresa = yield empresa_model_1.default.find();
                res.json(empresa);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Hubo un problema"
                }));
            }
        });
    }
    getGiro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Mostrando todos los giros");
                const giro = yield giro_model_1.default.find();
                res.json(giro);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Hubo un problema"
                }));
            }
        });
    }
    // Controllers/empresaController.ts
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Mostrando una empresa");
                const empresa = yield empresa_model_1.default.findById(req.params.id);
                if (!empresa) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, { error: "Empresa no encontrada" }));
                    return;
                }
                // Obtener el perfil de la empresa
                const perfil = yield perfilEmpresa_model_1.default.findOne({ id_empresa: empresa._id });
                res.json({
                    empresa,
                    perfil
                });
                console.log("Empresa: ", empresa);
                console.log("Perfil: ", perfil);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, { error: "Hubo un error" }));
            }
        });
    }
    borrarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Borrando una empresa");
            try {
                const idEmpresa = req.params.id;
                // Buscar y eliminar el perfil de la empresa usando el ID de la empresa
                const perfil = yield perfilEmpresa_model_1.default.findOneAndDelete({ id_empresa: idEmpresa });
                if (!perfil) {
                    console.log("Perfil no encontrado o ya eliminado");
                }
                const oferta = yield OfertaLaboral_model_1.default.findOneAndDelete({ id_empresa: idEmpresa });
                if (!oferta) {
                    console.log("Oferta no encontrada o ya eliminada");
                }
                // Eliminar la empresa
                const empresa = yield empresa_model_1.default.findByIdAndDelete(idEmpresa);
                if (!empresa) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        error: "Empresa no encontrada"
                    }));
                    return;
                }
                res.json({
                    message: "Empresa y documentos relacionados eliminados correctamente",
                    empresa
                });
            }
            catch (error) {
                console.error(error); // Log the specific error for debugging
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo eliminar la empresa"
                }));
            }
        });
    }
    actualizarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Actualizando un empresa");
                const empresa = yield empresa_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.json(empresa);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo actualizar la información de la empresa"
                }));
            }
        });
    }
    actualizarPerfilEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Actualizando un empresa");
                const perfil = yield perfilEmpresa_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.json(perfil);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo actualizar la información del perfil"
                }));
            }
        });
    }
    obtenerPerfilEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const perfil = yield perfilEmpresa_model_1.default.findOne({ id_empresa: id });
                if (perfil) {
                    res.json(perfil);
                }
                else {
                    res.status(404).json({ message: 'Perfil de empresa no encontrado' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener el perfil de la empresa', error });
            }
        });
    }
    ;
    buscarEmpresas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Filtrando las empresas");
                // Extracción de parámetros de búsqueda desde la consulta de la URL
                const { ciudad, estado, giro } = req.body;
                // Construcción dinámica del filtro de búsqueda
                const filtros = {};
                if (estado)
                    filtros.estado = estado;
                if (ciudad)
                    filtros.ciudad = ciudad;
                if (giro)
                    filtros.giro = giro;
                // Consulta a la base de datos usando los filtros
                const empresas = yield empresa_model_1.default.find(filtros);
                // Verificar si se encontraron empresas
                if (empresas.length === 0) {
                    console.log("No hay coincidencias");
                    res.status(404).json({
                        message: "No se encontraron coincidencias"
                    });
                    return;
                }
                res.json(empresas);
            }
            catch (error) {
                console.error("Error al buscar empresas:", error);
                res.status(500).json({
                    error: "Hubo un error al buscar las empresas"
                });
            }
        });
    }
    filtrarPostulaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Mostrando las postulaciones por empresa");
                const empresa = yield empresa_model_1.default.findById(req.params.id);
                if (!empresa) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, { error: "Empresa no encontrada" }));
                    return;
                }
                // Obtener las notificaciones para la empresa
                const notificaciones = yield notificacionEmpresa_model_1.default.find({ recipientId: empresa._id });
                // Si no hay notificaciones
                if (!notificaciones.length) {
                    res.status(404).json({ message: 'No se encontraron notificaciones para esta empresa' });
                    return;
                }
                // Transformar las notificaciones para mostrar nombres en lugar de IDs
                const notificacionesConNombres = yield Promise.all(notificaciones.map((noti) => __awaiter(this, void 0, void 0, function* () {
                    let senderNombre = '';
                    let recipientNombre = '';
                    // Obtener el nombre del remitente (senderId) que puede ser un usuario
                    const sender = yield usuario_model_1.default.findById(noti.senderId);
                    if (sender) {
                        senderNombre = sender.nombre;
                        console.log(senderNombre);
                    }
                    else {
                        const senderEmpresa = yield empresa_model_1.default.findById(noti.senderId);
                        if (senderEmpresa) {
                            senderNombre = senderEmpresa.nombre;
                        }
                        else {
                            senderNombre = 'Remitente no encontrado';
                        }
                    }
                    // Obtener el nombre del destinatario (recipientId) que es la empresa
                    const recipientEmpresa = yield empresa_model_1.default.findById(noti.recipientId);
                    if (recipientEmpresa) {
                        recipientNombre = recipientEmpresa.nombre;
                    }
                    else {
                        recipientNombre = 'Destinatario no encontrado';
                    }
                    // Retornar los datos con nombres en lugar de IDs
                    return Object.assign(Object.assign({}, noti.toObject()), { senderNombre,
                        recipientNombre });
                })));
                res.json(notificacionesConNombres);
                console.log("Empresa: ", empresa);
                console.log("Notificaciones: ", notificacionesConNombres);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, { error: "Hubo un error" }));
            }
        });
    }
    obtenerNotificaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Mostrando las postulaciones por empresa");
                const empresa = yield empresa_model_1.default.findById(req.params.id);
                if (!empresa) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, { error: "Empresa no encontrada" }));
                    return;
                }
                // Obtener las notificaciones para la empresa
                const notificaciones = yield notificacionEmpresa_model_1.default.find({ recipientId: empresa._id });
                res.status(200).json({ notificaciones });
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, { error: "Hubo un error" }));
            }
        });
    }
    ;
}
exports.empresaController = new EmpresaController();
