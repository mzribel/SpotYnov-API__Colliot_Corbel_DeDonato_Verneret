import express from 'express';

import {UserDAO} from "../daos/user.dao";
import {UserService} from "../services/user.service";
import {AuthController} from "../controllers/auth.controller";
import {GroupDAO} from "../daos/group.dao";

const router = express.Router();

const userDAO = new UserDAO();
const groupDAO = new GroupDAO();
const userService = new UserService(userDAO, groupDAO);
const authController = new AuthController(userService);

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

export default router;