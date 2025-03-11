import {GroupService} from "./group.service";
import {UserSpotifyService} from "./user.spotify.service";
import {Group} from "../models/Group";
import User from "../models/User";
import {ApiError} from "../utils/error.util";
import {SpotifyTrackDTO} from "../dtos/spotify.track.dto";

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

    public async getMembersTopTracks(group:Group) {
        let userSavedTracks:SpotifyTrackDTO[] = [];
        const users:User[] = this.groupService.getGroupUsers(group);
        for (const user of users) {
            await this.userSpotifyService.getSavedTracks(user, 0, 10)
                .then((savedTracks:SpotifyTrackDTO[]) => {
                    userSavedTracks.push(...savedTracks) })
                .catch((err:Error) => {
                    console.log("Couldn't fetch saved tracks for user "+user.Username);
                    console.log(err)
                })
        }
        return userSavedTracks;
    }

    public async getGroupMembersWithSpotifyData(group:Group) {
        const users:User[] = this.groupService.getGroupUsers(group);
        let members:object[] = [];
        for (const user of users) {
            const spotify_profile = await this.userSpotifyService.getUserSpotifyProfile(user).catch(()=>{return null});
            const spotify_playbackstate = await this.userSpotifyService.getUserSpotifyCurrentlyPlayingTrack(user).catch(()=>{return null});
            members.push({
                ...user.toDTO(),
                isAdmin: group.getAdminID == user.Id,
                spotify: {
                    profile: spotify_profile,
                    playback_state: spotify_playbackstate
                }
            });
        }
        return members;
    }
}