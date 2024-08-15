"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonResponse = void 0;
function jsonResponse(statusCode, body) {
    return {
        statusCode,
        body,
    };
}
exports.jsonResponse = jsonResponse;
