export class SpotifyTrackDTO {
    public name:string
    public album: {
        name:string,
        image_url:string,
    }
    public artists:string[]
    public release_date:string
    public duration_ms:number
    public uri:string
    public popularity:number
    public id:string

    constructor(data: Partial<SpotifyTrackDTO>) {
        this.duration_ms = data.duration_ms ?? 0;
        this.name = data.name ?? "";
        this.popularity = data.popularity ?? 0;
        this.uri = data.uri ?? "";
        this.artists = data.artists ?? [];
        this.album = {
            name: data.album?.name ?? "",
            image_url: data.album?.image_url ?? "",
        };
        this.release_date = data.release_date ?? "";
        this.id = data.id ?? "";
    }

    public static fromSpotifyTrackObject(trackObject:any):SpotifyTrackDTO {
        return new SpotifyTrackDTO({
            name: trackObject.name,
            album: {
                name: trackObject.album.name,
                image_url: trackObject.album.images[0]?.url ?? ""
            },
            artists: (trackObject.artists as any[]).map((artist: any) => artist.name),
            release_date: trackObject.album.release_date,
            duration_ms: trackObject.duration_ms,
            popularity: trackObject.popularity,
            uri: trackObject.uri,
            id: trackObject.id
        })
    }
}