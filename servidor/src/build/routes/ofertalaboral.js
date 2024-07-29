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
        this.router.get('/', ofertaLaboalController_1.OfertaLaboralController.listOfertas);
        this.router.post('/', ofertaLaboalController_1.OfertaLaboralController.createOfertaLaboral);
        this.router.put('/:id', ofertaLaboalController_1.OfertaLaboralController.actualizarOfertaLaboral);
    }
}
const ofertaLaboralRoutes = new OfertaLaboralRoutes();
exports.default = ofertaLaboralRoutes.router;
