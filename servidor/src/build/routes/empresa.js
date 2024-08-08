"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empresaController_1 = require("../controllers/empresaController");
class EmpresaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/obtenerEmpresa/:id', empresaController_1.empresaController.listOne);
        this.router.get('/listarEmpresa', empresaController_1.empresaController.list);
        this.router.post('/', empresaController_1.empresaController.createEmpresa);
        this.router.delete('/:id', empresaController_1.empresaController.borrarEmpresa);
        this.router.put('/:id', empresaController_1.empresaController.actualizarEmpresa);
        this.router.put('/actualizar/:id', empresaController_1.empresaController.actualizarPerfilEmpresa);
        this.router.delete('/eliminarEmpresa/:id', empresaController_1.empresaController.borrarEmpresa);
    }
}
const empresaRoutes = new EmpresaRoutes();
exports.default = empresaRoutes.router;
