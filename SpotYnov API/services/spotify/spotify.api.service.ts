// TODO : Exporter les méthodes utiles :

import {SpotifyRequestService} from "./spotify.request.service";

export class SpotifyApiService {
    private spotifyRequestService: SpotifyRequestService
    public constructor() {
        this.spotifyRequestService = new SpotifyRequestService()
    }

    async getSpotifyProfile(access_token:string) {
        return this.spotifyRequestService.request({method:"get", endpoint:"/me", access_token});
    }

}



