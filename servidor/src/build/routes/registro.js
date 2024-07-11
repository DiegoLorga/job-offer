"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonResponse_1 = require("../lib/jsonResponse");
class RegistroRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post("/", (req, res) => {
            const { nombre, correo, contrasena, verificar, direccion, ciudad, estado } = req.body;
            if (!!!nombre || !!!correo || !!!contrasena || !!!verificar || !!!direccion || !!!ciudad || !!!estado) {
                return res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "Al menos un campo está vacío"
                }));
            }
            //crear usuario en la base de datos
            res.status(200).json((0, jsonResponse_1.jsonResponse)(200, { messege: "Usuario creado correctamente" }));
        });
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/
    }
}
const registroRoutes = new RegistroRoutes();
exports.default = registroRoutes.router;
