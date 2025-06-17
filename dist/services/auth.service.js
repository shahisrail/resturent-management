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
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = data;
    const existingUser = yield User_model_1.default.findOne({ email });
    if (existingUser)
        throw new Error("Email already registered");
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Restaurant users cannot self-register, only admin can create
    if (role === "restaurant")
        throw new Error("Restaurant users must be created by admin");
    const user = new User_model_1.default({
        name,
        email,
        password: hashedPassword,
        role,
        isApproved: true,
    });
    yield user.save();
    return user;
});
exports.registerUser = registerUser;
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const user = yield User_model_1.default.findOne({ email });
    if (!user)
        throw new Error("Invalid credentials");
    if (user.isBlocked)
        throw new Error("User is blocked");
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match)
        throw new Error("Invalid credentials");
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return { user, token };
});
exports.loginUser = loginUser;
