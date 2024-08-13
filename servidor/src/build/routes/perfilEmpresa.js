"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redesSocilesController_1 = require("../controllers/redesSocilesController");
const empresaController_1 = require("../controllers/empresaController");
class perfilEmpresaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/', redesSocilesController_1.redesSocialesController.createRedSocial);
        this.router.get('/', redesSocilesController_1.redesSocialesController.listRedesSociales);
        this.router.get('/obtener_red/:id', redesSocilesController_1.redesSocialesController.listOne);
        this.router.post('/crearEnlace', redesSocilesController_1.redesSocialesController.createEnlaceRed);
        this.router.put('/actualizar/:id', empresaController_1.empresaController.actualizarPerfilEmpresa);
        this.router.delete('/eliminarEmpresa/:id', empresaController_1.empresaController.borrarEmpresa);
        this.router.get('/perfil/:id', empresaController_1.empresaController.obtenerPerfilEmpresa);
    }
}
const PerfilEmpresaRoutes = new perfilEmpresaRoutes();
exports.default = PerfilEmpresaRoutes.router;
