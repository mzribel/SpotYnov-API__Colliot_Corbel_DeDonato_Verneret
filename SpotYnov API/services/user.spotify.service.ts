import log from '../logger';
import { SpotifyAuthService } from "./spotify/spotify.auth.service";
import { UserService } from "./user.service";
import User from "../models/User";
import { ApiError } from "../utils/error.util";
import { SpotifyApiService } from "./spotify/spotify.api.service";
import { AxiosError } from "axios";
import {SpotifyTokenData} from "../models/SpotifyData";
import {msDurationToString} from "../utils/format.util";
import { SpotifyTrackDTO } from "../dtos/spotify.track.dto"
import {SpotifyUserDTO} from "../dtos/spotify.user.dto";

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

        if (!user.SpotifyAccessToken && !user.SpotifyRefreshToken) { throw new ApiError(401, "User has not linked any Spotify account.") }

        try {
            return await requestFn(user.SpotifyAccessToken, ...args);
        } catch (error) {
            if (error instanceof AxiosError && error.status == 401) {
                if (!user.SpotifyRefreshToken) {
                    throw new ApiError(401, "Spotify token missing or invalid.")
                }
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
            throw new ApiError(400, "Wrong Spotify token data format.")
        }

        // Modifies but **doesn't save** user data and retrieves Spotify Profile.
        // We retrieve the profile to check the token validity!
        user.setSpotifyData(token_data, "", "");
        const user_data = await this.getUserSpotifyProfile(user);

        // If profile has successfully been retrieved, we save the token in json file.
        this.userService.setSpotifyUserData(user, token_data,user_data.id, user_data.display_name)
        return user_data;
    }

    async getUserWithSpotifyProfile(user:User) {
        const spotify_profile = this.getUserSpotifyProfile(user).catch(()=>{return null});
        return {
            ...user,
            spotify: {
                profile: spotify_profile,
            }
        }
    }

    async getUserSpotifyProfile(user:User): Promise<SpotifyUserDTO> {
        return this.userRequest(user, (token) => this.spotifyApiService.getSpotifyProfile(token))
    }

    async getUserSpotifyCurrentlyPlayingTrack(user:User) {
        return this.userRequest(user, (token:string) => this.spotifyApiService.getSpotifyCurrentlyPlayingTrack(token))
    }
    async requestSavedTracks(user:User, offset=0, limit=50):Promise<any> {
        return this.userRequest(user, (token:string):Promise<any> => this.spotifyApiService.getSavedTracks(token, offset, limit))
    }

    async getSavedTracks(user:User, offset=0, limit=50):Promise<SpotifyTrackDTO[]> {
        return (await this.requestSavedTracks(user, offset, limit)).items ?? [];
    }

    async getAllSavedTracks(user:User, limitPerRequest=50):Promise<SpotifyTrackDTO[]> {
        let savedTracks:SpotifyTrackDTO[] = [];

        let data = await this.requestSavedTracks(user);
        if (!data.items) { throw new ApiError(404, "User has not liked any track."); }

        let offset:number = 0;
        while(true) {
            savedTracks = savedTracks.concat(data.items);

            if (!data.next) { break; }
            offset+= limitPerRequest;
            data = await this.requestSavedTracks(user, offset, limitPerRequest);
        }
        return savedTracks;
    }
    async requestTopTracks(user:User, limit:number=50, offset:number=0):Promise<SpotifyTrackDTO[]> {
        return this.userRequest(user, (token:string):Promise<any> => this.spotifyApiService.getTopTracks(token, offset, limit))
    }

    async getUserPersonalityFromSavedTracks(user:User) {
        const tracks = await this.getAllSavedTracks(user);
        const avg_duration_ms = Math.round(tracks.reduce((acc: any, track: any) => acc+track.duration_ms, 0) / tracks.length)

        return {
            count: tracks.length,
            avg_popularity: +(tracks.reduce((acc: any, track: any) => acc+track.popularity, 0) / tracks.length).toFixed(2),
            avg_duration_ms: avg_duration_ms,
            avg_duration: msDurationToString(avg_duration_ms)
        }
    }

    async playTracks(user:User, uris:string[], progress_ms:number) {
        if (!uris) { throw new ApiError(400, "At least one track must be specified.") }
        return this.userRequest(user, (token:string) => this.spotifyApiService.startPlayingTracks(token, uris, progress_ms))
    }

    async synchronizePlayers(from_user:User, to_users:User[]) {
        const from_user_data = await this.getUserSpotifyCurrentlyPlayingTrack(from_user);
        if (!from_user_data || !from_user_data.track) {
            throw new ApiError(400, "User player is not active at the moment.")
        }

        const progress_ms:number = from_user_data.progress_ms;
        const uri:string = from_user_data.track.uri;

        for (const user of to_users) {
            if (user.Id == from_user.Id) continue;
            await this.playTracks(user, [uri], progress_ms).catch(()=>{});
        }
    }

    async createUserPlaylist(user:User, name:string, description?:string) {
        const user_data = await this.getUserSpotifyProfile(user);
        name = name.trim();
        return this.userRequest(user, (token:string) => this.spotifyApiService.createPlaylist(token, user_data.id, name, description))
    }

    async addToUserPlaylist(user:User, playlist_id:string, uris:string[]) {
        return this.userRequest(user, (token:string) => this.spotifyApiService.addToPlaylist(token, playlist_id, uris))
    }

    async removeFromUserSavedTracks(user:User, ids:string[]) {
        return this.userRequest(user, (token:string) => this.spotifyApiService.removeFromSavedTracks(token, ids))
    }
    async getUserPlaylist(user:User, id:string) {
        return this.userRequest(user, (token:string) => this.spotifyApiService.getPlaylist(token, id))
    }
}