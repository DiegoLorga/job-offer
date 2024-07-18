"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
class RegistroRoutes {
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
const registroRoutes = new RegistroRoutes();
exports.default = registroRoutes.router;
