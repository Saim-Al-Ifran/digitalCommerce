"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, _req, res, _next) => {
    const message = err.message || 'Server Error Occurred';
    const status = err.status || 500;
    res.status(status).json({
        message,
        status,
    });
};
exports.default = errorHandler;
