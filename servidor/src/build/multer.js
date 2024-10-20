'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, 'img/perfilUsuario'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
});
exports.default = storage;
