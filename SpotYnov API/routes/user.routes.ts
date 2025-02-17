import express from 'express';
const router = express.Router();

import { UserController } from '../controllers/user.controller';
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserService } from "../services/user.service";
import { UserDAO } from "../daos/user.dao";

const userDAO = new UserDAO();
const userService = new UserService(userDAO);
const userController = new UserController(userService);

// router.post("/users", ...);

// router.post("/users/:userId", ...);
// router.put("/users/:userId", ...);
// router.delete("/users/:userId", ...);

// router.put("/users/:userId/personality", ...);

// router.post("/users/:userId/playlists/from-top-tracks", ...);

// Todo: Remove this route (placeholder for spotify data)
router.get("/me/latest", authMiddleware, userController.getUserData)

export default router