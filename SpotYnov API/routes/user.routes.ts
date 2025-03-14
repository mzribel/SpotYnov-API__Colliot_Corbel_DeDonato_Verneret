import express from 'express';
const router = express.Router();

import { UserController } from '../controllers/user.controller';
import { authenticateUser } from "../middlewares/auth.middleware";
import { UserService } from "../services/user.service";
import { UserDAO } from "../daos/user.dao";
import {UserSpotifyService} from "../services/user.spotify.service";
import {SpotifyAuthService} from "../services/spotify/spotify.auth.service";
import {SpotifyApiService} from "../services/spotify/spotify.api.service";
import {GroupDAO} from "../daos/group.dao";
import {GroupService} from "../services/group.service";
import {GroupSpotifyService} from "../services/group.spotify.service";
import {GroupController} from "../controllers/group.controller";

const userDAO = new UserDAO();
const groupDAO = new GroupDAO();
const userService = new UserService(userDAO, groupDAO);
const spotifyAuthService = new SpotifyAuthService();
const spotifyApiService = new SpotifyApiService();
const userSpotifyService = new UserSpotifyService(userService, spotifyAuthService, spotifyApiService);
const userController = new UserController(userService, userSpotifyService);

const groupService = new GroupService(groupDAO, userService);
const groupSpotifyService = new GroupSpotifyService(groupService, userSpotifyService);
const groupController = new GroupController(groupService, groupSpotifyService);

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

router.get("/me/group", authenticateUser, groupController.getGroupData);

export default router