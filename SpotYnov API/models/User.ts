class User {
    private username:string;
    private password:string;
    private spotify_id: string | undefined;
    private spotify_token: string | undefined

    public constructor(username:string, password:string) {
        this.username = username;
        this.password = password;
    }

    public setSpotifyData(spotify_id:string|undefined, spotify_token:string|undefined) {
        this.spotify_id = spotify_id;
        this.spotify_token = spotify_token;
    }
}

export default User;