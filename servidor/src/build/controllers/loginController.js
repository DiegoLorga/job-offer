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
exports.loginController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
const jsonResponse_1 = require("../lib/jsonResponse");
const jwt_1 = require("../libs/jwt");
class LoginController {
    constructor() {
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo, contrasena } = req.body;
            try {
                const usuario = yield usuario_model_1.default.findOne({ correo });
                if (!usuario) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        error: "Usuario inválido"
                    }));
                    return;
                }
                const contrasenaValida = yield bcryptjs_1.default.compare(contrasena, usuario.contrasena);
                if (!contrasenaValida) {
                    res.status(401).json((0, jsonResponse_1.jsonResponse)(401, {
                        error: "Usuario inválido"
                    }));
                    return;
                }
                const token = yield (0, jwt_1.createAccesToken)({ id: usuario._id });
                console.log(usuario._id);
                res.cookie('token', token);
                res.status(200).json((0, jsonResponse_1.jsonResponse)(200, {
                    message: "El usuario y la contraseña son correctos",
                    usuario: {
                        id_usuario: usuario._id,
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        direccion: usuario.direccion,
                        ciudad: usuario.ciudad,
                        estado: usuario.estado,
                        id_rol: usuario.id_rol
                    }
                }));
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Error del servidor"
                }));
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deslogueando");
            res.cookie('token', "", { expires: new Date(0) });
            res.sendStatus(200);
            return;
        });
    }
    perfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarioEncontrado = yield usuario_model_1.default.findById(req.usuario.id);
            if (!usuarioEncontrado)
                res.status(400).json({ mensaje: "Usuario no encontrado" });
            res.json({
                id: usuarioEncontrado === null || usuarioEncontrado === void 0 ? void 0 : usuarioEncontrado._id,
                nombre: usuarioEncontrado === null || usuarioEncontrado === void 0 ? void 0 : usuarioEncontrado.nombre,
                correo: usuarioEncontrado === null || usuarioEncontrado === void 0 ? void 0 : usuarioEncontrado.correo,
                createdAt: usuarioEncontrado === null || usuarioEncontrado === void 0 ? void 0 : usuarioEncontrado.createdAt,
                updatedAt: usuarioEncontrado === null || usuarioEncontrado === void 0 ? void 0 : usuarioEncontrado.updatedAt
            });
        });
    }
}
exports.loginController = new LoginController();
