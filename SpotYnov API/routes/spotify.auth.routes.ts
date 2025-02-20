import express from 'express';
const router = express.Router();
import { SpotifyAuthController } from "../controllers/spotify.auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {SpotifyAuthService} from "../services/spotify/spotify.auth.service";
import {UserService} from "../services/user.service";
import {UserDAO} from "../daos/user.dao";
import {SpotifyApiService} from "../services/spotify/spotify.api.service";
import {SpotifyRequestService} from "../services/spotify/spotify.request.service";
import {UserSpotifyService} from "../services/user.spotify.service";

// User dependancies
const userDAO = new UserDAO();
const userService = new UserService(userDAO);
// Spotify dependancies
const spotifyAPIService = new SpotifyApiService()
const spotifyAuthService = new SpotifyAuthService();
// Best of both worlds
const userSpotifyService = new UserSpotifyService(userService, spotifyAuthService, spotifyAPIService)

const spotifyAuthController = new SpotifyAuthController(userService, spotifyAuthService, userSpotifyService);

router.get("/auth", authMiddleware, spotifyAuthController.getAuthCodeUrl);
router.get("/callback", spotifyAuthController.handleAuthCodeCallback);
router.post("/link_account", authMiddleware, spotifyAuthController.linkSpotifyAccount)
router.get("/unlink_account", authMiddleware, spotifyAuthController.unlinkSpotifyAccount)
export default router;