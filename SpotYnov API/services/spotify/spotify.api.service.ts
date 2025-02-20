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
}



