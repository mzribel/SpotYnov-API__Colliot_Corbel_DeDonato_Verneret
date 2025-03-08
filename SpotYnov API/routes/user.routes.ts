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

router.get("/:userID/spotify/profile", authenticateUser, userController.getSpotifyUserProfile)
router.get("/:userID/spotify/currently_playing", authenticateUser, userController.getUserSpotifyCurrentlyPlayingTrack)
router.put("/:userID/spotify/play", authenticateUser, userController.playTracks)
router.get("/:userID/spotify/saved_tracks", authenticateUser, userController.getUserSpotifySavedTracks)
router.get("/:userID/spotify/saved_tracks/personality", authenticateUser, userController.getUserPersonalityFromSavedTracks)
router.get("/:userID/spotify/top_tracks", authenticateUser, userController.getUserSpotifyTopTracks)

router.post("/:userID/spotify/playlists/", authenticateUser, userController.createSpotifyPlaylist)
router.post("/:userID/spotify/playlists/:playlistID", authenticateUser, userController.addToUserPlaylist)
export default router