import {SpotifyApiService} from "./spotify/spotify.api.service";
import {GroupService} from "./group.service";
import {UserSpotifyService} from "./user.spotify.service";
import {Group} from "../models/Group";
import User from "../models/User";
import {ApiError} from "../utils/error.util";

export class GroupSpotifyService {
    constructor(
        private groupService: GroupService,
        private userSpotifyService: UserSpotifyService
    ) {}

    public async synchronizePlayers(group:Group) {
        const users:User[] = this.groupService.getGroupUsers(group);
        const admin:User|undefined = users.find((user:User) => user.Id == group.getAdminID);
        if (!admin) { throw new ApiError(400, "Group has no admin.")}

        return this.userSpotifyService.synchronizePlayers(admin, users);
    }

}