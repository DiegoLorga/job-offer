"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonResponse = jsonResponse;
function jsonResponse(statusCode, body) {
    return {
        statusCode,
        body,
    };
}
