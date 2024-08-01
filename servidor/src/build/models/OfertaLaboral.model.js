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
const schemaOfertaLaboral = new mongoose_1.Schema({
    id_empresa: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Empresa',
        requiere: true
    },
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    puesto: {
        type: String,
        required: true,
        trim: true
    },
    sueldo: {
        type: Number,
        required: true,
        trim: true,
    },
    horario: {
        type: String,
        required: true
    },
    modalidad: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    requisitos: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    educacion: {
        type: String,
        required: true
    },
    idioma: {
        type: String,
        required: true
    },
    experienciaLaboral: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('OfertaLaboral', schemaOfertaLaboral);
