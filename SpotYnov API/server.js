"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./logger"));
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    console.log(`\nServer is running on port ${PORT} !`);
    console.log("----");
    console.log(`Link : http://localhost:${PORT}`);
    console.log(`Documentation : http://localhost:${PORT}/documentation`);
    console.log("----\n");
    logger_1.default.info(`Server is running on port ${PORT}`);
});
