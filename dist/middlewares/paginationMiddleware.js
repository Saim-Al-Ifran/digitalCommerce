"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("../utils/errors/customError"));
const paginationMiddleware = (req, _res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        if (page <= 0 || limit <= 0) {
            return next(new customError_1.default('Invalid page or limit parameters', 400));
        }
        req.pagination = { page, limit };
        next();
    }
    catch (error) {
        console.error(error.message);
        next(new customError_1.default('Internal Server Error', 500));
    }
};
exports.default = paginationMiddleware;
