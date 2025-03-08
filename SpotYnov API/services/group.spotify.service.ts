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

    // TODO: clean up this shit
    public async createPlaylistFromMembersTopTracks(group:Group, target_user:User, playlist_name?:string, playlist_description?:string) {
        if (!target_user.hasSpotifyTokenData()) { throw new ApiError(400, "User has not linked any Spotify account.") }

        // Retrieves music
        const tracks = await (this.getMembersTopTracks(group));
        const uris:string[] = tracks.map((obj:SpotifyTrackDTO)=> obj.uri)
        if (!uris.length) { throw new ApiError(400, "No tracks found."); }

        // Splits tracks in sendable chunks
        const splittedTracks: string[][] = [];
        for (let i = 0; i < uris.length; i += 5) {
            splittedTracks.push(uris.slice(i, i + 5));
        }

        // Create playlist
        if (!playlist_name) playlist_name = `${group.Name}'s playlist`;
        const playlist_data = await this.userSpotifyService.createUserPlaylist(target_user, playlist_name, playlist_description);
        const playlist_id:string = playlist_data.id ?? "";

        // Add chunks of track uris to playlist
        for (const chunk of splittedTracks) {
            await this.userSpotifyService.addToUserPlaylist(target_user, playlist_id, chunk)
        }

        // Retrieves full playlist data
        return await this.userSpotifyService.getUserPlaylist(target_user, playlist_id);
    }
}