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
exports.AdminController = void 0;
const jsonResponse_1 = require("../lib/jsonResponse");
const administrador_model_1 = __importDefault(require("../models/administrador.model"));
const rol_model_1 = __importDefault(require("../models/rol.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class adminController {
    constructor() {
    }
    createAdministrador(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creado un administrador");
            const { nombre, correo, contrasena, id_rol } = req.body;
            try {
                const rol = yield rol_model_1.default.findOne({ tipo: "Administrador" }); // Cambia "TipoDeseado" por el tipo que buscas
                if (!rol) {
                    res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                        error: "Rol no encontrado"
                    }));
                    return;
                }
                const tipoRol = rol._id; // Obtener el ID del rol encontrado
                const hashedPassword = yield bcryptjs_1.default.hash(contrasena, 10);
                const nuevoAdministrador = new administrador_model_1.default({
                    nombre,
                    correo,
                    contrasena: hashedPassword,
                    id_rol: tipoRol
                });
                const AdministradorGuardado = yield nuevoAdministrador.save();
                res.json({
                    nombre: AdministradorGuardado.nombre,
                    correo: AdministradorGuardado.correo,
                    id_rol: AdministradorGuardado.id_rol
                });
            }
            catch (_a) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear el administrador"
                }));
            }
        });
    }
    listAdmins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Listando admins");
            try {
                const admin = yield administrador_model_1.default.find();
                res.json(admin);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Hubo un error al obtener los administradores"
                }));
            }
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Mostrando un administrador");
                const OneAdmin = yield administrador_model_1.default.findById(req.params.id_admin);
                res.json(OneAdmin);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Hubo un error"
                }));
            }
        });
    }
    eliminarAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Borrando un administrador");
            try {
                const idAdmin = req.params.id_admin;
                const admin = yield administrador_model_1.default.findByIdAndDelete(idAdmin);
                if (!admin) {
                    console.log("Administrador no encontrado");
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        error: "Administrador no encontrado"
                    }));
                    return;
                }
                console.log("Administrador eliminado correctamente");
                res.status(200).json((0, jsonResponse_1.jsonResponse)(200, {
                    message: "Administrador eliminado correctamente"
                }));
            }
            catch (error) {
                console.error(error); // Log the specific error for debugging
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo eliminar al administrador"
                }));
            }
        });
    }
    actualizarAdministrador(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Actualizando un administrador");
                const admin = yield administrador_model_1.default.findByIdAndUpdate(req.params.id_admin, req.body, { new: true });
                res.json(admin);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo actualizar la información del administrador"
                }));
            }
        });
    }
}
exports.AdminController = new adminController();
