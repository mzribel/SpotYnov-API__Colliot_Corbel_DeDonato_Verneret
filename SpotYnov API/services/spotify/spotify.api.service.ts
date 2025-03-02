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
}



