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

    public async getGroupWithSpotifyData(group:Group, show_playback_state:boolean=false) {
        let groupDTO = this.groupService.groupToDTO(group, true);

        const users = this.groupService.getGroupUsers(group);
        groupDTO.members = await Promise.all(users.map(async (user: User) => {
            return show_playback_state ?
                await this.userSpotifyService.getUserWithSpotifyPlaybackState(user) :
                await this.userSpotifyService.getUserWithSpotifyProfile(user);
        }));

        return groupDTO;
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

    public async getGroupMembersWithSpotifyData(group:Group, show_playback_state:boolean=false) {
        const users:User[] = this.groupService.getGroupUsers(group);
        let members:object[] = [];
        for (const user of users) {
            const data = show_playback_state ?
                await this.userSpotifyService.getUserWithSpotifyPlaybackState(user) :
                await this.userSpotifyService.getUserWithSpotifyProfile(user);
            members.push({
                ...data,
                isAdmin: group.getAdminID == user.Id
            });
        }
        return members;
    }
}