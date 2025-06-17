"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const restaurant_routes_1 = __importDefault(require("./routes/restaurant.routes"));
const restaurantMenu_routes_1 = __importDefault(require("./routes/restaurantMenu.routes"));
const publicMenu_routes_1 = __importDefault(require("./routes/publicMenu.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
dotenv_1.default.config();
// Example route
app.get("/", (req, res) => {
    res.send(" FOOD API is running");
});
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/admin", admin_routes_1.default);
app.use("/api/v1/restaurant", restaurant_routes_1.default);
app.use("/api/v1/restaurant/menu", restaurantMenu_routes_1.default);
app.use("/api/v1/public", publicMenu_routes_1.default);
exports.default = app;
