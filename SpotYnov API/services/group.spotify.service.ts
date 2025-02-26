import {SpotifyApiService} from "./spotify/spotify.api.service";
import {GroupService} from "./group.service";

export class GroupSpotifyService {
    constructor (
        private groupService:GroupService,
        private spotifyApiService: SpotifyApiService
    ) {}


}