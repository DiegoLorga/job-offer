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
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
