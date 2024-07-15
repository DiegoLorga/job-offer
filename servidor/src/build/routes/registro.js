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
        //this.router.get("/correo/:correo",usuariosController.validarCorreo)
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/
    }
}
const registroRoutes = new RegistroRoutes();
exports.default = registroRoutes.router;
