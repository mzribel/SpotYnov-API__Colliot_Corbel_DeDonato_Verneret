import { hashPassword } from "../utils/format";
import { SpotifyToken } from "./SpotifyToken";

export class User {
    private readonly id:number;
    private readonly username:string;
    private readonly password:string;
    private spotify_id: string|undefined;
    private spotify_token_data: SpotifyToken|undefined;

    private constructor(username:string="", password:string="", id:number=-1, spotifyId:string|undefined=undefined, spotifyToken:SpotifyToken|undefined=undefined) {
        this.username = username;
        this.password = password;
        this.id = id;
        this.spotify_id = spotifyId;
        this.spotify_token_data = spotifyToken;
    }

    public static create(username:string, password:string, id:number=-1) {
        username = username.trim();
        let hashed_password = hashPassword(password);
        if (!username || !hashed_password) {
            throw new Error("Username and password are required");
        }
        return new User(username, password, id);
    }

    static fromObject(obj:Object) {
        const user = Object.assign(new User(), obj)
        user.spotify_token_data = SpotifyToken.fromObject(user.spotify_token_data)
        return user;
    }

    get Username():string {
        return this.username;
    }
    get Id():number {
        return this.id;
    }
    get SpotifyId():string|undefined {
        return this.spotify_id;
    }

    get SpotifyAccessToken():string {
        return this.spotify_token_data?.AccessToken ?? "";
    }
    get SpotifyRefreshToken():string {
        return this.spotify_token_data?.refreshToken ?? "";
    }

    public hasSpotifyTokenData():boolean {
        return !(!this.spotify_token_data);     // LMAO j'ai oublié comment on fait
    }

    public setSpotifyData(spotify_id:string|undefined, spotify_token:object
        |undefined) {
        this.spotify_id = spotify_id;
        this.spotify_token_data = SpotifyToken.fromObject(spotify_token);
    }

    public refreshSpotifyToken(newSpotifyToken:SpotifyToken) {
        // No Spotify token beforehand
        if (!this.spotify_token_data) {
            this.spotify_token_data = newSpotifyToken;
            return;
        }

        // New token doesn't have a new refresh token : keep the one stored
        if (!newSpotifyToken.refreshToken) {
            newSpotifyToken.refreshToken = this.spotify_token_data.refreshToken
        }

        // Replace token
        this.spotify_token_data = newSpotifyToken;
    }

    public checkPassword(password:string):boolean {
        return this.password == hashPassword(password)
    }
}

export default User;