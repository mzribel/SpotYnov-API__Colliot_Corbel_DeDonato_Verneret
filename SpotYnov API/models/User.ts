import {hashPassword} from "../utils/format";

export class User {
    private readonly id:number;
    private readonly username:string;
    private readonly password:string;
    private spotifyId: string|undefined;
    private spotifyToken: object|undefined;

    private constructor(username:string="", password:string="", id:number=-1, spotifyId:string|undefined=undefined, spotifyToken:Object|undefined=undefined) {
        this.username = username;
        this.password = password;
        this.id = id;
        this.spotifyId = spotifyId;
        this.spotifyToken = spotifyToken;
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
        return Object.assign(new User(), obj)
    }

    get Username():string {
        return this.username;
    }
    get Id():number {
        return this.id;
    }
    get SpotifyId():string|undefined {
        return this.spotifyId;
    }
    get SpotifyToken():object|undefined {
        return this.spotifyToken;
    }

    public setSpotifyData(spotify_id:string|undefined, spotify_token:object
        |undefined) {
        this.spotifyId = spotify_id;
        this.spotifyToken = spotify_token;
    }

    public checkPassword(password:string):boolean {
        return this.password == hashPassword(password)
    }
}

export default User;