import { Request, Response, NextFunction } from 'express';
import { UserService } from "../services/user.service";
import {ApiError} from "../utils/error.util";
import { ResponseService } from "../services/api/response.service";
import {UserSpotifyService} from "../services/user.spotify.service";
import {SpotifyTrackDTO} from "../dtos/spotify.track.dto";
import {GroupSpotifyService} from "../services/group.spotify.service";
import {GroupService} from "../services/group.service";

export class UserController {
    // Dependancy Injection
    constructor(
        private userService:UserService,
        private userSpotifyService:UserSpotifyService
    ) {}

    public getUserData = async (req: Request, res: Response, next: NextFunction) => {
        // Retrieve path parameters
        const userID = req.params.userID;
        // Get user
        const user = this.userService.getUserDTOById(userID);
        if (!user) { throw new ApiError(404, "User not found."); }
        ResponseService.handleSuccessResponse(res, user)
    }
    public getUsersData = async (req: Request, res: Response, next: NextFunction) => {
        // Get users
        const users = this.userService.getUsersDTO();
        if (!users) { throw new ApiError(404, "User not found."); }
        ResponseService.handleSuccessResponse(res, users)
    }

    public getSpotifyUserProfile = async (req: Request, res: Response, next: NextFunction) => {
        const user = this.userService.getUserByIDOrExplode(req.params.userID);
        const data = await this.userSpotifyService.getUserSpotifyProfile(user);
        ResponseService.handleSuccessResponse(res, data)
    }

    public getUserSpotifyCurrentlyPlayingTrack = async (req: Request, res: Response, next: NextFunction) => {
        const user = this.userService.getUserByIDOrExplode(req.params.userID);
        const data = await this.userSpotifyService.getUserSpotifyCurrentlyPlayingTrack(user);
        ResponseService.handleSuccessResponse(res, data)
    }
    public getUserSpotifySavedTracks = async (req: Request, res: Response, next: NextFunction) => {
        const user = this.userService.getUserByIDOrExplode(req.params.userID);
        if (req.user?.id != user.Id) { throw new ApiError(403, "A user can only access their own Spotify data.") }

        const data = await this.userSpotifyService.getAllSavedTracks(user);
        ResponseService.handleSuccessResponse(res, data)
    }

    public getUserSpotifyTopTracks = async (req: Request, res: Response, next: NextFunction) => {
        const user = this.userService.getUserByIDOrExplode(req.params.userID);
        if (req.user?.id != user.Id) { throw new ApiError(403, "A user can only access their own Spotify data.") }

        const data = await this.userSpotifyService.requestTopTracks(user);
        ResponseService.handleSuccessResponse(res, data)
    }

    public getUserPersonalityFromSavedTracks = async (req: Request, res: Response, next: NextFunction) => {
        const user = this.userService.getUserByIDOrExplode(req.params.userID);
        const data = await this.userSpotifyService.getUserPersonalityFromSavedTracks(user);
        ResponseService.handleSuccessResponse(res, data)
    }

    public playTracks = async (req: Request, res: Response, next: NextFunction) => {
        const user = this.userService.getUserByIDOrExplode(req.params.userID);

        if (req.user?.id != user.Id) {
            throw new ApiError(403, "A user can only modify their own Spotify player.")
        }

        const uris:string[] = req.body.uris;
        const progress_ms:number = req.body.progress_ms ?? 0;

        await this.userSpotifyService.playTracks(user, uris, progress_ms);
        ResponseService.handleSuccessResponse(res, null, 204)
    }

    public createSpotifyPlaylist = async (req: Request, res: Response, next: NextFunction) => {
        const user = this.userService.getUserByIDOrExplode(req.params.userID);
        if (req.user?.id != user.Id) {
            throw new ApiError(403, "A user can only create a playlist on their own account.")
        }

        const name:string = req.body.name ?? "";
        const description:string = req.body.description ?? "";
        let result:any;
        // A partir d'un groupe
        if (req.query.from == "group") {
            result = await this.userSpotifyService.createPlaylistFromUserGroup(user, name, description)

        // A partir d'un utilisateur
        } else if (req.query.from == "user") {
            const source_user_id = req.body.user_id;
            let source_user;
            // No user_id in body = using authenticated user as source
            if (!source_user_id) {
                source_user = this.userService.getUserByIDOrExplode(req.user.id);
            // Else, retrieves user associated to user_id
            } else {
                source_user = this.userService.getUserById(source_user_id);
                if (!source_user) { throw new ApiError(400, "User to create playlist from doesn't exist."); }
            }
            result = await this.userSpotifyService.createPlaylistFromUser(user, source_user, name, description)

        // Playlist vide ou à partir d'uris
        // TODO : à partir d'URI
        } else {
            result = await this.userSpotifyService.createUserPlaylist(user, name, description)
        }
        ResponseService.handleSuccessResponse(res, result, 201)
    }

    public addToUserPlaylist = async (req: Request, res: Response, next: NextFunction) => {
        const user = this.userService.getUserByIDOrExplode(req.params.userID);
        const uris:string[] = req.body.uris;
        const playlistID = req.params.playlistID;
        const response = await this.userSpotifyService.addToUserPlaylist(user, playlistID, uris)
        ResponseService.handleSuccessResponse(res, response, 201)
    }

    public emptyUserSavedTracks = async (req: Request, res: Response, next: NextFunction) => {
        const user = this.userService.getUserByIDOrExplode(req.params.userID);

        if (req.user?.id != user.Id) {
            throw new ApiError(403, "A user can only modify their own saved tracks.")
        }

        const from_end:boolean = (req.query.from_end?.toString() ?? '').toLowerCase() == "true";
        let amount:number = parseInt(req.query.amount?.toString()??"");
        if (!amount || amount < 1) { amount = 5; }

        let ids:string[] = [];
        let tracks:SpotifyTrackDTO[] = [];
        if (!from_end) {
            tracks = await this.userSpotifyService.requestSavedTracks(user, 0, amount)
        } else {
            tracks = await this.userSpotifyService.getAllSavedTracks(user);
            if (tracks.length > amount) {
                tracks = tracks.slice(-amount);
            }
        }

        ids = tracks.map((track:SpotifyTrackDTO) => track.id);
        await this.userSpotifyService.removeFromUserSavedTracks(user, ids);
        ResponseService.handleSuccessResponse(res, {
            message: `Deleted ${amount} tracks from user ${user.Username}'s saved tracks.`
        }, 200)
    }
}