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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const auth_validation_1 = require("../validations/auth.validation");
const auth_service_1 = require("../services/auth.service");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = auth_validation_1.registerSchema.parse(req.body);
        const user = yield (0, auth_service_1.registerUser)(data);
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = auth_validation_1.loginSchema.parse(req.body);
        const { user, token } = yield (0, auth_service_1.loginUser)(data);
        res.json({ message: "Login successful", user, token });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
        console.log(err.message);
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // JWT token based logout is stateless by default
    // Frontend should delete token from client storage (localStorage/cookies)
    // Optional: Implement token blacklist if needed
    res.json({ message: "Logout successful" });
});
exports.logout = logout;
