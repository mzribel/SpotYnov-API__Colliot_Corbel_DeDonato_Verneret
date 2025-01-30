"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./docs/swagger.json"));
const responseService_1 = require("./services/api/responseService");
require('dotenv').config();
const app = (0, express_1.default)();
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes max par IP par fenêtre
    message: 'Too many requests from this IP, please try again after 15 minutes',
    headers: true,
});
app.use((0, cors_1.default)());
app.use(apiLimiter);
app.use(body_parser_1.default.json());
// ROUTES
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const spotifyAuthRoutes_1 = __importDefault(require("./routes/spotifyAuthRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
app.use('/', authRoutes_1.default);
app.use('/spotify', spotifyAuthRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/groups', groupRoutes_1.default);
// Swagger
app.use('/documentation', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// 404
app.use((req, res) => {
    (0, responseService_1.getErrorResponse)(res, 404, "URL does not exist");
});
exports.default = app;
