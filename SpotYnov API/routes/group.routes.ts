import express from 'express';
import { GroupDAO } from "../daos/group.dao";
import { GroupService } from "../services/group.service";
import { GroupController } from "../controllers/group.controller";
import {UserService} from "../services/user.service";
import {UserDAO} from "../daos/user.dao";
import {authenticateUser} from "../middlewares/auth.middleware";
import {UserSpotifyService} from "../services/user.spotify.service";
import {SpotifyAuthService} from "../services/spotify/spotify.auth.service";
import {SpotifyApiService} from "../services/spotify/spotify.api.service";
import {GroupSpotifyService} from "../services/group.spotify.service";
const router = express.Router();

// User DAO & Service
const userDAO = new UserDAO();
const userService = new UserService(userDAO);
// Spotify Services
const spotifyAuthService = new SpotifyAuthService();
const spotifyApiService = new SpotifyApiService();
// User & Spotify Service
const userSpotifyService = new UserSpotifyService(userService, spotifyAuthService, spotifyApiService);

// Group DAO & Service
const groupDAO = new GroupDAO();
const groupService = new GroupService(groupDAO, userService);
// Group & Spotify Service
const groupSpotifyService = new GroupSpotifyService(groupService, userSpotifyService);

// Controller
const groupController = new GroupController(groupService, groupSpotifyService);

router.get("/", authenticateUser, groupController.getGroupsData);
router.post("/", authenticateUser, groupController.createGroup);

router.get("/:groupID", authenticateUser, groupController.getGroupData);
router.delete("/:groupID", authenticateUser, groupController.deleteGroup);

router.post("/:groupID/members", authenticateUser, groupController.addGroupMember);
router.delete("/:groupID/members/:userID", authenticateUser, groupController.deleteGroupMember);

router.get("/:groupID/spotify/synchronize", authenticateUser, groupController.synchronizePlayers);
router.post("/:groupID/spotify/playlists/from-top-tracks", authenticateUser, groupController.createPlaylistFromMembersTopTracks)
export default router;