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
const estado_model_1 = __importDefault(require("../models/estado.model"));
const ciudad_model_1 = __importDefault(require("../models/ciudad.model"));
const jsonResponse_1 = require("../lib/jsonResponse");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UsuarioController {
    createUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, correo, contrasena, direccion, ciudad, estado, id_rol, verificar } = req.body;
            let camposError = null;
            let contrasenasError = null;
            let nombreError = null;
            let correoError = null;
            if (!nombre || !correo || !contrasena || !verificar || !direccion || !ciudad || !estado) {
                camposError = "Todos los campos son requeridos";
            }
            else {
                if (contrasena !== verificar) {
                    contrasenasError = "Las contraseñas no coinciden";
                }
                else {
                    const contrasenaregex = /^(?=.*[A-ZÀ-ÿ])(?=.*\d)(?=.*[@$!%*?&#+^()_+=\{\}\[\]|:;,.<>~-])[A-Za-zÀ-ÿ\d@$!%*?&#+^()_+=\{\}\[\]|:;,.<>~-]{8,}$/;
                    if (!contrasenaregex.test(contrasena)) {
                        contrasenasError = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un dígito y un carácter especial";
                    }
                }
                const nameRegex = /^[a-zA-ZÀ-ÿ'\s]{1,50}$/;
                if (!nameRegex.test(nombre)) {
                    nombreError = "Nombre no válido";
                }
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(correo)) {
                    correoError = "Correo no válido";
                }
            }
            if (camposError || contrasenasError || nombreError || correoError) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    camposError,
                    contrasenasError,
                    nombreError,
                    correoError
                }));
                return;
            }
            try {
                const tipoRol = '6690640c24eacbffd867f333';
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
                    id_rol: UsuarioGuardado.id_rol,
                    nombre: UsuarioGuardado.nombre,
                    correo: UsuarioGuardado.correo,
                    contrasena: UsuarioGuardado.contrasena,
                    direccion: UsuarioGuardado.direccion,
                    ciudad: UsuarioGuardado.ciudad,
                    estado: UsuarioGuardado.estado
                });
            }
            catch (error) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear el usuario"
                }));
            }
        });
    }
    getEstados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const estados = yield estado_model_1.default.find();
            res.json(estados);
        });
    }
    getCiudades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clave = req.params.clave;
            const ciudades = yield ciudad_model_1.default.find({ clave: clave });
            res.json(ciudades);
            console.log("Ciudades encontradas:", ciudades);
        });
    }
}
exports.usuariosController = new UsuarioController();
