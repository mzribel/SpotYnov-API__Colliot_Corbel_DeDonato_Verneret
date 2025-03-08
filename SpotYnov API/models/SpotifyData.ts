export interface SpotifyData {
    id:string,
    display_name:string,
    token_data?:SpotifyTokenData
}

export class SpotifyTokenData {
    private access_token?: string;
    private refresh_token?: string;
    private issued_at?: number;
    private registered_at?: number;
    private expires_in?: number;

    // --------- GETTERS & SETTERS --------- //
    get AccessToken() {
        return this.access_token;
    }
    get RefreshToken() :string| undefined {
        return this.refresh_token;
    }
    set RefreshToken(value:string) {
        this.refresh_token = value;
    }

    // ------------ CONSTRUCTOR ------------ //
    private constructor() {}

    // ------------- CONVERTERS ----------- //
    public static fromObject(obj: Object, issuedNow:boolean=false): SpotifyTokenData {
        const token:SpotifyTokenData = Object.assign(new SpotifyTokenData(), obj);

        // Trying to keep track of the token validity
        const nowInMs:number = token.issued_at = new Date().getTime() / 1000;
        if (issuedNow) {
            token.issued_at = nowInMs;
            token.registered_at = nowInMs;
        } else if (!token.registered_at) {
            token.registered_at = nowInMs;
        }
        return token;
    }

    // ----------- METHODS ------------ //
    public isValidToken() {
        // @ts-ignore   TODO: Pourquoi j'ai mis ça ?
        return Date.now() < new Date((this.issued_at+this.expires_in)*1000);
    }
}

export interface SpotifyTokenResponseDTO {
    access_token: string;
    expires_in: number;
    issued_at: number;
    refresh_token: string;
    scope: string;
}