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
        this.router.put("/actualizarHabilidades/:id_usuario", perfilUsuarioController_1.perfilUsuarioController.actualizarHabilidades);
        this.router.get("/buscarHabilidades/:id_usuario", perfilUsuarioController_1.perfilUsuarioController.buscarHabilidades);
        this.router.post("/crearHabilidades/:id_usuario", perfilUsuarioController_1.perfilUsuarioController.crearHabilidades);
        this.router.delete('/eliminarHabilidad/:id_habilidad', perfilUsuarioController_1.perfilUsuarioController.eliminarHabilidad);
        this.router.put("/actualizarEducacion/:id_usuario", perfilUsuarioController_1.perfilUsuarioController.actualizarEducacion);
    }
}
const administradorRoutes = new perfilUsuarioRoutes();
exports.default = administradorRoutes.router;
