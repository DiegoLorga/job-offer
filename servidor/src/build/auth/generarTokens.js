"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccesToken = createAccesToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createAccesToken(payload) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
            if (err)
                reject(err);
            resolve(token);
        });
    });
}
