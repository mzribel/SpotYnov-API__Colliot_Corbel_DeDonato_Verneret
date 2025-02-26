import { Request, Response } from "express";
import log from '../logger';
import { ResponseService } from "../services/api/response.service";
import { SpotifyAuthService } from "../services/spotify/spotify.auth.service";
import { ApiError } from "../utils/error.util";
import { UserService } from "../services/user.service";
import { UserSpotifyService } from "../services/user.spotify.service";

export class SpotifyAuthController{

    constructor(
        private userService: UserService,
        private spotifyAuthService: SpotifyAuthService,
        private userSpotifyService: UserSpotifyService
    ) {}

    public getAuthCodeUrl = (req:Request, res:Response):void => {
        const auth_url:string = this.spotifyAuthService.generateAuthCodeUrl();
        ResponseService.handleSuccessResponse(res, {url: auth_url})
    };

    public handleAuthCodeCallback = async (req:Request, res:Response) => {
        const code:string = String(req.query.code);
        try {
            const response:any = await this.spotifyAuthService.exchangeAuthCode(code);
            log.info('Successfully exchanged token data');
            ResponseService.handleSuccessResponse(res, response.data);
        } catch (err) {
            const error = err as Error;     // Typescript...
            log.error('Error while exchanging authorization code for token', error.message || error);
            ResponseService.handleErrorResponse(res, 500, error.message);
        }
    };

    public linkSpotifyAccount =  async (req:Request, res:Response) => {
        const spotify_token = req.body.data;
        if (!spotify_token || !spotify_token.access_token) {
            throw new ApiError(400, "Spotify token data missing or invalid.");
        }

        let currentUser = this.userService.getUserByIDOrExplode(req.user?.id ?? "")
        const spotifyData = await this.userSpotifyService.linkSpotifyAccount(currentUser, spotify_token)

        ResponseService.handleSuccessResponse(res, {message: `Successfully linked Spotify Account ${spotifyData.display_name} to user ${currentUser.Username}.`});
    }

    public unlinkSpotifyAccount =  async (req:Request, res:Response) => {
        let currentUser = this.userService.getUserByIDOrExplode(req.user?.id ?? "")

        // Modifies and updates user data
        this.userService.deleteSpotifyUserData(currentUser);
        ResponseService.handleSuccessResponse(res, {message: `Successfully unlinked Spotify Account from user ${currentUser.Username}.`});
    }

}

