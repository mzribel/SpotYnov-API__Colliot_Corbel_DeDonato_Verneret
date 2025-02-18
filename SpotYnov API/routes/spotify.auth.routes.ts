import express from 'express';
const router = express.Router();
import { SpotifyAuthController } from "../controllers/spotify.auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {SpotifyAuthService} from "../services/spotify/spotify.auth.service";
import {UserService} from "../services/user.service";
import {UserDAO} from "../daos/user.dao";

const userDAO = new UserDAO();
const userService = new UserService(userDAO);
const spotifyAuthService = new SpotifyAuthService();
const spotifyAuthController = new SpotifyAuthController(userService, spotifyAuthService);

router.get("/auth", authMiddleware, spotifyAuthController.getAuthCodeUrl);
router.get("/callback", spotifyAuthController.handleAuthCodeCallback);
router.post("/link_account", authMiddleware, spotifyAuthController.linkSpotifyAccount)
router.get("/unlink_account", authMiddleware, spotifyAuthController.unlinkSpotifyAccount)
export default router;