import {SpotifyApiService} from "./spotify/spotify.api.service";
import {GroupService} from "./group.service";
import {UserSpotifyService} from "./user.spotify.service";

export class GroupSpotifyService {
    constructor(
        private groupService: GroupService,
        private spotifyApiService: UserSpotifyService
    ) {}


}