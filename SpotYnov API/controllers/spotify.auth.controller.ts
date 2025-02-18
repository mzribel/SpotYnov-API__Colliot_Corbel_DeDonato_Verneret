import { Request, Response } from "express";
import log from '../logger';
import { ResponseService } from "../services/api/response.service";
import { ApiError } from "../utils/error.util";
import {UserSpotifyService} from "../services/user.spotify.service";
import {UserService} from "../services/user.service";
import {SpotifyAuthService} from "../services/spotify/spotify.auth.service";
import {SpotifyRequestService} from "../services/spotify/spotify.request.service";

export class SpotifyAuthController{
    private userSpotifyService: UserSpotifyService;
    private userService: UserService;
    private spotifyAuthService: SpotifyAuthService;

    constructor(userService: UserService, spotifyAuthService: SpotifyAuthService) {
        this.userSpotifyService = new UserSpotifyService(userService, spotifyAuthService);
        this.userService = userService;
        this.spotifyAuthService = spotifyAuthService;
    }

    public getAuthCodeUrl = (req:Request, res:Response):void => {
        const auth_url:string = this.spotifyAuthService.getAuthorizationCodeUrl();
        ResponseService.handleSuccessResponse(res, {url: auth_url})
    };

    public handleAuthCodeCallback = async (req:Request, res:Response) => {
        const code:string = String(req.query.code);
        try {
            const tokenData = await this.spotifyAuthService.exchangeAuthorizationCode(code);
            log.info('Successfully exchanged token data');
            ResponseService.handleSuccessResponse(res, tokenData);
        } catch (err) {
            const error = err as Error;     // Typescript...
            log.error('Error while exchanging authorization code for token', error.message || error);
            ResponseService.handleErrorResponse(res, 500, error.message);
        }
    };

    public linkSpotifyAccount =  async (req:Request, res:Response) => {
        // Checks the validity of the token by requesting user data
        const spotify_token = req.body.data;
        if (!spotify_token || !spotify_token.access_token) {
            throw new ApiError(400, "Spotify token data missing or invalid.");
        }

        let currentUser = this.userService.getUserByIDOrExplode(req.user?.id ?? "")
        const response = await new SpotifyRequestService().request({method:"get", endpoint:"/me", access_token:spotify_token.access_token});
        if (!response) { throw new ApiError(400, "Spotify token data missing or invalid.") }

        // Modifies and updates user data
        this.userService.setSpotifyUserData(currentUser, response.id, response.display_name, spotify_token)
        // Returns
        ResponseService.handleSuccessResponse(res, {message: `Successfully linked Spotify Account ${response.display_name} to user ${currentUser.Username}.`});
    }

    public unlinkSpotifyAccount =  async (req:Request, res:Response) => {
        let currentUser = this.userService.getUserByIDOrExplode(req.user?.id ?? "")

        // Modifies and updates user data
        this.userService.deleteSpotifyUserData(currentUser);
        ResponseService.handleSuccessResponse(res, {message: `Successfully unlinked Spotify Account from user ${currentUser.Username}.`});
    }
}

