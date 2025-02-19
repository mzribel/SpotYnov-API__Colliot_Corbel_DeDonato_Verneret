import log from '../logger';
import { SpotifyAuthService } from "./spotify/spotify.auth.service";
import { UserService } from "./user.service";
import User from "../models/User";
import { ApiError } from "../utils/error.util";
import { SpotifyApiService } from "./spotify/spotify.api.service";
import {SpotifyRequestParams, SpotifyRequestService} from "./spotify/spotify.request.service";
import { AxiosError } from "axios";
import {SpotifyTokenData} from "../models/SpotifyData";

// Mediator Service
export class UserSpotifyService {
    constructor (
        private userService:UserService,
        private spotifyAuthService:SpotifyAuthService,
        private spotifyApiService: SpotifyApiService
    ) {}

    async userRequest(
        user:User,
        requestFn:(token:string, ...args:any[]) => Promise<any>,
        ...args:[]): Promise<any> {

        // TODO : L'utilisateur n'a pas de données de token spotify
        if (!user.spotify_data?.token_data) { throw new ApiError(6969, "jsp") }

        try {
            return await requestFn(user.SpotifyAccessToken, ...args);
        } catch (error) {
            if (error instanceof AxiosError) {
                const new_token = await this.refreshUserToken(user) ?? "";
                return await requestFn(new_token, ...args);
            }
            throw error;
        }
    }

    public async refreshUserToken(user:User) {
        if (!user.hasSpotifyTokenData()) { throw new ApiError(401, "No Spotify account linked to this user.") }

        const newTokenData = await this.spotifyAuthService.refreshToken(user.SpotifyRefreshToken);
        if (!newTokenData || !newTokenData?.AccessToken) {
            log.error("")
            throw new ApiError(69, "touche de l'herbe")
        }

        log.info(`Successfully refreshed token for user ${user.Id} (${user.Username}).`)

        this.userService.setSpotifyUserData(user, newTokenData)
        return newTokenData.AccessToken;
    }

    public async linkSpotifyAccount(user:User, spotify_token_data:any) {
        const token_data = SpotifyTokenData.fromObject(spotify_token_data)

        if (!token_data || !(token_data.AccessToken || token_data.RefreshToken)) {
            throw new ApiError(401, "Mes couilles en ski.")
        }

        const userProfileResponse = await new SpotifyRequestService().request({method:"get", endpoint:"/me", access_token:token_data.AccessToken});
        if (!userProfileResponse.data) { throw new ApiError(400, "Spotify token data missing or invalid.") }

        // Modifies and updates user data
        this.userService.setSpotifyUserData(user, token_data,userProfileResponse.data.id, userProfileResponse.data.display_name)
        return user.getSpotifyUserData();
    }

    async getUserSpotifyProfile(user:User) {
        return this.userRequest(user, (token) => this.spotifyApiService.getSpotifyProfile(token))
    }
}