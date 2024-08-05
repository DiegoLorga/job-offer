"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Esquema de Mongoose para el perfil de usuario
const schemaperfilUsuario = new mongoose_1.Schema({
    cv: {
        type: Boolean,
        //required: true,
    },
    experiencia: {
        type: String,
        //required: true,
    },
    especialidad: {
        type: String,
        //required: true,
    },
    habilidades: {
        type: String,
        //required: true,
    },
    educacion: {
        type: String,
        //required: true,
    },
    idiomas: {
        type: String,
        //required: true,
    },
    certificaciones: {
        type: Boolean,
        //required: true,
    },
    repositorio: {
        type: String,
        //required: true,
    },
    status: {
        type: Boolean,
        //required: true,
    },
    foto: {
        type: Boolean,
        //required: true,
    },
    id_usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        requiere: true
    },
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('perfilUsuario', schemaperfilUsuario);
