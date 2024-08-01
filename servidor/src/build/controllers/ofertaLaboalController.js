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
exports.OfertaLaboralController = void 0;
const jsonResponse_1 = require("../lib/jsonResponse");
const OfertaLaboral_model_1 = __importDefault(require("../models/OfertaLaboral.model"));
class ofertaLaboralController {
    constructor() {
    }
    createOfertaLaboral(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creado una red social");
            const { id_empresa, titulo, puesto, sueldo, horario, modalidad, direccion, ciudad, estado, status, descripcion, requisitos, telefono, correo, educacion, idioma } = req.body;
            const inicio = 0;
            try {
                const nuevaOfertaLaboral = new OfertaLaboral_model_1.default({
                    id_empresa,
                    titulo,
                    puesto,
                    sueldo,
                    horario,
                    modalidad,
                    direccion,
                    ciudad,
                    estado,
                    status: inicio,
                    descripcion,
                    requisitos,
                    telefono,
                    correo,
                    educacion,
                    idioma
                });
                const OfertaLaboralGuardado = yield nuevaOfertaLaboral.save();
                res.json({
                    id_Oferta: OfertaLaboralGuardado._id,
                    id_empresa: OfertaLaboralGuardado.id_empresa,
                    titulo: OfertaLaboralGuardado.titulo,
                    puesto: OfertaLaboralGuardado.puesto,
                    sueldo: OfertaLaboralGuardado.sueldo,
                    horario: OfertaLaboralGuardado.horario,
                    modalidad: OfertaLaboralGuardado.modalidad,
                    direccion: OfertaLaboralGuardado.direccion,
                    ciudad: OfertaLaboralGuardado.ciudad,
                    estado: OfertaLaboralGuardado.estado,
                    status: OfertaLaboralGuardado.status,
                    descripcion: OfertaLaboralGuardado.descripcion,
                    requisitos: OfertaLaboralGuardado.requisitos,
                    telefono: OfertaLaboralGuardado.telefono,
                    correo: OfertaLaboralGuardado.correo,
                    educacion: OfertaLaboralGuardado.educacion,
                    idioma: OfertaLaboralGuardado.id_empresa,
                });
            }
            catch (_a) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear la oferta laboral"
                }));
            }
        });
    }
    listOfertas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Listando las redes");
            try {
                const oferta = yield OfertaLaboral_model_1.default.find();
                res.json(oferta);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Hubo un error al obtener las ofertas"
                }));
            }
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Mostrando una oferta");
                const OneOferta = yield OfertaLaboral_model_1.default.findById(req.params.id);
                res.json(OneOferta);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Hubo un error"
                }));
            }
        });
    }
    eliminarOferta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Borrando una empresa");
            try {
                const idOferta = req.params.id;
                const oferta = yield OfertaLaboral_model_1.default.findByIdAndDelete(idOferta);
                if (!oferta) {
                    console.log("Perfil no encontrado o ya eliminado");
                }
            }
            catch (error) {
                console.error(error); // Log the specific error for debugging
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo eliminar la oferta"
                }));
            }
        });
    }
    actualizarOfertaLaboral(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Actualizando una oferta");
                const oferta = yield OfertaLaboral_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.json(oferta);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo actualizar la información de la oferta"
                }));
            }
        });
    }
    buscarOfertas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extracción de parámetros de búsqueda desde la consulta de la URL
                const { estado, ciudad, sueldo, modalidad, educacion, fechacreacion } = req.body;
                // Construcción dinámica del filtro de búsqueda
                const filtros = {};
                if (estado)
                    filtros.estado = estado;
                if (ciudad)
                    filtros.ciudad = ciudad;
                if (sueldo)
                    filtros.sueldo = { $gte: Number(sueldo) }; // Sueldo mayor o igual
                if (modalidad)
                    filtros.modalidad = modalidad;
                if (educacion)
                    filtros.educacion = educacion;
                if (fechacreacion)
                    filtros.createdAt = { $gte: new Date(fechacreacion) }; // Ofertas creadas después de la fecha
                // Consulta a la base de datos usando los filtros
                const ofertas = yield OfertaLaboral_model_1.default.find(filtros);
                res.json(ofertas);
            }
            catch (error) {
                console.error("Error al buscar ofertas:", error);
                res.status(500).json({
                    error: "Hubo un error al buscar las ofertas laborales"
                });
            }
        });
    }
}
exports.OfertaLaboralController = new ofertaLaboralController();
