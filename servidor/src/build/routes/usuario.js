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
    }
}
const usuaioRoutes = new UsuarioRoutes();
exports.default = usuaioRoutes.router;
