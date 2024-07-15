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
exports.usuariosController = void 0;
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
const rol_model_1 = __importDefault(require("../models/rol.model"));
const jsonResponse_1 = require("../lib/jsonResponse");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UsuarioController {
    constructor() {
    }
    createUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creado un  usuario");
            const { nombre, correo, contrasena, direccion, ciudad, estado, id_rol } = req.body;
            const tipoRol = yield rol_model_1.default.findById(id_rol);
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(contrasena, 10);
                const nuevoUsuario = new usuario_model_1.default({
                    nombre,
                    correo,
                    contrasena: hashedPassword,
                    direccion,
                    ciudad,
                    estado,
                    id_rol: tipoRol
                });
                const UsuarioGuardado = yield nuevoUsuario.save();
                res.json({
                    nombre: UsuarioGuardado.nombre,
                    correo: UsuarioGuardado.correo,
                    contrasena: UsuarioGuardado.contrasena,
                    direccion: UsuarioGuardado.direccion,
                    ciudad: UsuarioGuardado.ciudad,
                    estado: UsuarioGuardado.estado
                });
            }
            catch (_a) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear el rol"
                }));
            }
        });
    }
    validarCorreo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo } = req.params;
        });
    }
}
exports.usuariosController = new UsuarioController();
