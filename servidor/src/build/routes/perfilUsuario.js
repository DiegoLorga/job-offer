"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const perfilUsuarioController_1 = require("../controllers/perfilUsuarioController");
class perfilUsuarioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.put("/actualizarExperiencia/:id_usuario", perfilUsuarioController_1.perfilUsuarioController.actualizarExperiencia);
        this.router.get("/buscarExperiencia/:id_usuario", perfilUsuarioController_1.perfilUsuarioController.buscarExperiencia);
    }
}
const administradorRoutes = new perfilUsuarioRoutes();
exports.default = administradorRoutes.router;
