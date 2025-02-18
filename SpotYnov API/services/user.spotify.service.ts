import {SpotifyAuthService} from "./spotify/spotify.auth.service";
import {UserService} from "./user.service";
import User from "../models/User";
import {ApiError} from "../utils/error.util";

// Pattern Facade
export class UserSpotifyService {
    constructor (
        private userService:UserService,
        private spotifyAuthService:SpotifyAuthService,
    ) {}

    public async refreshUserToken(userID:string) {
        const user:User|null = this.userService.getUserById(userID);
        if (user == null) {
            throw new ApiError(401,"User doesn't exist.");
        }

        if (!user.hasSpotifyTokenData()) {
            throw new ApiError(401, "No Spotify account linked to this user.")
        }

        // const newTokenData = await this.userSpotifyService.refreshUserToken(user.SpotifyRefreshToken);
        // if (!newTokenData) {
        //     console.error("Refresh token failed.");
        //     return null;
        // }
        // user.refreshSpotifyToken(newTokenData);
        // saveUserToFile(user);
        // return newTokenData.AccessToken ?? null;
        return null;
    }
}