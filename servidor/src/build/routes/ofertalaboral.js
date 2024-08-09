"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ofertaLaboalController_1 = require("../controllers/ofertaLaboalController");
class OfertaLaboralRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/obtenerOfertas/:id', ofertaLaboalController_1.OfertaLaboralController.listOne);
        this.router.get('/listarOfertas', ofertaLaboalController_1.OfertaLaboralController.listOfertas);
        this.router.post('/', ofertaLaboalController_1.OfertaLaboralController.createOfertaLaboral);
        this.router.put('/:id', ofertaLaboalController_1.OfertaLaboralController.actualizarOfertaLaboral);
        this.router.post('/crearCategoria', ofertaLaboalController_1.OfertaLaboralController.createCategoria);
        this.router.get('/categorias', ofertaLaboalController_1.OfertaLaboralController.list);
        this.router.get('/buscar', ofertaLaboalController_1.OfertaLaboralController.buscarOfertas);
        this.router.get('/buscarNombreEmpresa/:id', ofertaLaboalController_1.OfertaLaboralController.ObtenerNombreEmpresa);
    }
}
const ofertaLaboralRoutes = new OfertaLaboralRoutes();
exports.default = ofertaLaboralRoutes.router;
