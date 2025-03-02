import log from '../logger';
import { SpotifyAuthService } from "./spotify/spotify.auth.service";
import { UserService } from "./user.service";
import User from "../models/User";
import { ApiError } from "../utils/error.util";
import { SpotifyApiService } from "./spotify/spotify.api.service";
import { SpotifyRequestService} from "./spotify/spotify.request.service";
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

        if (!user.spotify_data?.token_data) { throw new ApiError(403, "User has not linked any Spotify account.") }

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

    // TODO : Ne jamais re-regarder ce TODO
    public async linkSpotifyAccount(user:User, spotify_token_data:any) {
        const token_data = SpotifyTokenData.fromObject(spotify_token_data)

        if (!token_data || !(token_data.AccessToken || token_data.RefreshToken)) {
            throw new ApiError(400, "Wrong Spotify token data format.")
        }

        const userProfileResponse = await new SpotifyRequestService().request({method:"get", endpoint:"/me", access_token:token_data.AccessToken});

        // Modifies and updates user data
        this.userService.setSpotifyUserData(user, token_data,userProfileResponse.data.id, userProfileResponse.data.display_name)
        return {
            id: userProfileResponse.data.id,
            display_name: userProfileResponse.data.display_name
        }
    }

    async getUserSpotifyProfile(user:User) {
        return this.userRequest(user, (token) => this.spotifyApiService.getSpotifyProfile(token))
    }

    async getUserSpotifyCurrentlyPlayingTrack(user:User) {
        return this.userRequest(user, (token:string) => this.spotifyApiService.getSpotifyCurrentlyPlayingTrack(token))
    }

    async playTracks(user:User, uris:string[], progress_ms:number) {
        if (!uris) { throw new ApiError(400, "At least one track must be specified.") }
        return this.userRequest(user, (token:string) => this.spotifyApiService.startPlayingTracks(token, uris, progress_ms))
    }

    async synchronizePlayers(from_user:User, to_users:User[]) {
        const from_user_data = await this.getUserSpotifyCurrentlyPlayingTrack(from_user);
        if (!from_user_data || !from_user_data.item) {
            throw new ApiError(400, "User player is not active at the moment.")
        }

        const progress_ms:number = from_user_data.progress_ms;
        const uri:string = from_user_data.item.uri;

        for (const user of to_users) {
            if (user.Id == from_user.Id) continue;
            await this.playTracks(user, [uri], progress_ms).catch(()=>{});
        }
    }
}







