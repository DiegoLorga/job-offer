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
exports.redesSocialesController = void 0;
const NombreRedes_model_1 = __importDefault(require("../models/NombreRedes.model"));
const EnlaceRedes_model_1 = __importDefault(require("../models/EnlaceRedes.model"));
const jsonResponse_1 = require("../lib/jsonResponse");
class RedesSocilesController {
    constructor() {
    }
    createRedSocial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creado una red social");
            const { nombre } = req.body;
            try {
                const neuvared = new NombreRedes_model_1.default({
                    nombre
                });
                const RedGuardado = yield neuvared.save();
                res.json({
                    nombre: RedGuardado.nombre
                });
            }
            catch (_a) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear la red social"
                }));
            }
        });
    }
    createEnlaceRed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creando un enlace a una red social");
            const { id_empresa, link, id_redes } = req.body;
            try {
                const nuevoEnlace = new EnlaceRedes_model_1.default({
                    id_empresa,
                    link,
                    id_redes
                });
                const enlaceGuardado = yield nuevoEnlace.save();
                res.json({
                    id_empresa: enlaceGuardado.id_empresa,
                    link: enlaceGuardado.link,
                    id_redes: enlaceGuardado.id_redes
                });
            }
            catch (_a) {
                res.status(400).json((0, jsonResponse_1.jsonResponse)(400, {
                    error: "No se pudo crear el enlace"
                }));
            }
        });
    }
    listRedesSociales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Listando las redes");
            try {
                const redes = yield NombreRedes_model_1.default.find();
                res.json(redes);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Hubo un error al obtener las redes sociales"
                }));
            }
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Mostrando una red");
                const OneRedSocial = yield NombreRedes_model_1.default.findById(req.params.id);
                res.json(OneRedSocial);
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    error: "Hubo un error"
                }));
            }
        });
    }
}
exports.redesSocialesController = new RedesSocilesController();
