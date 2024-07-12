"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesController = void 0;
const rol_model_1 = __importDefault(require("../models/rol.model"));
const jsonResponse_1 = require("../lib/jsonResponse");
class RolesController {
    constructor() {
    }
    createRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creado un  rol");
            const { tipo } = req.body;
            try {
                const nuevoRol = new rol_model_1.default({
                    tipo
                });
                const RolGuardado = yield nuevoRol.save();
                res.json({
                    tipo: RolGuardado.tipo
                });
            }
            catch (_a) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear el rol"
                }));
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Mostrando un rol");
            const role = yield rol_model_1.default.find;
            res.json(role);
        });
    }
}
exports.rolesController = new RolesController();
