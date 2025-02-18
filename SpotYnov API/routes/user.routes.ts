import express from 'express';
const router = express.Router();

import { UserController } from '../controllers/user.controller';
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserService } from "../services/user.service";
import { UserDAO } from "../daos/user.dao";

const userDAO = new UserDAO();
const userService = new UserService(userDAO);
const userController = new UserController(userService);

router.get("/", authMiddleware, userController.getUsersData)
router.get("/:userID/", authMiddleware, userController.getUserData)

// router.put("/users/:userId/personality", ...);
// router.post("/users/:userId/playlists/from-top-tracks", ...);

// Todo: Remove this route (placeholder for spotify data)
router.get("/me/spotify_profile", authMiddleware, userController.getUserData)

export default router