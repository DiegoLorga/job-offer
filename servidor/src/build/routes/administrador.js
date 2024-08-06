"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
class AdministradorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post("/", adminController_1.AdminController.createAdministrador);
        this.router.get("/listaAdmins", adminController_1.AdminController.listAdmins);
        this.router.delete("/eliminarAdmin/:id_admin", adminController_1.AdminController.eliminarAdmin);
        this.router.get("/listAdmin/:id_admin", adminController_1.AdminController.listOne);
        this.router.put("/actualizarAdmin/:id_admin", adminController_1.AdminController.actualizarAdministrador);
    }
}
const administradorRoutes = new AdministradorRoutes();
exports.default = administradorRoutes.router;
