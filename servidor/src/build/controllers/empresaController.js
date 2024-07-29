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
class EmpresaController {
    constructor() {
    }
    createEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, correo, contrasena, direccion, ciudad, estado, giro } = req.body;
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
                    id_rol: tipoRol
                });
                const EmpresaGuardado = yield nuevaEmpresa.save();
                const token = yield (0, jwt_1.createAccesToken)({ id: EmpresaGuardado._id });
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
            console.log("Mostrando todas las empresas");
            const empresa = yield empresa_model_1.default.find;
            res.json(empresa);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Mostrando un empresa");
            const OneEmpresa = yield empresa_model_1.default.findById(req.params.id);
            res.json(OneEmpresa);
        });
    }
    borrarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Borrando una empresa");
            try {
                const idEmpresa = req.params.id;
                // Eliminar documentos relacionados primero
                //await Proyecto.deleteMany({ id_empresa: idEmpresa });
                // Luego eliminar la empresa
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
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo eliminar la empresa"
                }));
            }
        });
    }
    actualizarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Actualizando un empresa");
            const empresa = yield empresa_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(empresa);
        });
    }
}
exports.empresaController = new EmpresaController();
