import express from 'express';
const router = express.Router();
import { SpotifyAuthController } from "../controllers/spotify.auth.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import {SpotifyAuthService} from "../services/spotify/spotify.auth.service";
import {UserService} from "../services/user.service";
import {UserDAO} from "../daos/user.dao";
import {SpotifyApiService} from "../services/spotify/spotify.api.service";
import {UserSpotifyService} from "../services/user.spotify.service";
import {GroupDAO} from "../daos/group.dao";

// User dependancies
const userDAO = new UserDAO();
const groupDAO = new GroupDAO();
const userService = new UserService(userDAO, groupDAO);
// Spotify dependancies
const spotifyAPIService = new SpotifyApiService()
const spotifyAuthService = new SpotifyAuthService();
// Best of both worlds
const userSpotifyService = new UserSpotifyService(userService, spotifyAuthService, spotifyAPIService)

const spotifyAuthController = new SpotifyAuthController(userService, spotifyAuthService, userSpotifyService);

router.get("/", authenticateUser, spotifyAuthController.getAuthCodeUrl);
router.get("/callback", spotifyAuthController.handleAuthCodeCallback);
router.post("/link_account", authenticateUser, spotifyAuthController.linkSpotifyAccount)
router.delete("/unlink_account", authenticateUser, spotifyAuthController.unlinkSpotifyAccount)
export default router;