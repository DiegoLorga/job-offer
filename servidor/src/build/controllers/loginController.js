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
const empresa_model_1 = __importDefault(require("../models/empresa.model"));
const administrador_model_1 = __importDefault(require("../models/administrador.model")); // Supongo que tienes un modelo de administrador
const jsonResponse_1 = require("../lib/jsonResponse");
const jwt_1 = require("../libs/jwt");
class LoginController {
    constructor() { }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo, contrasena } = req.body;
            try {
                let userType = ''; // Para identificar el tipo de usuario
                let user = yield usuario_model_1.default.findOne({ correo });
                if (user)
                    userType = "usuario";
                if (!user) {
                    user = yield empresa_model_1.default.findOne({ correo });
                    if (user)
                        userType = 'empresa';
                }
                if (!user) {
                    user = yield administrador_model_1.default.findOne({ correo });
                    if (user)
                        userType = 'administrador';
                }
                if (!user) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        error: "Credenciales inválidas"
                    }));
                    return;
                }
                const contrasenaValida = yield bcryptjs_1.default.compare(contrasena, user.contrasena);
                if (!contrasenaValida) {
                    res.status(401).json((0, jsonResponse_1.jsonResponse)(401, {
                        error: "Credenciales inválidas"
                    }));
                    return;
                }
                const token = yield (0, jwt_1.createAccesToken)({ id: user._id, type: userType });
                res.cookie('token', token);
                res.status(200).json((0, jsonResponse_1.jsonResponse)(200, {
                    message: `Login exitoso como ${userType}`,
                    usuario: {
                        id: user._id,
                        nombre: user.nombre,
                        correo: user.correo,
                        id_rol: user.id_rol || 'usuario' // Si tiene roles, lo asignas aquí
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
            console.log("Deslogueando");
            res.cookie('token', "", { expires: new Date(0) });
            res.sendStatus(200);
            return;
        });
    }
    perfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id;
            const userType = (_b = req.usuario) === null || _b === void 0 ? void 0 : _b.type;
            if (!userId || !userType) {
                res.status(400).json({ mensaje: "Información de usuario no disponible" });
                return;
            }
            try {
                let user;
                // Buscar en la base de datos según el tipo de usuario
                if (userType === 'usuario') {
                    user = yield usuario_model_1.default.findById(userId);
                }
                else if (userType === 'empresa') {
                    user = yield empresa_model_1.default.findById(userId);
                }
                else if (userType === 'administrador') {
                    user = yield administrador_model_1.default.findById(userId);
                }
                else {
                    res.status(400).json({ mensaje: "Tipo de usuario no válido" });
                    return;
                }
                if (!user) {
                    res.status(404).json({ mensaje: "Usuario no encontrado" });
                    return;
                }
                // Devuelve la información del perfil
                res.json({
                    id: user._id,
                    nombre: user.nombre,
                    correo: user.correo,
                    id_rol: user.id_rol, // Incluye solo si aplica
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                });
            }
            catch (error) {
                res.status(500).json({ mensaje: "Error del servidor" });
            }
        });
    }
}
exports.loginController = new LoginController();
