"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class RefreshTokenRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get("/", (req, res) => {
            res.send("Token");
        });
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/
    }
}
const refreshtokenRoutes = new RefreshTokenRoutes();
exports.default = refreshtokenRoutes.router;
