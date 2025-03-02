import log from '../logger';
import { Request, Response, NextFunction } from 'express';
import { UserService } from "../services/user.service";
import {ApiError} from "../utils/error.util";
import { ResponseService } from "../services/api/response.service";
import {UserSpotifyService} from "../services/user.spotify.service";

export class UserController {
    // Dependancy Injection
    constructor(
        private userService:UserService,
        private userSpotifyService:UserSpotifyService) {}

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
}