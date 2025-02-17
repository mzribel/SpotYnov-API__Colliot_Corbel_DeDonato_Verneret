import express from 'express';

import {UserDAO} from "../daos/user.dao";
import {UserService} from "../services/user.service";
import {AuthController} from "../controllers/auth.controller";

const router = express.Router();

const userDAO = new UserDAO();
const userService = new UserService(userDAO);
const authController = new AuthController(userService);

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

export default router;