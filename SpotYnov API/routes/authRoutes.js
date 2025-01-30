"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// TODO: Importer les fonctions de authController
// import { ... } from '../controllers/authController';
router.get("/", (req, res) => {
    res.send("Hello world");
});
// router.post("/register", ...);
// router.get("/login", ...);
// router.get("/logout", ...);
exports.default = router;
