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
exports.perfilUsuarioController = void 0;
const experiencia_model_1 = __importDefault(require("../models/experiencia.model"));
const jsonResponse_1 = require("../lib/jsonResponse");
const perfilUsuario_model_1 = __importDefault(require("../models/perfilUsuario.model"));
class PerfilUsuarioController {
    actualizarExperiencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa, puesto, descripcion } = req.body;
            const { id_usuario } = req.params;
            try {
                const experiencia = yield experiencia_model_1.default.findOneAndUpdate({ id_usuario }, { empresa, puesto, descripcion }, { new: true, runValidators: true });
                if (!experiencia) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        Error: "No se encontró la experiencia para el usuario dado"
                    }));
                    return;
                }
                const perfil = yield perfilUsuario_model_1.default.findOneAndUpdate({ id_usuario }, { experiencia: true }, { new: true });
                // Devuelve la experiencia actualizada
                res.json((0, jsonResponse_1.jsonResponse)(200, experiencia));
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al actualizar la experiencia"
                }));
            }
        });
    }
    buscarExperiencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            try {
                const experiencia = yield experiencia_model_1.default.findOne({ id_usuario });
                if (!experiencia) {
                    res.status(404).json((0, jsonResponse_1.jsonResponse)(404, {
                        Error: "No se encontró la experiencia para el usuario dado"
                    }));
                    return;
                }
                // Devuelve la experiencia encontrada
                res.json({
                    id: experiencia._id,
                    empresa: experiencia.empresa,
                    puesto: experiencia.puesto,
                    descripcion: experiencia.descripcion
                });
            }
            catch (error) {
                res.status(500).json((0, jsonResponse_1.jsonResponse)(500, {
                    Error: "Error al buscar la experiencia"
                }));
            }
        });
    }
}
exports.perfilUsuarioController = new PerfilUsuarioController();
