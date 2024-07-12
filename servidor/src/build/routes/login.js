"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonResponse_1 = require("../lib/jsonResponse");
class LoginRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post("/", (req, res) => {
            const { correo, contrasena } = req.body;
            if (!!!correo || !!!contrasena) {
                return res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "Al menos un campo está vacío"
                }));
            }
            //autenticar usuario 
            const accessToken = "access_Token";
            const refreshtoken = "refresh_token";
            const user = {
                id: "1",
                nombre: "Gizelle",
                correo: "ramires@gmail.com",
                direccion: "Actlima",
                ciudad: "Huajuapan",
                estado: "Oaxaca"
            };
            //crear usuario en la base de datos
            res.status(200).json((0, jsonResponse_1.jsonResponse)(200, { user, refreshtoken, accessToken }));
        });
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/
    }
}
const loginRoutes = new LoginRoutes();
exports.default = loginRoutes.router;
