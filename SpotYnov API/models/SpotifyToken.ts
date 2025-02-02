export class SpotifyToken {
    private access_token: string|undefined;
    private expires_in: number|undefined;
    private issued_at: number|undefined;
    private refresh_token: string|undefined;
    private scope: string|undefined;

    private constructor() {}

    public create(access_token: string, expires_in: number, refresh_token: string, scope: string) {
        this.access_token = access_token;
        this.expires_in = expires_in;
        this.issued_at = new Date().getTime() / 1000;
        this.refresh_token = refresh_token;
        this.scope = scope;
    }

    public static fromObject(obj: Object|undefined): SpotifyToken|undefined {
        if (obj === undefined || obj === null) {
            return undefined;
        }
        const token = Object.assign(new SpotifyToken(), obj);
        // Todo : ne pas recalculer la date à chaque fois
        token.issued_at = new Date().getTime() / 1000;
        return token;
    }

    public isValidToken() {
        // @ts-ignore
        return Date.now() < new Date((this.issued_at+this.expires_in)*1000);
    }

    get AccessToken() {
        return this.access_token;
    }
    get refreshToken() {
        return this.refresh_token;
    }
}