import { Request, Response } from "express";
import log from '../logger';
import { ResponseService } from "../services/api/response.service";
import { ApiError } from "../utils/error.util";
import axios, { AxiosResponse } from "axios";
import {UserSpotifyService} from "../services/user.spotify.service";
import {UserService} from "../services/user.service";
import {SpotifyAuthService} from "../services/spotify/spotify.auth.service";

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

        // Todo: Centralize spotify data fetching (SpotifyAPIService)
        let currentUser = this.userService.getUserByIDOrExplode(req.user?.id ?? "")
        const config = {
            headers: {
                Authorization: `Bearer ${spotify_token.access_token}`,
            }
        }
        const response:AxiosResponse<any,any> = await axios.get("https://api.spotify.com/v1/me", config);
        if (!response.data) { throw new ApiError(400, "Spotify token data missing or invalid.") }

        // Modifies and updates user data
        this.userService.setSpotifyUserData(currentUser, response.data.id, response.data.display_name, spotify_token)

        // HTTP Response :
        // Todo : Attention erreur 500 quand le token est invalide, devrait être 401
        const spotifyUsername = response.data.display_name || "";
        ResponseService.handleSuccessResponse(res, {message: `Successfully linked Spotify Account ${spotifyUsername} to user ${currentUser.Username}.`});
    }

    public unlinkSpotifyAccount =  async (req:Request, res:Response) => {
        let currentUser = this.userService.getUserByIDOrExplode(req.user?.id ?? "")

        // Modifies and updates user data
        this.userService.deleteSpotifyUserData(currentUser);
        ResponseService.handleSuccessResponse(res, {message: `Successfully unlinked Spotify Account from user ${currentUser.Username}.`});
    }
}

