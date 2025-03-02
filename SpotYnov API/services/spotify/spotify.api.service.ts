// TODO : Exporter les méthodes utiles :

import { SpotifyRequestService } from "./spotify.request.service";

export class SpotifyApiService {
    private readonly spotifyRequestService: SpotifyRequestService
    public constructor() {
        this.spotifyRequestService = new SpotifyRequestService();
    }

    async getSpotifyProfile(access_token:string) {
        const response = await this.spotifyRequestService.request({method:"get", endpoint:"/me", access_token});
        return response.data;
    }

    async getSpotifyCurrentlyPlayingTrack(access_token:string) {
        const response = await this.spotifyRequestService.request({method:"get", endpoint:"/me/player/currently-playing", access_token});
        return response.data;
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
        return response.data;
    }
}



