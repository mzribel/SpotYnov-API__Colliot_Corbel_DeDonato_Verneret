import { hashPassword } from "../utils/auth.util";
import {SpotifyTokenData, SpotifyData} from "./SpotifyData";
import {ApiError} from "../utils/error.util";

// ---------------------------------------- //
// ----------- USERDATA (model) ----------- //
// ---------------------------------------- //
export interface UsersData {
    auto_increment: number,
    users: {[key: string]: User}
}

// ---------------------------------------- //
// ------------- USER (model) ------------- //
// ---------------------------------------- //
export class User {
    private id:string;
    private username:string;
    private password:string;
    public spotify_data?: SpotifyData

    public constructor(username:string, password:string,id:string="",spotify_data?:SpotifyData) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.spotify_data = spotify_data;
    }

    // --------- GETTERS & SETTERS --------- //
    get Id():string {
        return this.id;             // No setter for now
    }
    set Id(id:string) {
        this.id = id;
    }
    get Username():string {
        return this.username;       // No setter for now
    }

    // ------------- METHODS -------------- //
    getSpotifyUserData():{id:string, display_name:string}|null {
        if (!this.spotify_data) return null;

        return {
            id: this.spotify_data.id,
            display_name: this.spotify_data.display_name
        }
    }
    setSpotifyData(token_data:object, id:string, display_name:string, force_valid_id:boolean=false) {
        const tokenData:SpotifyTokenData = SpotifyTokenData.fromObject(token_data)
        if (!tokenData || (!tokenData.AccessToken && !tokenData.RefreshToken) || force_valid_id && !id) return false;

        this.spotify_data = {
            id:id,
            display_name:display_name,
            token_data:tokenData
        }
        return true;
    }
    setSpotifyToken(token_data:object|SpotifyTokenData) {
        if (!this.spotify_data?.id || !this.spotify_data.display_name)
            throw new ApiError(400, "jsp")

        let new_token = token_data instanceof SpotifyTokenData ? token_data : SpotifyTokenData.fromObject(token_data)
        if (!new_token.RefreshToken && this.spotify_data.token_data?.RefreshToken) new_token.RefreshToken = this.spotify_data.token_data?.RefreshToken;

        this.spotify_data.token_data = new_token;
        return new_token;
    }

    deleteSpotifyData() {
        this.spotify_data = undefined;
    }
    get SpotifyAccessToken():string {
        return this.spotify_data?.token_data?.AccessToken ?? "";
    }
    get SpotifyRefreshToken():string {
        return this.spotify_data?.token_data?.RefreshToken ?? "";
    }

    public hasSpotifyTokenData():boolean {
        return !!(this.SpotifyRefreshToken || this.SpotifyAccessToken);     // LMAO j'ai oublié comment on fait
    }

    public checkPassword(password:string):boolean {
        return this.password == hashPassword(password)
    }

    // ------------- CONVERSIONS -------------- //
    public toDTO = ():UserDTO => {
        let spotify_data_dto = this.spotify_data ?
            { id: this.spotify_data.id, display_name: this.spotify_data.display_name} :
            undefined;
        return new UserDTO(this.id, this.username);
    }

    static fromObject(obj:Object):User {
        let user:User = Object.assign(new User("", "", ""), obj);
        if (!user.spotify_data || !user.spotify_data.token_data) { return user; }

        user.spotify_data.token_data = SpotifyTokenData.fromObject(user.spotify_data.token_data)
        return user;
    }
}


// ---------------------------------------- //
// ---------- USERDTO (... DTO) ----------- //
// ---------------------------------------- //
export class UserDTO {
    public id:string
    public username:string
    public spotify?: {
        profile?: any,
        playback_state?:any
    }

    public constructor(id:string,username:string, spotify_profile?:any, spotify_playback_state?:any) {
        this.id = id;
        this.username = username;
        if (!spotify_profile) { return; }
        this.spotify = {
            profile: spotify_profile,
            playback_state: spotify_playback_state
        }
    }
}

export default User;