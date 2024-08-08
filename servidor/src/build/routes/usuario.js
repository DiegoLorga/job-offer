"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
class UsuarioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post("/", usuarioController_1.usuariosController.createUsuario);
        this.router.get("/getEstados", usuarioController_1.usuariosController.getEstados);
        this.router.get("/getCiudades/:clave", usuarioController_1.usuariosController.getCiudades);
        this.router.get("/listaUsuarios", usuarioController_1.usuariosController.listUsuarios);
        this.router.get("/getUsuario/:id", usuarioController_1.usuariosController.UsuarioEncontrado);
        this.router.delete("/eliminarUsuario/:id", usuarioController_1.usuariosController.eliminarUsuario);
        this.router.get("/getPerfilUsuario/:id_usuario", usuarioController_1.usuariosController.getPerfilUsuario);
        this.router.put("/actualizarPerfilUsuario/:id", usuarioController_1.usuariosController.actualizarPerfilUsuario);
        this.router.post('/restablecerContrasena', usuarioController_1.usuariosController.restablecerContrasena);
        this.router.get("/getEstado/:clave", usuarioController_1.usuariosController.getEstado);
        this.router.put("/actualizarUsuario/:id", usuarioController_1.usuariosController.actualizarUsuario);
    }
}
const usuaioRoutes = new UsuarioRoutes();
exports.default = usuaioRoutes.router;
