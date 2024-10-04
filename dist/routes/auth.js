"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../controllers/user/auth");
// User Registration
router.post('/register', auth_1.register);
// User Login
router.post('/login', auth_1.userLogin);
// Admin Login
router.post('/admin/login', auth_1.adminLogin);
router.post('/refresh-token', auth_1.refreshTokenController);
exports.default = router;
