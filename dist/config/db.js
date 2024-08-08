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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const secret_1 = require("../secret");
const connectDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (options = {}) {
    try {
        if (!secret_1.mongoDbUrl) {
            throw new Error('MongoDB URL is not defined in secret.ts');
        }
        yield mongoose_1.default.connect(secret_1.mongoDbUrl, options);
        console.log('Connection Successful');
        mongoose_1.default.connection.on('error', (error) => {
            console.error('DB Connection error:', error);
        });
    }
    catch (error) {
        console.error('Could not connect to DB:', error.message);
    }
});
exports.connectDB = connectDB;
