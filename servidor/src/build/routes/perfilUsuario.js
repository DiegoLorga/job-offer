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
        this.router.get("/buscarEducacionUsuario/:id_usuario", perfilUsuarioController_1.perfilUsuarioController.buscarEduUsu);
        this.router.post("/crearIdioma", perfilUsuarioController_1.perfilUsuarioController.createIdioma);
        this.router.get("/listIdiomas", perfilUsuarioController_1.perfilUsuarioController.listIdiomas);
        this.router.post("/crearNivelIdioma", perfilUsuarioController_1.perfilUsuarioController.createNivelIdioma);
        this.router.get("/listNivelIdiomas", perfilUsuarioController_1.perfilUsuarioController.listNivelIdiomas);
        this.router.post("/agregarIdiomasNiveles/:id_usuario", perfilUsuarioController_1.perfilUsuarioController.agregarIdiomasNiveles);
        this.router.get("/idiomas/:id_usuario", perfilUsuarioController_1.perfilUsuarioController.obtenerIdiomasDelUsuario);
        this.router.delete("/eliminarUsuarioIdioma/:_id", perfilUsuarioController_1.perfilUsuarioController.eliminarUsuarioIdioma);
    }
}
const administradorRoutes = new perfilUsuarioRoutes();
exports.default = administradorRoutes.router;
