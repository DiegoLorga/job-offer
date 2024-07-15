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
const usuarioController_1 = require("./usuarioController");
class LoginController {
    constructor() {
    }
    verificarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo, contrasena } = req.body;
            try {
                const usuario = yield usuario_model_1.default.findOne({ correo });
                if (!usuario) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        error: "Datos inválidos"
                    }));
                    return;
                }
                const contrasenaValida = yield bcryptjs_1.default.compare(contrasena, usuario.contrasena);
                if (!contrasenaValida) {
                    res.status(401).json((0, jsonResponse_1.jsonResponse)(401, {
                        error: "Datos inválidos"
                    }));
                    return;
                }
                const accessToken = usuarioController_1.usuariosController;
                const refreshToken = usuarioController_1.usuariosController;
                res.status(200).json((0, jsonResponse_1.jsonResponse)(200, { correo, accessToken, refreshToken }));
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Error del servidor"
                }));
            }
        });
    }
}
exports.loginController = new LoginController();
