"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user/user");
const authenticate_1 = __importDefault(require("../middlewares/auth/authenticate"));
const authorizeAdmin_1 = __importDefault(require("../middlewares/auth/authorizeAdmin"));
const router = express_1.default.Router();
//admin routes
router.get('/users', authenticate_1.default, authorizeAdmin_1.default, user_1.getAllUsers);
router.delete('/users/:id', authenticate_1.default, authorizeAdmin_1.default, user_1.deleteUser);
exports.default = router;
