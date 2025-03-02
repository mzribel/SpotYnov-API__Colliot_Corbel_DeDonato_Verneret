import express from 'express';
const router = express.Router();

import { UserController } from '../controllers/user.controller';
import { authenticateUser } from "../middlewares/auth.middleware";
import { UserService } from "../services/user.service";
import { UserDAO } from "../daos/user.dao";
import {UserSpotifyService} from "../services/user.spotify.service";
import {SpotifyAuthService} from "../services/spotify/spotify.auth.service";
import {SpotifyApiService} from "../services/spotify/spotify.api.service";

const userDAO = new UserDAO();
const userService = new UserService(userDAO);
const spotifyAuthService = new SpotifyAuthService();
const spotifyApiService = new SpotifyApiService();
const userSpotifyService = new UserSpotifyService(userService, spotifyAuthService, spotifyApiService);
const userController = new UserController(userService, userSpotifyService);

router.get("/", authenticateUser, userController.getUsersData)
router.get("/:userID/", authenticateUser, userController.getUserData)

// router.put("/users/:userId/personality", ...);
// router.post("/users/:userId/playlists/from-top-tracks", ...);

// Todo: Remove this route (placeholder for spotify data)
router.get("/:userID/spotify/profile", authenticateUser, userController.getSpotifyUserProfile)
router.get("/:userID/spotify/currently_playing", authenticateUser, userController.getUserSpotifyCurrentlyPlayingTrack)
router.put("/:userID/spotify/play", authenticateUser, userController.playTracks)
export default router