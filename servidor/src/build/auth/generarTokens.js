"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = sign;
exports.generaAccessToken = generaAccessToken;
exports.generaRefreshToken = generaRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Cargar variables de entorno del archivo .env
// Función para firmar el token
function sign(payload, isAccessToken) {
    const secret = isAccessToken ? process.env.ACCES_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
        throw new Error('El token no esta definido en el archivo .env');
    }
    return jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn: 3600
    });
}
// Función para generar el access token
function generaAccessToken(user) {
    return sign(user, true);
}
// Función para generar el refresh token
function generaRefreshToken(user) {
    return sign(user, false);
}
