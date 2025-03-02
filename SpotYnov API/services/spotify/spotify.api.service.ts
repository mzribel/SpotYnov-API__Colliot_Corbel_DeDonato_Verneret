// TODO : Exporter les méthodes utiles :

import { SpotifyRequestService } from "./spotify.request.service";
import {SpotifyUserDTO} from "../../dtos/spotify.user.dto";
import {SpotifyPlaybackStateDTO} from "../../dtos/spotify.playbackstate.dto";
import {SpotifyTrackDTO} from "../../dtos/spotify.track.dto";

export class SpotifyApiService {
    private readonly spotifyRequestService: SpotifyRequestService
    public constructor() {
        this.spotifyRequestService = new SpotifyRequestService();
    }

    async getSpotifyProfile(access_token:string) {
        const response = await this.spotifyRequestService.request({method:"get", endpoint:"/me", access_token});
        return SpotifyUserDTO.fromSpotifyUserObject(response.data);
    }

    // TODO : Check if playing item is a track and not a podcast episode !
    async getSpotifyCurrentlyPlayingTrack(access_token:string):Promise<SpotifyPlaybackStateDTO> {
        const response = await this.spotifyRequestService.request({method:"get", endpoint:"/me/player", access_token});
        return SpotifyPlaybackStateDTO.fromSpotifyPlaybackStateObject(response.data);
    }

    async startPlayingTracks(access_token:string, uris:string[], position_ms:number) {
        const response = await this.spotifyRequestService.request({
            method:"put",
            endpoint:"/me/player/play",
            access_token,
            body: {
                uris,
                position_ms
            }
        })
        // TODO: 204 doesn't return any data!
        return response.data;
    }

    async getSavedTracks(access_token:string, offset=0, limit=50) {
        const response = await this.spotifyRequestService.request({
            method:"get",
            endpoint:"/me/tracks",
            access_token,
            params: {
                offset, limit
            }});
        const items = response.data.items as any[];
        response.data.items = items.map((item:any) => {
            return SpotifyTrackDTO.fromSpotifyTrackObject(item.track);
        })
        return response.data;
    }
    async getTopTracks(access_token:string, offset=0, limit=20, time_range:"short_term"|"medium_term"|"long_term"="medium_term") {
        const response = await this.spotifyRequestService.request({
            method:"get",
            endpoint:"/me/top/tracks",
            access_token,
            params: {
                offset:offset, limit:limit, time_range
            }});
        const items = response.data.items as any[];
        return items.map((item:any) => {
            return SpotifyTrackDTO.fromSpotifyTrackObject(item);
        })
    }

    async createPlaylist(access_token:string, user_id:string, name:string, description?:string) {
        const response = await this.spotifyRequestService.request({
            method:"post",
            endpoint: `/users/${user_id}/playlists`,
            access_token,
            body: {
                name,
                description
            }
        })
        return response.data;
    }

    async addToPlaylist(access_token:string, playlist_id:string, uris:string[]) {
        const response = await this.spotifyRequestService.request({
            method:"post",
            endpoint: `/playlists/${playlist_id}/tracks`,
            access_token,
            body: {
                uris
            }
        })
        return response.data;
    }
}



