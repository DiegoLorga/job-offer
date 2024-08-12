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
const perfilUsuario_model_1 = __importDefault(require("../models/perfilUsuario.model"));
const fotosPerfilUsuario_model_1 = __importDefault(require("../models/fotosPerfilUsuario.model"));
const jsonResponse_1 = require("../lib/jsonResponse");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../libs/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const empresa_model_1 = __importDefault(require("../models/empresa.model"));
const administrador_model_1 = __importDefault(require("../models/administrador.model"));
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
            const usuarioExistente = yield usuario_model_1.default.findOne({ correo });
            if (usuarioExistente) {
                correoError = "El correo electrónico ya está en uso";
            }
            const estadoName = yield estado_model_1.default.findOne({ clave: estado });
            let estadoNom = estado; // Definir la variable con el tipo correcto
            if (estadoName) {
                estadoNom = estadoName.nombre;
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
                const tipoRol = "6690640c24eacbffd867f333";
                const hashedPassword = yield bcryptjs_1.default.hash(contrasena, 10);
                const nuevoUsuario = new usuario_model_1.default({
                    nombre,
                    correo,
                    contrasena: hashedPassword,
                    direccion,
                    ciudad,
                    estado: estadoNom,
                    id_rol: tipoRol
                });
                const UsuarioGuardado = yield nuevoUsuario.save();
                const nuevoPerfil = new perfilUsuario_model_1.default({
                    id_usuario: UsuarioGuardado._id,
                    cv: false,
                    experiencia: '',
                    especialidad: '',
                    habilidades: '',
                    educacion: '',
                    idiomas: '',
                    certificaciones: false,
                    repositorio: '',
                    status: false,
                    foto: false
                });
                const PerfilGuardado = yield nuevoPerfil.save();
                const nuevaFotoPerfil = new fotosPerfilUsuario_model_1.default({
                    id_fotoUs: PerfilGuardado._id
                });
                yield nuevaFotoPerfil.save();
                const token = yield (0, jwt_1.createAccesToken)({ id: UsuarioGuardado._id });
                res.cookie('token', token);
                console.log(res.cookie);
                res.json({
                    id: UsuarioGuardado._id,
                    idRol: UsuarioGuardado.id_rol,
                    nombre: UsuarioGuardado.nombre,
                    correo: UsuarioGuardado.correo,
                    direccion: UsuarioGuardado.direccion,
                    ciudad: UsuarioGuardado.ciudad,
                    estado: UsuarioGuardado.estado,
                });
            }
            catch (error) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear el usuario"
                }));
            }
        });
    }
    listUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarios = yield usuario_model_1.default.find();
                const usuariosFormateados = usuarios.map(usuario => ({
                    id: usuario._id,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    id_rol: usuario.id_rol
                }));
                res.json(usuariosFormateados);
            }
            catch (error) {
                res.status(500).json({ mensaje: "Error al obtener los usuarios", error });
            }
        });
    }
    UsuarioEncontrado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioEncontrado = yield usuario_model_1.default.findById(req.params.id); // Usando `req.params.id` para obtener el ID del usuario
                if (!usuarioEncontrado) {
                    res.status(500).json({ mensaje: "Error al buscar el usuario" });
                }
                else {
                    res.json({
                        id: usuarioEncontrado._id,
                        nombre: usuarioEncontrado.nombre,
                        correo: usuarioEncontrado.correo,
                        ciudad: usuarioEncontrado.ciudad,
                        estado: usuarioEncontrado.estado,
                        id_rol: usuarioEncontrado.id_rol,
                        direccion: usuarioEncontrado.direccion
                    });
                }
            }
            catch (error) {
                res.status(500).json({ mensaje: "Error al buscar el usuario", error });
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
        });
    }
    getEstado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clave = req.params.clave;
                // Buscar el estado en la colección adecuada
                const estado = yield estado_model_1.default.findOne({ clave: clave });
                if (estado) {
                    res.json({ nombre: estado.nombre });
                }
                else {
                    res.status(404).json({ error: "Estado no encontrado" });
                }
            }
            catch (error) {
                console.error("Error al obtener el estado:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    eliminarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const perfilEliminado = yield perfilUsuario_model_1.default.findOneAndDelete({ id_usuario: req.params.id });
                console.log(perfilEliminado);
                if (perfilEliminado) {
                    yield fotosPerfilUsuario_model_1.default.findOneAndDelete({ id_fotoUs: perfilEliminado._id });
                }
                const usuario = yield usuario_model_1.default.findByIdAndDelete(req.params.id);
                res.json(usuario);
                console.log("Usuario eliminado correctamente");
                res.status(200).json((0, jsonResponse_1.jsonResponse)(200, {
                    message: "Uusuario eliminado correctamente"
                }));
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo eliminar el usuario"
                }));
            }
        });
    }
    getPerfilUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id_usuario = req.params.id_usuario;
                const perfilEncontrado = yield perfilUsuario_model_1.default.findOne({ id_usuario: id_usuario });
                if (perfilEncontrado) {
                    res.json(perfilEncontrado);
                }
                else {
                    res.status(404).json({ message: "Perfil de usuario no encontrado" });
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    actualizarPerfilUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const perfil = yield perfilUsuario_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.json(perfil);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    actualizarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, direccion, ciudad, estado } = req.body;
            let nombreError = null;
            const nameRegex = /^[a-zA-ZÀ-ÿ'\s]{1,50}$/;
            if (!nameRegex.test(nombre)) {
                nombreError = "Nombre no válido";
            }
            const estadoName = yield estado_model_1.default.findOne({ clave: estado });
            let estadoNom = estado;
            if (estadoName) {
                estadoNom = estadoName.nombre;
            }
            if (nombreError) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    nombreError
                }));
                return;
            }
            try {
                const perfil = yield usuario_model_1.default.findByIdAndUpdate(req.params.id, { nombre, direccion, ciudad, estado: estadoNom }, { new: true });
                res.json(perfil);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(400, {
                    camposError: "Error al actualizar al usuario"
                }));
            }
        });
    }
    restablecerContrasena(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, password } = req.body;
            if (!token || !password) {
                res.status(400).json({ message: 'Token y contraseña son requeridos.' });
                return;
            }
            try {
                // Verifica el token y obtiene el correo
                const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || 'prueba');
                const email = decoded.email;
                // Encuentra el usuario en las tres colecciones posibles
                let user = yield usuario_model_1.default.findOne({ correo: email });
                if (!user) {
                    user = yield empresa_model_1.default.findOne({ correo: email });
                }
                if (!user) {
                    user = yield administrador_model_1.default.findOne({ correo: email });
                }
                // Si no se encontró el usuario en ninguna colección
                if (!user) {
                    res.status(404).json({ message: 'Usuario no encontrado.' });
                    return;
                }
                // Hashea la nueva contraseña
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                // Actualiza la contraseña en la colección correspondiente
                if (user instanceof usuario_model_1.default) {
                    yield usuario_model_1.default.findOneAndUpdate({ correo: email }, { contrasena: hashedPassword });
                }
                else if (user instanceof empresa_model_1.default) {
                    yield empresa_model_1.default.findOneAndUpdate({ correo: email }, { contrasena: hashedPassword });
                }
                else if (user instanceof administrador_model_1.default) {
                    yield administrador_model_1.default.findOneAndUpdate({ correo: email }, { contrasena: hashedPassword });
                }
                res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
            }
            catch (error) {
                console.error(error); // Imprime el error para depuración
                res.status(400).json({ message: 'Error al actualizar la contraseña.' });
            }
        });
    }
}
exports.usuariosController = new UsuarioController();
