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

    async request(
        userID:string,
        requestFn:(params:SpotifyRequestParams) => Promise<any>,
        params:SpotifyRequestParams): Promise<any> {

        let user = this.userService.getUserById(userID);
        if (!user || !user.spotify_data?.token_data?.AccessToken) {
            throw new Error("No Spotify account linked to this user.");
        }

        let access_token = user.spotify_data?.token_data?.AccessToken;
        try {
            return requestFn({... params, access_token});
        } catch (error) {
            if (error instanceof AxiosError) {
                access_token = await this.refreshUserToken(user) ?? "";
                return await requestFn({...params, access_token})
            }
            throw error;
        }
    }

    public async refreshUserToken(user:User) {
        if (!user.hasSpotifyTokenData()) { throw new ApiError(401, "No Spotify account linked to this user.") }

        const newTokenData = await this.spotifyAuthService.refreshToken(user.SpotifyRefreshToken);
        if (!newTokenData || !newTokenData?.AccessToken) {
            throw new ApiError(69, "touche de l'herbe")
        }

        user.setSpotifyToken(newTokenData);
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
}